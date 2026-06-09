/**
 * UI Components
 * Reusable functions to generate HTML strings or DOM elements
 */

// Generate a KPI Card
const createKPICard = (title, value, trend, icon, isUpGood = true) => {
  const isUp = trend.startsWith('+');
  const trendClass = isUp === isUpGood ? 'trend-up' : 'trend-down';
  const trendIcon = isUp ? 'ph-trend-up' : 'ph-trend-down';

  return `
    <div class="kpi-card animate-fade-in">
      <div class="kpi-header">
        <span>${title}</span>
        <div class="kpi-icon">
          <i class="ph ${icon}"></i>
        </div>
      </div>
      <div class="kpi-value">${value}</div>
      <div class="kpi-trend ${trendClass}">
        <i class="ph ${trendIcon}"></i>
        <span>${trend} vs last week</span>
      </div>
    </div>
  `;
};

// Generate an AI Insight Card
const createInsightCard = (insight) => {
  let iconClass, iconColor;
  
  switch(insight.type) {
    case 'warning':
      iconClass = 'ph-warning-circle';
      iconColor = 'var(--status-warning)';
      break;
    case 'success':
      iconClass = 'ph-check-circle';
      iconColor = 'var(--status-success)';
      break;
    case 'alert':
    case 'danger':
      iconClass = 'ph-siren';
      iconColor = 'var(--status-danger)';
      break;
    default:
      iconClass = 'ph-info';
      iconColor = 'var(--status-info)';
  }

  return `
    <div class="insight-card">
      <div class="insight-icon" style="background: ${iconColor}20; color: ${iconColor};">
        <i class="ph ${iconClass}"></i>
      </div>
      <div class="insight-content">
        <h4>${insight.title}</h4>
        <p>${insight.message}</p>
        <div class="insight-time">${insight.time}</div>
      </div>
    </div>
  `;
};

// Generate a Student Row for tables
const createStudentRow = (student) => {
  const riskClass = `badge-${student.riskLevel.toLowerCase()}`;
  
  return `
    <tr>
      <td>
        <div class="student-cell">
          <div class="avatar" style="width: 32px; height: 32px; font-size: 12px;">${student.avatar}</div>
          <div>
            <div style="font-weight: 500;">${student.name}</div>
            <div style="font-size: 12px; color: var(--text-muted);">${student.grade}</div>
          </div>
        </div>
      </td>
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 100%; height: 6px; background: var(--bg-card); border-radius: 3px; overflow: hidden;">
            <div style="width: ${student.focusScore}%; height: 100%; background: var(--accent-primary);"></div>
          </div>
          <span style="font-size: 13px; font-weight: 600;">${student.focusScore}</span>
        </div>
      </td>
      <td>
        <span class="badge-status ${riskClass}">${student.riskLevel} Risk</span>
      </td>
      <td>
        <span style="font-size: 13px; color: var(--text-secondary);">${student.recentBehavior}</span>
      </td>
    </tr>
  `;
};

// Generate a Simple SVG Line Chart (Sparkline)
const createSVGChart = (data, labels, height = 250) => {
  if (!data || data.length === 0) return '';
  
  const width = 800; // ViewBox width
  const padding = 40;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = (max - min) || 1; // avoid division by zero
  
  // Calculate points
  const points = data.map((val, index) => {
    const x = padding + (index * ((width - 2 * padding) / (data.length - 1)));
    const y = height - padding - (((val - min) / range) * (height - 2 * padding));
    return `${x},${y}`;
  }).join(' ');
  
  // Grid lines
  const gridLines = [0, 0.5, 1].map(multiplier => {
    const y = height - padding - (multiplier * (height - 2 * padding));
    return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="4" />`;
  }).join('');
  
  // X-axis labels
  const labelEls = labels.map((label, index) => {
    const x = padding + (index * ((width - 2 * padding) / (labels.length - 1)));
    return `<text x="${x}" y="${height - 10}" fill="var(--text-muted)" font-size="12" text-anchor="middle" font-family="Inter, sans-serif">${label}</text>`;
  }).join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%; overflow: visible;">
      <!-- Grid -->
      ${gridLines}
      
      <!-- Gradient -->
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="var(--accent-primary)" stop-opacity="0.5" />
          <stop offset="100%" stop-color="var(--accent-primary)" stop-opacity="0" />
        </linearGradient>
      </defs>
      
      <!-- Area Fill -->
      <polygon points="${padding},${height - padding} ${points} ${width - padding},${height - padding}" fill="url(#lineGrad)" />
      
      <!-- Line -->
      <polyline points="${points}" fill="none" stroke="var(--accent-primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 4px 6px rgba(99,102,241,0.3));" />
      
      <!-- Data Points -->
      ${data.map((val, index) => {
        const x = padding + (index * ((width - 2 * padding) / (data.length - 1)));
        const y = height - padding - (((val - min) / range) * (height - 2 * padding));
        return `<circle cx="${x}" cy="${y}" r="5" fill="var(--bg-card)" stroke="var(--accent-primary)" stroke-width="2" />
                <!-- Tooltip hover area (invisible) -->
                <circle cx="${x}" cy="${y}" r="15" fill="transparent"><title>${val}</title></circle>`;
      }).join('')}
      
      <!-- Labels -->
      ${labelEls}
    </svg>
  `;
};

window.UI = {
  createKPICard,
  createInsightCard,
  createStudentRow,
  createSVGChart
};
