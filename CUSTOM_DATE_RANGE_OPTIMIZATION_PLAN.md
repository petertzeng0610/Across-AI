# 自定義日期範圍選擇器優化計畫

## 📋 問題分析

### **現況問題**
1. 自定義日期範圍區塊一直展開，佔用過多版面空間
2. 即使不使用自定義日期，也會顯示完整的選擇器
3. 使用說明區塊始終顯示，增加視覺負擔

### **目標**
- 需要時展開，顯示完整的日期選擇器
- 不需要時收起，節省版面空間
- 保持使用體驗流暢
- F5 和 Cloudflare 兩個頁面統一優化

---

## 🎯 優化方案對比

### **方案 A：可折疊面板（推薦）✅**

#### **特點**
- 預設收起，只顯示一行標題 + 圖標
- 點擊標題展開/收起
- 展開後顯示完整的日期選擇器
- 已選擇日期時自動展開並顯示提示

#### **優勢**
- ✅ 符合用戶使用習慣
- ✅ 不需要額外彈出層
- ✅ 可以清楚看到已選擇的狀態
- ✅ 易於實現和維護
- ✅ 平滑的動畫過渡

#### **缺點**
- 需要點擊一次才能展開

---

### **方案 B：彈出式對話框（Popover）**

#### **特點**
- 點擊按鈕彈出浮動面板
- 選擇完成後自動收起
- 只在需要時顯示

#### **優勢**
- ✅ 完全不佔用版面空間
- ✅ 可以放置在任何位置

#### **缺點**
- ❌ 需要額外的彈出層管理
- ❌ 移動端體驗較差
- ❌ 難以查看已選擇的日期

---

### **方案 C：Tab 切換**

#### **特點**
- 快速選項和自定義日期用 Tab 切換
- 只顯示當前選擇的模式

#### **優勢**
- ✅ 清晰分離兩種模式
- ✅ 減少視覺複雜度

#### **缺點**
- ❌ 需要切換才能看到另一種選項
- ❌ 不符合「快速選項 OR 自定義日期」的邏輯

---

## 🏆 推薦方案：方案 A（可折疊面板）

---

## 📐 優化設計

### **收起狀態（預設）**

```
┌────────────────────────────────────────────┐
│ ⏰ 快速時間選擇                            │
│ [✓ 24h] [1h] [6h] [12h] [7d] [30d]         │
│                                            │
│ ──────────────────────────────────────────│
│                                            │
│ 📅 或選擇自定義日期範圍  [▼]               │  ← 點擊展開
└────────────────────────────────────────────┘
```

### **展開狀態（點擊後）**

```
┌────────────────────────────────────────────┐
│ ⏰ 快速時間選擇                            │
│ [1h] [6h] [12h] [✓ 24h] [7d] [30d]         │
│                                            │
│ ──────────────────────────────────────────│
│                                            │
│ 📅 或選擇自定義日期範圍  [▲]               │  ← 點擊收起
│                                            │
│ [開始日期 ▼]  至  [結束日期 ▼]             │
│                                            │
│ ✅ 已選擇：2025-11-18 至 2025-11-19        │
│ [清除自定義日期]                           │
│                                            │
│ ⚠️ 使用說明                                │
│ • 自定義日期範圍最長 30 天                  │
│ • 結束日期必須大於開始日期                  │
└────────────────────────────────────────────┘
```

### **已選擇狀態（自動展開 + 高亮）**

```
┌────────────────────────────────────────────┐
│ ⏰ 快速時間選擇                            │
│ [1h] [6h] [12h] [24h] [7d] [30d]           │
│                                            │
│ ──────────────────────────────────────────│
│                                            │
│ 📅 或選擇自定義日期範圍  [▲]               │
│ ┌──────────────────────────────────────┐  │
│ │                                      │  │  ← 高亮邊框
│ │ [2025-11-18 ▼] 至 [2025-11-19 ▼]   │  │
│ │                                      │  │
│ │ ✅ 已選擇：2025-11-18 至 2025-11-19  │  │
│ │ [清除自定義日期]                     │  │
│ └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

---

## 🔧 實施細節

### **1. 新增狀態變數**

```typescript
// 控制自定義日期區塊的展開/收起
const [customDateExpanded, setCustomDateExpanded] = useState(false)
```

### **2. 自動展開邏輯**

```typescript
// 當用戶選擇自定義日期時，自動展開
const handleCustomDateSelect = (date: Date | undefined, type: 'start' | 'end') => {
  if (type === 'start') {
    setCustomDateRange(prev => ({ ...prev, start: date }))
  } else {
    setCustomDateRange(prev => ({ ...prev, end: date }))
  }
  setUseCustomDate(true)
  setCustomDateExpanded(true)  // 自動展開
}

// 當用戶清除自定義日期時，收起
const handleClearCustomDate = () => {
  setUseCustomDate(false)
  setCustomDateRange({ start: undefined, end: undefined })
  setCustomDateExpanded(false)  // 自動收起
}
```

### **3. 折疊標題**

```typescript
{/* 自定義日期範圍折疊標題 */}
<div 
  onClick={() => setCustomDateExpanded(!customDateExpanded)}
  className="flex items-center justify-between cursor-pointer hover:bg-slate-800/30 p-2 rounded transition-colors"
>
  <div className="flex items-center gap-2">
    <CalendarIcon className="w-4 h-4 text-cyan-400" />
    <span className="text-sm font-semibold text-slate-300">或選擇自定義日期範圍</span>
    {useCustomDate && customDateRange.start && customDateRange.end && (
      <Badge variant="outline" className="ml-2 bg-cyan-900/20 text-cyan-400 border-cyan-500/30 text-xs">
        已選擇
      </Badge>
    )}
  </div>
  {customDateExpanded ? (
    <ChevronUp className="w-4 h-4 text-slate-400" />
  ) : (
    <ChevronDown className="w-4 h-4 text-slate-400" />
  )}
</div>
```

### **4. 可折疊內容（使用動畫）**

```typescript
{/* 可折疊內容 */}
<AnimatePresence>
  {customDateExpanded && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="pt-3 space-y-3">
        {/* 日期選擇器 */}
        <div className="flex gap-2 items-center flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <CustomDatePicker
              selected={customDateRange.start}
              onSelect={(date) => handleCustomDateSelect(date, 'start')}
              placeholder="選擇開始日期"
              disabled={isLoading}
            />
          </div>
          <span className="text-slate-400 text-sm">至</span>
          <div className="flex-1 min-w-[200px]">
            <CustomDatePicker
              selected={customDateRange.end}
              onSelect={(date) => handleCustomDateSelect(date, 'end')}
              placeholder="選擇結束日期"
              disabled={isLoading}
            />
          </div>
        </div>
        
        {/* 已選擇提示 */}
        {useCustomDate && customDateRange.start && customDateRange.end && (
          <div className="p-2 bg-cyan-900/20 border border-cyan-500/30 rounded text-xs text-cyan-400 flex items-center gap-2">
            <CheckCircle className="w-3 h-3 flex-shrink-0" />
            <span>
              已選擇：{format(customDateRange.start, 'yyyy-MM-dd HH:mm')} 至 {format(customDateRange.end, 'yyyy-MM-dd HH:mm')}
            </span>
          </div>
        )}
        
        {/* 清除按鈕 */}
        {useCustomDate && (
          <Button
            onClick={handleClearCustomDate}
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white text-xs"
          >
            清除自定義日期
          </Button>
        )}
        
        {/* 使用說明（只在展開時顯示）*/}
        <div className="p-3 bg-slate-800/50 border border-slate-600/50 rounded text-xs text-slate-400">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-300 mb-1">使用說明</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>自定義日期範圍最長 30 天</li>
                <li>結束日期必須大於開始日期</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

---

## 📊 優化前後對比

### **版面空間節省**

| 狀態 | 優化前高度 | 優化後高度 | 節省空間 |
|------|-----------|-----------|---------|
| 未使用自定義日期 | ~280px | ~40px | **85% ↓** |
| 使用自定義日期 | ~280px | ~280px | 0% |
| 展開但未選擇 | ~280px | ~220px | 21% ↓ |

### **用戶體驗改善**

| 指標 | 優化前 | 優化後 | 改善 |
|------|--------|--------|------|
| 初始視覺負擔 | 高 | 低 | ✅ 85% ↓ |
| 快速選項可見度 | 被擠壓 | 清晰 | ✅ 更好 |
| 自定義日期發現性 | 明顯 | 需點擊 | ⚠️ 稍弱 |
| 已選擇狀態可見度 | 清晰 | 清晰 | ✅ 相同 |
| 切換流暢度 | N/A | 平滑動畫 | ✅ 新增 |

---

## 🎨 視覺設計細節

### **折疊標題狀態**

| 狀態 | 背景色 | 圖標 | 徽章 |
|------|--------|------|------|
| 收起 + 未選擇 | 透明 | ▼ | - |
| 收起 + 已選擇 | 透明 | ▼ | 「已選擇」徽章 |
| 展開 | 透明 | ▲ | 「已選擇」徽章（如適用） |
| Hover | `bg-slate-800/30` | 同上 | 同上 |

### **動畫效果**

```typescript
// 展開/收起動畫
transition: {
  duration: 0.3,
  ease: 'easeInOut'
}

// Hover 過渡
transition-colors: 200ms
```

### **高亮效果（已選擇時）**

```typescript
className={`
  ${useCustomDate && customDateRange.start && customDateRange.end
    ? 'border-cyan-500/50 bg-cyan-900/10'  // 高亮邊框和背景
    : 'border-slate-700'
  }
  border rounded-lg p-3
`}
```

---

## 🔄 狀態流程圖

```
[初始狀態]
   ↓
[收起 + 未選擇]
   ↓
   ├─→ 點擊標題 → [展開 + 未選擇]
   │                    ↓
   │              選擇日期
   │                    ↓
   │              [展開 + 已選擇] ← 高亮顯示
   │                    ↓
   │              點擊標題
   │                    ↓
   ├─→ [收起 + 已選擇] ← 顯示「已選擇」徽章
   │                    ↓
   │              點擊清除
   │                    ↓
   └─────────── [收起 + 未選擇]
```

---

## 📝 需要修改的代碼位置

### **F5 頁面**
- **文件**: `/Users/peter/Across-AI/frontend/app/ai-analysis/f5/page.tsx`
- **行數**: ~1040-1115 行（時間範圍選擇器區塊）

### **Cloudflare 頁面**
- **文件**: `/Users/peter/Across-AI/frontend/app/ai-analysis/cloudflare/page.tsx`
- **行數**: ~540-615 行（時間範圍選擇器區塊）

---

## 📋 實施步驟

### **Step 1: 添加狀態變數** ⏱️ 5 分鐘
```typescript
const [customDateExpanded, setCustomDateExpanded] = useState(false)
```

### **Step 2: 修改折疊標題** ⏱️ 15 分鐘
- 添加點擊事件
- 添加 Hover 效果
- 添加「已選擇」徽章
- 添加展開/收起圖標

### **Step 3: 包裹可折疊內容** ⏱️ 20 分鐘
- 使用 `AnimatePresence` + `motion.div`
- 設置動畫參數
- 調整內容間距

### **Step 4: 更新處理函數** ⏱️ 10 分鐘
- `handleCustomDateSelect`: 自動展開
- `handleClearCustomDate`: 自動收起

### **Step 5: 優化使用說明** ⏱️ 5 分鐘
- 移除頂層的使用說明區塊
- 只在展開時顯示簡化版說明

### **Step 6: Cloudflare 頁面同步** ⏱️ 30 分鐘
- 複製所有修改
- 測試一致性

### **Step 7: 測試與調整** ⏱️ 15 分鐘
- 功能測試
- 動畫流暢度
- 響應式布局

**總計**: ~1.5 小時

---

## ✅ 測試檢查清單

### **功能測試**
- [ ] 預設狀態為收起
- [ ] 點擊標題可以展開/收起
- [ ] 展開後可以選擇日期
- [ ] 選擇日期後保持展開
- [ ] 清除日期後自動收起
- [ ] 已選擇時顯示「已選擇」徽章
- [ ] 收起狀態下，快速選項清晰可見

### **動畫測試**
- [ ] 展開動畫流暢
- [ ] 收起動畫流暢
- [ ] Hover 效果正常
- [ ] 高亮效果正確

### **響應式測試**
- [ ] 桌面端正常
- [ ] 平板端正常
- [ ] 手機端正常

### **一致性測試**
- [ ] F5 和 Cloudflare 行為一致
- [ ] 樣式一致

---

## 🎯 預期成果

### **優化後的優勢**
1. ✅ **節省 85% 版面空間**（未使用時）
2. ✅ **快速選項更清晰**（不被擠壓）
3. ✅ **按需展開**（需要時才顯示）
4. ✅ **自動展開/收起**（智能化）
5. ✅ **平滑動畫**（提升體驗）
6. ✅ **狀態清晰**（徽章提示）

### **保持的功能**
1. ✅ 所有原有功能完整保留
2. ✅ 日期驗證邏輯不變
3. ✅ Toast 通知不變
4. ✅ 已選擇日期提示不變

---

## 📊 總結

### **推薦方案**: 方案 A - 可折疊面板

### **核心改進**
- 預設收起，節省 85% 空間
- 點擊展開/收起，流暢動畫
- 自動展開（選擇日期時）
- 自動收起（清除日期時）
- 「已選擇」徽章提示

### **實施時間**: 1.5 小時
### **修改文件**: 2 個
### **代碼複雜度**: 低
### **向後兼容**: 100%

---

請確認此優化方案是否符合您的需求？如果確認，我可以立即開始實施！


