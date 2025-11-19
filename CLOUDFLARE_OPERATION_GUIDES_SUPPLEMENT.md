# Cloudflare 操作指引補充報告

## 📋 問題描述

用戶測試時發現，Cloudflare AI 分析產生的某些建議類型**沒有對應的操作指引**，點擊「查看操作步驟」按鈕後顯示「找不到對應的操作指引」。

**缺失的建議類型**：
1. 強化 User-Agent 規則
2. 使用 User-Agent 灰名單
3. 限制 User-Agent 的使用
4. 限制高風險 IP 地址的訪問
5. 監控流量模式

**發現日期**: 2025-11-19

---

## ✅ 已補充的操作指引

### 1. **強化 User-Agent 規則** (`USER_AGENT_RULES`)

- **嚴重程度**: HIGH
- **預估時間**: 10-15 分鐘
- **步驟數**: 5 個詳細步驟

**涵蓋內容**:
- 進入 Custom Rules 設定
- 設定 User-Agent 過濾條件（空白、異常短、掃描工具等）
- 使用多種表達式方式（contains、length 等）
- 設定執行動作（Block / Managed Challenge / Log）
- 部署並監控效果

**關鍵表達式範例**:
```javascript
// 阻擋空白或異常短的 User-Agent
(http.user_agent eq "") or (len(http.user_agent) lt 10)

// 阻擋常見掃描工具
(http.user_agent contains "sqlmap") or (http.user_agent contains "nikto")

// 阻擋異常長的 User-Agent
(len(http.user_agent) gt 500)
```

---

### 2. **使用 User-Agent 灰名單** (`USER_AGENT_GREYLIST`)

- **嚴重程度**: MEDIUM
- **預估時間**: 15-20 分鐘
- **步驟數**: 5 個詳細步驟

**涵蓋內容**:
- 在帳號層級建立 User-Agent 清單
- 新增惡意 User-Agent 項目（sqlmap, nikto, nmap 等）
- 建立使用清單的 Custom Rule
- 定期更新清單維護
- 監控和調整灰名單效果

**關鍵表達式**:
```javascript
// 使用清單語法
(http.user_agent in $malicious_user_agents)
```

**清單容量**:
- Business 方案: 10,000 個項目
- Enterprise 方案: 50,000 個項目

---

### 3. **限制 User-Agent 的使用** (`RESTRICT_USER_AGENT`)

- **嚴重程度**: LOW
- **預估時間**: 10-15 分鐘
- **步驟數**: 5 個詳細步驟

**涵蓋內容**:
- 建立允許的 User-Agent 白名單
- 建立白名單規則（只允許白名單中的 User-Agent）
- 使用正規表達式方式（進階選項）
- 測試和驗證規則
- 設定例外規則（特定路徑）

**關鍵表達式**:
```javascript
// 白名單方式：阻擋不在白名單中的
not (http.user_agent in $allowed_user_agents)

// 正規表達式方式（Enterprise）
not (http.user_agent matches "^Mozilla/5\\.0")

// 針對特定路徑
(http.request.uri.path matches "/api/.*") and not (http.user_agent in $allowed_user_agents)
```

---

### 4. **限制高風險 IP 地址的訪問** (`RESTRICT_HIGH_RISK_IPS`)

- **嚴重程度**: MEDIUM
- **預估時間**: 10-15 分鐘
- **步驟數**: 5 個詳細步驟

**涵蓋內容**:
- 使用 Threat Score 阻擋高風險 IP
- 根據國家地理位置限制訪問
- 建立 IP 黑名單
- 結合 Bot Management（Enterprise）
- 監控和調整策略

**關鍵表達式**:
```javascript
// 使用 Threat Score（分數越高越危險）
(cf.threat_score gt 50)

// 阻擋特定國家（使用 ISO Alpha-2 代碼）
(ip.geoip.country in {"CN" "RU" "KP"})

// 國家白名單（只允許特定國家）
not (ip.geoip.country in {"TW" "US" "JP" "SG"})

// 使用 IP 黑名單
(ip.src in $blocked_ips)

// Bot Management（Enterprise）
(cf.bot_management.score lt 30)
```

---

### 5. **監控流量模式** (`MONITOR_TRAFFIC_PATTERNS`)

- **嚴重程度**: LOW
- **預估時間**: 20-30 分鐘
- **步驟數**: 6 個詳細步驟

**涵蓋內容**:
- 使用 Cloudflare Analytics Dashboard
- 監控安全事件（Security Events）
- 設定流量異常告警
- 使用 Cloudflare Logs（Enterprise）
- 建立自定義監控儀表板（GraphQL API）
- 分析流量模式並採取行動

**關鍵指標**:
- Total Requests（總請求數）
- Cached Requests（快取比例）
- Bandwidth（頻寬使用）
- Unique Visitors（獨立訪客）
- Security Events（安全事件）
- Top Sources / Countries / Paths

---

## 🔄 映射關鍵字更新

為了讓 AI 生成的建議能正確對應到操作指引，新增了以下關鍵字映射：

### User-Agent 相關
- `'User-Agent 規則'` → `USER_AGENT_RULES`
- `'強化 User-Agent'` → `USER_AGENT_RULES`
- `'User-Agent 灰名單'` → `USER_AGENT_GREYLIST`
- `'User-Agent 黑名單'` → `USER_AGENT_GREYLIST`
- `'限制 User-Agent'` → `RESTRICT_USER_AGENT`

### IP 管理相關
- `'高風險 IP'` → `RESTRICT_HIGH_RISK_IPS`
- `'限制 IP'` → `RESTRICT_HIGH_RISK_IPS`
- `'IP 地址'` → `RESTRICT_HIGH_RISK_IPS`

### 監控相關
- `'監控流量'` → `MONITOR_TRAFFIC_PATTERNS`
- `'流量模式'` → `MONITOR_TRAFFIC_PATTERNS`
- `'流量監控'` → `MONITOR_TRAFFIC_PATTERNS`

---

## 📊 Cloudflare 操作指引總覽

現在 Cloudflare 共有 **9 個完整的操作指引**：

| 編號 | ID | 標題 | 嚴重程度 | 預估時間 | 狀態 |
|-----|----|----|---------|---------|------|
| 1 | WAF_CUSTOM_RULE_SETUP | 設定 WAF Custom Rule 阻擋攻擊 | HIGH | 5-10 分鐘 | ✅ 原有 |
| 2 | RATE_LIMITING_RULE | 設定 Rate Limiting 規則 | MEDIUM | 10-15 分鐘 | ✅ 原有 |
| 3 | MANAGED_RULES_DEPLOYMENT | 部署 Managed Rules | HIGH | 5-10 分鐘 | ✅ 原有 |
| 4 | BOT_MANAGEMENT_SETUP | 設定 Bot Management | HIGH | 15-20 分鐘 | ✅ 原有 |
| 5 | USER_AGENT_RULES | 強化 User-Agent 規則 | HIGH | 10-15 分鐘 | ⭐ 新增 |
| 6 | USER_AGENT_GREYLIST | 使用 User-Agent 灰名單 | MEDIUM | 15-20 分鐘 | ⭐ 新增 |
| 7 | RESTRICT_USER_AGENT | 限制 User-Agent 的使用 | LOW | 10-15 分鐘 | ⭐ 新增 |
| 8 | RESTRICT_HIGH_RISK_IPS | 限制高風險 IP 地址的訪問 | MEDIUM | 10-15 分鐘 | ⭐ 新增 |
| 9 | MONITOR_TRAFFIC_PATTERNS | 監控流量模式 | LOW | 20-30 分鐘 | ⭐ 新增 |

---

## 📁 修改的檔案

- ✅ `/backend/config/products/cloudflare/cloudflareOperationGuides.js`
  - 新增 5 個完整的操作指引（共 680+ 行程式碼）
  - 更新映射函數，新增 15+ 個關鍵字

---

## 🧪 測試驗證

請按照以下步驟測試修復：

### 測試步驟

1. **重新啟動後端服務**（如果正在運行）:
```bash
cd backend
npm start
```

2. **前往 Cloudflare AI 分析頁面**:
   - `http://localhost:3000/ai-analysis/cloudflare`

3. **執行 AI 分析**:
   - 點擊「開始分析」
   - 等待分析完成

4. **測試新增的操作指引**:
   - 點擊任一風險項目
   - 在「執行建議按鈕」區域，找到以下建議：
     - ✅ 「強化 User-Agent 規則」→ 應顯示 5 個步驟
     - ✅ 「使用 User-Agent 灰名單」→ 應顯示 5 個步驟
     - ✅ 「限制 User-Agent 的使用」→ 應顯示 5 個步驟
     - ✅ 「限制高風險 IP 地址的訪問」→ 應顯示 5 個步驟
     - ✅ 「監控流量模式」→ 應顯示 6 個步驟

5. **驗證操作步驟內容**:
   - 確認每個步驟有清楚的標題和描述
   - 確認有詳細的 actions（操作清單）
   - 確認有參考文件連結
   - 確認有疑難排解區塊

### 預期結果

- ✅ 所有建議都有對應的操作指引
- ✅ 點擊「查看操作步驟」後正常展開面板
- ✅ 操作步驟內容完整且實用
- ✅ 不再出現「找不到對應的操作指引」訊息

---

## 📝 補充內容亮點

### 1. **完整性**
每個操作指引都包含：
- ✅ 前置條件（Prerequisites）
- ✅ 詳細步驟（5-6 個步驟）
- ✅ 每個步驟的具體動作清單
- ✅ 注意事項（Notes）
- ✅ 參考文件（Official + Internal）
- ✅ 疑難排解（2-3 個常見問題）

### 2. **實用性**
- ✅ 提供多種實作方式（基礎 + 進階）
- ✅ 包含具體的表達式範例
- ✅ 說明不同方案的優缺點
- ✅ 提供方案容量限制資訊
- ✅ 建議測試流程（Log → Challenge → Block）

### 3. **彈性**
- ✅ 適用於不同 Cloudflare 方案（Free/Pro/Business/Enterprise）
- ✅ 提供白名單和黑名單兩種策略
- ✅ 支援路徑級別的例外規則
- ✅ 可以組合多個條件使用

---

## 📚 參考文件整合

所有新增的操作指引都引用了：

### 官方文件
- Cloudflare Custom Rules
- Cloudflare Rules Language
- Cloudflare Lists
- Cloudflare Analytics
- Cloudflare Notifications
- Cloudflare Logs
- GraphQL Analytics API
- Bot Management

### 內部文件
- `/backend/docs/cloudflare/stages/stage-4-security-products/custom-rules.md`
- `/backend/docs/cloudflare/stages/stage-4-security-products/waf.md`

---

## 💡 最佳實踐建議

### User-Agent 管理
1. 先使用黑名單（阻擋已知惡意），而非白名單
2. 使用 Log 模式測試 1-2 天後再改為 Block
3. 定期更新灰名單以涵蓋新的攻擊模式
4. 結合其他規則（WAF Attack Score、Rate Limiting）

### IP 管理
1. 優先使用 Cloudflare 的 Threat Score
2. 使用 Managed Challenge 而非直接 Block
3. 結合地理位置和 IP 黑名單策略
4. 定期檢視並調整閾值

### 流量監控
1. 建立正常流量基準線（2-4 週）
2. 設定合理的告警閾值（300-500%）
3. 定期檢視 Security Events（每週一次）
4. 記錄調整結果，持續優化

---

## ✅ 完成檢查清單

- ✅ 新增 5 個完整的操作指引
- ✅ 更新映射函數支援新關鍵字
- ✅ 所有步驟包含詳細的 actions
- ✅ 所有指引包含參考文件
- ✅ 所有指引包含疑難排解
- ✅ 引用內部 Cloudflare 文件
- ✅ 無程式碼錯誤
- ⏳ 待用戶測試驗證

---

## 🔮 未來擴充建議

### 可能還需要的操作指引

1. **DDoS Protection 設定** - 針對 DDoS 攻擊的防護配置
2. **Page Rules 優化** - 使用 Page Rules 提升安全性
3. **SSL/TLS 設定** - 加密連線配置
4. **Firewall Rules Migration** - 從舊版 Firewall Rules 遷移到 Custom Rules
5. **Zone Lockdown** - 限制特定 URL 只能由特定 IP 訪問
6. **API Shield** - 保護 API 端點

這些可以根據實際 AI 分析產生的建議類型，逐步補充。

---

**補充日期**: 2025-11-19  
**補充者**: AI Assistant  
**版本**: v1.2

