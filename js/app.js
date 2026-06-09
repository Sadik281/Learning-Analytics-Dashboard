/**
 * App State & Core Logic
 */

class EduLensApp {
  constructor() {
    this.state = {
      data: null,
      theme: localStorage.getItem('theme') || 'dark',
      mode: localStorage.getItem('mode') || 'student',
      currentRoute: window.location.hash || '#/dashboard',
      assistantOpen: false
    };

    this.elements = {
      appRoot: document.getElementById('app-root'),
      themeToggle: document.getElementById('theme-toggle'),
      sidebar: document.getElementById('sidebar'),
      sidebarOpen: document.getElementById('sidebar-open'),
      sidebarClose: document.getElementById('sidebar-close'),
      menuItems: document.querySelectorAll('.menu-item'),
      // New Elements
      modeSwitcher: document.getElementById('mode-switcher'),
      assistantToggle: document.getElementById('assistant-toggle'),
      assistantPanel: document.getElementById('ai-assistant-panel'),
      assistantClose: document.getElementById('assistant-close'),
      assistantChat: document.getElementById('assistant-chat'),
      assistantInput: document.getElementById('assistant-input'),
      assistantSend: document.getElementById('assistant-send'),
      assistantSuggestions: document.getElementById('assistant-suggestions')
    };

    this.init();
  }

  async init() {
    this.applyTheme(this.state.theme);
    this.applyMode(this.state.mode);
    if(this.elements.modeSwitcher) this.elements.modeSwitcher.value = this.state.mode;
    
    this.setupEventListeners();
    
    // Fetch mock data
    await this.fetchData();
    
    // Initial route handling
    this.handleRoute();
  }

  setupEventListeners() {
    // Theme toggle
    this.elements.themeToggle.addEventListener('click', () => {
      const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
      this.applyTheme(newTheme);
    });

    // Mode Switcher
    if (this.elements.modeSwitcher) {
      this.elements.modeSwitcher.addEventListener('change', (e) => {
        this.applyMode(e.target.value);
        // Auto-route based on mode
        const m = e.target.value;
        if (m === 'teacher') window.location.hash = '#/teacher';
        else if (m === 'parent') window.location.hash = '#/parent';
        else if (m === 'institute') window.location.hash = '#/institution';
        else window.location.hash = '#/dashboard';
      });
    }

    // Mobile Sidebar
    this.elements.sidebarOpen.addEventListener('click', () => {
      this.elements.sidebar.classList.add('open');
    });

    this.elements.sidebarClose.addEventListener('click', () => {
      this.elements.sidebar.classList.remove('open');
    });

    // Assistant toggles
    if (this.elements.assistantToggle) {
      this.elements.assistantToggle.addEventListener('click', () => this.toggleAssistant());
      this.elements.assistantClose.addEventListener('click', () => this.toggleAssistant(false));
    }

    // Assistant chat
    if (this.elements.assistantSend) {
      this.elements.assistantSend.addEventListener('click', () => this.handleAssistantSubmit());
      this.elements.assistantInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleAssistantSubmit();
      });
    }

    // Hash change for routing
    window.addEventListener('hashchange', () => {
      this.state.currentRoute = window.location.hash || '#/dashboard';
      this.handleRoute();
      
      // Close sidebar on mobile after navigation
      if (window.innerWidth <= 768) {
        this.elements.sidebar.classList.remove('open');
      }
    });
  }

  applyTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const icon = this.elements.themeToggle.querySelector('i');
    if (theme === 'dark') {
      icon.classList.remove('ph-sun');
      icon.classList.add('ph-moon');
    } else {
      icon.classList.remove('ph-moon');
      icon.classList.add('ph-sun');
    }
  }

  applyMode(mode) {
    this.state.mode = mode;
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('mode', mode);
    this.updateAssistantContext();
  }

  async fetchData() {
    try {
      const response = await fetch('./assets/mock-data.json');
      if (!response.ok) throw new Error('Failed to load mock data');
      this.state.data = await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      this.elements.appRoot.innerHTML = `
        <div class="loading-state" style="color: var(--status-danger);">
          <i class="ph ph-warning"></i>
          <p>Failed to load EduLens Engine Data.</p>
          <small style="font-size: 12px; color: var(--text-secondary);">${error.message}</small>
        </div>
      `;
    }
  }

  handleRoute() {
    if (!this.state.data) return;

    this.elements.menuItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === this.state.currentRoute) {
        item.classList.add('active');
      }
    });

    let htmlContent = '';
    switch (this.state.currentRoute) {
      case '#/dashboard':
        htmlContent = window.Views.renderMainDashboard(this.state.data);
        break;
      case '#/student':
        htmlContent = window.Views.renderStudentAnalytics(this.state.data);
        break;
      case '#/teacher':
        htmlContent = window.Views.renderTeacherAnalytics(this.state.data);
        break;
      case '#/parent':
        htmlContent = window.Views.renderParentDashboard(this.state.data);
        break;
      case '#/institution':
        htmlContent = window.Views.renderInstitutionOverview(this.state.data);
        break;
      default:
        window.location.hash = '#/dashboard';
        return;
    }

    this.elements.appRoot.innerHTML = htmlContent;
    this.updateAssistantContext(); // Update contextual prompts when route changes
  }

  /* --- Global AI Assistant Logic --- */

  toggleAssistant(forceState) {
    this.state.assistantOpen = forceState !== undefined ? forceState : !this.state.assistantOpen;
    if (this.state.assistantOpen) {
      this.elements.assistantPanel.classList.add('open');
      if (this.elements.assistantChat.children.length === 0) {
        this.addChatMessage('ai', this.getWelcomeMessage());
      }
      setTimeout(() => this.elements.assistantInput.focus(), 300);
    } else {
      this.elements.assistantPanel.classList.remove('open');
    }
  }

  getWelcomeMessage() {
    switch(this.state.mode) {
      case 'teacher': return "Hello! I'm your Teacher Assistant. I can help you analyze class performance or flag at-risk students.";
      case 'parent': return "Hi! I'm here to help you understand your child's progress and emotional wellness today.";
      case 'institute': return "Welcome to the Institute Dashboard. I can run macro-level data queries or identify departmental risks.";
      default: return "Hello! I am EduLens AI. How can I assist your learning journey today?";
    }
  }

  updateAssistantContext() {
    if (!this.elements.assistantSuggestions) return;

    let suggestions = [];
    if (this.state.mode === 'teacher') {
      suggestions = ["Summarize Class Focus", "Identify At-Risk Students", "Draft Intervention Plan"];
    } else if (this.state.mode === 'parent') {
      suggestions = ["Explain Study Consistency", "How is Alex feeling?", "Screen Time Breakdown"];
    } else if (this.state.mode === 'institute') {
      suggestions = ["Analyze Dropout Risk", "Compare Departments", "Export Compliance Report"];
    } else {
      suggestions = ["How's my Focus?", "Suggest a Break", "Explain Math Topic"];
    }

    this.elements.assistantSuggestions.innerHTML = suggestions.map(s => 
      `<button class="suggestion-btn">${s}</button>`
    ).join('');

    // Re-bind clicks
    this.elements.assistantSuggestions.querySelectorAll('.suggestion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.elements.assistantInput.value = btn.innerText;
        this.handleAssistantSubmit();
      });
    });
  }

  handleAssistantSubmit() {
    const text = this.elements.assistantInput.value.trim();
    if (!text) return;

    this.addChatMessage('user', text);
    this.elements.assistantInput.value = '';

    // Show typing
    const typingId = 'typing-' + Date.now();
    const typingHtml = `
      <div id="${typingId}" class="chat-msg ai">
        <div class="avatar"><i class="ph ph-sparkle"></i></div>
        <div class="chat-bubble">
          <div class="typing-indicator"><span></span><span></span><span></span></div>
        </div>
      </div>
    `;
    this.elements.assistantChat.insertAdjacentHTML('beforeend', typingHtml);
    this.scrollToBottom();

    // Simulate AI response
    setTimeout(() => {
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();
      const response = this.generateAIResponse(text);
      this.addChatMessage('ai', response);
    }, 1500 + Math.random() * 1000);
  }

  generateAIResponse(input) {
    const lower = input.toLowerCase();
    if (this.state.mode === 'teacher' && lower.includes('risk')) {
      return "Based on recent data, Sarah Jenkins and Michael Chang are showing sustained cognitive overload. I recommend reviewing their latest Calculus assignments.";
    }
    if (this.state.mode === 'parent' && lower.includes('feeling')) {
      return "Alex has been exceptionally positive this week. Frustration markers are at an all-time low during STEM subjects!";
    }
    if (this.state.mode === 'institute' && lower.includes('department')) {
      return "The Medicine department currently leads in engagement (96%). However, the Business department shows a 4% dropout risk anomaly. Would you like a deep dive into the Business dept?";
    }
    return "That's an interesting observation! As a frontend simulation, my capabilities are mocked, but in a production environment, I would connect to the EduLens Intelligence Engine to provide deep insights on '" + input + "'.";
  }

  addChatMessage(sender, text) {
    const isUser = sender === 'user';
    const html = `
      <div class="chat-msg ${sender}">
        <div class="avatar">${isUser ? 'AD' : '<i class="ph ph-sparkle"></i>'}</div>
        <div class="chat-bubble">${text}</div>
      </div>
    `;
    this.elements.assistantChat.insertAdjacentHTML('beforeend', html);
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.elements.assistantChat.scrollTop = this.elements.assistantChat.scrollHeight;
  }
}

// Boot the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new EduLensApp();
});
