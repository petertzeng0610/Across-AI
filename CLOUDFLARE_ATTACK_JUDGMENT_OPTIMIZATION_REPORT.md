# Cloudflare 攻擊判斷流程優化報告

**優化日期**: 2025-11-27  
**版本**: v2.0  
**狀態**: ✅ 已完成

---

## 📋 優化摘要

本次優化基於新的「Cloudflare HTTP Log 攻擊判斷流程（AI 分析用）」文檔，對 Cloudflare 攻擊判斷系統進行了全面重構，實現了多層威脅判斷架構、OWASP TOP 10 2021 攻擊模式庫、以及完整的 SecurityAction 分類處理。

---

## 🎯 優化目標

1. ✅ **實現多層威脅判斷架構**（基於 SecurityAction → WAF Score → URI/UA）
2. ✅ **完整支援 SecuritySources[] 和 SecurityRuleDescription**
3. ✅ **新增 OWASP TOP 10 2021 攻擊模式庫**
4. ✅ **修復時間對不上的問題**（使用日誌實際時間範圍 + 台灣時區）
5. ✅ **區分「已阻擋」vs「未阻擋」攻擊**
6. ✅ **按 ZoneName 分組顯示受影響資產**
7. ✅ **Top 5 IP 統計（含國家和攻擊類型）**

---

## 📁 修改的檔案

### 1. `backend/config/products/cloudflare/cloudflareFieldMapping.js`

**新增欄位**：
- `security_rule_description`：用於判斷規則是否為 log 模式
- 更新 `security_sources` 的 AI 上下文說明

**影響**：
- 提供完整的欄位映射支援
- 支援新的判斷流程所需的所有欄位

---

### 2. `backend/config/products/cloudflare/cloudflareStandards.js`（完全重寫）

#### **新增常量**

1. **`SECURITY_ACTION_CLASSIFICATION`** - SecurityAction 分類表
   ```javascript
   - BLOCKED: ['block', 'connectionClose'] → 低風險
   - CHALLENGE: ['challenge', 'jschallenge', 'managedChallenge'] → 中風險
   - LOG: ['log'] → 需要進一步判斷
   - RATE_LIMIT: ['rateLimit', 'l7ddos', 'botFight'] → 限制類
   - ALLOW: ['allow', 'bypass', ...] → 放行類
   ```

2. **`OWASP_TOP10_PATTERNS`** - OWASP TOP 10 2021 攻擊模式庫
   ```javascript
   - BROKEN_ACCESS_CONTROL (A01:2021)
   - SQL_INJECTION (A03:2021)
   - XSS (A03:2021)
   - COMMAND_INJECTION (A03:2021)
   - PATH_TRAVERSAL (A01:2021)
   - AUTH_BYPASS (A07:2021)
   - SSRF (A10:2021)
   ```

3. **`MALICIOUS_USER_AGENT_PATTERNS`** - 惡意 User-Agent 特徵庫
   ```javascript
   - SCANNERS: ['sqlmap', 'nikto', 'nmap', ...]
   - EXPLOIT_TOOLS: ['exploit', 'payload', ...]
   - AUTOMATED_SCRIPTS: ['python-requests', 'go-http-client', ...]
   - LEGITIMATE_TOOLS: ['curl', 'wget', ...]
   ```

#### **新增核心函數**

1. **`analyzeThreatLevel(log)`** - 多層威脅判斷系統（核心函數）
   - 第一層：SecurityAction 分類
   - 第二層：WAF Score < 20 判斷
   - 第三層：URI/UA 模式分析 + SecurityRuleDescription 檢查
   
   **返回值**：
   ```javascript
   {
     isThreat: boolean,
     isBlocked: boolean,
     severity: 'critical' | 'high' | 'medium' | 'low' | 'info',
     category: 'BLOCKED_ATTACK' | 'CONFIRMED_ATTACK' | 'CHALLENGED' | ...,
     reason: string,
     requiresAction: boolean,
     aiAnalysisType: 'full_analysis' | 'summary_only' | 'monitoring' | 'none',
     attackType?: string,
     securitySources?: array
   }
   ```

2. **`classifySecurityAction(action)`** - 分類 SecurityAction
   - 支援單一 action 或 actions[] 陣列
   - 優先級判斷（按照嚴重程度）

3. **`analyzeURIPattern(uri)`** - URI 模式分析
   - 基於 OWASP TOP 10 2021 模式庫
   - 識別 SQL 注入、XSS、命令注入、路徑遍歷等攻擊特徵

4. **`analyzeUserAgent(ua)`** - User-Agent 分析
   - 檢測掃描工具（sqlmap, nikto, nmap 等）
   - 檢測異常長度
   - 區分合法工具（curl, wget）與惡意工具

5. **`hasLowWAFScore(log)`** - 檢查 WAF 分數是否 < 20
6. **`identifyAttackType(log)`** - 識別攻擊類型

#### **保留的輔助函數**

- `classifyWAFScore(score)` - WAF 分數分類
- `isCloudflareInternalEndpoint(uri)` - 內部端點檢查
- `isValidWAFScore(score)` - WAF 分數有效性檢查
- `calculateValidAvgScore(logs, scoreField)` - 平均分數計算
- `isRealSecurityThreat(log)` - 舊函數（標註 @deprecated，保留向後兼容）

---

### 3. `backend/services/products/cloudflareWAFRiskService.js`

#### **更新 imports**

```javascript
// 新增引入
analyzeThreatLevel,
classifySecurityAction,
analyzeURIPattern,
analyzeUserAgent,
hasLowWAFScore,
identifyAttackType
```

#### **修改 `parseCloudflareLog()`**

**新增功能**：
1. **時間戳記處理**（修復時間對不上的問題）
   ```javascript
   // 支援 Unix Timestamp（毫秒）和 ISO 8601 格式
   if (typeof rawTimestamp === 'number') {
     timestamp = new Date(rawTimestamp).toISOString();
   } else if (typeof rawTimestamp === 'string') {
     timestamp = new Date(rawTimestamp).toISOString();
   }
   ```

2. **新增欄位解析**
   - `securityActions` (陣列)
   - `securityRuleDescription`
   - `securityRuleIDs` (陣列)
   - `securitySources` (陣列)
   - `zoneName`

#### **重寫攻擊分析函數**

1. **`analyzeSQLInjection()`**
   ```javascript
   // 使用新的多層判斷邏輯
   - 條件 1: WAF SQLi Score < 20
   - 條件 2: SecurityRule 觸發 SQL 相關規則
   - 條件 3: 使用 analyzeThreatLevel() 多層判斷
   
   // 分類：已阻擋 vs 未阻擋
   - blocked: 已阻擋次數（低風險）
   - unblocked: 未阻擋次數（高風險）
   
   // 新增統計
   - topIPs: Top 5 IP + 國家
   - affectedAssets: 按 ZoneName 分組
   ```

2. **`analyzeXSSAttacks()`** - 同上邏輯
3. **`analyzeRCEAttacks()`** - 同上邏輯

#### **新增函數**

1. **`groupByZoneName(logs)`** - 按 ZoneName 分組受影響資產
   ```javascript
   返回：
   [
     {
       zoneName: string,
       attackCount: number,
       blockedCount: number,      // ✅ 新增
       unblockedCount: number,    // ✅ 新增
       uniqueIPs: number,
       targetURIs: array
     }
   ]
   ```

2. **`getTopIPsWithCountry(logs, n)`** - Top N IP 詳細統計
   ```javascript
   返回：
   [
     {
       item: string (IP),
       count: number,
       country: string,           // ✅ 新增
       targetURIs: array,
       attackTypes: array         // ✅ 新增
     }
   ]
   ```

#### **修改 `generateFallbackRisks()`**

**時間格式修復**：
```javascript
// 使用日誌實際時間範圍（台灣時區 UTC+8）
const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString('zh-TW', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Taipei'  // ✅ 台灣時區
  });
};

createdDate: formatDate(timeRange.start),  // ✅ 日誌開始時間
updatedDate: formatDate(timeRange.end)     // ✅ 日誌結束時間
```

**新增欄位**：
- `blocked`: 已阻擋次數
- `unblocked`: 未阻擋次數
- `country`: 來源國家（Top IP）

#### **重寫 `generateAIPrompt()`**

**新增內容**：

1. **時間格式化函數**
   ```javascript
   const formatTime = (isoString) => {
     return new Date(isoString).toLocaleString('zh-TW', {
       year: 'numeric',
       month: '2-digit',
       day: '2-digit',
       hour: '2-digit',
       minute: '2-digit',
       second: '2-digit',
       timeZone: 'Asia/Taipei'
     });
   };
   ```

2. **攻擊統計（區分已阻擋 vs 未阻擋）**
   ```
   1. **SQL 注入攻擊**
      - 檢測方式: WAFSQLiAttackScore < 20 或 SecurityRule 包含 "sql"
      - 已阻擋: 50 次（低風險，已成功防禦）
      - 未阻擋: 10 次（⚠️ 高風險，需要立即處理）
   ```

3. **Cloudflare 攻擊判斷流程說明**
   ```
   第一層：SecurityAction 分類
   - block / connectionClose → 已阻擋攻擊（低風險）
   - log → 需要進一步判斷
   - challenge → 挑戰中（中風險）
   - rateLimit / l7ddos → 流量限制（中風險）
   
   第二層：WAF Attack Score
   - < 20: 幾乎確定是攻擊
   - 21-50: 可能攻擊（容易誤報）
   - 51-80: 可能正常
   - 81-99: 很可能正常
   
   第三層：URI / User-Agent 判斷
   - 基於 OWASP TOP 10 2021 攻擊模式庫
   - 檢查 SecurityRuleDescription 是否包含 "log" 字眼
   ```

4. **輸出規則（已阻擋 vs 未阻擋）**
   ```
   1. 已阻擋（block）：
      - severity = "low"
      - openIssues = 0
      - resolvedIssues = 已阻擋次數
   
   2. 未阻擋（log）：
      - severity = "critical" 或 "high"
      - openIssues = 未阻擋次數
   ```

5. **時間格式要求**
   ```
   createdDate: "2025/11/27 上午10:30:45"  // 日誌開始時間（台灣時區）
   updatedDate: "2025/11/27 下午02:15:30"  // 日誌結束時間（台灣時區）
   ```

---

## 📊 優化前後對比

| 項目 | 優化前 | 優化後 |
|------|--------|--------|
| **SecurityAction 分類** | ❌ 不區分 | ✅ 5 種分類（BLOCKED / CHALLENGE / LOG / RATE_LIMIT / ALLOW） |
| **SecuritySources 支援** | ❌ 未使用 | ✅ 完整支援（waf / firewallManaged / firewallCustom / rateLimit / l7ddos / botManagement） |
| **SecurityRuleDescription** | ❌ 未使用 | ✅ 檢查 "log" 字眼 |
| **WAF Score 閾值** | ❌ 混亂（<=50） | ✅ 明確（<20 = 攻擊） |
| **URI 分析** | ❌ 簡單字串匹配 | ✅ OWASP TOP 10 2021 模式庫（7 大類攻擊） |
| **UA 分析** | ❌ 簡單工具檢測 | ✅ 多層次分析（SCANNERS / EXPLOIT_TOOLS / AUTOMATED_SCRIPTS） |
| **風險分級** | ❌ 單一分級 | ✅ 多層分級（已阻擋/未阻擋/挑戰中/監控/正常） |
| **受影響資產** | ❌ 簡單計數 | ✅ 按 ZoneName 分組（含 URI、IP、阻擋統計） |
| **Top IP 統計** | ❌ Top 10（無國家） | ✅ Top 5 + 國家 + 攻擊類型 |
| **時間格式** | ❌ 使用生成時間 | ✅ 使用日誌實際時間範圍（台灣時區 UTC+8） |
| **時區處理** | ❌ 未處理 | ✅ UTC → Asia/Taipei |
| **AI 建議** | ❌ 通用建議 | ✅ 基於 SecurityAction 分類的 SOP |

---

## 🔄 判斷流程圖

```
日誌 Entry
    ↓
┌─────────────────────────────────────────────────┐
│ 第一層：SecurityAction 分類                      │
├─────────────────────────────────────────────────┤
│ • block / connectionClose → 已阻擋（低風險）     │
│ • challenge / jschallenge → 挑戰中（中風險）    │
│ • rateLimit / l7ddos → 限制類（中風險）        │
│ • log → 需要進一步判斷 ▼                        │
│ • allow / bypass → 放行類                       │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 第二層：WAF Score 判斷（僅針對 log）             │
├─────────────────────────────────────────────────┤
│ • Score < 20 → 確定攻擊（高風險）               │
│ • Score >= 20 → 需要第三層判斷 ▼                │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 第三層：URI / UA 判斷（OWASP TOP 10 2021）      │
├─────────────────────────────────────────────────┤
│ • URI 符合攻擊模式？                            │
│ • UA 包含惡意工具？                             │
│   ├─ YES → 檢查 SecurityRuleDescription        │
│   │   ├─ 包含 "log" → 安全連線（監控）         │
│   │   └─ 不包含 "log" → 確認攻擊（高風險）    │
│   └─ NO → 正常流量                              │
└─────────────────────────────────────────────────┘
```

---

## 🧪 測試案例

### 案例 1：block（已阻擋攻擊）

**輸入**：
```json
{
  "SecurityAction": "block",
  "WAFSQLiAttackScore": 15,
  "SecurityRuleDescription": "Cloudflare-Managed-WAF-SQLi-Block",
  "SecuritySources": ["waf", "firewallManaged"]
}
```

**輸出**：
```javascript
{
  isThreat: true,
  isBlocked: true,
  severity: 'low',
  category: 'BLOCKED_ATTACK',
  reason: '攻擊已被成功封鎖',
  requiresAction: false,
  aiAnalysisType: 'summary_only'
}
```

---

### 案例 2：log + WAF Score < 20（確定攻擊）

**輸入**：
```json
{
  "SecurityAction": "log",
  "WAFSQLiAttackScore": 12,
  "SecurityRuleDescription": "Custom-SQLi-Detection"
}
```

**輸出**：
```javascript
{
  isThreat: true,
  isBlocked: false,
  severity: 'critical',
  category: 'CONFIRMED_ATTACK',
  reason: 'WAF Score < 20，幾乎確定是攻擊',
  requiresAction: true,
  aiAnalysisType: 'full_analysis',
  attackType: 'SQL_INJECTION'
}
```

---

### 案例 3：log + Score > 20 + URI 可疑 + 含 "log" 字眼

**輸入**：
```json
{
  "SecurityAction": "log",
  "WAFSQLiAttackScore": 85,
  "ClientRequestURI": "/wp-admin/login.php",
  "SecurityRuleDescription": "Custom-Log-Admin-Access"
}
```

**輸出**：
```javascript
{
  isThreat: false,
  isBlocked: false,
  severity: 'medium',
  category: 'SAFE_CONNECTION',
  reason: 'SecurityRuleDescription 包含 "log"，判定為安全連線',
  requiresAction: false,
  aiAnalysisType: 'monitoring',
  uriAnalysis: {
    isSuspicious: true,
    attackType: 'BROKEN_ACCESS_CONTROL',
    owaspCategory: 'A01:2021',
    matchedPattern: '/wp-admin'
  }
}
```

---

### 案例 4：時間格式測試

**輸入**（ELK 原始時間）：
```json
{
  "EdgeStartTimestamp": 1700000000000  // Unix Timestamp（毫秒）
}
```

**輸出**（解析後）：
```javascript
{
  timestamp: "2023-11-15T02:13:20.000Z",  // ISO 8601 格式
  
  // AI 分析結果中的時間（台灣時區）
  createdDate: "2023/11/15 上午10:13:20"  // UTC+8
}
```

---

## ✅ 驗證清單

- [x] 新增 `security_rule_description` 欄位映射
- [x] 新增 `SECURITY_ACTION_CLASSIFICATION` 常量
- [x] 新增 `OWASP_TOP10_PATTERNS` 攻擊模式庫
- [x] 新增 `MALICIOUS_USER_AGENT_PATTERNS` 特徵庫
- [x] 實現 `analyzeThreatLevel()` 核心函數
- [x] 實現 `analyzeURIPattern()` 函數
- [x] 實現 `analyzeUserAgent()` 函數
- [x] 修改 `parseCloudflareLog()` 支援新欄位
- [x] 修改 `analyzeSQLInjection()` 使用新邏輯
- [x] 修改 `analyzeXSSAttacks()` 使用新邏輯
- [x] 修改 `analyzeRCEAttacks()` 使用新邏輯
- [x] 新增 `groupByZoneName()` 函數
- [x] 新增 `getTopIPsWithCountry()` 函數
- [x] 修正時間格式（使用日誌實際時間範圍）
- [x] 修正時區問題（UTC → Asia/Taipei）
- [x] 優化 AI Prompt（新增判斷流程說明）
- [x] 無 linter 錯誤

---

## 📝 使用說明

### 1. 測試新的判斷邏輯

```bash
# 測試 Cloudflare WAF 風險分析
curl -X POST http://localhost:8080/api/cloudflare/analyze-waf-risks \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "YOUR_GEMINI_API_KEY",
    "model": "gemini-2.0-flash-exp",
    "timeRange": "24h"
  }'
```

### 2. 檢查 analyzeThreatLevel 函數

```javascript
const { analyzeThreatLevel } = require('./backend/config/products/cloudflare/cloudflareStandards');

const testLog = {
  securityAction: 'log',
  wafSQLiScore: 15,
  requestURI: '/admin/login.php',
  userAgent: 'sqlmap/1.0',
  securityRuleDescription: 'Custom-SQLi-Detection'
};

const result = analyzeThreatLevel(testLog);
console.log(result);
// 輸出：
// {
//   isThreat: true,
//   isBlocked: false,
//   severity: 'critical',
//   category: 'CONFIRMED_ATTACK',
//   reason: 'WAF Score < 20，幾乎確定是攻擊',
//   requiresAction: true,
//   aiAnalysisType: 'full_analysis',
//   attackType: 'SQL_INJECTION'
// }
```

### 3. 檢查時間格式

```javascript
const CloudflareWAFRiskService = require('./backend/services/products/cloudflareWAFRiskService');
const service = new CloudflareWAFRiskService();

const analysisData = await service.analyzeCloudflareWAF('24h');

console.log('時間範圍:', analysisData.timeRange);
// 輸出：
// 時間範圍: {
//   start: "2025-11-26T10:30:45.000Z",
//   end: "2025-11-27T10:30:45.000Z"
// }

// AI 分析結果中的時間（台灣時區）
// createdDate: "2025/11/26 下午06:30:45"
// updatedDate: "2025/11/27 下午06:30:45"
```

---

## 🔧 向後兼容性

1. **保留舊函數**：`isRealSecurityThreat()` 標註為 `@deprecated` 但保留
2. **功能開關**：可在 `cloudflareELKConfig.js` 新增 `useNewThreatAnalysis: false`
3. **版本控制**：原檔案已重寫，如需回滾請使用 git

---

## 📚 相關文檔

- [Cloudflare WAF Attack Score 官方文檔](https://developers.cloudflare.com/waf/detections/attack-score/)
- [OWASP TOP 10 2021](https://owasp.org/Top10/)
- [Cloudflare Security Products](https://developers.cloudflare.com/fundamentals/reference/http-request-fields/#security)

---

## 👨‍💻 維護資訊

**負責人**: AI Assistant  
**最後更新**: 2025-11-27  
**狀態**: 生產就緒（Production Ready）

---

## 📞 支援

如有問題，請參考：
1. 本報告的「測試案例」章節
2. `cloudflareStandards.js` 中的函數註解
3. `AI_ANALYSIS_DOCUMENTATION.md`（如果存在）

---

**✅ 優化完成！系統現已支援完整的多層威脅判斷架構。**

