                    // 攻擊趨勢對比分析服務
// 處理時間區間計算和流量統計

class TrendAnalysisService {
  constructor() {
    this.TIME_RANGES = {
      '1h': { ms: 60 * 60 * 1000, label: '1小時' },
      '6h': { ms: 6 * 60 * 60 * 1000, label: '6小時' },
      '1d': { ms: 24 * 60 * 60 * 1000, label: '1天' },
      '3d': { ms: 3 * 24 * 60 * 60 * 1000, label: '3天' },
      '7d': { ms: 7 * 24 * 60 * 60 * 1000, label: '7天' },
      '30d': { ms: 30 * 24 * 60 * 60 * 1000, label: '30天' }
    };
  }

  // 計算兩個對比時間區間
  calculateComparisonPeriods(timeRange) {
    const now = new Date();
    const config = this.TIME_RANGES[timeRange];
    
    if (!config) {
      throw new Error(`不支援的時間範圍: ${timeRange}`);
    }

    const duration = config.ms;
    
    return {
      current: {
        start: new Date(now.getTime() - duration),
        end: now,
        label: `當前${config.label} (${this.formatDateRange(new Date(now.getTime() - duration), now)})`
      },
      previous: {
        start: new Date(now.getTime() - duration * 2),
        end: new Date(now.getTime() - duration),
        label: `上一${config.label} (${this.formatDateRange(new Date(now.getTime() - duration * 2), new Date(now.getTime() - duration))})`
      }
    };
  }

  // 格式化日期範圍顯示
  formatDateRange(start, end) {
    const formatDate = (date) => {
      return date.toLocaleDateString('zh-TW', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    return `${formatDate(start)} - ${formatDate(end)}`;
  }

  // 判定是否為攻擊IP的標準
  isAttackIP(logEntry) {
    const { SecurityAction, WAFAttackScore, WAFSQLiAttackScore, WAFXSSAttackScore, SecurityRuleDescription } = logEntry;
    
    // 條件1: 被Cloudflare明確阻擋的請求
    if (SecurityAction === 'block') return true;
    
    // 條件2: WAF攻擊分數高於70分（高風險）
    if (WAFAttackScore && WAFAttackScore >= 70) return true;
    if (WAFSQLiAttackScore && WAFSQLiAttackScore >= 70) return true;
    if (WAFXSSAttackScore && WAFXSSAttackScore >= 70) return true;
    
    // 條件3: 觸發了特定的安全規則
    if (SecurityRuleDescription && (
      SecurityRuleDescription.includes('attack') ||
      SecurityRuleDescription.includes('malicious') ||
      SecurityRuleDescription.includes('suspicious') ||
      SecurityRuleDescription.includes('exploit')
    )) return true;
    
    return false;
  }

  // 分析時期流量
  analyzePeriodTraffic(logEntries, period) {
    const trafficByTime = new Map();
    const ipTrafficMap = new Map();
    const attackIPSet = new Set(); // 新增：攻擊IP集合
    let totalRequestTraffic = 0;
    let totalRequests = logEntries.length;

    // 如果沒有數據，返回空結果
    if (logEntries.length === 0) {
      return {
        period: period,
        timeSeries: [],
        totalRequestTraffic: 0,
        totalRequests: 0,
        avgTrafficPerRequest: 0,
        topTrafficIPs: [],
        peakTrafficHour: 0,
        uniqueIPs: 0,
        groupInterval: 24 * 60 * 60 * 1000
      };
    }

    // 基於實際數據範圍決定分組粒度
    let groupInterval;
    let timeKeyGenerator;
    
    // 如果period有start和end時間，使用實際時間範圍
    let duration;
    if (period.start && period.end) {
      duration = period.end.getTime() - period.start.getTime();
    } else {
      // 否則根據數據本身計算時間跨度
      const timestamps = logEntries.map(entry => new Date(entry.EdgeStartTimestamp || entry.timestamp));
      const minTime = Math.min(...timestamps);
      const maxTime = Math.max(...timestamps);
      duration = maxTime - minTime;
    }

    if (duration <= 6 * 60 * 60 * 1000) { // 6小時以內，按小時分組
      groupInterval = 60 * 60 * 1000; // 1小時
      timeKeyGenerator = (timestamp) => {
        const date = new Date(timestamp);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()).getTime();
      };
    } else if (duration <= 7 * 24 * 60 * 60 * 1000) { // 7天以內，按天分組
      groupInterval = 24 * 60 * 60 * 1000; // 1天
      timeKeyGenerator = (timestamp) => {
        const date = new Date(timestamp);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      };
    } else { // 更長時間，按週分組
      groupInterval = 7 * 24 * 60 * 60 * 1000; // 1週
      timeKeyGenerator = (timestamp) => {
        const date = new Date(timestamp);
        const dayOfWeek = date.getDay();
        const startOfWeek = new Date(date.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
        return new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate()).getTime();
      };
    }

    // 按時間分組統計流量
    console.log(`📊 開始分析 ${logEntries.length} 筆記錄的流量分組...`);
    console.log(`時間分組間隔: ${groupInterval}ms (${groupInterval / (60*60*1000)}小時)`);
    
    // 先統計幾個樣本數據
    if (logEntries.length > 0) {
      console.log(`數據樣本:`);
      logEntries.slice(0, 3).forEach((entry, i) => {
        const timestamp = new Date(entry.EdgeStartTimestamp || entry.timestamp);
        const timeKey = timeKeyGenerator(timestamp.getTime());
        const requestBytes = parseInt(entry.ClientRequestBytes) || 0;
        console.log(`  記錄${i}: ${entry.EdgeStartTimestamp} -> timeKey: ${new Date(timeKey).toISOString()}, bytes: ${requestBytes}`);
      });
    }
    
    logEntries.forEach((entry, index) => {
      const timestamp = new Date(entry.EdgeStartTimestamp || entry.timestamp);
      const timeKey = timeKeyGenerator(timestamp.getTime());
      
      const requestBytes = parseInt(entry.ClientRequestBytes) || 0;
      totalRequestTraffic += requestBytes;

      // 判定是否為攻擊IP
      const clientIP = entry.ClientIP;
      const isAttack = this.isAttackIP(entry);
      if (isAttack && clientIP) {
        attackIPSet.add(clientIP);
      }

      // 時間序列統計
      if (!trafficByTime.has(timeKey)) {
        trafficByTime.set(timeKey, { 
          timestamp: timeKey, 
          traffic: 0, 
          requests: 0,
          uniqueIPs: new Set(),
          attackIPs: new Set() // 新增：時間桶內的攻擊IP
        });
      }
      const timeData = trafficByTime.get(timeKey);
      timeData.traffic += requestBytes;
      timeData.requests += 1;
      timeData.uniqueIPs.add(clientIP);
      if (isAttack && clientIP) {
        timeData.attackIPs.add(clientIP);
      }
      
      // 調試前幾筆數據
      if (index < 3) {
        console.log(`  處理記錄${index}: IP=${clientIP}, isAttack=${isAttack}, traffic累計=${timeData.traffic}`);
      }
      
      // IP流量統計
      if (!ipTrafficMap.has(clientIP)) {
        ipTrafficMap.set(clientIP, { 
          ip: clientIP, 
          traffic: 0, 
          requests: 0,
          country: entry.ClientCountry || 'N/A',
          asn: entry.ClientASN || 'N/A',
          isAttackIP: false // 新增：是否為攻擊IP標記
        });
      }
      const ipData = ipTrafficMap.get(clientIP);
      ipData.traffic += requestBytes;
      ipData.requests += 1;
      if (isAttack) {
        ipData.isAttackIP = true;
      }
    });
    
    console.log(`✅ 流量分組完成: 總流量=${totalRequestTraffic}, 時間桶數=${trafficByTime.size}`);
    console.log(`🎯 攻擊IP統計: 總IP=${ipTrafficMap.size}, 攻擊IP=${attackIPSet.size}`);

    // 轉換時間序列資料並填補空白時間點
    const timeSeries = this.fillTimeGaps(trafficByTime, period, groupInterval);

    return {
      period: period,
      timeSeries: timeSeries,
      totalRequestTraffic: totalRequestTraffic,
      totalRequests: totalRequests,
      avgTrafficPerRequest: totalRequests > 0 ? totalRequestTraffic / totalRequests : 0,
      topTrafficIPs: Array.from(ipTrafficMap.values())
        .sort((a, b) => b.traffic - a.traffic)
        .slice(0, 10),
      peakTrafficHour: Math.max(...timeSeries.map(t => t.traffic), 0),
      uniqueIPs: ipTrafficMap.size, // 總訪問IP數
      attackIPs: attackIPSet.size,  // 新增：真正的攻擊IP數
      groupInterval: groupInterval
    };
  }

  // 填補時間序列中的空白時間點
  fillTimeGaps(trafficByTime, period, interval) {
    if (trafficByTime.size === 0) {
      return [];
    }

    console.log(`📋 填補時間序列：期間有${trafficByTime.size}個時間桶`);
    
    // 直接使用實際的時間桶keys，而不是計算理論範圍
    const actualTimeKeys = Array.from(trafficByTime.keys()).sort((a, b) => a - b);
    
    console.log(`  實際時間桶keys:`, actualTimeKeys.map(k => new Date(k).toISOString()));
    
    const result = [];
    
    // 方式1：直接使用實際存在的時間桶
    actualTimeKeys.forEach(timeKey => {
      const existingData = trafficByTime.get(timeKey);
      result.push({
        timestamp: timeKey,
        traffic: existingData ? existingData.traffic : 0,
        requests: existingData ? existingData.requests : 0,
        uniqueIPs: existingData ? existingData.uniqueIPs.size : 0,
        attackIPs: existingData ? existingData.attackIPs.size : 0 // 新增：攻擊IP統計
      });
      console.log(`    時間桶 ${new Date(timeKey).toISOString()}: ${this.formatBytes(existingData?.traffic || 0)}, ${existingData?.requests || 0}次請求, ${existingData?.attackIPs?.size || 0}個攻擊IP`);
    });

    // 如果沒有實際時間桶但期間有明確範圍，創建理論範圍
    if (result.length === 0 && period.start && period.end) {
      console.log(`  沒有實際時間桶，使用期間範圍生成`);
      let currentTime = Math.floor(period.start.getTime() / interval) * interval;
      const endTime = Math.ceil(period.end.getTime() / interval) * interval;

      while (currentTime <= endTime) {
        const existingData = trafficByTime.get(currentTime);
        result.push({
          timestamp: currentTime,
          traffic: existingData ? existingData.traffic : 0,
          requests: existingData ? existingData.requests : 0,
          uniqueIPs: existingData ? existingData.uniqueIPs.size : 0,
          attackIPs: existingData ? existingData.attackIPs.size : 0 // 新增：攻擊IP統計
        });
        currentTime += interval;
      }
    }

    console.log(`✅ 時間序列生成完成：${result.length}個數據點`);
    return result.sort((a, b) => a.timestamp - b.timestamp);
  }

  // 生成單一對比圖表資料
  generateTrafficComparisonChart(currentAnalysis, previousAnalysis, periods) {
    console.log(`🔧 生成對比圖表：當前時期${currentAnalysis.timeSeries.length}個點，上一時期${previousAnalysis.timeSeries.length}個點`);
    
    // 如果任一時期沒有數據，創建基本的單點圖表
    if (currentAnalysis.timeSeries.length === 0 && previousAnalysis.timeSeries.length === 0) {
      return {
        data: [{
          timeLabel: '第1天',
          currentPeriod: 0,
          previousPeriod: 0,
          currentTimestamp: null,
          previousTimestamp: null,
          currentRequests: 0,
          previousRequests: 0
        }],
        currentLabel: periods.current.label,
        previousLabel: periods.previous.label
      };
    }
    
    // 使用總流量作為單點顯示（因為數據可能都在同一個時間桶中）
    const chartData = [];
    
    // 計算實際的時間點數量
    const maxDataPoints = Math.max(
      currentAnalysis.timeSeries.length, 
      previousAnalysis.timeSeries.length,
      1 // 至少1個點
    );
    
    for (let i = 0; i < maxDataPoints; i++) {
      const currentPoint = currentAnalysis.timeSeries[i];
      const previousPoint = previousAnalysis.timeSeries[i];
      
      // 如果某個時期沒有對應的時間點，但有總流量，使用總流量
      let currentTraffic = currentPoint ? currentPoint.traffic : 0;
      let previousTraffic = previousPoint ? previousPoint.traffic : 0;
      
      // 特殊處理：如果時間序列很少但有總流量，可能所有流量都在一個桶中
      if (i === 0) {
        if (currentAnalysis.timeSeries.length === 1 && currentPoint) {
          currentTraffic = currentPoint.traffic;
        } else if (currentAnalysis.timeSeries.length === 0 && currentAnalysis.totalRequestTraffic > 0) {
          // 如果沒有時間序列但有總流量，顯示總流量
          currentTraffic = currentAnalysis.totalRequestTraffic;
        }
        
        if (previousAnalysis.timeSeries.length === 1 && previousPoint) {
          previousTraffic = previousPoint.traffic;
        } else if (previousAnalysis.timeSeries.length === 0 && previousAnalysis.totalRequestTraffic > 0) {
          previousTraffic = previousAnalysis.totalRequestTraffic;
        }
      }
      
      const timeLabel = this.generateTimeLabel(i, currentAnalysis.groupInterval || 24 * 60 * 60 * 1000);
      
      chartData.push({
        timeLabel: timeLabel,
        currentPeriod: currentTraffic,
        previousPeriod: previousTraffic,
        currentTimestamp: currentPoint ? currentPoint.timestamp : null,
        previousTimestamp: previousPoint ? previousPoint.timestamp : null,
        currentRequests: currentPoint ? currentPoint.requests : 0,
        previousRequests: previousPoint ? previousPoint.requests : 0
      });
      
      console.log(`  圖表點${i}: 當前=${this.formatBytes(currentTraffic)}, 上一=${this.formatBytes(previousTraffic)}`);
    }

    console.log(`✅ 圖表生成完成，共${chartData.length}個數據點`);
    
    return {
      data: chartData,
      currentLabel: periods.current.label,
      previousLabel: periods.previous.label
    };
  }

  // 生成時間標籤
  generateTimeLabel(index, interval) {
    if (interval === 60 * 60 * 1000) { // 小時
      return `${index + 1}小時`;
    } else if (interval === 24 * 60 * 60 * 1000) { // 天
      return `第${index + 1}天`;
    } else { // 週
      return `第${index + 1}週`;
    }
  }

  // 計算對比統計
  calculateComparisonStats(currentAnalysis, previousAnalysis) {
    const calculateChangeRate = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous * 100).toFixed(2);
    };

    return {
      trafficChange: {
        current: currentAnalysis.totalRequestTraffic,
        previous: previousAnalysis.totalRequestTraffic,
        changeRate: calculateChangeRate(currentAnalysis.totalRequestTraffic, previousAnalysis.totalRequestTraffic)
      },
      requestsChange: {
        current: currentAnalysis.totalRequests,
        previous: previousAnalysis.totalRequests,
        changeRate: calculateChangeRate(currentAnalysis.totalRequests, previousAnalysis.totalRequests)
      },
      ipsChange: {
        current: currentAnalysis.uniqueIPs,
        previous: previousAnalysis.uniqueIPs,
        changeRate: calculateChangeRate(currentAnalysis.uniqueIPs, previousAnalysis.uniqueIPs)
      },
      attackIPsChange: {
        current: currentAnalysis.attackIPs,
        previous: previousAnalysis.attackIPs,
        changeRate: calculateChangeRate(currentAnalysis.attackIPs, previousAnalysis.attackIPs)
      },
      avgTrafficChange: {
        current: currentAnalysis.avgTrafficPerRequest,
        previous: previousAnalysis.avgTrafficPerRequest,
        changeRate: calculateChangeRate(currentAnalysis.avgTrafficPerRequest, previousAnalysis.avgTrafficPerRequest)
      }
    };
  }

  // 格式化位元組顯示
  formatBytes(bytes) {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    } else if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
    return `${bytes} B`;
  }

  // 建構趨勢分析提示詞
  buildTrendAnalysisPrompt(currentData, previousData, periods) {
    const stats = this.calculateComparisonStats(currentData, previousData);
    
    return `
請基於以下兩個時期的網路請求流量資料進行趨勢對比分析：

**分析時期:**
- 當前時期: ${periods.current.label}
- 上一時期: ${periods.previous.label}

**請求流量統計對比 (基於 ClientRequestBytes):**
- 當前時期總請求流量: ${this.formatBytes(currentData.totalRequestTraffic)} (${currentData.totalRequests} 次請求)
- 上一時期總請求流量: ${this.formatBytes(previousData.totalRequestTraffic)} (${previousData.totalRequests} 次請求)
- 流量變化率: ${stats.trafficChange.changeRate}%
- 請求數變化率: ${stats.requestsChange.changeRate}%
- 平均請求大小變化率: ${stats.avgTrafficChange.changeRate}%

**IP 來源統計對比:**
- 當前時期總訪問IP: ${currentData.uniqueIPs}
- 上一時期總訪問IP: ${previousData.uniqueIPs}
- 當前時期攻擊IP: ${currentData.attackIPs}
- 上一時期攻擊IP: ${previousData.attackIPs}
- 攻擊IP變化率: ${stats.attackIPsChange.changeRate}%

**Top 5 請求流量來源IP對比:**
當前時期: ${currentData.topTrafficIPs.slice(0, 5).map(ip => `${ip.ip} (${this.formatBytes(ip.traffic)}, ${ip.requests}次)`).join(', ')}
上一時期: ${previousData.topTrafficIPs.slice(0, 5).map(ip => `${ip.ip} (${this.formatBytes(ip.traffic)}, ${ip.requests}次)`).join(', ')}

**流量峰值對比:**
- 當前時期峰值: ${this.formatBytes(currentData.peakTrafficHour)}
- 上一時期峰值: ${this.formatBytes(previousData.peakTrafficHour)}

**請分析以下面向：**
1. **整體請求流量趨勢變化**及其可能原因（增加/減少/穩定）
2. **攻擊模式變化**：請求大小分佈、頻率變化等
3. **異常流量來源IP**的出現、消失或變化情況
4. **流量峰值時段**的變化模式和攻擊集中度
5. **潛在的安全威脅趨勢**：新興攻擊模式、攻擊強度等級
6. **建議的監控和防護措施**：基於趨勢變化的具體建議

請以繁體中文回答，並提供具體的數據支撐和可執行的建議。重點關注請求流量的變化模式，這有助於識別攻擊者的行為變化和威脅升級。
`;
  }
}

module.exports = TrendAnalysisService; 