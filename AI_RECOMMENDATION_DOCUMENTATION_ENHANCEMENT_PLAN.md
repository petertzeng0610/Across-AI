# AI 分析建議操作文件增強計畫

## 📋 需求分析

### 當前狀況
- AI 分析後在「執行建議按鈕」區塊顯示多個建議操作
- 每個建議下方有「執行此操作」按鈕
- 目前點擊會模擬執行（但實際上無法接 API）

### 需求變更
用戶希望點擊「執行此操作」按鈕時：
1. **不直接執行操作**，而是顯示詳細的操作步驟文件
2. **撈取原廠文件**（F5 或 Cloudflare）的 step-by-step 操作指引
3. **使用下拉式設計**（類似「自定義日期範圍」的 collapse 效果）
4. **顯示操作完成按鈕**，點擊後縮回
5. 同時適用於 **F5** 和 **Cloudflare** 兩個平台

---

## ✅ 可行性分析

### 1. 技術可行性：**高度可行** ✅

#### 1.1 前端實作
- ✅ 已有 `AnimatePresence` 和 `motion.div` 實作經驗（自定義日期範圍）
- ✅ 可使用相同的 collapse/expand 機制
- ✅ 按鈕狀態管理（展開/收起）已有範例參考

#### 1.2 後端資料來源
- ✅ **F5 原廠文件**：`backend/docs/f5/v17.1/` 
  - `violations-description.md`（違規類型說明）
  - `schema-description.md`（欄位結構說明）
  - 其他技術文件
- ✅ **Cloudflare 原廠文件**：`backend/docs/cloudflare/stages/stage-4-security-products/`
  - `waf.md`（WAF 完整說明，143 頁）
  - `traffic-detections.md`（流量偵測與 Attack Score）
  - `custom-rules.md`（Custom Rules 設定）
  - `rate-limiting-rules.md`（Rate Limiting 設定）
  - `managed-rules.md`（Managed Rules 說明）
- ✅ 已有 `f5Standards.js` 和 `cloudflareStandards.js` 定義威脅類型
- ℹ️ **現有文件主要是描述性內容，操作指引會引用這些文件作為技術參考**

#### 1.3 資料結構對應
```javascript
recommendation = {
  title: "啟用 SQL 注入防護簽章",
  description: "啟用 F5 SQL 注入防護簽章（Signature Set 200010000 系列）...",
  priority: "high"
}
```

需要新增：
```javascript
recommendation = {
  title: "啟用 SQL 注入防護簽章",
  description: "啟用 F5 SQL 注入防護簽章（Signature Set 200010000 系列）...",
  priority: "high",
  operationGuide: {
    platform: "f5",  // or "cloudflare"
    category: "SQL_INJECTION",
    steps: [...]
  }
}
```

---

## 🎯 實施方案

### 方案 A：靜態操作文件庫（推薦）⭐

#### 優點
- ✅ 實作簡單快速
- ✅ 內容可控，品質穩定
- ✅ 載入速度快（不需要查詢文件）
- ✅ 可以針對每個建議類型客製化操作步驟

#### 缺點
- ⚠️ 需要手動維護操作文件
- ⚠️ 新增威脅類型需要同步更新

#### 實作架構
```
backend/
  config/
    products/
      f5/
        f5FieldMapping.js
        f5Standards.js
        f5OperationGuides.js  ← 新增
      cloudflare/
        cloudflareFieldMapping.js
        cloudflareStandards.js
        cloudflareOperationGuides.js  ← 新增
```

---

### 方案 B：動態文件查詢（進階）

#### 優點
- ✅ 自動從原廠文件提取資訊
- ✅ 可以使用 AI 生成操作步驟

#### 缺點
- ⚠️ 實作複雜度高
- ⚠️ 需要 AI 額外解析文件
- ⚠️ 載入時間較長
- ⚠️ 品質不穩定（AI 可能理解錯誤）

---

## 📐 詳細設計方案（方案 A）

### 第一階段：建立操作文件資料結構

#### 1.1 F5 操作文件範例
```javascript
// backend/config/products/f5/f5OperationGuides.js

const F5_OPERATION_GUIDES = {
  // SQL 注入防護
  SQL_INJECTION_PROTECTION: {
    id: 'SQL_INJECTION_PROTECTION',
    title: '啟用 SQL 注入防護簽章',
    category: 'SQL Injection',
    severity: 'high',
    estimatedTime: '10-15 分鐘',
    prerequisites: [
      '需要具備 F5 BIG-IP Advanced WAF 管理員權限',
      '已登入 F5 BIG-IP 管理介面',
      '確認已建立 Security Policy'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '登入 F5 BIG-IP 管理介面',
        description: '使用管理員帳號登入 F5 BIG-IP Advanced WAF 管理介面',
        actions: [
          '開啟瀏覽器，輸入 F5 管理介面 URL（例如：https://10.0.0.1:8443）',
          '輸入管理員帳號和密碼',
          '點擊「Log in」按鈕'
        ],
        screenshot: null,
        notes: '建議使用 Chrome 或 Firefox 瀏覽器'
      },
      {
        stepNumber: 2,
        title: '進入 Security Policy 設定頁面',
        description: '導航到 Application Security Policy 設定',
        actions: [
          '在左側選單點選「Security」',
          '選擇「Application Security」→「Security Policies」',
          '選擇要修改的 Security Policy（例如：/Common/my_waf_policy）',
          '點擊進入 Policy 編輯頁面'
        ],
        screenshot: null,
        notes: '確保選擇正確的 Security Policy'
      },
      {
        stepNumber: 3,
        title: '啟用攻擊簽章',
        description: '啟用 SQL 注入相關的攻擊簽章',
        actions: [
          '在 Policy 頁面中，點選「Attack Signatures」',
          '點擊「Add Signature Set」按鈕',
          '在搜尋框中輸入「SQL Injection」',
          '勾選 Signature Set「200010000 - SQL Injection Signatures」',
          '將「Enforcement Mode」設定為「Blocking」',
          '點擊「Add」按鈕'
        ],
        screenshot: null,
        notes: '建議先在「Transparent」模式下測試，確認無誤報後再改為「Blocking」'
      },
      {
        stepNumber: 4,
        title: '設定違規處理方式',
        description: '配置 SQL 注入違規的處理動作',
        actions: [
          '點選「Violations」→「VIOL_ATTACK_SIGNATURE」',
          '確認「Block」選項已勾選',
          '在「Learn」欄位選擇「Enabled」（啟用學習模式）',
          '設定「Alarm」為「Enabled」（啟用告警）',
          '點擊「Save」按鈕'
        ],
        screenshot: null,
        notes: '啟用學習模式可以減少誤報'
      },
      {
        stepNumber: 5,
        title: '套用並部署變更',
        description: '將設定變更套用到運行中的 Policy',
        actions: [
          '點擊頁面右上角的「Apply Policy」按鈕',
          '等待系統套用變更（通常需要 10-30 秒）',
          '確認頁面顯示「Policy applied successfully」訊息'
        ],
        screenshot: null,
        notes: '套用變更不會中斷現有連線'
      },
      {
        stepNumber: 6,
        title: '驗證設定',
        description: '驗證 SQL 注入防護是否正常運作',
        actions: [
          '前往「Security」→「Event Logs」→「Application」→「Requests」',
          '嘗試發送測試 SQL 注入請求（例如：\' OR 1=1--）',
          '確認該請求被阻擋並記錄在日誌中',
          '檢查違規類型顯示為「VIOL_ATTACK_SIGNATURE」'
        ],
        screenshot: null,
        notes: '建議在測試環境先進行驗證'
      }
    ],
    references: [
      {
        title: 'F5 BIG-IP ASM Attack Signatures 官方文件',
        url: 'https://support.f5.com/csp/knowledge-center/software/BIG-IP?module=BIG-IP%20ASM',
        type: 'official'
      },
      {
        title: 'SQL Injection 攻擊簽章列表',
        url: '/backend/docs/f5/v17.1/violations-description.md#viol_attack_signature',
        type: 'internal'
      }
    ],
    relatedViolations: [
      'VIOL_SQL_INJECTION',
      'VIOL_ATTACK_SIGNATURE',
      'VIOL_PARAMETER_VALUE_METACHAR'
    ],
    troubleshooting: [
      {
        issue: '套用 Policy 時發生錯誤',
        solution: '檢查是否有其他管理員正在編輯同一個 Policy，請等待對方完成或協調後再套用'
      },
      {
        issue: '正常流量被誤報',
        solution: '使用「Transparent」模式觀察一段時間，分析誤報的簽章 ID，然後在「Attack Signatures」中停用該簽章'
      },
      {
        issue: '設定後仍無法阻擋 SQL 注入',
        solution: '確認 Enforcement Mode 是否設定為「Blocking」，並檢查 Virtual Server 是否正確套用該 Security Policy'
      }
    ]
  },

  // XSS 防護
  XSS_PROTECTION: {
    id: 'XSS_PROTECTION',
    title: '啟用 XSS 跨站腳本攻擊防護',
    category: 'XSS',
    severity: 'high',
    estimatedTime: '10-15 分鐘',
    prerequisites: [
      '需要具備 F5 BIG-IP Advanced WAF 管理員權限',
      '已登入 F5 BIG-IP 管理介面'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '進入 Security Policy',
        description: '導航到要設定的 Security Policy',
        actions: [
          '登入 F5 管理介面',
          '選擇「Security」→「Application Security」→「Security Policies」',
          '選擇目標 Policy'
        ],
        screenshot: null,
        notes: null
      },
      {
        stepNumber: 2,
        title: '啟用 XSS 攻擊簽章',
        description: '新增 XSS 相關攻擊簽章集',
        actions: [
          '點選「Attack Signatures」',
          '搜尋「Cross-Site Scripting (XSS)」',
          '勾選 Signature Set「200003000 - Cross-Site Scripting (XSS) Signatures」',
          '設定為「Blocking」模式',
          '點擊「Add」'
        ],
        screenshot: null,
        notes: null
      },
      {
        stepNumber: 3,
        title: '啟用 XSS 參數檢查',
        description: '在參數層級啟用 XSS 檢查',
        actions: [
          '前往「Parameters」',
          '選擇全域參數設定（*）',
          '勾選「Check for XSS in parameter value」',
          '點擊「Update」'
        ],
        screenshot: null,
        notes: '這會檢查所有參數值中的 XSS 攻擊模式'
      },
      {
        stepNumber: 4,
        title: '套用變更',
        description: '套用 Policy 變更',
        actions: [
          '點擊「Apply Policy」',
          '等待套用完成'
        ],
        screenshot: null,
        notes: null
      }
    ],
    references: [
      {
        title: 'F5 XSS Protection 官方文件',
        url: 'https://support.f5.com/csp/knowledge-center',
        type: 'official'
      }
    ],
    relatedViolations: ['VIOL_XSS', 'VIOL_ATTACK_SIGNATURE'],
    troubleshooting: []
  },

  // 速率限制
  RATE_LIMITING: {
    id: 'RATE_LIMITING',
    title: '設定速率限制規則',
    category: 'Rate Limiting',
    severity: 'medium',
    estimatedTime: '15-20 分鐘',
    steps: [
      {
        stepNumber: 1,
        title: '建立 DoS Profile',
        description: '建立 DoS Protection Profile',
        actions: [
          '前往「Security」→「DoS Protection」→「DoS Profiles」',
          '點擊「Create」',
          '輸入 Profile 名稱（例如：rate_limit_profile）',
          '選擇「Application Security」'
        ],
        screenshot: null,
        notes: null
      },
      {
        stepNumber: 2,
        title: '設定 TPS-based 防護',
        description: '配置基於 TPS（每秒交易數）的速率限制',
        actions: [
          '在 DoS Profile 中，點選「Application Security」',
          '啟用「TPS-based Detection」',
          '設定「Rate Limit」，例如：100 requests/second',
          '選擇「Rate Limit Mode」為「Block」',
          '點擊「Update」'
        ],
        screenshot: null,
        notes: '建議先從較高的閾值開始，逐步調整'
      },
      {
        stepNumber: 3,
        title: '套用到 Virtual Server',
        description: '將 DoS Profile 套用到 Virtual Server',
        actions: [
          '前往「Local Traffic」→「Virtual Servers」',
          '選擇要保護的 Virtual Server',
          '在「Security」標籤下，選擇「DoS Protection Profile」',
          '選擇剛才建立的 Profile',
          '點擊「Update」'
        ],
        screenshot: null,
        notes: null
      }
    ],
    references: [],
    relatedViolations: ['VIOL_BRUTE_FORCE'],
    troubleshooting: []
  }
};

module.exports = { F5_OPERATION_GUIDES };
```

#### 1.2 Cloudflare 操作文件範例
```javascript
// backend/config/products/cloudflare/cloudflareOperationGuides.js

const CLOUDFLARE_OPERATION_GUIDES = {
  // 設定 WAF Custom Rule
  WAF_CUSTOM_RULE_SETUP: {
    id: 'WAF_CUSTOM_RULE_SETUP',
    title: '設定 WAF Custom Rule 阻擋攻擊',
    category: 'WAF Rules',
    severity: 'high',
    estimatedTime: '5-10 分鐘',
    prerequisites: [
      '需要 Cloudflare 帳號管理員權限',
      '已登入 Cloudflare Dashboard',
      '網站已接入 Cloudflare'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '登入 Cloudflare Dashboard',
        description: '開啟並登入 Cloudflare 管理介面',
        actions: [
          '前往 https://dash.cloudflare.com',
          '輸入您的 Email 和密碼',
          '完成 2FA 驗證（如有啟用）',
          '點擊「Log in」'
        ],
        screenshot: null,
        notes: '建議啟用兩步驟驗證以提升安全性'
      },
      {
        stepNumber: 2,
        title: '選擇要保護的網站',
        description: '在 Dashboard 中選擇目標網站',
        actions: [
          '在 Dashboard 首頁，點擊要設定的網站（domain）',
          '確認進入該網站的管理頁面'
        ],
        screenshot: null,
        notes: null
      },
      {
        stepNumber: 3,
        title: '進入 WAF Custom Rules 設定',
        description: '導航到 Custom Rules 設定頁面',
        actions: [
          '在左側選單點選「Security」',
          '選擇「WAF」',
          '點擊「Custom rules」標籤',
          '點擊「Create rule」按鈕'
        ],
        screenshot: null,
        notes: 'Custom rules 功能需要 Pro 或以上方案'
      },
      {
        stepNumber: 4,
        title: '設定規則條件',
        description: '根據攻擊類型設定阻擋條件',
        actions: [
          '在「Rule name」欄位輸入名稱（例如：Block SQL Injection）',
          '在「If…」區塊設定條件：',
          '  - Field: WAF Attack Score',
          '  - Operator: less than or equal',
          '  - Value: 20（高風險閾值）',
          '或使用進階表達式：',
          '  (cf.waf.score.sqli le 20)',
          '在「Then…」區塊選擇動作：「Block」'
        ],
        screenshot: null,
        notes: 'Attack Score <= 20 為 Cloudflare 官方建議的高風險閾值'
      },
      {
        stepNumber: 5,
        title: '部署規則',
        description: '儲存並部署 Custom Rule',
        actions: [
          '檢查規則設定是否正確',
          '點擊「Deploy」按鈕',
          '等待系統完成部署（通常數秒內完成）',
          '確認規則狀態顯示為「Active」'
        ],
        screenshot: null,
        notes: '規則部署後立即生效，無需等待'
      },
      {
        stepNumber: 6,
        title: '驗證規則運作',
        description: '測試並確認規則正常運作',
        actions: [
          '前往「Security」→「Events」',
          '等待 5-10 分鐘讓系統收集數據',
          '檢查是否有被阻擋的請求',
          '篩選條件：Action = Block, Rule = 您設定的規則名稱',
          '檢視被阻擋請求的詳細資訊'
        ],
        screenshot: null,
        notes: '建議持續監控 1-2 天，確認無誤報情況'
      }
    ],
    references: [
      {
        title: 'Cloudflare WAF Custom Rules 官方文件',
        url: 'https://developers.cloudflare.com/waf/custom-rules/',
        type: 'official'
      },
      {
        title: 'WAF Attack Score 說明',
        url: 'https://developers.cloudflare.com/waf/about/waf-attack-score/',
        type: 'official'
      },
      {
        title: '內部文件 - WAF 完整說明',
        url: '/backend/docs/cloudflare/stages/stage-4-security-products/waf.md',
        type: 'internal'
      },
      {
        title: '內部文件 - 流量偵測與 Attack Score',
        url: '/backend/docs/cloudflare/stages/stage-4-security-products/traffic-detections.md',
        type: 'internal'
      },
      {
        title: '內部文件 - Custom Rules 詳細說明',
        url: '/backend/docs/cloudflare/stages/stage-4-security-products/custom-rules.md',
        type: 'internal'
      }
    ],
    relatedScores: ['cf.waf.score.sqli', 'cf.waf.score.xss', 'cf.waf.score.rce'],
    troubleshooting: [
      {
        issue: '規則沒有阻擋任何請求',
        solution: '檢查 Attack Score 閾值是否設定過低。建議從 20 開始測試，視情況調整'
      },
      {
        issue: '正常流量被誤報',
        solution: '將動作從「Block」改為「Log」模式，觀察 1-2 天後分析日誌，找出誤報來源並調整條件'
      },
      {
        issue: '找不到 Custom rules 功能',
        solution: 'Custom rules 需要 Pro、Business 或 Enterprise 方案。請確認您的方案等級'
      }
    ]
  },

  // Rate Limiting Rule
  RATE_LIMITING_RULE: {
    id: 'RATE_LIMITING_RULE',
    title: '設定速率限制規則',
    category: 'Rate Limiting',
    severity: 'medium',
    estimatedTime: '10-15 分鐘',
    steps: [
      {
        stepNumber: 1,
        title: '進入 Rate Limiting 設定',
        description: '開啟速率限制規則設定頁面',
        actions: [
          '登入 Cloudflare Dashboard',
          '選擇要設定的網站',
          '點選「Security」→「WAF」',
          '選擇「Rate limiting rules」標籤',
          '點擊「Create rule」'
        ],
        screenshot: null,
        notes: null
      },
      {
        stepNumber: 2,
        title: '設定速率限制條件',
        description: '定義觸發速率限制的條件',
        actions: [
          '輸入規則名稱（例如：Login API Rate Limit）',
          '在「If incoming requests match…」設定比對條件',
          '  - 例如：URI Path equals "/api/login"',
          '在「With the same…」選擇追蹤方式',
          '  - 建議選擇「IP」（追蹤來源 IP）',
          '設定「Requests」數量和時間窗口',
          '  - 例如：10 requests per 10 seconds'
        ],
        screenshot: null,
        notes: '建議先設定較寬鬆的限制，觀察後再調整'
      },
      {
        stepNumber: 3,
        title: '設定處理動作',
        description: '選擇超過限制時的處理方式',
        actions: [
          '在「Then take action…」選擇動作',
          '  - Block：直接阻擋',
          '  - Managed Challenge：顯示挑戰頁面',
          '  - JS Challenge：JavaScript 挑戰',
          '  - Log：僅記錄（測試用）',
          '設定「Duration」（阻擋持續時間）',
          '  - 例如：60 seconds'
        ],
        screenshot: null,
        notes: '測試階段建議先使用「Log」動作'
      },
      {
        stepNumber: 4,
        title: '部署並驗證',
        description: '部署規則並測試效果',
        actions: [
          '點擊「Deploy」',
          '前往「Security」→「Events」查看效果',
          '測試：連續快速發送請求到設定的端點',
          '確認超過限制後觸發相應動作'
        ],
        screenshot: null,
        notes: null
      }
    ],
    references: [
      {
        title: 'Cloudflare Rate Limiting Rules 官方文件',
        url: 'https://developers.cloudflare.com/waf/rate-limiting-rules/',
        type: 'official'
      },
      {
        title: '內部文件 - Rate Limiting Rules 詳細說明',
        url: '/backend/docs/cloudflare/stages/stage-4-security-products/rate-limiting-rules.md',
        type: 'internal'
      },
      {
        title: '內部文件 - WAF 完整說明',
        url: '/backend/docs/cloudflare/stages/stage-4-security-products/waf.md',
        type: 'internal'
      }
    ],
    relatedScores: [],
    troubleshooting: []
  },

  // Managed Rules 啟用
  MANAGED_RULES_DEPLOYMENT: {
    id: 'MANAGED_RULES_DEPLOYMENT',
    title: '部署 Cloudflare Managed Ruleset',
    category: 'Managed Rules',
    severity: 'high',
    estimatedTime: '5-10 分鐘',
    steps: [
      {
        stepNumber: 1,
        title: '進入 Managed Rules 設定',
        actions: [
          '登入 Cloudflare Dashboard',
          '選擇網站',
          '點選「Security」→「WAF」',
          '選擇「Managed rules」標籤'
        ],
        screenshot: null,
        notes: null
      },
      {
        stepNumber: 2,
        title: '啟用 Cloudflare Managed Ruleset',
        actions: [
          '找到「Cloudflare Managed Ruleset」',
          '點擊右側的「Deploy」或「Enable」按鈕',
          '確認 Ruleset 狀態變為「Deployed」'
        ],
        screenshot: null,
        notes: '此 Ruleset 包含 Cloudflare 維護的攻擊簽章'
      },
      {
        stepNumber: 3,
        title: '調整 Sensitivity（敏感度）',
        actions: [
          '點擊 Ruleset 右側的「Configure」',
          '在「Ruleset configuration」中調整敏感度',
          '  - Low（低）：較少誤報，但可能漏掉攻擊',
          '  - Medium（中）：平衡設定（預設）',
          '  - High（高）：更嚴格，可能有誤報',
          '點擊「Save」'
        ],
        screenshot: null,
        notes: '建議從 Medium 開始，視情況調整'
      },
      {
        stepNumber: 4,
        title: '啟用 OWASP Core Ruleset（選用）',
        actions: [
          '找到「Cloudflare OWASP Core Ruleset」',
          '點擊「Deploy」',
          '設定 Paranoia Level（建議：PL1 或 PL2）',
          '選擇 Score Threshold（建議：Medium - 60 分）',
          '點擊「Save」'
        ],
        screenshot: null,
        notes: 'OWASP Ruleset 提供額外的防護層'
      }
    ],
    references: [
      {
        title: 'Cloudflare Managed Rules 官方文件',
        url: 'https://developers.cloudflare.com/waf/managed-rules/',
        type: 'official'
      },
      {
        title: '內部文件 - Managed Rules 詳細說明',
        url: '/backend/docs/cloudflare/stages/stage-4-security-products/managed-rules.md',
        type: 'internal'
      },
      {
        title: '內部文件 - WAF 完整說明',
        url: '/backend/docs/cloudflare/stages/stage-4-security-products/waf.md',
        type: 'internal'
      }
    ],
    relatedScores: [],
    troubleshooting: []
  }
};

module.exports = { CLOUDFLARE_OPERATION_GUIDES };
```

---

### 第二階段：後端 API 開發

#### 2.1 新增 API Endpoint

**F5 路由**
```javascript
// backend/routes/f5.routes.js

// 新增：取得操作指引
router.post('/get-operation-guide', async (req, res) => {
  try {
    const { recommendationTitle, category } = req.body;
    
    // 根據建議標題或分類，找到對應的操作指引
    const guideId = mapRecommendationToGuideId(recommendationTitle, category);
    
    if (!guideId) {
      return res.json({
        success: false,
        message: '找不到對應的操作指引'
      });
    }
    
    const { F5_OPERATION_GUIDES } = require('../config/products/f5/f5OperationGuides');
    const guide = F5_OPERATION_GUIDES[guideId];
    
    if (!guide) {
      return res.json({
        success: false,
        message: '操作指引不存在'
      });
    }
    
    res.json({
      success: true,
      guide: guide
    });
    
  } catch (error) {
    console.error('❌ 取得 F5 操作指引失敗:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 輔助函數：將建議對應到操作指引 ID
function mapRecommendationToGuideId(title, category) {
  const mappings = {
    'SQL 注入': 'SQL_INJECTION_PROTECTION',
    '啟用 SQL 注入防護簽章': 'SQL_INJECTION_PROTECTION',
    'XSS': 'XSS_PROTECTION',
    '跨站腳本': 'XSS_PROTECTION',
    '啟用 XSS 防護': 'XSS_PROTECTION',
    '速率限制': 'RATE_LIMITING',
    '設定速率限制': 'RATE_LIMITING'
  };
  
  // 先用標題比對
  for (const [keyword, guideId] of Object.entries(mappings)) {
    if (title.includes(keyword)) {
      return guideId;
    }
  }
  
  // 再用分類比對
  if (category) {
    const categoryMappings = {
      'SQL_INJECTION': 'SQL_INJECTION_PROTECTION',
      'XSS': 'XSS_PROTECTION',
      'RATE_LIMIT': 'RATE_LIMITING'
    };
    return categoryMappings[category];
  }
  
  return null;
}
```

**Cloudflare 路由**
```javascript
// backend/routes/cloudflare.routes.js

// 新增：取得操作指引
router.post('/get-operation-guide', async (req, res) => {
  try {
    const { recommendationTitle, category } = req.body;
    
    const guideId = mapRecommendationToGuideId(recommendationTitle, category);
    
    if (!guideId) {
      return res.json({
        success: false,
        message: '找不到對應的操作指引'
      });
    }
    
    const { CLOUDFLARE_OPERATION_GUIDES } = require('../config/products/cloudflare/cloudflareOperationGuides');
    const guide = CLOUDFLARE_OPERATION_GUIDES[guideId];
    
    if (!guide) {
      return res.json({
        success: false,
        message: '操作指引不存在'
      });
    }
    
    res.json({
      success: true,
      guide: guide
    });
    
  } catch (error) {
    console.error('❌ 取得 Cloudflare 操作指引失敗:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

function mapRecommendationToGuideId(title, category) {
  const mappings = {
    'WAF Custom Rule': 'WAF_CUSTOM_RULE_SETUP',
    '阻擋攻擊': 'WAF_CUSTOM_RULE_SETUP',
    '設定 WAF 規則': 'WAF_CUSTOM_RULE_SETUP',
    '速率限制': 'RATE_LIMITING_RULE',
    'Rate Limiting': 'RATE_LIMITING_RULE',
    'Managed Rules': 'MANAGED_RULES_DEPLOYMENT',
    '啟用託管規則': 'MANAGED_RULES_DEPLOYMENT'
  };
  
  for (const [keyword, guideId] of Object.entries(mappings)) {
    if (title.includes(keyword)) {
      return guideId;
    }
  }
  
  return null;
}
```

---

### 第三階段：前端 UI 實作

#### 3.1 修改 F5 頁面

```tsx
// frontend/app/ai-analysis/f5/page.tsx

// 新增狀態管理
const [expandedGuides, setExpandedGuides] = useState<Set<string>>(new Set());
const [operationGuides, setOperationGuides] = useState<{[key: string]: any}>({});
const [loadingGuides, setLoadingGuides] = useState<Set<string>>(new Set());

// 點擊「執行此操作」按鈕時的處理
const handleExecuteAction = async (
  actionTitle: string, 
  actionDescription: string, 
  issueId: string,
  actionIndex: number
) => {
  const guideKey = `${issueId}-${actionIndex}`;
  
  // 如果已展開，則收起
  if (expandedGuides.has(guideKey)) {
    setExpandedGuides(prev => {
      const newSet = new Set(prev);
      newSet.delete(guideKey);
      return newSet;
    });
    return;
  }
  
  // 如果已有操作指引，直接展開
  if (operationGuides[guideKey]) {
    setExpandedGuides(prev => new Set(prev).add(guideKey));
    return;
  }
  
  // 載入操作指引
  setLoadingGuides(prev => new Set(prev).add(guideKey));
  
  try {
    const response = await fetch('http://localhost:8080/api/f5/get-operation-guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recommendationTitle: actionTitle,
        category: null  // 可以從 risk 中取得 category
      })
    });
    
    const data = await response.json();
    
    if (data.success && data.guide) {
      setOperationGuides(prev => ({
        ...prev,
        [guideKey]: data.guide
      }));
      setExpandedGuides(prev => new Set(prev).add(guideKey));
      
      toast({
        title: "✅ 操作指引已載入",
        description: "請依照步驟完成設定"
      });
    } else {
      toast({
        title: "⚠️ 找不到操作指引",
        description: data.message || "暫無此操作的詳細步驟",
        variant: "destructive"
      });
    }
  } catch (error) {
    console.error('載入操作指引失敗:', error);
    toast({
      title: "❌ 載入失敗",
      description: "無法取得操作指引，請稍後再試",
      variant: "destructive"
    });
  } finally {
    setLoadingGuides(prev => {
      const newSet = new Set(prev);
      newSet.delete(guideKey);
      return newSet;
    });
  }
};

// 操作完成處理
const handleOperationComplete = (guideKey: string) => {
  setExpandedGuides(prev => {
    const newSet = new Set(prev);
    newSet.delete(guideKey);
    return newSet;
  });
  
  toast({
    title: "✅ 操作已完成",
    description: "已標記為完成，建議稍後檢查效果"
  });
  
  // 可選：記錄到 localStorage 或後端
  // saveCompletedOperation(guideKey);
};

// 在渲染建議區塊時
{assessment.recommendations.map((rec, idx) => {
  const guideKey = `${assessment.id}-${idx}`;
  const isExpanded = expandedGuides.has(guideKey);
  const guide = operationGuides[guideKey];
  const isLoading = loadingGuides.has(guideKey);
  
  return (
    <div key={idx} className="space-y-2">
      <div className="p-4 rounded-lg bg-slate-800/50 border border-cyan-400/30">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-white font-medium text-sm">{rec.title}</h4>
              <Badge
                className={
                  rec.priority === "high"
                    ? "bg-red-500/20 text-red-400 border-red-500/50"
                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                }
                variant="outline"
              >
                {rec.priority.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">{rec.description}</p>
          </div>
        </div>

        <Button
          onClick={() => handleExecuteAction(rec.title, rec.description, assessment.id, idx)}
          disabled={isLoading}
          className={`w-full ${
            isExpanded
              ? "bg-slate-600 hover:bg-slate-700"
              : "bg-cyan-600 hover:bg-cyan-700"
          } text-white`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              載入中...
            </>
          ) : isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              收起操作步驟
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              查看操作步驟
            </>
          )}
        </Button>
      </div>
      
      {/* 操作指引展開區塊 */}
      <AnimatePresence>
        {isExpanded && guide && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="bg-slate-800/30 border-cyan-500/30">
              <CardContent className="p-6 space-y-6">
                {/* 操作指引標題與資訊 */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      📘 {guide.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{guide.estimatedTime}</span>
                      </div>
                      <Badge className={
                        guide.severity === 'high' 
                          ? "bg-red-500/20 text-red-400" 
                          : "bg-yellow-500/20 text-yellow-400"
                      }>
                        {guide.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* 前置條件 */}
                {guide.prerequisites && guide.prerequisites.length > 0 && (
                  <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-semibold text-blue-300">
                        前置條件
                      </span>
                    </div>
                    <ul className="space-y-1 text-sm text-slate-300">
                      {guide.prerequisites.map((prereq: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 操作步驟 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <span className="text-cyan-400">📋</span>
                    <span>操作步驟</span>
                  </div>
                  
                  {guide.steps.map((step: any, stepIndex: number) => (
                    <div 
                      key={stepIndex}
                      className="p-4 bg-slate-900/50 border border-slate-600/50 rounded-lg space-y-3"
                    >
                      {/* 步驟標題 */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                          {step.stepNumber}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-1">
                            {step.title}
                          </h4>
                          <p className="text-sm text-slate-400">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* 詳細動作 */}
                      {step.actions && step.actions.length > 0 && (
                        <div className="ml-11 space-y-2">
                          {step.actions.map((action: string, actionIndex: number) => (
                            <div 
                              key={actionIndex}
                              className="flex items-start gap-2 text-sm text-slate-300"
                            >
                              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{action}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* 注意事項 */}
                      {step.notes && (
                        <div className="ml-11 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded text-sm text-yellow-200 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{step.notes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 參考文件 */}
                {guide.references && guide.references.length > 0 && (
                  <div className="p-4 bg-slate-900/50 border border-slate-600/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3 text-white font-semibold">
                      <span>📚</span>
                      <span>參考文件</span>
                    </div>
                    <ul className="space-y-2">
                      {guide.references.map((ref: any, i: number) => (
                        <li key={i}>
                          <a 
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
                          >
                            <span>{ref.title}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 疑難排解 */}
                {guide.troubleshooting && guide.troubleshooting.length > 0 && (
                  <div className="p-4 bg-slate-900/50 border border-slate-600/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3 text-white font-semibold">
                      <span>🔧</span>
                      <span>常見問題與疑難排解</span>
                    </div>
                    <div className="space-y-3">
                      {guide.troubleshooting.map((item: any, i: number) => (
                        <div key={i} className="space-y-1">
                          <div className="text-sm font-semibold text-red-400">
                            ❌ {item.issue}
                          </div>
                          <div className="text-sm text-slate-300 ml-4">
                            ✅ {item.solution}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 操作完成按鈕 */}
                <div className="flex gap-3 pt-4 border-t border-slate-600">
                  <Button
                    onClick={() => handleOperationComplete(guideKey)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    操作完成
                  </Button>
                  <Button
                    onClick={() => {
                      setExpandedGuides(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(guideKey);
                        return newSet;
                      });
                    }}
                    variant="outline"
                    className="bg-slate-700 hover:bg-slate-600 text-white border-slate-500"
                  >
                    <ChevronUp className="w-4 h-4 mr-2" />
                    收起
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
})}
```

#### 3.2 修改 Cloudflare 頁面

Cloudflare 頁面的實作方式相同，只需將 API endpoint 改為 `/api/cloudflare/get-operation-guide`。

---

## 📅 實施時程

### 第一週：資料準備
- **Day 1-2**: 建立 `f5OperationGuides.js` 基礎結構，撰寫 3-5 個常見操作指引
- **Day 3-4**: 建立 `cloudflareOperationGuides.js`，撰寫 3-5 個操作指引
- **Day 5**: Code Review 與調整

### 第二週：後端開發
- **Day 1-2**: 實作 F5 路由 `/get-operation-guide`
- **Day 3-4**: 實作 Cloudflare 路由 `/get-operation-guide`
- **Day 5**: 測試後端 API，撰寫測試案例

### 第三週：前端開發
- **Day 1-3**: 實作 F5 頁面的操作指引 UI（collapse、展開、完成按鈕）
- **Day 4-5**: 實作 Cloudflare 頁面的操作指引 UI

### 第四週：測試與優化
- **Day 1-2**: 整合測試（前後端聯調）
- **Day 3-4**: UI/UX 優化、錯誤處理、Loading 狀態
- **Day 5**: 部署到測試環境，進行用戶測試

---

## 🎨 UI/UX 設計要點

### 設計原則
1. **一致性**：F5 和 Cloudflare 頁面使用相同的 UI 模式
2. **清晰性**：步驟編號清楚，每步驟獨立顯示
3. **漸進式揭露**：預設收起，點擊後展開
4. **視覺回饋**：Loading、成功、失敗狀態明確
5. **可讀性**：字體大小適中，行距合理

### 顏色方案
- **步驟編號背景**：cyan-600
- **前置條件區塊**：blue-900/20 邊框 blue-500/30
- **注意事項**：yellow-900/20 邊框 yellow-500/30
- **完成按鈕**：green-600
- **收起按鈕**：slate-700

---

## 🔍 測試計畫

### 單元測試
- 測試 `mapRecommendationToGuideId` 函數的對應邏輯
- 測試操作指引資料結構的完整性

### 整合測試
- 測試 API endpoint 能正確回傳操作指引
- 測試前端展開/收起功能
- 測試 Loading 狀態顯示

### 用戶測試
- 邀請 3-5 位用戶測試操作流程
- 收集回饋：步驟是否清楚、是否有遺漏、UI 是否易用

---

## 💡 後續擴展建議

### 短期（1-2 個月）
1. **增加更多操作指引**：涵蓋更多攻擊類型和防護措施
2. **多語言支援**：提供英文版操作指引
3. **操作記錄**：記錄用戶完成的操作，提供歷史查詢

### 中期（3-6 個月）
1. **影片教學**：為複雜操作提供螢幕錄影
2. **互動式教學**：引導用戶逐步操作（類似 Onboarding）
3. **AI 生成步驟**：使用 AI 動態生成操作步驟（基於官方文件）

### 長期（6-12 個月）
1. **自動化執行**：真正整合 F5/Cloudflare API，實現一鍵執行
2. **模擬環境**：提供沙盒環境讓用戶練習
3. **社群貢獻**：允許用戶分享自己的操作經驗

---

## 📊 評估指標

### 量化指標
- **操作指引點擊率**：有多少用戶點擊「查看操作步驟」
- **完成率**：有多少用戶點擊「操作完成」
- **平均查看時長**：用戶花多久時間閱讀指引
- **API 回應時間**：操作指引載入速度

### 質化指標
- **用戶滿意度**：透過問卷調查收集回饋
- **步驟清晰度**：步驟是否容易理解
- **減少支援請求**：是否減少用戶諮詢操作方式的次數

---

## ⚠️ 風險與挑戰

### 技術風險
1. **操作指引過時**：F5/Cloudflare 介面更新後，步驟可能不適用
   - **應對**：定期檢查並更新文件，在步驟中標註適用版本

2. **對應邏輯不準確**：`mapRecommendationToGuideId` 可能無法準確對應
   - **應對**：建立測試案例，逐步完善對應邏輯

### 內容風險
1. **步驟不夠詳細**：用戶仍無法獨立完成操作
   - **應對**：收集用戶回饋，持續優化步驟內容

2. **文件維護成本高**：隨著功能增加，文件數量快速增長
   - **應對**：建立標準化的文件模板，使用 AI 輔助生成初稿

---

## 📝 總結

### 可行性結論
✅ **高度可行**

此方案具有以下優勢：
1. **技術成熟**：使用已驗證的 UI 模式（collapse/expand）
2. **資料充足**：已有原廠文件作為參考
3. **實作簡單**：主要是前端 UI 和靜態資料管理
4. **用戶價值高**：直接解決「無法接 API」的痛點

### 建議
1. **採用方案 A（靜態操作文件庫）**：快速實作，易於維護
2. **分階段實施**：先完成 3-5 個核心操作指引，驗證可行性後再擴展
3. **持續優化**：根據用戶回饋不斷改進步驟內容和 UI 設計

### 下一步
如果確認實施此方案，建議：
1. 先實作 **1-2 個操作指引**作為 POC（概念驗證）
2. 內部測試後，再擴展到更多操作類型
3. 準備好後，我可以協助實作完整程式碼

---

## 📞 聯絡資訊

如有任何問題或需要進一步討論，請隨時提出！

---

**文件版本**: 1.0  
**建立日期**: 2025-11-19  
**最後更新**: 2025-11-19

