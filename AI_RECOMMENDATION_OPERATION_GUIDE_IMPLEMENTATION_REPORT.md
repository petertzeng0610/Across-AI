# AI 建議操作指引實作報告

## 📋 實作總覽

本次實作成功將 AI 分析建議系統升級為**可查看詳細操作步驟的互動式指引系統**。使用者現在可以點擊「查看操作步驟」按鈕，展開包含 step-by-step 操作指引的面板，完成操作後點擊「操作完成」收起面板。

---

## ✅ 實作完成項目

### 1. **後端實作**

#### F5 操作指引資料檔案
- **檔案**: `/backend/config/products/f5/f5OperationGuides.js`
- **功能**: 
  - 建立 6 個完整的 F5 操作指引範例：
    1. SQL 注入防護簽章配置
    2. XSS 跨站腳本防護
    3. 速率限制規則設定
    4. **調整 violation_rating 閾值** ⭐ 新增
    5. **監控攻擊來源和目標 URL** ⭐ 新增
    6. 命令注入防護
  - 包含 prerequisites、steps、references、troubleshooting 等完整資訊
  - 實作 `mapRecommendationToGuideId` 映射函數，支援多種關鍵字對應

#### Cloudflare 操作指引資料檔案
- **檔案**: `/backend/config/products/cloudflare/cloudflareOperationGuides.js`
- **功能**: 
  - 建立 9 個完整的 Cloudflare 操作指引範例：
    1. WAF Custom Rule 設定
    2. Rate Limiting 規則
    3. Managed Rules 部署
    4. Bot Management 設定
    5. **強化 User-Agent 規則** ⭐ v1.2 新增
    6. **使用 User-Agent 灰名單** ⭐ v1.2 新增
    7. **限制 User-Agent 的使用** ⭐ v1.2 新增
    8. **限制高風險 IP 地址的訪問** ⭐ v1.2 新增
    9. **監控流量模式** ⭐ v1.2 新增
  - 包含 prerequisites、steps、references、troubleshooting 等完整資訊
  - 實作 `mapRecommendationToGuideId` 映射函數，支援多種關鍵字對應

#### F5 API Endpoint
- **檔案**: `/backend/routes/f5.routes.js`
- **Endpoint**: `POST /api/f5/get-operation-guide`
- **功能**: 
  - 接收 `recommendationTitle` 和 `category` 參數
  - 透過映射函數找到對應的操作指引
  - 回傳完整的操作指引資料

#### Cloudflare API Endpoint
- **檔案**: `/backend/routes/cloudflare.routes.js`
- **Endpoint**: `POST /api/cloudflare/get-operation-guide`
- **功能**: 
  - 接收 `recommendationTitle` 和 `category` 參數
  - 透過映射函數找到對應的操作指引
  - 回傳完整的操作指引資料

### 2. **前端實作**

#### F5 前端頁面
- **檔案**: `/frontend/app/ai-analysis/f5/page.tsx`
- **修改內容**:
  1. 新增 `FileText` 和 `ExternalLink` icons
  2. 新增三個狀態變數：
     - `expandedGuides`: 記錄展開的操作指引
     - `operationGuides`: 儲存已載入的操作指引資料
     - `loadingGuides`: 記錄正在載入的操作指引
  3. 實作 `handleExecuteAction` 函數：
     - 點擊按鈕時載入操作指引
     - 如已載入則直接展開/收起
     - 整合 API 呼叫和錯誤處理
  4. 實作 `handleOperationComplete` 函數：
     - 標記操作完成並收起面板
     - 顯示完成通知
  5. 重構建議渲染區塊：
     - 動態切換按鈕文字和圖示
     - 實作可展開的操作指引面板
     - 完整呈現前置條件、步驟、參考文件、疑難排解等資訊

#### Cloudflare 前端頁面
- **檔案**: `/frontend/app/ai-analysis/cloudflare/page.tsx`
- **修改內容**: 與 F5 頁面相同的實作邏輯，僅 API endpoint 不同

---

## 🎨 UI/UX 設計特色

### 1. **按鈕狀態動態切換**
- **初始狀態**: 🔹 "查看操作步驟" (藍色背景)
- **載入狀態**: ⏳ "載入中..." (帶旋轉動畫)
- **展開狀態**: 🔼 "收起操作步驟" (灰色背景)

### 2. **可展開操作指引面板**
採用 `framer-motion` 實作流暢的展開/收起動畫：
- **動畫效果**: height 和 opacity 漸變
- **配色風格**: 深色背景搭配青色邊框，符合原有設計語言

### 3. **完整的操作步驟呈現**

#### 標題區塊
- 📘 操作指引標題
- 🕒 預估時間
- 🔴 嚴重性標籤 (HIGH/CRITICAL)

#### 前置條件
- 🔷 藍色背景
- 清單式呈現所有前置條件

#### 操作步驟
- 🔢 數字編號 (圓形藍色背景)
- 步驟標題與描述
- ✅ 詳細動作清單 (綠色勾選圖示)
- ⚠️ 注意事項 (黃色警告框)

#### 參考文件
- 📚 文件標題
- 🔗 可點擊的連結 (開啟新分頁)
- 區分官方文件與內部文件

#### 疑難排解
- 🔧 常見問題列表
- ❌ 問題描述 (紅色)
- ✅ 解決方案 (灰色)

### 4. **雙按鈕設計**
- **操作完成** (綠色主按鈕): 標記完成並收起面板
- **收起** (灰色次要按鈕): 僅收起面板不標記完成

---

## 📊 資料結構設計

### 操作指引物件結構

```javascript
{
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
      title: '進入 Security Policy 設定頁面',
      description: '導航到 WAF 安全策略配置區域',
      actions: [
        '登入 F5 BIG-IP Configuration utility',
        '點選左側選單 Security > Application Security',
        '選擇目標 Security Policy'
      ],
      notes: '如果沒有 Security Policy，需先建立一個新的 Policy'
    }
    // ... 更多步驟
  ],
  references: [
    {
      title: 'F5 BIG-IP ASM Attack Signatures 官方文件',
      url: 'https://support.f5.com/...',
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
    'VIOL_ATTACK_SIGNATURE'
  ],
  troubleshooting: [
    {
      issue: '簽章更新失敗',
      solution: '確認網路連線正常，檢查 F5 License 是否有效'
    }
    // ... 更多疑難排解
  ]
}
```

---

## 🔗 文件引用策略

### F5 文件引用
**內部文件目錄**: `/backend/docs/f5/`

已引用的文件：
- `v17.1/violations-description.md` - 違規描述
- `v17.1/attack-signatures.md` - 攻擊簽章說明
- `v17.1/security-policy-configuration.md` - 安全策略配置
- `v17.1/rate-limiting.md` - 速率限制配置
- `v17.1/bot-defense.md` - Bot 防禦配置

### Cloudflare 文件引用
**內部文件目錄**: `/backend/docs/cloudflare/stages/stage-4-security-products/`

已引用的文件：
- `waf.md` - WAF 完整說明
- `traffic-detections.md` - 流量偵測與 Attack Score
- `custom-rules.md` - Custom Rules 詳細說明
- `rate-limiting-rules.md` - Rate Limiting Rules
- `managed-rules.md` - Managed Rules 部署指南

---

## 🧪 測試指南

### 前置準備

1. **啟動後端服務**
```bash
cd backend
npm start
```
確認服務運行在 `http://localhost:8080`

2. **啟動前端服務**
```bash
cd frontend
npm run dev
```
確認服務運行在 `http://localhost:3000`

### 測試步驟

#### 測試 F5 操作指引

1. **進入 F5 AI 分析頁面**
   - 導航至 `http://localhost:3000/ai-analysis/f5`
   - 點擊「開始分析」載入 WAF 風險資料

2. **選擇一個風險項目**
   - 從左側列表選擇任一風險項目（如：SQL Injection）
   - 確認右側「執行建議按鈕」區域顯示建議內容

3. **測試操作指引載入**
   - 點擊第一個建議的「查看操作步驟」按鈕
   - **預期結果**:
     - ✅ 按鈕文字變為「載入中...」並顯示旋轉動畫
     - ✅ 約 0.5-1 秒後展開操作指引面板
     - ✅ 顯示成功通知: "✅ 操作指引已載入"
     - ✅ 面板包含：標題、預估時間、嚴重性、前置條件、操作步驟、參考文件、疑難排解

4. **測試展開/收起功能**
   - 再次點擊「收起操作步驟」按鈕
   - **預期結果**:
     - ✅ 面板平滑收起
     - ✅ 按鈕文字變回「查看操作步驟」
   - 再次點擊按鈕
   - **預期結果**:
     - ✅ 面板立即展開（無需重新載入）

5. **測試操作完成功能**
   - 點擊操作指引面板底部的「操作完成」按鈕
   - **預期結果**:
     - ✅ 面板收起
     - ✅ 顯示完成通知: "✅ 操作已完成"

6. **測試多個建議**
   - 對其他建議重複步驟 3-5
   - 確認每個建議可獨立展開/收起

7. **測試找不到操作指引的情況**
   - 如果某個建議沒有對應的操作指引
   - **預期結果**:
     - ✅ 顯示警告通知: "⚠️ 找不到操作指引"

#### 測試 Cloudflare 操作指引

1. **進入 Cloudflare AI 分析頁面**
   - 導航至 `http://localhost:3000/ai-analysis/cloudflare`
   - 點擊「開始分析」載入 WAF 風險資料

2. **重複 F5 測試步驟 2-7**
   - 確認 Cloudflare 的操作指引功能與 F5 一致

### API 測試

可使用以下 curl 命令測試後端 API：

#### 測試 F5 API
```bash
curl -X POST http://localhost:8080/api/f5/get-operation-guide \
  -H "Content-Type: application/json" \
  -d '{
    "recommendationTitle": "啟用 SQL 注入防護簽章",
    "category": null
  }'
```

**預期回應**:
```json
{
  "success": true,
  "product": "F5",
  "guide": {
    "id": "SQL_INJECTION_PROTECTION",
    "title": "啟用 SQL 注入防護簽章",
    // ... 完整操作指引資料
  }
}
```

#### 測試 Cloudflare API
```bash
curl -X POST http://localhost:8080/api/cloudflare/get-operation-guide \
  -H "Content-Type: application/json" \
  -d '{
    "recommendationTitle": "設定 WAF Custom Rule 阻擋攻擊",
    "category": null
  }'
```

**預期回應**:
```json
{
  "success": true,
  "product": "Cloudflare",
  "guide": {
    "id": "WAF_CUSTOM_RULE_SETUP",
    "title": "設定 WAF Custom Rule 阻擋攻擊",
    // ... 完整操作指引資料
  }
}
```

---

## 📁 檔案清單

### 新增檔案
- `/backend/config/products/f5/f5OperationGuides.js`
- `/backend/config/products/cloudflare/cloudflareOperationGuides.js`

### 修改檔案
- `/backend/routes/f5.routes.js` - 新增 `/get-operation-guide` endpoint
- `/backend/routes/cloudflare.routes.js` - 新增 `/get-operation-guide` endpoint
- `/frontend/app/ai-analysis/f5/page.tsx` - 實作操作指引 UI
- `/frontend/app/ai-analysis/cloudflare/page.tsx` - 實作操作指引 UI

---

## 🔄 工作流程

```
使用者點擊「查看操作步驟」
    ↓
前端檢查是否已載入操作指引
    ↓
[未載入] → 呼叫後端 API
    ↓
後端透過映射函數找到對應 Guide ID
    ↓
後端回傳完整操作指引資料
    ↓
前端儲存資料並展開面板
    ↓
[已載入] → 直接展開面板
    ↓
使用者查看操作步驟
    ↓
使用者完成操作後點擊「操作完成」
    ↓
前端收起面板並顯示完成通知
```

---

## 🚀 未來擴充建議

### 1. **操作歷史記錄**
- 記錄使用者完成的操作指引
- 在儀表板顯示操作完成率
- 提供操作歷史查詢功能

### 2. **自動化執行**
- 針對部分簡單操作提供一鍵執行功能
- 整合 F5 和 Cloudflare API 實現自動化配置
- 執行前預覽變更內容

### 3. **操作指引擴充**
- 為更多建議類型建立操作指引
- 支援自定義操作指引
- 提供操作指引編輯器

### 4. **多語言支援**
- 提供英文、繁體中文、簡體中文版本
- 根據使用者偏好自動切換語言

### 5. **互動式教學**
- 加入影片教學
- 提供互動式 Walkthrough
- 整合截圖和標註功能

### 6. **協作功能**
- 操作指引可分享給團隊成員
- 支援操作指引的評論和討論
- 記錄誰執行了哪些操作

---

## ✅ 實作驗收檢查表

- [x] F5 操作指引資料檔案建立完成
- [x] Cloudflare 操作指引資料檔案建立完成
- [x] F5 後端 API endpoint 實作完成
- [x] Cloudflare 後端 API endpoint 實作完成
- [x] F5 前端 UI 修改完成
- [x] Cloudflare 前端 UI 修改完成
- [x] 無 Linter 錯誤
- [x] UI 動畫流暢
- [x] 錯誤處理完善
- [x] 參考文件連結正確
- [x] 內部文件引用正確

---

## 📞 技術支援

如果在測試過程中遇到問題，請檢查：

1. **後端服務是否正常運行**
   - 檢查 console 是否有錯誤訊息
   - 確認 port 8080 未被佔用

2. **前端服務是否正常運行**
   - 檢查 browser console 是否有錯誤
   - 確認 port 3000 未被佔用

3. **API 連線是否正常**
   - 檢查 Network tab 確認 API 請求成功
   - 確認後端 API 回應格式正確

4. **操作指引檔案是否存在**
   - 確認 `f5OperationGuides.js` 和 `cloudflareOperationGuides.js` 正確匯出

---

## 🎉 實作總結

本次實作成功完成了 **AI 建議操作指引功能**，為使用者提供了：

✅ **直觀的操作步驟**: step-by-step 引導，降低操作門檻  
✅ **完整的文件引用**: 整合原廠文件和內部文件  
✅ **流暢的互動體驗**: 可展開/收起的操作面板  
✅ **豐富的資訊呈現**: 前置條件、步驟、疑難排解一應俱全  
✅ **雙產品支援**: F5 和 Cloudflare 完整覆蓋  

這套系統讓原本只是「建議文字」的功能，升級為**可實際操作的互動式指引系統**，大幅提升了 AI 分析建議的實用價值！

---

## 📝 更新記錄

### v1.2 (2025-11-19)
**補充 Cloudflare 操作指引**

根據用戶測試反饋，發現以下 Cloudflare 建議類型缺少操作指引：
- ❌ "強化 User-Agent 規則" - 沒有操作說明
- ❌ "使用 User-Agent 灰名單" - 沒有操作說明
- ❌ "限制 User-Agent 的使用" - 沒有操作說明
- ❌ "限制高風險 IP 地址的訪問" - 沒有操作說明
- ❌ "監控流量模式" - 沒有操作說明

**補充內容**：
1. ✅ 新增 `USER_AGENT_RULES` 操作指引（5 個步驟）
   - 設定 User-Agent 過濾條件
   - 阻擋空白、異常短、掃描工具 User-Agent
   - 部署並監控效果

2. ✅ 新增 `USER_AGENT_GREYLIST` 操作指引（5 個步驟）
   - 建立 User-Agent 清單（帳號層級）
   - 新增惡意 User-Agent 項目
   - 建立使用清單的 Custom Rule
   - 定期更新和維護

3. ✅ 新增 `RESTRICT_USER_AGENT` 操作指引（5 個步驟）
   - 建立允許的 User-Agent 白名單
   - 使用正規表達式限制
   - 設定例外規則

4. ✅ 新增 `RESTRICT_HIGH_RISK_IPS` 操作指引（5 個步驟）
   - 使用 Threat Score 阻擋高風險 IP
   - 根據國家地理位置限制
   - 建立 IP 黑名單
   - 結合 Bot Management

5. ✅ 新增 `MONITOR_TRAFFIC_PATTERNS` 操作指引（6 個步驟）
   - 使用 Analytics Dashboard
   - 監控安全事件
   - 設定流量異常告警
   - 使用 Logpush（Enterprise）
   - 建立自定義監控儀表板

6. ✅ 更新映射函數 `mapRecommendationToGuideId`
   - 新增 15+ 個關鍵字（User-Agent、IP、監控相關）
   - 支援中文關鍵字匹配

**成果**：
- Cloudflare 操作指引從 4 個增加到 **9 個**
- 涵蓋 User-Agent 管理、IP 管理、流量監控三大類別
- 新增 680+ 行詳細操作步驟程式碼

---

### v1.1 (2025-11-19)
**補充 F5 操作指引**

根據用戶測試反饋，發現以下建議類型缺少操作指引：
- ❌ "調整 violation_rating 閾值" - 沒有操作說明
- ❌ "監控攻擊來源和目標 URL" - 沒有操作說明

**補充內容**：
1. ✅ 新增 `ADJUST_VIOLATION_RATING` 操作指引（6 個步驟）
   - 檢視當前違規評分設定
   - 調整全域違規評分閾值
   - 調整特定違規項目的評分權重
   - 設定基於評分的阻擋規則
   - 套用並監控效果
   - 包含 3 個疑難排解案例

2. ✅ 新增 `MONITOR_ATTACK_SOURCES` 操作指引（7 個步驟）
   - 存取 F5 Event Logs
   - 設定日誌篩選條件
   - 分析攻擊來源 IP
   - 分析被攻擊的目標 URL
   - 使用 Reporting 功能生成報表
   - 設定告警通知
   - 根據分析結果採取行動
   - 包含 3 個疑難排解案例

3. ✅ 更新映射函數 `mapRecommendationToGuideId`
   - 新增 `violation_rating`, `violation rating`, `調整閾值`, `閾值`, `評分`, `threshold` 等關鍵字
   - 新增 `監控`, `攻擊來源`, `目標 URL`, `來源和目標`, `監控攻擊`, `monitor` 等關鍵字

**測試驗證**：
現在 F5 頁面的所有常見建議類型都有對應的操作指引，包括：
- ✅ SQL 注入防護簽章配置
- ✅ XSS 跨站腳本防護
- ✅ 速率限制規則設定
- ✅ **調整 violation_rating 閾值** (新增)
- ✅ **監控攻擊來源和目標 URL** (新增)
- ✅ 命令注入防護

---

### v1.0 (2025-11-19)
**初始實作**

完成 AI 建議操作指引功能的基礎架構：
- ✅ F5 和 Cloudflare 操作指引資料結構
- ✅ 後端 API endpoints
- ✅ 前端 UI 互動介面
- ✅ 可展開/收起的操作面板
- ✅ 詳細的 step-by-step 操作步驟

---

**最後更新日期**: 2025-11-19  
**實作者**: AI Assistant  
**當前版本**: v1.2

