# GestãoPro — Sistema de Gestão Empresarial

Sistema web completo de gestão financeira, estoque e relatórios. Funciona 100% no navegador, sem necessidade de servidor ou banco de dados externo (usa localStorage).

---

## 📁 Estrutura de Arquivos

```
gestao-system/
├── index.html          → Página de Login
├── register.html       → Página de Cadastro
├── dashboard.html      → Dashboard Principal
├── financeiro.html     → Módulo Financeiro
├── estoque.html        → Módulo de Estoque
├── relatorios.html     → Módulo de Relatórios
├── admin.html          → Painel Administrativo
├── css/
│   └── style.css       → Estilos globais
└── js/
    ├── app.js          → Lógica principal (auth, storage, helpers)
    └── layout.js       → Componente de layout (sidebar + topbar)
```

---

## ⚙️ Configuração Inicial

Abra o arquivo `js/app.js` e altere as configurações no topo:

```javascript
const CONFIG = {
  ADMIN_EMAIL: 'admin@sistema.com',     // ← Seu e-mail de admin
  ADMIN_PASSWORD: 'admin@123',          // ← Sua senha de admin
  WHATSAPP_NUMBER: '5511999999999',     // ← Seu número WhatsApp (com DDI+DDD)
  WHATSAPP_MESSAGE: 'Olá! Gostaria de ativar meu acesso ao sistema de gestão.',
  APP_NAME: 'GestãoPro'
};
```

> **Importante:** Troque o número do WhatsApp pelo seu número real antes de publicar.

---

## 🚀 Como Usar

1. Abra o arquivo `index.html` em qualquer navegador moderno
2. Faça login com as credenciais de admin ou crie uma conta
3. Para acessar o painel admin: `admin@sistema.com` / `admin@123`

---

## 👤 Fluxo de Usuário

| Etapa | Descrição |
|-------|-----------|
| 1. Cadastro | Usuário cria conta → status **inativo** |
| 2. Exploração | Pode navegar e ver todas as telas |
| 3. Bloqueio | Ao tentar usar qualquer função, aparece modal de bloqueio |
| 4. Contato | Botão redireciona para WhatsApp com mensagem automática |
| 5. Ativação | Admin ativa a conta no painel admin |
| 6. Acesso total | Usuário pode usar todas as funcionalidades |

---

## 🔑 Acesso Admin

- **URL:** `admin.html`
- **E-mail:** `admin@sistema.com`
- **Senha:** `admin@123`

No painel admin você pode:
- Ver todos os usuários cadastrados
- Ativar ou desativar contas
- Excluir usuários
- Filtrar e buscar usuários

---

## 📊 Módulos do Sistema

### Dashboard
- Cards com faturamento, despesas e lucro do mês
- Gráfico de linha: evolução financeira (6 meses)
- Gráfico de pizza: distribuição de despesas
- Tabela das últimas 5 transações

### Financeiro
- Cadastro de entradas e saídas
- Categorização automática
- Filtros por tipo, categoria e período
- Saldo atual em tempo real

### Estoque
- Cadastro de produtos com SKU, preço de custo e venda
- Controle de quantidade mínima com alertas
- Histórico de movimentações (entrada, saída, ajuste)
- Indicador de estoque crítico

### Relatórios
- Filtro por período (1, 3, 6, 12 meses ou personalizado)
- Gráfico de linha: evolução financeira
- Gráfico de barras: comparativo mensal
- Gráfico de pizza: distribuição de despesas
- Ranking de receitas e despesas por categoria
- Tabela de produtos com estoque crítico

---

## 🛡️ Segurança e Dados

- Todos os dados são salvos no **localStorage** do navegador
- Cada usuário tem seus dados isolados (separados por ID)
- Sem necessidade de servidor ou banco de dados externo
- Para uso em produção, recomenda-se migrar para um backend real

---

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1024px+)
- Tablet (768px–1024px)
- Mobile (até 768px) — menu lateral deslizante

---

## 🔧 Tecnologias Utilizadas

- **HTML5** — Estrutura das páginas
- **CSS3** — Estilos e responsividade (sem frameworks)
- **JavaScript ES6+** — Lógica, localStorage e interações
- **Chart.js 4.4** — Gráficos (carregado via CDN)
- **Google Fonts (Inter)** — Tipografia (carregado via CDN)

> O sistema funciona offline, exceto pelos recursos carregados via CDN (Chart.js e fonte Inter). Para uso completamente offline, baixe esses arquivos e referencie localmente.
