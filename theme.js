(function() {
  const themeToggleHTML = `
    <div class="theme-switch-wrapper" title="Toggle Dark Mode">
      <label class="theme-switch" for="theme-toggle">
        <input type="checkbox" id="theme-toggle" />
        <div class="slider round">
          <span class="icon sun">☀️</span>
          <span class="icon moon">🌙</span>
        </div>
      </label>
    </div>
  `;

  const themeStyles = `
    <style>
      .theme-switch-wrapper {
        position: fixed;
        bottom: 25px;
        right: 25px;
        z-index: 9999;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
        border-radius: 34px;
      }
      .theme-switch {
        display: inline-block;
        height: 34px;
        position: relative;
        width: 66px;
        margin: 0;
      }
      .theme-switch input {
        display: none;
      }
      .slider {
        background-color: #f0d080;
        bottom: 0;
        cursor: pointer;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transition: .4s;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 8px;
        box-sizing: border-box;
      }
      .slider .icon {
        font-size: 14px;
        z-index: 1;
        line-height: 1;
      }
      .slider:before {
        background-color: #fff;
        bottom: 4px;
        content: "";
        height: 26px;
        left: 4px;
        position: absolute;
        transition: .4s;
        width: 26px;
        z-index: 2;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      }
      input:checked + .slider {
        background-color: #0a1b38;
      }
      input:checked + .slider:before {
        transform: translateX(32px);
      }
      .slider.round {
        border-radius: 34px;
      }
      .slider.round:before {
        border-radius: 50%;
      }
      
      /* Dark Mode Variables Override */
      html[data-theme="dark"] {
        --navy: #040914;
        --royal: #0a1b38;
        --gold: #d4b868;
        --gold-light: #f4db9a;
        --cream: #121826;
        --white: #1e2638;
        --text: #e2e8f0;
        --muted: #94a3b8;
        --border: #334155;
      }

      /* Global Background & Text */
      html[data-theme="dark"] body {
        background-color: var(--cream) !important;
        background: var(--cream) !important;
        color: var(--text) !important;
      }
      
      /* Standardizing White Backgrounds to Dark */
      html[data-theme="dark"] .feature-card,
      html[data-theme="dark"] .team-card,
      html[data-theme="dark"] .notice-item,
      html[data-theme="dark"] .xml-item,
      html[data-theme="dark"] .testimonial-card,
      html[data-theme="dark"] .panel,
      html[data-theme="dark"] .topbar,
      html[data-theme="dark"] .stat-card,
      html[data-theme="dark"] .main-footer,
      html[data-theme="dark"] .sec-tab.active,
      html[data-theme="dark"] .book-card,
      html[data-theme="dark"] .modal,
      html[data-theme="dark"] .xml-section,
      html[data-theme="dark"] .testimonials-section,
      html[data-theme="dark"] .section[style*="background:#fff"],
      html[data-theme="dark"] .section[style*="background: #fff"],
      html[data-theme="dark"] .footer {
        background-color: var(--white) !important;
        background: var(--white) !important;
        border-color: var(--border) !important;
        color: var(--text) !important;
      }

      /* Inputs */
      html[data-theme="dark"] input, 
      html[data-theme="dark"] select, 
      html[data-theme="dark"] textarea {
        background-color: #121826 !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      html[data-theme="dark"] input:focus, 
      html[data-theme="dark"] select:focus, 
      html[data-theme="dark"] textarea:focus {
        background-color: #0b101a !important;
      }

      /* Fix specific components for readability in dark mode */
      html[data-theme="dark"] .team-id { background: #2a3449 !important; }
      html[data-theme="dark"] .sec-tabs { background: #121826 !important; }
      html[data-theme="dark"] .nav-brand-text h1 { color: #fff !important; }
      html[data-theme="dark"] .navbar {
         background: rgba(4, 9, 20, 0.95) !important;
         border-bottom: 1px solid rgba(212, 184, 104, 0.15) !important;
      }
      html[data-theme="dark"] td {
          border-bottom: 1px solid #334155 !important;
      }
      html[data-theme="dark"] th {
          background: #1e2638 !important;
          border-bottom: 2px solid #334155 !important;
      }
      html[data-theme="dark"] tr:hover td {
          background: #2a3449 !important;
      }
      /* Prevent invisible links */
      html[data-theme="dark"] a { color: var(--gold-light); }
      html[data-theme="dark"] .nav-links a { color: rgba(255,255,255,0.65) !important; }
      html[data-theme="dark"] .nav-links a:hover, html[data-theme="dark"] .nav-links a.active { color: var(--gold-light) !important; }
      html[data-theme="dark"] .btn, html[data-theme="dark"] .btn-primary, html[data-theme="dark"] .btn-detail { color: #fff; }
      html[data-theme="dark"] .btn-outline { color: var(--gold-light); }
      html[data-theme="dark"] .hero a { color: inherit; }
    </style>
  `;

  // Insert styles
  document.head.insertAdjacentHTML('beforeend', themeStyles);
  
  // Insert toggle button once DOM is ready
  if (document.body) {
    injectToggle();
  } else {
    document.addEventListener('DOMContentLoaded', injectToggle);
  }

  function injectToggle() {
    if(!document.getElementById('theme-toggle')) {
        document.body.insertAdjacentHTML('beforeend', themeToggleHTML);
        initTheme();
    }
  }

  function initTheme() {
    const toggleSwitch = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('pu_theme');
    
    // Set initial theme
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
      toggleSwitch.checked = true;
    }

    // Handle toggle
    toggleSwitch.addEventListener('change', function(e) {
      if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('pu_theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('pu_theme', 'light');
      }
    });
  }
})();
