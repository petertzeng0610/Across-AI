# 🎯 Cloudflare AI 分析頁面實作計畫（最終版）

## 📋 核心原則

1. ✅ **畫面呈現**：與 `http://localhost:3003/ai-analysis/cloudflare` 一模一樣
2. ✅ **環境配置**：使用現有 `backend/config/elkConfig.js` 設定
3. ✅ **日誌格式**：嚴格遵循 `cloudflare-field-mapping.js` 欄位定義
4. ✅ **產品範圍**：僅針對 Cloudflare
5. ✅ **不添加功能**：不創建頁面沒有的任何畫面或連結

---

## 🔍 現狀深度分析

### 目標頁面結構 (`frontend/app/ai-analysis/cloudflare/page.tsx`)

#### 完整 UI 結構（不可更改）

```
┌─────────────────────────────────────────────────────────────────┐
│  Header: "AI Cyber Security Analysis - Cloudflare"              │
│  副標題: "基於 Cloudflare 安全數據的智能分析與建議"               │
│  統計: "總計 X 個開放問題，影響 Y 個資產"                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┬─────────────────────────┬──────────────────┐
│  左側欄位    │      中間欄位            │    右側欄位       │
│  (3 cols)    │      (6 cols)           │    (3 cols)      │
├──────────────┼─────────────────────────┼──────────────────┤
│              │                         │                  │
│ 風險評估      │   趨勢分析               │  執行建議按鈕     │
│              │                         │                  │
│ [高風險]     │   [選中風險的詳細資訊]    │  [AI 推薦措施]   │
│  - 數量      │   - 標題                 │  - 建議1 [HIGH]  │
│  - 開放問題  │   - 更新/創建日期         │    執行按鈕      │
│  - 受影響資產│   - Tags                 │  - 建議2 [MED]   │
│              │   - 描述                 │    執行按鈕      │
│ [中風險]     │   - CVE 編號             │                  │
│  - 數量      │   - Open Issues          │  [其他操作]      │
│  - 開放問題  │   - Resolved             │  - 生成報告      │
│  - 受影響資產│   - Affected Assets      │  - 創建工單      │
│              │   - AI 深度分析區塊       │  - 通知人員      │
│ [低風險]     │                         │  - 歷史趨勢      │
│  - 數量      │                         │                  │
│  - 開放問題  │                         │  [風險等級卡片]  │
│  - 受影響資產│                         │  - 嚴重程度      │
│              │                         │  - 是否在野外利用│
│ [風險列表]   │                         │                  │
│  - 項目1     │                         │                  │
│  - 項目2     │                         │                  │
│  - 項目3     │                         │                  │
│              │                         │                  │
└──────────────┴─────────────────────────┴──────────────────┘
```

#### 資料結構（不可更改）

```typescript
interface WAFRiskData {
  id: string                    // 唯一識別碼
  title: string                 // 風險標題
  severity: "critical" | "high" | "medium" | "low"
  openIssues: number            // 開放問題數
  resolvedIssues: number        // 已解決問題數
  affectedAssets: number        // 受影響資產數
  tags: string[]                // 標籤陣列
  description: string           // 詳細描述
  createdDate: string           // 創建日期
  updatedDate: string           // 更新日期
  exploitInWild: boolean        // 是否在野外利用
  internetExposed: boolean      // 是否暴露於互聯網
  confirmedExploitable: boolean // 是否確認可利用
  cveId?: string                // CVE 編號（可選）
  recommendations: {
    title: string               // 建議標題
    description: string         // 建議描述
    priority: "high" | "medium" | "low"
  }[]
}
```

#### 現有靜態資料範例

```typescript
{
  id: "sql-injection-surge",
  title: "SQL 注入攻擊激增",
  severity: "critical",
  openIssues: 3120,
  resolvedIssues: 245,
  affectedAssets: 45,
  tags: ["Exploit In Wild", "Internet Exposed", "Confirmed Exploitable"],
  description: "檢測到針對資料庫查詢端點的 SQL 注入攻擊大幅增加...",
  createdDate: "Apr 6, 2025",
  updatedDate: "Apr 9, 2025",
  exploitInWild: true,
  internetExposed: true,
  confirmedExploitable: true,
  cveId: "CVE-2025-1234",
  recommendations: [
    {
      title: "啟用 WAF SQL 注入防護規則",
      description: "立即啟用 Cloudflare WAF 的 SQL 注入防護規則集，阻擋惡意請求",
      priority: "high"
    },
    {
      title: "更新參數化查詢",
      description: "檢查並更新所有資料庫查詢，使用參數化查詢防止注入攻擊",
      priority: "high"
    }
  ]
}
```

---

## 🔧 現有環境配置

### ELK 配置 (`backend/config/elkConfig.js`)

```javascript
const DEFAULT_MCP_SERVER_URL = process.env.ELK_MCP_SERVER_URL || 'http://10.168.10.250:8080';

const ELK_CONFIG = {
  mcp: {
    serverUrl: DEFAULT_MCP_SERVER_URL,
    protocol: 'proxy',
    proxyCommand: resolveMcpProxyCommand(), // 自動偵測 macOS/Linux/Windows 的 mcp-proxy
    proxyArgs: ['--transport=streamablehttp', ensureMcpEndpoint(DEFAULT_MCP_SERVER_URL)],
    timeout: 30000,
    retryAttempts: 3
  },
  elasticsearch: {
    host: 'https://10.168.10.250:9200',
    index: 'adasone-cf-logpush-*',
    apiKey: 'Z3h5NE1KZ0JXTG9ZV1JjU3pleTA6b2Nfd1FEWjZfUTZmYVZHaW1kRzB6dw==',
    maxResults: 10000
  }
};
```

### Cloudflare 欄位對應 (`cloudflare-field-mapping.js`)

**關鍵欄位（用於 WAF 分析）：**

| 欄位名稱 | ELK 欄位 | 用途 |
|---------|---------|------|
| `ClientIP` | 來源 IP | 攻擊來源識別 |
| `ClientCountry` | 國家代碼 | 地理分佈 |
| `ClientASN` | ASN 號碼 | 網路供應商 |
| `ClientRequestURI` | 請求路徑 | 攻擊目標識別 |
| `ClientRequestMethod` | HTTP 方法 | 請求類型 |
| `ClientRequestUserAgent` | User-Agent | 客戶端識別 |
| `WAFAttackScore` | WAF 總分 | 攻擊嚴重度 (0-99, 越低越嚴重) |
| `WAFSQLiAttackScore` | SQL 注入分數 | SQL 注入威脅 |
| `WAFXSSAttackScore` | XSS 分數 | XSS 威脅 |
| `WAFRCEAttackScore` | RCE 分數 | 遠程代碼執行威脅 |
| `SecurityAction` | 安全動作 | block, challenge, log |
| `SecurityRuleDescription` | 規則描述 | 觸發的安全規則 |
| `EdgeRequestHost` | 目標主機 | 受影響資產 |
| `EdgeStartTimestamp` | 時間戳記 | 攻擊時間 |

---

## 🏗️ 實作架構（完全不改變前端）

```
┌─────────────────────────────────────────────────────────────┐
│             前端 (Next.js) - 完全不變                         │
│                                                              │
│  /ai-analysis/cloudflare/page.tsx                           │
│  ├─ useWAFData() context                                    │
│  ├─ useEffect(() => {                                       │
│  │    if (wafRisks.length === 0) {                          │
│  │      // ⭐ 修改點：調用後端 API 而非使用靜態資料           │
│  │      loadWAFRisksFromBackend()                           │
│  │    }                                                     │
│  │  }, [])                                                  │
│  └─ 三欄式 UI（完全不變）                                    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ HTTP POST /api/analyze-waf-risks-cloudflare
                   ▼
┌─────────────────────────────────────────────────────────────┐
│           後端 API (Express.js) - 新增端點                    │
│                                                              │
│  backend/index.js                                            │
│  └─ POST /api/analyze-waf-risks-cloudflare                  │
│      ├─ 使用現有 ELK_CONFIG                                  │
│      ├─ 使用現有 elkMCPClient                                │
│      ├─ 使用現有 CLOUDFLARE_FIELD_MAPPING                    │
│      └─ 回傳格式完全符合 WAFRiskData[]                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ wafRiskService.analyzeCloudflareWAF()
                   ▼
┌─────────────────────────────────────────────────────────────┐
│        WAF 風險分析服務 (新建) - 專門for Cloudflare          │
│                                                              │
│  backend/services/cloudflareWAFRiskService.js               │
│  ├─ analyzeCloudflareWAF(timeRange)                        │
│  │   ├─ ⭐ 使用 elkMCPClient.queryElasticsearch()           │
│  │   ├─ ⭐ 使用 CLOUDFLARE_FIELD_MAPPING 解析欄位            │
│  │   ├─ 分析 WAF 分數                                       │
│  │   ├─ 統計攻擊類型                                        │
│  │   └─ 生成風險資料                                        │
│  ├─ generateAIPrompt(analysisData)                         │
│  └─ buildRiskItems(aiResponse, analysisData)               │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ├────────────────┐
                   │                │
                   ▼                ▼
         ┌──────────────┐  ┌──────────────┐
         │  ELK MCP     │  │  Gemini AI   │
         │  (現有)      │  │              │
         │              │  │  生成風險分析 │
         │ Index:       │  │  和建議       │
         │ adasone-cf-  │  │              │
         │ logpush-*    │  │              │
         └──────────────┘  └──────────────┘
```

---

## 📝 實作計畫（分階段）

### 階段 1: 建立 Cloudflare WAF 風險分析服務（核心）

**檔案：** `backend/services/cloudflareWAFRiskService.js`

**功能：**
1. 透過 ELK MCP 查詢 `adasone-cf-logpush-*` 索引
2. 使用 `CLOUDFLARE_FIELD_MAPPING` 解析欄位
3. 分析 WAF 分數和攻擊模式
4. 生成 AI Prompt
5. 解析 AI 回應並格式化為 `WAFRiskData[]`

**關鍵方法：**

```javascript
class CloudflareWAFRiskService {
  constructor() {
    // 引入現有配置
    this.elkClient = require('./elkMCPClient').elkMCPClient;
    this.elkConfig = require('../config/elkConfig').ELK_CONFIG;
    this.fieldMapping = require('../../cloudflare-field-mapping').CLOUDFLARE_FIELD_MAPPING;
  }
  
  // ⭐ 主要方法：分析 Cloudflare WAF 風險
  async analyzeCloudflareWAF(timeRange = '24h') {
    // 1. 透過 MCP 查詢 ELK
    const elkData = await this.elkClient.queryElasticsearch(timeRange);
    
    // 2. 使用 cloudflare-field-mapping 解析資料
    const logEntries = elkData.hits.map(hit => this.parseCloudflareLog(hit.source));
    
    // 3. 分析各種攻擊類型（基於 WAF 分數）
    const sqlInjection = this.analyzeSQLInjection(logEntries);
    const xssAttacks = this.analyzeXSSAttacks(logEntries);
    const rceAttacks = this.analyzeRCEAttacks(logEntries);
    const botTraffic = this.analyzeBotTraffic(logEntries);
    const pathTraversal = this.analyzePathTraversal(logEntries);
    const abnormalUA = this.analyzeAbnormalUA(logEntries);
    
    // 4. 生成統計資料
    return {
      sqlInjection,
      xssAttacks,
      rceAttacks,
      botTraffic,
      pathTraversal,
      abnormalUA,
      totalEvents: logEntries.length,
      timeRange: { start, end }
    };
  }
  
  // 解析 Cloudflare 日誌（使用 field mapping）
  parseCloudflareLog(rawLog) {
    return {
      rayId: rawLog[this.fieldMapping.ray_id.elk_field],
      clientIP: rawLog[this.fieldMapping.client_ip.elk_field],
      clientCountry: rawLog[this.fieldMapping.client_country.elk_field],
      clientASN: rawLog[this.fieldMapping.client_asn.elk_field],
      requestURI: rawLog[this.fieldMapping.client_request_uri.elk_field],
      requestMethod: rawLog[this.fieldMapping.client_request_method.elk_field],
      userAgent: rawLog[this.fieldMapping.client_request_user_agent.elk_field],
      wafAttackScore: rawLog[this.fieldMapping.waf_attack_score.elk_field],
      wafSQLiScore: rawLog[this.fieldMapping.waf_sqli_attack_score.elk_field],
      wafXSSScore: rawLog[this.fieldMapping.waf_xss_attack_score.elk_field],
      wafRCEScore: rawLog[this.fieldMapping.waf_rce_attack_score.elk_field],
      securityAction: rawLog[this.fieldMapping.security_action.elk_field],
      securityRule: rawLog[this.fieldMapping.security_rule_description.elk_field],
      edgeHost: rawLog[this.fieldMapping.edge_request_host.elk_field],
      timestamp: rawLog[this.fieldMapping.edge_start_timestamp.elk_field]
    };
  }
  
  // 分析 SQL 注入（WAF 分數 < 10 = 高風險）
  analyzeSQLInjection(logEntries) {
    const sqliLogs = logEntries.filter(log => 
      log.wafSQLiScore !== undefined && log.wafSQLiScore < 30
    );
    
    return {
      count: sqliLogs.length,
      highRisk: sqliLogs.filter(log => log.wafSQLiScore < 10).length,
      topIPs: this.getTopN(sqliLogs, 'clientIP', 10),
      topTargets: this.getTopN(sqliLogs, 'requestURI', 10),
      topCountries: this.getTopN(sqliLogs, 'clientCountry', 5),
      affectedAssets: new Set(sqliLogs.map(log => log.edgeHost)).size,
      avgScore: this.calculateAvg(sqliLogs, 'wafSQLiScore')
    };
  }
  
  // ... 其他分析方法（XSS, RCE, Bot, Path Traversal, Abnormal UA）
  
  // 生成 AI Prompt（完全基於真實資料）
  generateAIPrompt(analysisData) {
    return `
作為資安專家，請基於以下 Cloudflare WAF 日誌分析結果，生成風險評估報告。

**資料來源**
- 索引: ${this.elkConfig.elasticsearch.index}
- 時間範圍: ${analysisData.timeRange.start} ~ ${analysisData.timeRange.end}
- 總事件數: ${analysisData.totalEvents}

**攻擊統計**（WAF 分數越低越危險，< 10 = 嚴重威脅）

1. SQL 注入攻擊
   - 檢測次數: ${analysisData.sqlInjection.count}
   - 高風險 (分數<10): ${analysisData.sqlInjection.highRisk}
   - 受影響資產: ${analysisData.sqlInjection.affectedAssets}
   - Top 5 來源: ${analysisData.sqlInjection.topIPs.slice(0,5).map(ip => ip.item).join(', ')}
   - Top 5 目標: ${analysisData.sqlInjection.topTargets.slice(0,5).map(t => t.item).join(', ')}

2. XSS 攻擊
   - 檢測次數: ${analysisData.xssAttacks.count}
   - 高風險 (分數<10): ${analysisData.xssAttacks.highRisk}
   - 受影響資產: ${analysisData.xssAttacks.affectedAssets}

3. RCE 攻擊
   - 檢測次數: ${analysisData.rceAttacks.count}
   - 高風險 (分數<10): ${analysisData.rceAttacks.highRisk}
   - 受影響資產: ${analysisData.rceAttacks.affectedAssets}

4. 惡意機器人
   - 檢測次數: ${analysisData.botTraffic.count}
   - Top 5 國家: ${analysisData.botTraffic.topCountries.map(c => c.item).join(', ')}

5. 路徑遍歷
   - 檢測次數: ${analysisData.pathTraversal.count}
   - 敏感檔案: ${analysisData.pathTraversal.sensitiveFiles.join(', ')}

6. 異常 User-Agent
   - 檢測次數: ${analysisData.abnormalUA.count}

**請生成 JSON 格式的風險報告（嚴格遵守以下格式）：**

\`\`\`json
{
  "risks": [
    {
      "id": "攻擊類型-時間戳",
      "title": "風險標題（例如：SQL 注入攻擊激增）",
      "severity": "critical|high|medium|low",
      "openIssues": 檢測次數（數字）,
      "resolvedIssues": 0,
      "affectedAssets": 受影響資產數（數字）,
      "tags": ["Exploit In Wild", "Internet Exposed", "Confirmed Exploitable"],
      "description": "詳細描述（200-300字）",
      "createdDate": "Apr 6, 2025",
      "updatedDate": "Apr 10, 2025",
      "exploitInWild": true|false,
      "internetExposed": true,
      "confirmedExploitable": true|false,
      "cveId": "CVE-XXXX-XXXX（如適用）",
      "recommendations": [
        {
          "title": "建議標題",
          "description": "建議描述",
          "priority": "high|medium|low"
        }
      ]
    }
  ]
}
\`\`\`

**風險等級判定**：
- Critical: WAF分數<10 或 高風險次數>500
- High: WAF分數<30 或 檢測次數>100
- Medium: WAF分數<50 或 檢測次數>50
- Low: 其他情況

**標籤判定**：
- "Exploit In Wild": 檢測到已知攻擊模式
- "Internet Exposed": 所有 Cloudflare 流量（預設 true）
- "Confirmed Exploitable": WAF分數<10

請只生成有真實資料支撐的風險（例如：若 SQL注入count=0，不生成該風險）。
每個風險至少提供 2 個具體建議。

回應純 JSON，不要有 markdown 格式。
    `.trim();
  }
  
  // 工具方法
  getTopN(logs, field, n) {
    const counts = new Map();
    logs.forEach(log => {
      const value = log[field];
      if (value) counts.set(value, (counts.get(value) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([item, count]) => ({ item, count }));
  }
  
  calculateAvg(logs, field) {
    const values = logs.map(log => log[field]).filter(v => v !== undefined);
    return values.length > 0 
      ? (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2) 
      : 0;
  }
}

module.exports = CloudflareWAFRiskService;
```

---

### 階段 2: 新增後端 API 端點

**檔案：** `backend/index.js`（新增端點）

```javascript
const CloudflareWAFRiskService = require('./services/cloudflareWAFRiskService');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 初始化服務
const cloudflareWAFService = new CloudflareWAFRiskService();

// ⭐ Cloudflare WAF 風險分析 API
app.post('/api/analyze-waf-risks-cloudflare', async (req, res) => {
  try {
    const { apiKey, model = 'gemini-2.5-flash', timeRange = '24h' } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: '請提供 Gemini API Key' });
    }
    
    console.log('🔍 開始 Cloudflare WAF 風險分析...');
    console.log(`📅 時間範圍: ${timeRange}`);
    console.log(`⭐ 使用索引: ${ELK_CONFIG.elasticsearch.index}`);
    
    // Step 1: 透過 ELK MCP 分析 Cloudflare 日誌
    const analysisData = await cloudflareWAFService.analyzeCloudflareWAF(timeRange);
    console.log(`✅ 分析完成，處理 ${analysisData.totalEvents} 筆事件`);
    
    // Step 2: 生成 AI Prompt
    const aiPrompt = cloudflareWAFService.generateAIPrompt(analysisData);
    
    // Step 3: 調用 Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const genModel = genAI.getGenerativeModel({ model });
    const result = await genModel.generateContent(aiPrompt);
    const response = await result.response;
    let aiResponseText = response.text();
    
    // Step 4: 解析 AI 回應
    aiResponseText = aiResponseText.replace(/```json\s*|```\s*/g, '').trim();
    if (!aiResponseText.startsWith('{')) {
      const jsonStart = aiResponseText.indexOf('{');
      if (jsonStart !== -1) aiResponseText = aiResponseText.substring(jsonStart);
    }
    
    let aiAnalysis;
    try {
      aiAnalysis = JSON.parse(aiResponseText);
    } catch (parseError) {
      console.error('❌ AI 回應解析失敗');
      // 回退：生成基本風險資料
      aiAnalysis = cloudflareWAFService.generateFallbackRisks(analysisData);
    }
    
    // Step 5: 驗證並回傳資料（格式完全符合 WAFRiskData[]）
    const risks = aiAnalysis.risks || [];
    
    console.log(`✅ 成功生成 ${risks.length} 個風險項目`);
    
    res.json({
      success: true,
      risks: risks,  // ⭐ 前端直接使用的格式
      metadata: {
        timestamp: new Date().toISOString(),
        model: model,
        dataSource: 'elk-mcp',
        index: ELK_CONFIG.elasticsearch.index,
        totalEvents: analysisData.totalEvents,
        timeRange: analysisData.timeRange
      }
    });
    
  } catch (error) {
    console.error('❌ Cloudflare WAF 風險分析失敗:', error);
    res.status(500).json({ 
      error: '分析失敗', 
      details: error.message 
    });
  }
});
```

---

### 階段 3: 最小化修改前端（只改資料來源）

**檔案：** `frontend/app/ai-analysis/cloudflare/page.tsx`

**修改位置：** `useEffect` 中的資料載入邏輯

```typescript
// 只修改這一段（第 17-194 行）
useEffect(() => {
  // ⭐ 修改：從後端 API 載入真實資料
  const loadWAFRisks = async () => {
    if (wafRisks.length > 0) return; // 避免重複載入
    
    try {
      // 從 localStorage 取得 API Key
      const apiKey = localStorage.getItem('gemini_api_key');
      const model = localStorage.getItem('gemini_model') || 'gemini-2.5-flash';
      
      if (!apiKey) {
        console.warn('未設定 API Key，使用模擬資料');
        setWafRisks(MOCK_DATA); // 保留 fallback
        return;
      }
      
      // 調用後端 API
      const response = await fetch('http://localhost:8080/api/analyze-waf-risks-cloudflare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, model, timeRange: '24h' })
      });
      
      if (!response.ok) {
        throw new Error('API 請求失敗');
      }
      
      const data = await response.json();
      
      // ⭐ 直接使用回傳的 risks（格式已經完全符合）
      setWafRisks(data.risks);
      
    } catch (error) {
      console.error('載入 WAF 風險失敗:', error);
      // Fallback 到模擬資料
      setWafRisks(MOCK_DATA);
    }
  };
  
  loadWAFRisks();
}, [wafRisks.length, setWafRisks]);

// 其餘程式碼完全不變
```

**注意：** 不添加任何 UI 元素（載入狀態、錯誤提示、重新分析按鈕等），保持畫面完全一致。

---

## ✅ 實作檢查清單

### 後端實作

- [ ] **建立 Cloudflare WAF 服務**
  - 檔案: `backend/services/cloudflareWAFRiskService.js`
  - 使用 `elkMCPClient` (現有)
  - 使用 `ELK_CONFIG` (現有)
  - 使用 `CLOUDFLARE_FIELD_MAPPING` (現有)

- [ ] **新增 API 端點**
  - 路由: `POST /api/analyze-waf-risks-cloudflare`
  - 位置: `backend/index.js`
  - 回傳格式: `{ success, risks: WAFRiskData[], metadata }`

- [ ] **測試 ELK MCP 查詢**
  ```bash
  # 測試查詢 Cloudflare 日誌
  curl -X POST http://localhost:8080/api/analyze-waf-risks-cloudflare \
    -H "Content-Type: application/json" \
    -d '{"apiKey":"YOUR_API_KEY","timeRange":"1h"}'
  ```

### 前端實作

- [ ] **最小化修改前端**
  - 只修改 `useEffect` 資料載入邏輯
  - 不修改任何 UI
  - 不添加任何新元素
  - 保留 fallback 機制

### 測試驗證

- [ ] **資料格式驗證**
  - 確認 API 回傳的 `risks` 格式符合 `WAFRiskData[]`
  - 確認所有欄位存在且類型正確
  - 確認 `recommendations` 格式正確

- [ ] **UI 顯示驗證**
  - 左側：風險分類正確
  - 中間：詳細資訊顯示正確
  - 右側：建議顯示正確
  - 沒有任何 UI 變化

- [ ] **錯誤處理驗證**
  - API Key 錯誤時 fallback 到模擬資料
  - 網路錯誤時 fallback 到模擬資料
  - 解析錯誤時 fallback 到模擬資料

---

## 🎯 關鍵要點

### ✅ 做的事

1. **使用現有配置**
   - `backend/config/elkConfig.js` 的所有設定
   - `backend/services/elkMCPClient.js` 的 MCP 客戶端
   - `cloudflare-field-mapping.js` 的欄位對應

2. **透過 MCP 查詢 ELK**
   - 索引: `adasone-cf-logpush-*`
   - 使用現有的 `elkMCPClient.queryElasticsearch()`
   - 完全基於真實 Cloudflare 日誌

3. **生成符合格式的資料**
   - 完全符合 `WAFRiskData` 介面
   - 格式與現有模擬資料一致
   - 可直接替換使用

### ❌ 不做的事

1. **不修改 UI**
   - 不添加載入狀態
   - 不添加錯誤訊息
   - 不添加重新分析按鈕
   - 不修改任何樣式

2. **不創建新功能**
   - 不添加時間範圍選擇
   - 不添加匯出功能
   - 不添加歷史對比
   - 不添加任何該頁面沒有的東西

3. **不修改架構**
   - 不修改 `waf-data-context.tsx`
   - 不修改路由結構
   - 不修改 Card/Button 組件

---

## 🚀 實作優先順序

### 第一優先（核心）

1. **建立 `CloudflareWAFRiskService`**
   - 正確使用 `CLOUDFLARE_FIELD_MAPPING`
   - 正確解析 WAF 分數
   - 生成正確格式的資料

2. **新增 API 端點**
   - 正確回傳 `WAFRiskData[]`
   - 錯誤處理完善

### 第二優先（整合）

3. **修改前端資料載入**
   - 最小化修改
   - 保留 fallback

4. **測試驗證**
   - 確保格式正確
   - 確保 UI 不變

---

**文檔版本**: v3.0 FINAL  
**建立時間**: 2024-11-10  
**狀態**: ✅ **準備實作（完全對齊現有架構）**

