/**
 * Views
 * Functions to render specific pages
 */

const renderMainDashboard = (data) => {
  return `
    <div class="page-header animate-fade-in">
      <div>
        <h1 class="page-title">EduLens Dashboard</h1>
        <p class="page-subtitle">Real-time learning intelligence overview</p>
      </div>
      <div>
        <button class="icon-btn" style="width: auto; padding: 0 16px; border-radius: 8px; background: var(--accent-primary); color: white; border: none;">
          <i class="ph ph-download-simple"></i>
          <span style="margin-left: 8px; font-weight: 500; font-size: 14px;">Export Report</span>
        </button>
      </div>
    </div>
    
    <div class="grid-4">
      ${window.UI.createKPICard('Active Students', '14,205', '+2.4%', 'ph-users')}
      ${window.UI.createKPICard('Avg Focus Score', '84%', '+1.2%', 'ph-target')}
      ${window.UI.createKPICard('Avg Engagement', '79%', '-0.5%', 'ph-lightning', false)}
      ${window.UI.createKPICard('Critical Alerts', '12', '-3', 'ph-warning-circle')}
    </div>
    
    <div class="grid-2">
      <div class="glass-panel animate-fade-in" style="animation-delay: 0.1s;">
        <div class="panel-header">
          <h3 class="panel-title">
            <i class="ph ph-chart-line-up" style="color: var(--accent-primary);"></i>
            Weekly Engagement Trends
          </h3>
          <button class="icon-btn" style="width: 32px; height: 32px;"><i class="ph ph-dots-three"></i></button>
        </div>
        <div class="chart-container">
          ${window.UI.createSVGChart([65, 70, 68, 75, 82, 79, 85], ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])}
        </div>
      </div>
      
      <div class="glass-panel animate-fade-in" style="animation-delay: 0.2s;">
        <div class="panel-header">
          <h3 class="panel-title">
            <i class="ph ph-brain" style="color: var(--accent-secondary);"></i>
            AI Actionable Insights
          </h3>
        </div>
        <div class="insight-list" style="max-height: 250px; overflow-y: auto; padding-right: 8px;">
          <div class="insight-card">
            <div class="insight-icon" style="background: var(--status-warning)20; color: var(--status-warning);">
              <i class="ph ph-warning-circle"></i>
            </div>
            <div class="insight-content">
              <h4>Engagement Drop</h4>
              <p>Grade 9 Literature showing a 15% drop in overall engagement this week.</p>
              <div class="insight-time">2h ago</div>
            </div>
          </div>
          <div class="insight-card">
            <div class="insight-icon" style="background: var(--status-success)20; color: var(--status-success);">
              <i class="ph ph-check-circle"></i>
            </div>
            <div class="insight-content">
              <h4>Focus Improvement</h4>
              <p>Sophia Martinez has improved her focus score by 10 points.</p>
              <div class="insight-time">5h ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="glass-panel animate-fade-in" style="animation-delay: 0.3s;">
      <div class="panel-header">
        <h3 class="panel-title">
          <i class="ph ph-student" style="color: var(--text-primary);"></i>
          At-Risk Students Watchlist
        </h3>
        <div style="display: flex; gap: 8px;">
          <input type="text" placeholder="Filter..." style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 6px; color: var(--text-primary); outline: none;">
        </div>
      </div>
      <div style="overflow-x: auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Focus Score</th>
              <th>Risk Level</th>
              <th>AI Analysis</th>
            </tr>
          </thead>
          <tbody>
            ${(data.teacher?.atRisk || []).map(s => window.UI.createStudentRow({
              name: s.name,
              avatar: s.avatar,
              grade: s.subject,
              focusScore: s.risk === 'High' ? 45 : 70,
              riskLevel: s.risk,
              recentBehavior: s.reason
            })).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

const renderStudentAnalytics = (data) => {
  const student = data.student;
  if(!student) return '';

  return `
    <div class="page-header animate-fade-in">
      <div>
        <h1 class="page-title">Student Analytics</h1>
        <p class="page-subtitle">Deep dive into individual learning patterns for <span style="color: var(--accent-primary);">${student.name}</span></p>
      </div>
    </div>
    
    <div class="grid-4">
      ${window.UI.createKPICard('Focus Score', student.kpis.focusScore.value, student.kpis.focusScore.trend, 'ph-target')}
      ${window.UI.createKPICard('Productivity', student.kpis.productivity.value, student.kpis.productivity.trend, 'ph-trend-up')}
      ${window.UI.createKPICard('Burnout Risk', student.kpis.burnoutRisk.value, student.kpis.burnoutRisk.trend, 'ph-fire')}
      ${window.UI.createKPICard('Academic Risk', student.kpis.academicRisk.value, '', 'ph-warning-circle')}
    </div>
    
    <div class="grid-2">
      <div class="glass-panel animate-fade-in">
        <div class="panel-header">
          <h3 class="panel-title">Weekly Cognitive Progress</h3>
        </div>
        <div class="chart-container">
          ${window.UI.createSVGChart(student.weeklyProgress.map(p => p.focus), student.weeklyProgress.map(p => p.day))}
        </div>
      </div>
      
      <div class="space-y-6 flex flex-col gap-6">
        <div class="glass-panel animate-fade-in">
          <div class="panel-header">
            <h3 class="panel-title" style="color: var(--accent-secondary);"><i class="ph ph-sparkle"></i> AI Recommendations</h3>
          </div>
          <ul style="display: flex; flex-direction: column; gap: 16px;">
            ${student.aiRecommendations.map(rec => `
              <li style="display: flex; gap: 12px; font-size: 14px; color: var(--text-secondary);">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: ${rec.color === 'brand' ? 'var(--accent-primary)' : 'var(--status-success)'}; flex-shrink: 0; margin-top: 6px;"></div>
                <p>${rec.text}</p>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;
};

const renderTeacherAnalytics = (data) => {
  const teacher = data.teacher;
  if (!teacher) return '';

  return `
    <div class="page-header animate-fade-in">
      <div>
        <h1 class="page-title">Teacher Analytics</h1>
        <p class="page-subtitle">Class-wide performance forecasting and intervention management.</p>
      </div>
    </div>
    
    <div class="grid-2">
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div class="glass-panel animate-fade-in" style="border-color: rgba(239, 68, 68, 0.2);">
          <div class="panel-header mb-4">
            <h3 class="panel-title"><i class="ph ph-warning-circle" style="color: var(--status-danger);"></i> At-Risk Student Alerts</h3>
          </div>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${teacher.atRisk.map(student => `
              <div style="padding: 16px; border-radius: 12px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 4px;">
                    <span style="font-weight: 600;">${student.name}</span>
                    <span class="badge-status ${student.risk === 'High' ? 'badge-high' : 'badge-medium'}">${student.risk} Risk</span>
                  </div>
                  <div style="font-size: 13px; color: var(--text-secondary);">${student.reason}</div>
                </div>
                <button style="padding: 8px 16px; background: var(--bg-card); border-radius: 8px; font-size: 13px; font-weight: 500; transition: var(--transition);" onmouseover="this.style.background='var(--bg-card-hover)'" onmouseout="this.style.background='var(--bg-card)'">Review</button>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="glass-panel animate-fade-in">
          <div class="panel-header">
            <h3 class="panel-title">Class Engagement Heatmap</h3>
          </div>
          <div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 4px; padding: 16px; background: rgba(0,0,0,0.2); border-radius: 12px; position: relative;">
            <div style="position: absolute; inset: 0; background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%); pointer-events: none;"></div>
            ${teacher.heatmapData.map(val => `
              <div style="aspect-ratio: 1; border-radius: 4px; background: var(--accent-primary); opacity: ${val / 100}; transition: opacity 0.3s;"></div>
            `).join('')}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); margin-top: 12px;">
            <span>Mon 8:00 AM</span>
            <span>Engagement Intensity Map (Last 30 Days)</span>
            <span>Fri 4:00 PM</span>
          </div>
        </div>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div class="glass-panel animate-fade-in">
          <div class="panel-header">
            <h3 class="panel-title"><i class="ph ph-book-open" style="color: var(--accent-primary);"></i> Weak Topic Clustering</h3>
          </div>
          <div style="display: flex; flex-direction: column; gap: 20px;">
            ${teacher.weakTopics.map(topic => `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
                  <span style="font-weight: 500;">${topic.topic}</span>
                  <span style="color: var(--accent-primary);">${topic.mastery}% Mastery</span>
                </div>
                <div style="height: 8px; border-radius: 4px; background: var(--bg-card); overflow: hidden; margin-bottom: 4px;">
                  <div style="height: 100%; width: ${topic.mastery}%; background: var(--accent-primary); border-radius: 4px;"></div>
                </div>
                <div style="font-size: 12px; color: var(--text-muted);">${topic.affected} students struggling</div>
              </div>
            `).join('')}
          </div>
          <button style="width: 100%; margin-top: 24px; padding: 10px; background: var(--accent-glow); color: var(--accent-primary); border-radius: 8px; font-weight: 500; display: flex; justify-content: center; align-items: center; gap: 8px; transition: var(--transition);" onmouseover="this.style.background='rgba(99, 102, 241, 0.3)'" onmouseout="this.style.background='var(--accent-glow)'">
            Generate Intervention Plan <i class="ph ph-caret-right"></i>
          </button>
        </div>
        
        <div class="glass-panel animate-fade-in" style="background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3);">
          <h3 style="color: var(--status-success); font-weight: 600; display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <i class="ph ph-trend-up"></i> Learning Acceleration
          </h3>
          <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">
            ${teacher.aiInsight}
          </p>
        </div>
      </div>
    </div>
  `;
};

const renderParentDashboard = (data) => {
  const parent = data.parent;
  if (!parent) return '';

  return `
    <div class="page-header animate-fade-in">
      <div>
        <h1 class="page-title">Parent Portal</h1>
        <p class="page-subtitle">Monitoring emotional wellness and study consistency for <span style="color: var(--accent-primary); font-weight: 500;">${parent.childName}</span>.</p>
      </div>
      <div>
        <span class="badge-status" style="background: rgba(16, 185, 129, 0.2); color: var(--status-success); padding: 8px 16px; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 24px; display: flex; align-items: center; gap: 8px;">
          <i class="ph ph-shield-check"></i> Wellness Status: ${parent.wellnessStatus}
        </span>
      </div>
    </div>
    
    <div class="grid-4" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
      <!-- Emotional Wellness Card -->
      <div class="glass-panel animate-fade-in" style="background: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.2);">
        <div class="panel-header mb-4">
          <h3 class="panel-title"><div style="padding: 8px; border-radius: 8px; background: rgba(239, 68, 68, 0.2); color: var(--status-danger);"><i class="ph ph-heartbeat"></i></div> Emotional Wellness</h3>
        </div>
        <div style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">${parent.emotional.status}</div>
        <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 24px;">${parent.emotional.description}</p>
        
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">
          <span>Stress Level</span>
          <span style="color: var(--status-success);">Low (${parent.emotional.stressLevel}%)</span>
        </div>
        <div style="height: 6px; background: var(--bg-card); border-radius: 3px;">
          <div style="height: 100%; width: ${parent.emotional.stressLevel}%; background: var(--status-success); border-radius: 3px;"></div>
        </div>
      </div>
      
      <!-- Screen Time Ratio -->
      <div class="glass-panel animate-fade-in" style="background: rgba(99, 102, 241, 0.05); border-color: rgba(99, 102, 241, 0.2);">
        <div class="panel-header mb-4">
          <h3 class="panel-title"><div style="padding: 8px; border-radius: 8px; background: var(--accent-glow); color: var(--accent-primary);"><i class="ph ph-clock"></i></div> Screen Time Ratio</h3>
        </div>
        <div style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">${parent.screenTime.productive}% Productive</div>
        <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 24px;">Out of ${parent.screenTime.totalHours} hours of screen time today, ${parent.screenTime.productiveHours} hours were spent on focused educational activities.</p>
        
        <div style="display: flex; gap: 4px; height: 8px; border-radius: 4px; overflow: hidden;">
          <div style="background: var(--accent-primary); width: ${parent.screenTime.productive}%;"></div>
          <div style="background: var(--border-color); width: ${100 - parent.screenTime.productive}%;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); margin-top: 8px;">
          <span>Educational</span>
          <span>Other</span>
        </div>
      </div>
      
      <!-- Consistency Tracking -->
      <div class="glass-panel animate-fade-in" style="background: rgba(245, 158, 11, 0.05); border-color: rgba(245, 158, 11, 0.2);">
        <div class="panel-header mb-4">
          <h3 class="panel-title"><div style="padding: 8px; border-radius: 8px; background: rgba(245, 158, 11, 0.2); color: var(--status-warning);"><i class="ph ph-calendar"></i></div> Study Consistency</h3>
        </div>
        <div style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">${parent.studyConsistency.score} / 10</div>
        <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 24px;">${parent.studyConsistency.description}</p>
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
          ${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
              <div style="width: 24px; height: 24px; border-radius: 4px; background: ${parent.studyConsistency.days[i] ? 'var(--status-warning)' : 'var(--bg-card)'};"></div>
              <span style="font-size: 10px; color: var(--text-muted);">${day}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    
    <div class="glass-panel animate-fade-in" style="margin-top: 24px;">
      <h2 style="font-size: 20px; font-weight: 600; display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <i class="ph ph-brain" style="color: var(--accent-primary);"></i> AI-Generated Progress Summary
      </h2>
      <p style="color: var(--text-secondary); line-height: 1.8; max-width: 900px;">
        ${parent.aiSummary}
      </p>
    </div>
  `;
};

const renderInstitutionOverview = (data) => {
  const inst = data.institution;
  if (!inst) return '';

  return `
    <div class="page-header animate-fade-in">
      <div>
        <h1 class="page-title">Institutional Overview</h1>
        <p class="page-subtitle">Macro-level predictive analytics and cross-departmental KPIs.</p>
      </div>
      <div>
        <button class="icon-btn" style="width: auto; padding: 0 16px; border-radius: 8px; background: var(--accent-primary); color: white; border: none;">
          <span style="margin-right: 8px; font-weight: 500; font-size: 14px;">Export Report</span>
          <i class="ph ph-arrow-up-right"></i>
        </button>
      </div>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px;">
      ${inst.kpis.map((kpi, idx) => `
        <div class="glass-panel animate-fade-in" style="padding: 16px; animation-delay: ${idx * 0.05}s;">
          <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">${kpi.label}</div>
          <div style="font-size: 24px; font-weight: 700; margin-bottom: 4px;">${kpi.value}</div>
          <div style="font-size: 12px; font-weight: 500; color: ${kpi.good ? 'var(--status-success)' : 'var(--status-danger)'};">${kpi.trend} vs last month</div>
        </div>
      `).join('')}
    </div>
    
    <div class="grid-2">
      <div class="glass-panel animate-fade-in">
        <h2 style="font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
          <i class="ph ph-buildings" style="color: var(--accent-primary);"></i>
          Department Performance vs Risk
        </h2>
        <div style="height: 300px; display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 24px; position: relative;">
          <!-- Grid lines -->
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 24px; display: flex; flex-direction: column; justify-content: space-between; pointer-events: none; z-index: 0;">
             ${[100, 75, 50, 25, 0].map(val => `
                <div style="width: 100%; height: 1px; border-top: 1px dashed var(--border-color); display: flex; align-items: center;">
                   <span style="position: absolute; left: -25px; font-size: 10px; color: var(--text-muted);">${val}</span>
                </div>
             `).join('')}
          </div>
          
          <div style="display: flex; justify-content: space-around; width: 100%; height: 100%; align-items: flex-end; padding-left: 20px; z-index: 1;">
            ${inst.departments.map(dept => `
              <div style="display: flex; gap: 4px; height: 100%; align-items: flex-end; position: relative; width: 40px; cursor: pointer;" title="${dept.name} - Score: ${dept.score}, Engagement: ${dept.engagement}">
                <div style="width: 18px; height: ${dept.score}%; background: ${dept.score > 85 ? 'var(--accent-primary)' : 'var(--accent-secondary)'}; border-radius: 4px 4px 0 0; opacity: 0.9;"></div>
                <div style="width: 18px; height: ${dept.engagement}%; background: #ec4899; border-radius: 4px 4px 0 0; opacity: 0.9;"></div>
                <div style="position: absolute; bottom: -24px; left: 50%; transform: translateX(-50%); font-size: 11px; color: var(--text-muted); white-space: nowrap;">${dept.name.substring(0, 3)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div class="glass-panel animate-fade-in" style="background: rgba(245, 158, 11, 0.05); border-color: rgba(245, 158, 11, 0.2); flex: 1; display: flex; flex-direction: column; justify-content: center;">
          <div style="display: flex; gap: 16px; margin-bottom: 16px;">
            <div style="padding: 12px; border-radius: 12px; background: rgba(245, 158, 11, 0.2); color: var(--status-warning); align-self: flex-start;">
              <i class="ph ph-warning" style="font-size: 24px;"></i>
            </div>
            <div>
              <h3 style="font-size: 18px; font-weight: 600; color: var(--status-warning); margin-bottom: 8px;">High Risk Alert: ${inst.highRiskAlert.dept}</h3>
              <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">${inst.highRiskAlert.message}</p>
            </div>
          </div>
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(245, 158, 11, 0.2);">
            <button style="color: var(--status-warning); font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 4px;">
              View Drill-down Analytics <i class="ph ph-arrow-right"></i>
            </button>
          </div>
        </div>
        
        <div class="glass-panel animate-fade-in" style="background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.2);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <i class="ph ph-trend-up" style="color: var(--status-success); font-size: 20px;"></i>
            <h3 style="font-weight: 600; color: var(--status-success);">Teaching Effectiveness Peak</h3>
          </div>
          <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">
            ${inst.teachingPeak.message}
          </p>
        </div>
      </div>
    </div>
  `;
};

window.Views = {
  renderMainDashboard,
  renderStudentAnalytics,
  renderTeacherAnalytics,
  renderParentDashboard,
  renderInstitutionOverview
};
