/* =============================================
   GESTÃOPRO PREMIUM - LAYOUT ENGINE (v21 - FLAT)
   ============================================= */

import { Auth, Theme, DataHelper, showBlockedModal } from './app.js';

export async function renderLayout(title, subtitle, activePage) {
  // 1. Garantir que o Auth esteja inicializado e buscar usuário
  const user = await Auth.getCurrentUser();
  
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  const isAdmin = user.role === 'admin';
  const isActive = user.status === 'active' || isAdmin;
  const currentTheme = localStorage.getItem('theme') || 'light';

  // 2. Construir Estrutura Base
  const layoutHTML = `
    <div class="app-wrapper">
      <div class="sidebar-overlay" id="sidebarOverlay"></div>
      
      <aside class="sidebar" id="sidebar">
        <div style="padding: 32px 24px; display:flex; flex-direction:column; height:100%;">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:40px;">
            <div style="width:48px; height:48px; background:var(--primary); border-radius:14px; display:flex; align-items:center; justify-content:center; color:white; box-shadow:0 8px 16px rgba(99,102,241,0.3);">
              <i data-lucide="bar-chart-3" size="28"></i>
            </div>
            <div>
              <h2 style="font-size:20px; font-weight:800; letter-spacing:-0.03em; color:var(--text-main);">GestãoPro</h2>
              <span style="font-size:11px; font-weight:700; color:var(--primary); text-transform:uppercase; letter-spacing:0.05em;">Premium SaaS</span>
            </div>
          </div>

          <nav style="display:flex; flex-direction:column; gap:8px; flex:1;">
            <div style="font-size:11px; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.1em; padding:12px 16px;">Menu Principal</div>
            
            <a href="dashboard.html" class="btn btn-outline ${activePage === 'dashboard' ? 'active-nav' : ''}" style="width:100%; justify-content:flex-start; border:none;">
              <i data-lucide="layout-dashboard" size="20"></i> Dashboard
            </a>
            
            <a href="financeiro.html" class="btn btn-outline ${activePage === 'financeiro' ? 'active-nav' : ''}" style="width:100%; justify-content:flex-start; border:none;">
              <i data-lucide="wallet" size="20"></i> Financeiro
            </a>
            
            <a href="estoque.html" class="btn btn-outline ${activePage === 'estoque' ? 'active-nav' : ''}" style="width:100%; justify-content:flex-start; border:none;">
              <i data-lucide="package" size="20"></i> Estoque
            </a>
            
            <a href="relatorios.html" class="btn btn-outline ${activePage === 'relatorios' ? 'active-nav' : ''}" style="width:100%; justify-content:flex-start; border:none;">
              <i data-lucide="pie-chart" size="20"></i> Relatórios
            </a>

            ${isAdmin ? `
              <div style="font-size:11px; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.1em; padding:24px 16px 8px;">Admin</div>
              <a href="admin.html" class="btn btn-outline ${activePage === 'admin' ? 'active-nav' : ''}" style="width:100%; justify-content:flex-start; border:none;">
                <i data-lucide="shield-check" size="20"></i> Painel Admin
              </a>
            ` : ''}
          </nav>

          <div style="margin-top:auto; padding-top:24px; border-top:1px solid var(--border-color);">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
              <div style="width:40px; height:40px; background:var(--primary); color:white; border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:16px;">
                ${user.name.charAt(0).toUpperCase()}
              </div>
              <div style="flex:1; min-width:0;">
                <div style="font-weight:700; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--text-main);">${user.name}</div>
                <div style="font-size:11px; color:${isActive ? 'var(--success)' : 'var(--warning)'}; font-weight:700; display:flex; align-items:center; gap:4px;">
                  <span style="width:6px; height:6px; background:currentColor; border-radius:50%;"></span>
                  ${isActive ? 'Acesso Ativo' : 'Aguardando Ativação'}
                </div>
              </div>
            </div>
            <button class="btn btn-outline" id="logoutBtn" style="width:100%; justify-content:flex-start; border:none; color:var(--danger); padding:10px 16px;">
              <i data-lucide="log-out" size="18"></i> Sair do Sistema
            </button>
          </div>
        </div>
      </aside>

      <main class="main-container">
        <header class="top-bar">
          <div style="display:flex; align-items:center;">
            <button id="mobileMenuBtn" class="mobile-menu-btn">
              <i data-lucide="menu" size="24"></i>
            </button>
            <div>
              <h1 style="font-size:20px; font-weight:800; color:var(--text-main); letter-spacing:-0.02em;">${title}</h1>
              <p style="font-size:12px; color:var(--text-muted); font-weight:500;">${subtitle}</p>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:12px;">
            <div style="display:flex; align-items:center; gap:6px; background:var(--bg-hover); padding:6px; border-radius:14px; border:1px solid var(--border-color);">
              <button id="themeToggleBtn" style="background:none; border:none; cursor:pointer; color:var(--text-main); padding:8px; display:flex;">
                <i data-lucide="${currentTheme === 'light' ? 'moon' : 'sun'}" size="20"></i>
              </button>
              <button id="backupBtn" style="background:none; border:none; cursor:pointer; color:var(--text-main); padding:8px; display:flex;" title="Fazer Backup">
                <i data-lucide="download-cloud" size="20"></i>
              </button>
            </div>
          </div>
        </header>

        <div class="content-wrapper animate-in" id="pageContent">
          <!-- Conteúdo da página injetado via script individual -->
        </div>
      </main>
    </div>
  `;

  document.body.innerHTML = layoutHTML;

  if (window.lucide) window.lucide.createIcons();
  
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const backupBtn = document.getElementById('backupBtn');

  const toggleSidebar = () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
  };

  if (mobileMenuBtn) mobileMenuBtn.onclick = toggleSidebar;
  if (overlay) overlay.onclick = toggleSidebar;
  if (themeToggleBtn) themeToggleBtn.onclick = () => Theme.toggle();
  if (logoutBtn) logoutBtn.onclick = () => Auth.logout();
  if (backupBtn) backupBtn.onclick = () => window.ExportHelper.downloadBackup();
  
  if (!isActive) showBlockedModal();
}

window.ExportHelper = {
  async downloadBackup() {
    if (!Auth.isActive()) return showBlockedModal();
    const transactions = await DataHelper.getAll('transactions');
    const products = await DataHelper.getAll('products');
    const backup = {
      version: '1.4',
      date: new Date().toISOString(),
      data: { transactions, products }
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `gestaopro_backup_${new Date().getTime()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
};
