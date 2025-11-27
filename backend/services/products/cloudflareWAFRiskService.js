// backend/services/products/cloudflareWAFRiskService.js
// Cloudflare WAF 風險分析服務
// 專門分析 Cloudflare WAF 日誌並生成風險評估報告

const { elkMCPClient } = require('../elkMCPClient');
const { CLOUDFLARE_FIELD_MAPPING } = require('../../config/products/cloudflare/cloudflareFieldMapping');
const cloudflareELKConfig = require('../../config/products/cloudflare/cloudflareELKConfig');
const {
  classifyWAFScore,
  isCloudflareInternalEndpoint,
  isValidWAFScore,
  isRealSecurityThreat,
  calculateValidAvgScore,
  RECOMMENDED_THRESHOLDS,
  WAF_SCORE_CLASSIFICATION,
  analyzeThreatLevel,
  classifySecurityAction,
  analyzeURIPattern,
  analyzeUserAgent,
  hasLowWAFScore,
  identifyAttackType
} = require('../../config/products/cloudflare/cloudflareStandards');

class CloudflareWAFRiskService {
  constructor() {
    console.log('🔧 初始化 Cloudflare WAF 風險分析服務...');
    this.elkClient = elkMCPClient;
    this.elkConfig = cloudflareELKConfig;
    this.fieldMapping = CLOUDFLARE_FIELD_MAPPING;
  }
  
  // ⭐ 主要方法：分析 Cloudflare WAF 風險
  async analyzeCloudflareWAF(timeRange = '24h') {
    console.log(`\n🔍 ===== 開始 Cloudflare WAF 風險分析 =====`);
    console.log(`📅 時間範圍: ${timeRange}`);
    console.log(`📊 索引: ${this.elkConfig.index}`);
    
    try {
      // ⭐ Step 1: 透過 ELK MCP 查詢 Cloudflare 日誌
      console.log('\n⭐ Step 1: 透過 MCP 查詢 Cloudflare 日誌...');
      const elkData = await this.elkClient.queryElasticsearch(timeRange, {
        indexPattern: this.elkConfig.index,
        fieldMapping: this.fieldMapping
      });
      
      if (!elkData.hits || elkData.hits.length === 0) {
        console.log('⚠️ 未找到日誌資料');
        return this.getEmptyAnalysisResult();
      }
      
      // Step 2: 使用 cloudflare-field-mapping 解析資料
      console.log(`\n⭐ Step 2: 解析 ${elkData.hits.length} 筆日誌...`);
      const logEntries = elkData.hits.map(hit => this.parseCloudflareLog(hit.source));
      console.log(`✅ 成功解析 ${logEntries.length} 筆日誌`);
      
      // Step 3: 分析各種攻擊類型
      console.log('\n⭐ Step 3: 分析攻擊模式...');
      const sqlInjection = this.analyzeSQLInjection(logEntries);
      console.log(`   SQL 注入: ${sqlInjection.count} 次 (高風險: ${sqlInjection.highRisk})`);
      
      const xssAttacks = this.analyzeXSSAttacks(logEntries);
      console.log(`   XSS 攻擊: ${xssAttacks.count} 次 (高風險: ${xssAttacks.highRisk})`);
      
      const rceAttacks = this.analyzeRCEAttacks(logEntries);
      console.log(`   RCE 攻擊: ${rceAttacks.count} 次 (高風險: ${rceAttacks.highRisk})`);
      
      const botTraffic = this.analyzeBotTraffic(logEntries);
      console.log(`   惡意機器人: ${botTraffic.count} 次`);
      
      const pathTraversal = this.analyzePathTraversal(logEntries);
      console.log(`   路徑遍歷: ${pathTraversal.count} 次`);
      
      const abnormalUA = this.analyzeAbnormalUA(logEntries);
      console.log(`   異常 UA: ${abnormalUA.count} 次`);
      
      // Step 4: 生成地理和時間分析
      console.log('\n⭐ Step 4: 生成統計資料...');
      const geoAnalysis = this.analyzeGeoDistribution(logEntries);
      const assetAnalysis = this.analyzeAffectedAssets(logEntries);
      
      // 計算時間範圍（使用混合方案）
      const timeRange_result = this.calculateTimeRangeWithFallback(timeRange, logEntries);
      
      console.log(`📅 時間範圍資訊:`);
      console.log(`   預期範圍: ${this.formatTimeTaipei(timeRange_result.display.start)} ~ ${this.formatTimeTaipei(timeRange_result.display.end)}`);
      if (timeRange_result.actual) {
        console.log(`   實際日誌: ${this.formatTimeTaipei(timeRange_result.actual.start)} ~ ${this.formatTimeTaipei(timeRange_result.actual.end)}`);
      }
      console.log(`   日誌數量: ${timeRange_result.logCount} 筆`);
      
      console.log('\n✅ ===== Cloudflare WAF 風險分析完成 =====\n');
      
      return {
        sqlInjection,
        xssAttacks,
        rceAttacks,
        botTraffic,
        pathTraversal,
        abnormalUA,
        geoAnalysis,
        assetAnalysis,
        totalEvents: logEntries.length,
        timeRange: timeRange_result
      };
      
    } catch (error) {
      console.error('❌ Cloudflare WAF 風險分析失敗:', error);
      throw error;
    }
  }
  
  // 解析 Cloudflare 日誌（使用 cloudflare-field-mapping）
  parseCloudflareLog(rawLog) {
    // 處理時間戳記（支援多種格式）
    const rawTimestamp = rawLog[this.fieldMapping.edge_start_timestamp.elk_field];
    let timestamp;
    
    if (typeof rawTimestamp === 'number') {
      // Unix Timestamp（毫秒）
      timestamp = new Date(rawTimestamp).toISOString();
    } else if (typeof rawTimestamp === 'string') {
      // ISO 8601 格式
      timestamp = new Date(rawTimestamp).toISOString();
    } else {
      // 預設使用當前時間
      timestamp = new Date().toISOString();
    }
    
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
      
      // 安全相關欄位（新增）
      securityAction: rawLog[this.fieldMapping.security_action.elk_field],
      securityActions: rawLog[this.fieldMapping.security_actions.elk_field] || [],
      securityRule: rawLog[this.fieldMapping.security_rule_id.elk_field],
      securityRuleDescription: rawLog[this.fieldMapping.security_rule_description.elk_field],
      securityRuleIDs: rawLog[this.fieldMapping.security_rule_ids.elk_field] || [],
      securitySources: rawLog[this.fieldMapping.security_sources.elk_field] || [],
      
      // 資產相關
      zoneName: rawLog[this.fieldMapping.zone_name.elk_field],
      edgeHost: rawLog[this.fieldMapping.client_request_host.elk_field],
      
      // 時間戳記（已格式化為 ISO 8601）
      timestamp: timestamp
    };
  }
  
  /**
   * 計算時間範圍（混合方案：同時返回預期和實際時間範圍）
   * @param {string|object} timeRangeParam - 使用者選擇的時間範圍（如 "24h" 或 {start, end}）
   * @param {array} logEntries - 日誌條目
   * @returns {object} 完整的時間範圍資訊
   */
  calculateTimeRangeWithFallback(timeRangeParam, logEntries) {
    // 1. 計算預期的時間範圍（基於使用者選擇）
    let expectedStart, expectedEnd;
    
    if (typeof timeRangeParam === 'string') {
      // 預設時間範圍（如 "24h", "7d"）
      expectedEnd = new Date();
      
      const timeRangeMapping = {
        '1h': 1 * 60 * 60 * 1000,
        '6h': 6 * 60 * 60 * 1000,
        '12h': 12 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      };
      
      const duration = timeRangeMapping[timeRangeParam] || 24 * 60 * 60 * 1000;
      expectedStart = new Date(expectedEnd.getTime() - duration);
      
    } else if (timeRangeParam && timeRangeParam.start && timeRangeParam.end) {
      // 自定義時間範圍
      expectedStart = new Date(timeRangeParam.start);
      expectedEnd = new Date(timeRangeParam.end);
    } else {
      // Fallback：預設 24 小時
      expectedEnd = new Date();
      expectedStart = new Date(expectedEnd.getTime() - 24 * 60 * 60 * 1000);
    }
    
    // 2. 計算實際日誌時間範圍
    const timestamps = logEntries
      .map(log => log.timestamp)
      .filter(t => t)
      .map(t => new Date(t).getTime())
      .filter(t => !isNaN(t));
    
    let actualStart = null;
    let actualEnd = null;
    
    if (timestamps.length > 0) {
      actualStart = new Date(Math.min(...timestamps)).toISOString();
      actualEnd = new Date(Math.max(...timestamps)).toISOString();
    }
    
    // 3. 返回完整的時間範圍資訊
    return {
      // 用於顯示的時間範圍（優先使用預期時間）
      display: {
        start: expectedStart.toISOString(),
        end: expectedEnd.toISOString()
      },
      // 預期的時間範圍（基於使用者選擇）
      expected: {
        start: expectedStart.toISOString(),
        end: expectedEnd.toISOString()
      },
      // 實際日誌的時間範圍（如果有日誌）
      actual: actualStart && actualEnd ? {
        start: actualStart,
        end: actualEnd
      } : null,
      // 是否有日誌
      hasLogs: timestamps.length > 0,
      // 日誌數量
      logCount: logEntries.length,
      // 向後兼容：保留舊的 start/end 欄位
      start: expectedStart.toISOString(),
      end: expectedEnd.toISOString()
    };
  }
  
  /**
   * 格式化時間（台灣時區 UTC+8）
   */
  formatTimeTaipei(isoString) {
    return new Date(isoString).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Taipei',
      hour12: false
    });
  }
  
  // 分析 SQL 注入（使用新的多層判斷邏輯）
  analyzeSQLInjection(logEntries) {
    // 使用新的多層判斷邏輯
    const sqliLogs = logEntries.filter(log => {
      // 排除 Cloudflare 內部端點
      if (isCloudflareInternalEndpoint(log.requestURI)) {
        return false;
      }
      
      // 條件 1：WAF SQLi Score < 20（確定攻擊）
      if (isValidWAFScore(log.wafSQLiScore) && log.wafSQLiScore < 20) {
        return true;
      }
      
      // 條件 2：SecurityRule 觸發 SQL 相關規則
      if (log.securityRule && log.securityRule.toLowerCase().includes('sql')) {
        return true;
      }
      
      // 條件 3：使用多層判斷邏輯
      const analysis = analyzeThreatLevel(log);
      if (analysis.isThreat && analysis.attackType && analysis.attackType.includes('SQL')) {
        return true;
      }
      
      return false;
    });
    
    // 分類：已阻擋 vs 未阻擋
    const blockedLogs = sqliLogs.filter(log => {
      const analysis = analyzeThreatLevel(log);
      return analysis.isBlocked;
    });
    
    const unblockedLogs = sqliLogs.filter(log => {
      const analysis = analyzeThreatLevel(log);
      return !analysis.isBlocked;
    });
    
    return {
      count: sqliLogs.length,
      blocked: blockedLogs.length,
      unblocked: unblockedLogs.length,
      highRisk: unblockedLogs.length,  // 未阻擋 = 高風險
      topIPs: this.getTopIPsWithCountry(sqliLogs, 5),  // Top 5 IP + 國家
      topTargets: this.getTopN(sqliLogs, 'requestURI', 10),
      topCountries: this.getTopN(sqliLogs, 'clientCountry', 5),
      affectedAssets: this.groupByZoneName(sqliLogs),  // 按 ZoneName 分組
      avgScore: calculateValidAvgScore(sqliLogs, 'wafSQLiScore')
    };
  }
  
  // 分析 XSS 攻擊（使用新的多層判斷邏輯）
  analyzeXSSAttacks(logEntries) {
    const xssLogs = logEntries.filter(log => {
      if (isCloudflareInternalEndpoint(log.requestURI)) {
        return false;
      }
      
      // 條件 1：WAF XSS Score < 20
      if (isValidWAFScore(log.wafXSSScore) && log.wafXSSScore < 20) {
        return true;
      }
      
      // 條件 2：SecurityRule 觸發 XSS 規則
      if (log.securityRule && log.securityRule.toLowerCase().includes('xss')) {
        return true;
      }
      
      // 條件 3：URI 包含 XSS pattern
      if (log.requestURI && (log.requestURI.includes('<script') || log.requestURI.includes('javascript:'))) {
        return true;
      }
      
      // 條件 4：多層判斷邏輯
      const analysis = analyzeThreatLevel(log);
      if (analysis.isThreat && analysis.attackType && analysis.attackType.includes('XSS')) {
        return true;
      }
      
      return false;
    });
    
    // 分類：已阻擋 vs 未阻擋
    const blockedLogs = xssLogs.filter(log => {
      const analysis = analyzeThreatLevel(log);
      return analysis.isBlocked;
    });
    
    const unblockedLogs = xssLogs.filter(log => {
      const analysis = analyzeThreatLevel(log);
      return !analysis.isBlocked;
    });
    
    return {
      count: xssLogs.length,
      blocked: blockedLogs.length,
      unblocked: unblockedLogs.length,
      highRisk: unblockedLogs.length,
      topIPs: this.getTopIPsWithCountry(xssLogs, 5),
      topTargets: this.getTopN(xssLogs, 'requestURI', 10),
      topCountries: this.getTopN(xssLogs, 'clientCountry', 5),
      affectedAssets: this.groupByZoneName(xssLogs),
      avgScore: calculateValidAvgScore(xssLogs, 'wafXSSScore')
    };
  }
  
  // 分析 RCE 攻擊（使用新的多層判斷邏輯）
  analyzeRCEAttacks(logEntries) {
    const rceLogs = logEntries.filter(log => {
      if (isCloudflareInternalEndpoint(log.requestURI)) {
        return false;
      }
      
      // 條件 1：WAF RCE Score < 20
      if (isValidWAFScore(log.wafRCEScore) && log.wafRCEScore < 20) {
        return true;
      }
      
      // 條件 2：SecurityRule 觸發 RCE 規則
      if (log.securityRule && (log.securityRule.toLowerCase().includes('rce') || 
                               log.securityRule.toLowerCase().includes('remote code'))) {
        return true;
      }
      
      // 條件 3：多層判斷邏輯
      const analysis = analyzeThreatLevel(log);
      if (analysis.isThreat && analysis.attackType && analysis.attackType.includes('RCE')) {
        return true;
      }
      
      return false;
    });
    
    // 分類：已阻擋 vs 未阻擋
    const blockedLogs = rceLogs.filter(log => {
      const analysis = analyzeThreatLevel(log);
      return analysis.isBlocked;
    });
    
    const unblockedLogs = rceLogs.filter(log => {
      const analysis = analyzeThreatLevel(log);
      return !analysis.isBlocked;
    });
    
    return {
      count: rceLogs.length,
      blocked: blockedLogs.length,
      unblocked: unblockedLogs.length,
      highRisk: unblockedLogs.length,
      topIPs: this.getTopIPsWithCountry(rceLogs, 5),
      topTargets: this.getTopN(rceLogs, 'requestURI', 10),
      topCountries: this.getTopN(rceLogs, 'clientCountry', 5),
      affectedAssets: this.groupByZoneName(rceLogs),
      avgScore: calculateValidAvgScore(rceLogs, 'wafRCEScore')
    };
  }
  
  // 分析惡意機器人流量
  analyzeBotTraffic(logEntries) {
    // 檢測機器人特徵：User-Agent、請求模式
    const botLogs = logEntries.filter(log => {
      const ua = (log.userAgent || '').toLowerCase();
      return ua.includes('bot') || 
             ua.includes('crawler') || 
             ua.includes('spider') ||
             ua.includes('python') ||
             ua.includes('curl') ||
             ua.includes('wget');
    });
    
    return {
      count: botLogs.length,
      topIPs: this.getTopN(botLogs, 'clientIP', 10),
      topCountries: this.getTopN(botLogs, 'clientCountry', 5),
      topASNs: this.getTopN(botLogs, 'clientASN', 5),
      affectedAssets: new Set(botLogs.map(log => log.edgeHost).filter(h => h)).size
    };
  }
  
  // 分析路徑遍歷攻擊
  analyzePathTraversal(logEntries) {
    const pathTraversalLogs = logEntries.filter(log => {
      const uri = (log.requestURI || '').toLowerCase();
      return uri.includes('../') || 
             uri.includes('..\\') || 
             uri.includes('%2e%2e') ||
             uri.includes('traversal');
    });
    
    const sensitiveFiles = this.extractSensitiveFiles(pathTraversalLogs);
    
    return {
      count: pathTraversalLogs.length,
      topIPs: this.getTopN(pathTraversalLogs, 'clientIP', 10),
      sensitiveFiles: sensitiveFiles,
      affectedAssets: new Set(pathTraversalLogs.map(log => log.edgeHost).filter(h => h)).size
    };
  }
  
  // 分析異常 User-Agent
  analyzeAbnormalUA(logEntries) {
    const abnormalUALogs = logEntries.filter(log => {
      const ua = log.userAgent || '';
      
      // 空 UA
      if (ua.length === 0) return true;
      
      // 異常短
      if (ua.length < 10) return true;
      
      // 異常長
      if (ua.length > 500) return true;
      
      // 明顯的掃描工具
      const lowerUA = ua.toLowerCase();
      const scanTools = ['sqlmap', 'nmap', 'nikto', 'masscan', 'zap', 'burp', 'metasploit'];
      return scanTools.some(tool => lowerUA.includes(tool));
    });
    
    return {
      count: abnormalUALogs.length,
      topIPs: this.getTopN(abnormalUALogs, 'clientIP', 10),
      examples: [...new Set(abnormalUALogs.map(log => log.userAgent))].slice(0, 5),
      affectedAssets: new Set(abnormalUALogs.map(log => log.edgeHost).filter(h => h)).size
    };
  }
  
  // 分析地理分佈
  analyzeGeoDistribution(logEntries) {
    return {
      topCountries: this.getTopN(logEntries, 'clientCountry', 10),
      topIPs: this.getTopN(logEntries, 'clientIP', 20),
      topASNs: this.getTopN(logEntries, 'clientASN', 10)
    };
  }
  
  // 分析受影響資產
  analyzeAffectedAssets(logEntries) {
    const assetCounts = this.getTopN(logEntries, 'edgeHost', 20);
    return {
      totalAssets: new Set(logEntries.map(log => log.edgeHost).filter(h => h)).size,
      topAssets: assetCounts
    };
  }
  
  // 提取敏感檔案
  extractSensitiveFiles(logs) {
    const sensitivePatterns = [
      '.env', 'config', '.git', 'wp-config', 'web.config', 
      'admin', '.htaccess', '.htpasswd', 'id_rsa', 'authorized_keys',
      '.aws', '.ssh', 'database.yml', 'settings.py'
    ];
    const found = new Set();
    
    logs.forEach(log => {
      const uri = log.requestURI || '';
      sensitivePatterns.forEach(pattern => {
        if (uri.toLowerCase().includes(pattern)) {
          found.add(uri);
        }
      });
    });
    
    return Array.from(found).slice(0, 15);
  }
  
  // 生成 AI 分析 Prompt（基於新的判斷流程）
  generateAIPrompt(analysisData) {
    const {
      sqlInjection,
      xssAttacks,
      rceAttacks,
      botTraffic,
      pathTraversal,
      abnormalUA,
      geoAnalysis,
      assetAnalysis,
      totalEvents,
      timeRange
    } = analysisData;

    // 格式化時間（台灣時區 UTC+8）
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

    // 動態構建攻擊統計
    const attackSections = [];

    // SQL 注入
    if (sqlInjection.count > 0) {
      const blockedInfo = sqlInjection.blocked > 0 ? 
        `\n   - 已阻擋: ${sqlInjection.blocked} 次（低風險，已成功防禦）` : '';
      const unblockedInfo = sqlInjection.unblocked > 0 ?
        `\n   - 未阻擋: ${sqlInjection.unblocked} 次（⚠️ 高風險，需要立即處理）` : '';
      
      attackSections.push({
        type: 'SQL 注入攻擊',
        data: sqlInjection,
        description: `WAFSQLiAttackScore < 20 或 SecurityRule 包含 "sql"${blockedInfo}${unblockedInfo}`
      });
    }

    // XSS
    if (xssAttacks.count > 0) {
      const blockedInfo = xssAttacks.blocked > 0 ? 
        `\n   - 已阻擋: ${xssAttacks.blocked} 次（低風險）` : '';
      const unblockedInfo = xssAttacks.unblocked > 0 ?
        `\n   - 未阻擋: ${xssAttacks.unblocked} 次（⚠️ 高風險）` : '';
      
      attackSections.push({
        type: 'XSS 跨站腳本攻擊',
        data: xssAttacks,
        description: `WAFXSSAttackScore < 20 或 SecurityRule 包含 "xss"${blockedInfo}${unblockedInfo}`
      });
    }

    // RCE
    if (rceAttacks.count > 0) {
      const blockedInfo = rceAttacks.blocked > 0 ? 
        `\n   - 已阻擋: ${rceAttacks.blocked} 次（低風險）` : '';
      const unblockedInfo = rceAttacks.unblocked > 0 ?
        `\n   - 未阻擋: ${rceAttacks.unblocked} 次（⚠️ 高風險）` : '';
      
      attackSections.push({
        type: 'RCE 遠程代碼執行攻擊',
        data: rceAttacks,
        description: `WAFRCEAttackScore < 20 或 SecurityRule 包含 "rce"${blockedInfo}${unblockedInfo}`
      });
    }

    if (botTraffic.count > 0) {
      attackSections.push({
        type: '惡意機器人流量',
        data: botTraffic,
        description: 'BotScore < 30 或 BotTags 包含 "malicious"'
      });
    }

    if (pathTraversal.count > 0) {
      attackSections.push({
        type: '路徑遍歷攻擊',
        data: pathTraversal,
        description: 'URI 包含 "../", "..\\\\" 或敏感檔案路徑'
      });
    }

    if (abnormalUA.count > 0) {
      attackSections.push({
        type: '異常 User-Agent',
        data: abnormalUA,
        description: 'User-Agent 長度異常或包含掃描工具特徵'
      });
    }

    // 構建攻擊統計文字
    let attackStatisticsText = '';
    
    if (attackSections.length === 0) {
      attackStatisticsText = `
**未檢測到任何安全威脅**

在指定時間範圍內，未檢測到任何攻擊行為。

⚠️ **重要**：請輸出空的 risks 陣列：
\`\`\`json
{
  "risks": []
}
\`\`\`
`;
    } else {
      attackStatisticsText = attackSections.map((section, index) => {
        const { type, data, description } = section;
        
        // 格式化受影響資產
        let assetsInfo = '';
        if (data.affectedAssets && Array.isArray(data.affectedAssets)) {
          const top3Zones = data.affectedAssets.slice(0, 3);
          assetsInfo = top3Zones.map(zone => 
            `${zone.zoneName} (${zone.attackCount}次攻擊，${zone.blockedCount}次已阻擋，${zone.unblockedCount}次未阻擋)`
          ).join(', ');
        }
        
        return `
${index + 1}. **${type}**
   - 檢測方式: ${description}
   - 總檢測次數: ${data.count}
   ${data.blocked !== undefined ? `- 已阻擋: ${data.blocked} 次` : ''}
   ${data.unblocked !== undefined ? `- 未阻擋: ${data.unblocked} 次` : ''}
   ${data.highRisk !== undefined ? `- 高風險 (WAF分數 < 20): ${data.highRisk}` : ''}
   ${data.avgScore !== undefined && data.avgScore !== 'N/A' ? `- 平均 WAF 分數: ${data.avgScore}` : ''}
   ${assetsInfo ? `- 受影響資產 Top 3: ${assetsInfo}` : ''}
   ${data.topIPs ? `- Top 5 來源IP: ${data.topIPs.slice(0, 5).map(ip => `${ip.item} (${ip.count}次, ${ip.country || '未知'})`).join(', ')}` : ''}
   ${data.topCountries ? `- Top 5 來源國家: ${data.topCountries.map(c => `${c.item} (${c.count}次)`).join(', ')}` : ''}
   ${data.topTargets ? `- Top 5 攻擊目標: ${data.topTargets.slice(0, 5).map(t => `${t.item} (${t.count}次)`).join(', ')}` : ''}
`.trim();
      }).join('\n\n');
    }

    // 生成完整的 Prompt 模板
    const promptTemplate = `
你是一位資深的網路安全分析專家，專精於 Cloudflare WAF 日誌分析和威脅識別。

### 【任務說明】

請根據以下 Cloudflare WAF 日誌數據，**基於新的攻擊判斷流程**生成完整的風險評估報告。

---

### 【資料來源】

- **索引名稱**: ${this.elkConfig.index}
- **分析時間範圍（台灣時間 UTC+8）**: 
  - 開始: ${formatTime(timeRange.start)}
  - 結束: ${formatTime(timeRange.end)}
- **總日誌數**: ${totalEvents.toLocaleString()} 筆
- **分析時間**: ${formatTime(new Date().toISOString())}

---

### 【Cloudflare 攻擊判斷流程（重要）】

本次分析採用多層判斷架構：

**第一層：SecurityAction 分類**
1. **block / connectionClose** → 已阻擋攻擊（低風險）
   - 風險等級: 低
   - AI 分析要求: 僅提供簡短摘要
   
2. **log** → 需要進一步判斷（依據 WAF Score 和 URI/UA）
   - WAF Score < 20 → 確定攻擊（高風險）
   - WAF Score >= 20 → 檢查 URI/UA 是否符合 OWASP TOP 10 攻擊模式
   
3. **challenge / jschallenge / managedChallenge** → 挑戰中（中風險）
   - 風險等級: 中
   - AI 分析要求: 持續監控
   
4. **rateLimit / l7ddos** → 流量限制（中風險）
   - 風險等級: 中
   - AI 分析要求: 簡短摘要

**第二層：WAF Attack Score**
- **< 20**: 幾乎確定是攻擊（Attack 級別）
- **21-50**: 可能攻擊（Likely Attack 級別，容易誤報）
- **51-80**: 可能正常（Likely Clean 級別）
- **81-99**: 很可能正常（Clean 級別）
- **0 或 100**: 未評分（已自動排除）

**第三層：URI / User-Agent 判斷**
- 基於 OWASP TOP 10 2021 攻擊模式庫
- 檢查 SecurityRuleDescription 是否包含 "log" 字眼

---

### 【攻擊統計（基於新的判斷流程）】

${attackStatisticsText}

---

### 【地理與資產分析】

- **Top 10 攻擊來源國家**: ${geoAnalysis.topCountries.slice(0, 10).map(c => `${c.item} (${c.count}次)`).join(', ') || '無'}
- **Top 10 攻擊來源IP**: ${geoAnalysis.topIPs.slice(0, 10).map(ip => `${ip.item} (${ip.count}次)`).join(', ') || '無'}
- **受影響資產總數**: ${assetAnalysis.totalAssets}
- **Top 5 被攻擊資產**: ${assetAnalysis.topAssets.slice(0, 5).map(a => `${a.item} (${a.count}次)`).join(', ') || '無'}

---

### 【輸出格式要求】

請生成 **嚴格的 JSON 格式** 風險報告：

\`\`\`json
{
  "risks": [
    {
      "id": "攻擊類型-唯一識別碼",
      "title": "攻擊標題",
      "severity": "critical | high | medium | low",
      "openIssues": 未阻擋的攻擊次數,
      "resolvedIssues": 已阻擋的攻擊次數,
      "affectedAssets": 受影響資產數量,
      "tags": ["標籤陣列"],
      "description": "詳細描述",
      "aiInsight": "AI 深度分析（必須包含具體數字、時間範圍、WAF 分數、來源、目標）",
      "createdDate": "${formatTime(timeRange.start)}",
      "updatedDate": "${formatTime(timeRange.end)}",
      "exploitInWild": true | false,
      "internetExposed": true,
      "confirmedExploitable": true | false,
      "cveId": null,
      "recommendations": [
        {
          "title": "建議標題",
          "description": "詳細建議（150-200字）",
          "priority": "high | medium | low"
        }
      ]
    }
  ]
}
\`\`\`

---

### 【輸出規則】

1. ⚠️ **已阻擋 vs 未阻擋**：
   - 已阻擋（block）：severity = "low"，openIssues = 0，resolvedIssues = 已阻擋次數
   - 未阻擋（log）：severity = "critical" 或 "high"，openIssues = 未阻擋次數

2. ⚠️ **時間格式**：
   - createdDate 和 updatedDate 必須使用日誌實際時間範圍
   - 格式：${formatTime(timeRange.start)} ~ ${formatTime(timeRange.end)}

3. ⚠️ **AI Insight 必須包含**：
   - 時間範圍（台灣時間）
   - 總攻擊次數
   - 已阻擋 vs 未阻擋次數
   - WAF 分數統計
   - Top 5 來源 IP 和國家
   - 受影響資產

4. ⚠️ **建議（Recommendations）**：
   - 針對未阻擋的攻擊：提供具體的 SOP 步驟
   - 針對已阻擋的攻擊：建議持續監控

5. ⚠️ **CVE 編號**：一律設為 null

---

請以繁體中文回答，**務必輸出純 JSON 格式**，不要有 markdown 或其他格式符號。
`;

    return promptTemplate.trim();
  }
  
  // 生成 Fallback 風險資料（AI 解析失敗時使用）
  generateFallbackRisks(analysisData) {
    const risks = [];
    const { sqlInjection, xssAttacks, rceAttacks, botTraffic, pathTraversal, abnormalUA, assetAnalysis, timeRange } = analysisData;
    
    // 格式化時間（使用日誌實際時間範圍，台灣時區 UTC+8）
    const formatDate = (isoString) => {
      const date = new Date(isoString);
      return date.toLocaleDateString('zh-TW', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Taipei'
      });
    };
    
    // 根據實際資料生成基本風險項目
    if (sqlInjection.count > 0) {
      const topCountry = sqlInjection.topCountries[0];
      const topIP = sqlInjection.topIPs[0];
      
      risks.push({
        id: `sql-injection-${Date.now()}`,
        title: 'SQL 注入攻擊檢測',
        severity: sqlInjection.highRisk > 50 ? 'critical' : sqlInjection.count > 100 ? 'high' : 'medium',
        openIssues: sqlInjection.count,
        resolvedIssues: 0,
        affectedAssets: sqlInjection.affectedAssets?.length || 0,
        tags: sqlInjection.highRisk > 0 ? ['Internet Exposed', 'Confirmed Exploitable'] : ['Internet Exposed'],
        description: `檢測到 ${sqlInjection.count} 次 SQL 注入攻擊嘗試，其中 ${sqlInjection.blocked || 0} 次已被阻擋，${sqlInjection.unblocked || 0} 次未被阻擋（需要立即處理）。主要來源國家：${sqlInjection.topCountries.slice(0, 3).map(c => c.item).join('、')}。`,
        aiInsight: `在時間範圍 ${formatDate(timeRange.start)} ~ ${formatDate(timeRange.end)} 內檢測到 ${sqlInjection.count} 次 SQL 注入嘗試，其中 ${sqlInjection.highRisk} 次屬於高風險級別（WAF 分數 < 20）。已阻擋 ${sqlInjection.blocked || 0} 次，未阻擋 ${sqlInjection.unblocked || 0} 次。主要攻擊來自 ${topCountry?.item || '未知'}（${topCountry?.count || 0} 次），Top 攻擊 IP 為 ${topIP?.item || '未知'}（${topIP?.count || 0} 次，來自 ${topIP?.country || '未知'}）。平均 WAF 分數為 ${sqlInjection.avgScore}。建議立即檢查受影響端點並封鎖攻擊來源。`,
        createdDate: formatDate(timeRange.start),
        updatedDate: formatDate(timeRange.end),
        exploitInWild: sqlInjection.highRisk > 0,
        internetExposed: true,
        confirmedExploitable: sqlInjection.highRisk > 0,
        cveId: null,
        recommendations: [
          {
            title: '封鎖攻擊來源 IP',
            description: `立即在 Cloudflare WAF 中封鎖主要攻擊 IP（如 ${topIP?.item || '檢測到的攻擊 IP'}），使用 IP Lists 功能建立黑名單並配置 Custom Rule 阻擋。前往 Account Home → Configurations → Lists 建立 IP list，然後在 Custom rules 中使用 (ip.src in $blocked_ips) 表達式。`,
            priority: 'high'
          },
          {
            title: '強化輸入驗證與參數檢查',
            description: '對所有輸入參數實施嚴格的白名單檢查，並使用參數化查詢防止 SQL 注入。在 Cloudflare 中使用 Custom Rules 配置 HTTP Headers 驗證（如 X-CSRF-Token）和 Cookie 驗證（如 Session Cookie），限制敏感 API 端點的訪問。',
            priority: 'high'
          },
          {
            title: '啟用 Cloudflare WAF SQL 注入防護規則',
            description: '立即啟用並強化 Cloudflare WAF 的 SQL 注入防護規則集。前往 Security → WAF → Managed rules，部署 Cloudflare Managed Ruleset 和 OWASP Core Ruleset。同時建立 Custom Rule 使用 Attack Score 阻擋高風險請求：(cf.waf.score.sqli le 20)。',
            priority: 'high'
          }
        ]
      });
    }
    
    if (xssAttacks.count > 0) {
      const topCountry = xssAttacks.topCountries[0];
      const topIP = xssAttacks.topIPs[0];
      
      risks.push({
        id: `xss-attack-${Date.now()}`,
        title: 'XSS 攻擊檢測',
        severity: xssAttacks.highRisk > 30 ? 'high' : 'medium',
        openIssues: xssAttacks.count,
        resolvedIssues: 0,
        affectedAssets: xssAttacks.affectedAssets?.length || 0,
        tags: ['Internet Exposed', 'Confirmed Exploitable'],
        description: `檢測到 ${xssAttacks.count} 次跨站腳本攻擊嘗試，其中 ${xssAttacks.blocked || 0} 次已被阻擋，${xssAttacks.unblocked || 0} 次未被阻擋。`,
        aiInsight: `在時間範圍 ${formatDate(timeRange.start)} ~ ${formatDate(timeRange.end)} 內檢測到 ${xssAttacks.count} 次 XSS 攻擊嘗試，其中 ${xssAttacks.highRisk} 次屬於高風險級別（WAF 分數 < 20）。已阻擋 ${xssAttacks.blocked || 0} 次，未阻擋 ${xssAttacks.unblocked || 0} 次。主要攻擊來自 ${topCountry?.item || '未知'}（${topCountry?.count || 0} 次），Top IP 為 ${topIP?.item || '未知'}（來自 ${topIP?.country || '未知'}）。平均 WAF 分數為 ${xssAttacks.avgScore}。建議立即啟用 CSP 並檢查輸入驗證機制。`,
        createdDate: formatDate(timeRange.start),
        updatedDate: formatDate(timeRange.end),
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: xssAttacks.highRisk > 0,
        cveId: null,
        recommendations: [
          {
            title: '封鎖攻擊來源 IP',
            description: `立即在 Cloudflare WAF 中封鎖主要攻擊 IP（如 ${topIP?.item || '檢測到的攻擊 IP'}），使用 IP Lists 功能建立黑名單。`,
            priority: 'high'
          },
          {
            title: '強化輸入驗證與 XSS 防護',
            description: '配置 Cloudflare WAF 的 XSS 防護規則，使用 Custom Rules 過濾包含 <script>、javascript: 等危險字符的請求。同時在應用層實施輸入過濾和輸出編碼，啟用 Content Security Policy (CSP) Headers 提供額外防護。',
            priority: 'high'
          },
          {
            title: '啟用 XSS 防護規則',
            description: '配置 Cloudflare WAF 的 XSS 防護規則並啟用 CSP',
            priority: 'high'
          }
        ]
      });
    }
    
    if (botTraffic.count > 100) {
      risks.push({
        id: `bot-traffic-${Date.now()}`,
        title: '惡意機器人流量',
        severity: 'medium',
        openIssues: botTraffic.count,
        resolvedIssues: 0,
        affectedAssets: botTraffic.affectedAssets,
        tags: ['Internet Exposed'],
        description: `檢測到 ${botTraffic.count} 次惡意機器人流量。`,
        aiInsight: `在時間範圍 ${formatDate(timeRange.start)} ~ ${formatDate(timeRange.end)} 內檢測到大量機器人流量，建議啟用 Cloudflare Bot Management 進行防護。`,
        createdDate: formatDate(timeRange.start),
        updatedDate: formatDate(timeRange.end),
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: false,
        cveId: null,
        recommendations: [
          {
            title: '啟用 Cloudflare Bot Management',
            description: '配置機器人管理功能以識別和阻擋惡意機器人',
            priority: 'medium'
          }
        ]
      });
    }
    
    return { risks };
  }
  
  // 按 ZoneName 分組受影響資產（新增）
  groupByZoneName(logs) {
    const zoneMap = new Map();
    
    logs.forEach(log => {
      const zoneName = log.zoneName || log.edgeHost || 'Unknown';
      const uri = log.requestURI || '/';
      
      if (!zoneMap.has(zoneName)) {
        zoneMap.set(zoneName, {
          zoneName: zoneName,
          attackCount: 0,
          uniqueIPs: new Set(),
          targetURIs: new Set(),
          blockedCount: 0,
          unblockedCount: 0
        });
      }
      
      const zone = zoneMap.get(zoneName);
      const analysis = analyzeThreatLevel(log);
      
      zone.attackCount++;
      zone.uniqueIPs.add(log.clientIP);
      zone.targetURIs.add(uri);
      
      if (analysis.isBlocked) {
        zone.blockedCount++;
      } else {
        zone.unblockedCount++;
      }
    });
    
    // 轉換為陣列並排序
    return Array.from(zoneMap.values())
      .map(zone => ({
        zoneName: zone.zoneName,
        attackCount: zone.attackCount,
        blockedCount: zone.blockedCount,
        unblockedCount: zone.unblockedCount,
        uniqueIPs: zone.uniqueIPs.size,
        targetURIs: Array.from(zone.targetURIs).slice(0, 10)
      }))
      .sort((a, b) => b.attackCount - a.attackCount);
  }
  
  // 獲取 Top IP 的詳細統計（包含國家）（新增）
  getTopIPsWithCountry(logs, n = 5) {
    const ipMap = new Map();
    
    logs.forEach(log => {
      const ip = log.clientIP;
      const country = log.clientCountry || 'Unknown';
      
      if (!ip) return;
      
      if (!ipMap.has(ip)) {
        ipMap.set(ip, {
          ip: ip,
          count: 0,
          country: country,
          targetURIs: new Set(),
          attackTypes: new Set()
        });
      }
      
      const ipData = ipMap.get(ip);
      ipData.count++;
      ipData.targetURIs.add(log.requestURI);
      
      // 識別攻擊類型
      const analysis = analyzeThreatLevel(log);
      if (analysis.attackType) {
        ipData.attackTypes.add(analysis.attackType);
      }
    });
    
    return Array.from(ipMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, n)
      .map(ipData => ({
        item: ipData.ip,  // 保持與 getTopN 格式一致
        count: ipData.count,
        country: ipData.country,
        targetURIs: Array.from(ipData.targetURIs).slice(0, 5),
        attackTypes: Array.from(ipData.attackTypes)
      }));
  }
  
  // 工具方法：取得 Top N
  getTopN(logs, field, n) {
    const counts = new Map();
    logs.forEach(log => {
      const value = log[field];
      if (value !== undefined && value !== null && value !== '') {
        counts.set(value, (counts.get(value) || 0) + 1);
      }
    });
    
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([item, count]) => ({ item, count }));
  }
  
  // 工具方法：計算平均值
  calculateAvg(logs, field) {
    const values = logs
      .map(log => log[field])
      .filter(v => v !== undefined && v !== null && !isNaN(v));
    
    if (values.length === 0) return 'N/A';
    return (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2);
  }
  
  // 空結果
  getEmptyAnalysisResult() {
    return {
      sqlInjection: { count: 0, highRisk: 0, topIPs: [], topTargets: [], topCountries: [], affectedAssets: 0, avgScore: 'N/A' },
      xssAttacks: { count: 0, highRisk: 0, topIPs: [], topTargets: [], topCountries: [], affectedAssets: 0, avgScore: 'N/A' },
      rceAttacks: { count: 0, highRisk: 0, topIPs: [], topTargets: [], topCountries: [], affectedAssets: 0, avgScore: 'N/A' },
      botTraffic: { count: 0, topIPs: [], topCountries: [], topASNs: [], affectedAssets: 0 },
      pathTraversal: { count: 0, topIPs: [], sensitiveFiles: [], affectedAssets: 0 },
      abnormalUA: { count: 0, topIPs: [], examples: [], affectedAssets: 0 },
      geoAnalysis: { topCountries: [], topIPs: [], topASNs: [] },
      assetAnalysis: { totalAssets: 0, topAssets: [] },
      totalEvents: 0,
      timeRange: { start: new Date().toISOString(), end: new Date().toISOString() }
    };
  }
}

module.exports = CloudflareWAFRiskService;

