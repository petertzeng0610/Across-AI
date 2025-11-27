# Check Point 攻擊判斷流程優化計畫

**日期**: 2025-11-27  
**版本**: v2.0  
**狀態**: 📋 優化計畫

---

## 📋 **優化摘要**

基於新的「Check Point Log 攻擊判斷流程（Firewall + Application Control + URL Filtering）」文檔，需要對 Check Point 攻擊判斷系統進行優化，整合威脅防護（Threat Prevention）功能，並與 Cloudflare 的優化保持一致性。

---

## 🎯 **優化目標**

1. ✅ **擴展 Action 分類**（新增 Alert, Info, Allow）
2. ✅ **新增威脅辨識欄位**（threat_severity, threat_name, threat_category, burst_count）
3. ✅ **新增 URI/UA 分析**（http_user_agent, HTTP URL 的 OWASP 模式分析）
4. ✅ **調整 Top IP 統計**（改為 Top 5 + 詳細統計）
5. ✅ **修復時間處理問題**（使用日誌實際時間範圍 + 台灣時區）
6. ✅ **整合 URL Filtering**（url_category 分析）

---

## 📊 **現有架構 vs 新判斷流程對比**

| 項目 | 現有架構 | 新判斷流程要求 | 優化方案 |
|------|----------|----------------|----------|
| **Action 分類** | Drop, Reject, Accept, Encrypt | + Alert, Info, Allow | ✅ 擴展 CHECKPOINT_ACTION_MAPPING |
| **威脅辨識** | ❌ 無 threat_severity | threat_severity, threat_name, threat_category | ✅ 新增 THREAT_PREVENTION_MAPPING |
| **URI/UA 分析** | ❌ 缺少 | http_user_agent + OWASP 模式 | ✅ 新增 analyzeURIPattern() + analyzeUserAgent() |
| **Top IP 統計** | Top 10 | Top 5 + 國家 + 攻擊類型 | ✅ 新增 getTopIPsWithCountry() |
| **URL Filtering** | ❌ 僅 app_category | url_category 完整分析 | ✅ 新增 URL_CATEGORY_MAPPING |
| **時間格式** | ❓ 未確認 | 日誌實際時間範圍 + 台灣時區 | ✅ 修正時間處理邏輯 |

---

## 🔄 **新的判斷流程架構**

```
Check Point 日誌
    ↓
┌─────────────────────────────────────────────────┐
│ 第一層：Action 分類（Firewall）                   │
├─────────────────────────────────────────────────┤
│ • Drop, Reject → 阻擋類（已阻擋攻擊）             │
│ • Accept, Allow → 允許類（需進一步判斷）          │
│ • Alert, Info → 告警類（偵測或狀態記錄）          │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 第二層：威脅辨識（Threat Prevention）             │
├─────────────────────────────────────────────────┤
│ • threat_severity (High/Medium/Low)             │
│ • threat_name (SQL Injection, XSS, Botnet...)  │
│ • threat_category (Exploit, DDoS, Botnet...)   │
│ • burst_count (連線快速爆發)                     │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 第三層：應用程式風險評估（Application Control）   │
├─────────────────────────────────────────────────┤
│ • app_risk (0-5)                                │
│ • application (應用程式名稱)                      │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 第四層：URI/UA 分析（OWASP TOP 10）              │
├─────────────────────────────────────────────────┤
│ • http_user_agent (掃描工具特徵)                 │
│ • HTTP URL (匹配攻擊模式)                        │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 第五層：URL Filtering（政策違規）                │
├─────────────────────────────────────────────────┤
│ • url_category (網站安全性類別)                  │
│ • app_category (應用程式類別)                    │
└─────────────────────────────────────────────────┘
```

---

## 📁 **需要修改的檔案**

### 1. `backend/config/products/checkpoint/chcekpointFieldMapping.js`

**新增欄位映射**：
- `threat_severity` - 威脅嚴重程度
- `threat_name` - 威脅名稱
- `threat_category` - 威脅類別
- `burst_count` / `count` - 連續攻擊次數
- `http_user_agent` - HTTP User-Agent
- `url_category` - URL 分類

---

### 2. `backend/config/products/checkpoint/checkpointStandards.js`

#### **新增常量**

1. **擴展 `CHECKPOINT_ACTION_MAPPING`**
   ```javascript
   'Alert': {
     isBlocked: false,
     isThreat: true,
     severity: 'medium',
     displayName: '告警（Alert）',
     description: '告警類事件，需要進一步分析'
   },
   'Info': {
     isBlocked: false,
     isThreat: false,
     severity: 'info',
     displayName: '資訊（Info）',
     description: '資訊類記錄'
   },
   'Allow': {
     isBlocked: false,
     isThreat: false,
     severity: 'info',
     displayName: '已允許（Allow）',
     description: '明確允許的流量'
   }
   ```

2. **新增 `THREAT_PREVENTION_MAPPING`**
   ```javascript
   const THREAT_PREVENTION_MAPPING = {
     SEVERITY: {
       'High': { severity: 'critical', score: 90, description: '高嚴重度威脅' },
       'Medium': { severity: 'high', score: 60, description: '中嚴重度威脅' },
       'Low': { severity: 'medium', score: 30, description: '低嚴重度威脅' }
     },
     CATEGORY: {
       'Exploit': { type: 'ATTACK', severity: 'critical' },
       'Botnet': { type: 'MALWARE', severity: 'critical' },
       'DDoS': { type: 'ATTACK', severity: 'critical' },
       'SQL Injection': { type: 'INJECTION', severity: 'critical', owaspCategory: 'A03:2021' },
       'XSS': { type: 'INJECTION', severity: 'high', owaspCategory: 'A03:2021' },
       'Command Injection': { type: 'INJECTION', severity: 'critical', owaspCategory: 'A03:2021' }
     }
   };
   ```

3. **新增 `URL_CATEGORY_MAPPING`**
   ```javascript
   const URL_CATEGORY_MAPPING = {
     'Malicious Sites': { severity: 'critical', violation_type: 'SECURITY_THREAT' },
     'Phishing': { severity: 'critical', violation_type: 'SECURITY_THREAT' },
     'Pornography': { severity: 'high', violation_type: 'CONTENT_VIOLATION' },
     'Gambling': { severity: 'high', violation_type: 'CONTENT_VIOLATION' },
     'Social Media': { severity: 'medium', violation_type: 'PRODUCTIVITY_IMPACT' },
     'Streaming Media': { severity: 'medium', violation_type: 'BANDWIDTH_CONSUMPTION' }
   };
   ```

4. **新增 OWASP TOP 10 攻擊模式庫**（與 Cloudflare 相同）

#### **新增核心函數**

1. **`analyzeThreatLevel(log)`** - 多層威脅判斷（整合 Threat Prevention）
   ```javascript
   function analyzeThreatLevel(log) {
     // Layer 1: Action 分類
     // Layer 2: Threat Prevention (threat_severity, threat_name)
     // Layer 3: Application Risk (app_risk)
     // Layer 4: URI/UA 分析
     // Layer 5: URL Filtering (url_category)
   }
   ```

2. **`analyzeURIPattern(uri)`** - URI 模式分析（OWASP TOP 10）

3. **`analyzeUserAgent(ua)`** - User-Agent 分析

4. **`classifyThreatPrevention(log)`** - Threat Prevention 分析

---

### 3. `backend/services/products/CheckpointRiskServices.js`

#### **修改 `parseCheckPointLog()`**

**新增欄位解析**：
```javascript
parseCheckPointLog(rawLog) {
  // 處理時間戳記（支援多種格式）
  const rawTimestamp = rawLog[this.fieldMapping['@timestamp'].elk_field];
  let timestamp;
  
  if (typeof rawTimestamp === 'number') {
    timestamp = new Date(rawTimestamp).toISOString();
  } else if (typeof rawTimestamp === 'string') {
    timestamp = new Date(rawTimestamp).toISOString();
  } else {
    timestamp = new Date().toISOString();
  }
  
  return {
    // ... 現有欄位 ...
    
    // 新增：Threat Prevention 欄位
    threat_severity: rawLog[this.fieldMapping.threat_severity?.elk_field],
    threat_name: rawLog[this.fieldMapping.threat_name?.elk_field],
    threat_category: rawLog[this.fieldMapping.threat_category?.elk_field],
    burst_count: rawLog[this.fieldMapping.burst_count?.elk_field] || rawLog[this.fieldMapping.count?.elk_field],
    
    // 新增：HTTP 相關欄位
    http_user_agent: rawLog[this.fieldMapping.http_user_agent?.elk_field],
    url_category: rawLog[this.fieldMapping.url_category?.elk_field],
    
    // 時間戳記（已格式化為 ISO 8601）
    timestamp: timestamp
  };
}
```

#### **新增分析函數**

1. **`analyzeThreatPrevention(logEntries)`** - Threat Prevention 分析
   ```javascript
   analyzeThreatPrevention(logEntries) {
     // 分析 threat_severity, threat_name, threat_category
     // 統計 High/Medium/Low 威脅
     // Top 5 IP + 國家
   }
   ```

2. **`analyzeURLFiltering(logEntries)`** - URL Filtering 分析
   ```javascript
   analyzeURLFiltering(logEntries) {
     // 分析 url_category
     // 統計不安全網站訪問
   }
   ```

3. **`analyzeBurstTraffic(logEntries)`** - 快速攻擊爆發分析
   ```javascript
   analyzeBurstTraffic(logEntries) {
     // 分析 burst_count 高的事件
     // 識別 DDoS / 暴力破解
   }
   ```

4. **`getTopIPsWithCountry(logs, n)`** - Top N IP 詳細統計（與 Cloudflare 相同）

#### **修改 `generateAIPrompt()`**

**新增內容**：
- 時間格式化（台灣時區）
- Threat Prevention 統計
- URL Filtering 統計
- 完整的判斷流程說明

#### **修改 `generateFallbackRisks()`**

**時間格式修復**：
```javascript
// 使用日誌實際時間範圍（台灣時區）
const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString('zh-TW', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Taipei'
  });
};

createdDate: formatDate(timeRange.start),
updatedDate: formatDate(timeRange.end)
```

---

## 🧪 **時間處理問題檢查**

### **問題**：
與 Cloudflare 相同，Check Point 可能也存在：
1. ELK 時間戳記格式問題
2. AI 分析結果使用「生成時間」而非「日誌時間範圍」

### **解決方案**：
1. ✅ 修正 `parseCheckPointLog()` 的時間處理
2. ✅ 修正 `generateFallbackRisks()` 的時間格式
3. ✅ 修正 `generateAIPrompt()` 的時間顯示（台灣時區）

---

## 📊 **優化前後對比**

| 項目 | 優化前 | 優化後 |
|------|--------|--------|
| **Action 分類** | Drop, Reject, Accept, Encrypt | ✅ + Alert, Info, Allow |
| **Threat Prevention** | ❌ 無 | ✅ threat_severity, threat_name, threat_category |
| **URI 分析** | ❌ 無 | ✅ OWASP TOP 10 模式庫 |
| **UA 分析** | ❌ 無 | ✅ 多層次分析（掃描工具/長度/合法性） |
| **URL Filtering** | ❌ 僅 app_category | ✅ 完整 url_category 分析 |
| **Top IP 統計** | Top 10（無國家） | ✅ Top 5 + 國家 + 攻擊類型 |
| **時間格式** | ❓ 未確認 | ✅ 使用日誌時間範圍（台灣時區） |
| **Burst Traffic** | ❌ 無 | ✅ 連線爆發分析 |

---

## ✅ **實施順序**

### **階段 1：P0 優先級（關鍵修復）**

1. ✅ 新增威脅欄位映射（chcekpointFieldMapping.js）
2. ✅ 修正時間處理邏輯（CheckpointRiskServices.js）
3. ✅ 擴展 CHECKPOINT_ACTION_MAPPING（checkpointStandards.js）

### **階段 2：P1 優先級（高）**

4. ✅ 新增 THREAT_PREVENTION_MAPPING（checkpointStandards.js）
5. ✅ 新增 URL_CATEGORY_MAPPING（checkpointStandards.js）
6. ✅ 新增 `analyzeThreatLevel()` 函數（checkpointStandards.js）
7. ✅ 新增 `analyzeThreatPrevention()` 函數（CheckpointRiskServices.js）

### **階段 3：P2 優先級（中）**

8. ✅ 新增 OWASP TOP 10 模式庫（checkpointStandards.js）
9. ✅ 新增 `analyzeURIPattern()` 函數（checkpointStandards.js）
10. ✅ 新增 `analyzeUserAgent()` 函數（checkpointStandards.js）
11. ✅ 新增 `analyzeURLFiltering()` 函數（CheckpointRiskServices.js）
12. ✅ 新增 `analyzeBurstTraffic()` 函數（CheckpointRiskServices.js）

### **階段 4：P3 優先級（低）**

13. ✅ 優化 AI Prompt 結構（CheckpointRiskServices.js）
14. ✅ 修改 `generateFallbackRisks()`（CheckpointRiskServices.js）
15. ✅ 新增 `getTopIPsWithCountry()` 函數（CheckpointRiskServices.js）

---

## 🎯 **預期成果**

優化完成後，Check Point 系統將具備：

1. ✅ **完整的 Firewall + Threat Prevention + Application Control + URL Filtering 整合**
2. ✅ **多層威脅判斷架構**（5 層：Action → Threat → App Risk → URI/UA → URL Filtering）
3. ✅ **OWASP TOP 10 2021 攻擊模式識別**
4. ✅ **Burst Traffic 爆發攻擊檢測**
5. ✅ **Top 5 IP 統計**（含國家和攻擊類型）
6. ✅ **準確的時間顯示**（日誌實際時間範圍 + 台灣時區）
7. ✅ **與 Cloudflare 優化保持一致性**

---

## 📝 **下一步行動**

1. ✅ **確認優化計畫**
2. ⏳ **執行階段 1-4 優化**
3. ⏳ **測試與驗證**
4. ⏳ **撰寫優化報告**

---

**準備開始實施？請確認後我將立即開始執行優化！** 🚀

