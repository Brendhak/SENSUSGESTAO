function renderizarNavbar() {
    const navbarContainer = document.getElementById('navbar-component');
    if (!navbarContainer) return;

    const pathArray = window.location.pathname.split("/");
    const paginaAtual = pathArray.pop();
    const noSubfolder = pathArray.includes("pages");

    // Se estiver dentro da pasta pages, as rotas não precisam do prefixo, mas se estiver na raiz precisa
    const prefix = noSubfolder ? "" : "pages/";

    navbarContainer.innerHTML = `
        <nav class="navbar">
            <div class="nav-logo">SENSUS 5S</div>
            <ul class="nav-links">
                <li><a href="${noSubfolder ? 'dashboard.html' : 'pages/dashboard.html'}" style="${paginaAtual === 'dashboard.html' ? 'font-weight: bold; color: #000;' : ''}">Visão Geral</a></li>
                <li><a href="${noSubfolder ? 'checklist.html' : 'pages/checklist.html'}" style="${paginaAtual === 'checklist.html' ? 'font-weight: bold; color: #000;' : ''}">Checklist 5S</a></li>
                <li><a href="${noSubfolder ? 'setores.html' : 'pages/setores.html'}" style="${paginaAtual === 'setores.html' ? 'font-weight: bold; color: #000;' : ''}">Setores</a></li>
                <li><a href="${noSubfolder ? 'sobre-gestao.html' : 'pages/sobre-gestao.html'}" style="${paginaAtual === 'sobre-gestao.html' ? 'font-weight: bold; color: #000;' : ''}">Guia da Metodologia</a></li>
            </ul>
        </nav>
    `;
}

document.addEventListener("DOMContentLoaded", renderizarNavbar);