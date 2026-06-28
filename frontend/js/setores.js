// URL Base do seu Back-end em Node.js
const API_URL = 'http://localhost:3000/api/setores';

// Variável global para armazenar os setores que vêm do banco
let sectors = [];

// Executa automaticamente assim que a página é carregada no navegador
document.addEventListener('DOMContentLoaded', () => {
    carregarSetores(); // Busca os dados reais do SQLite
    setupFormListener(); // Configura o formulário de cadastro
});

/**
 * 1. BUSCA OS SETORES DO BANCO DE DADOS (MÉTODO GET)
 */
async function carregarSetores() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar setores do servidor.');
        
        sectors = await response.json();
        
        // Atualiza a tela com os dados reais salvos
        renderSectors();
    } catch (error) {
        console.error("[SENSUS TCC] Erro ao carregar setores:", error);
    }
}

/**
 * 2. RENDERIZA OS CARDS NA GRID DA TELA
 */
function renderSectors() {
    const grid = document.querySelector('.sectors-grid');
    if (!grid) return;

    // Limpa a grid antes de desenhar para não duplicar
    grid.innerHTML = '';

    // Atualiza o contador geral de setores dinamicamente na tela (se houver o elemento)
    const contadorElemento = document.getElementById('total-setores');
    if (contadorElemento) {
        contadorElemento.textContent = sectors.length;
    }

    sectors.forEach(sector => {
        // Define a cor do score baseado na pontuação
        const numScore = parseInt(sector.score) || 0;
        const scoreColor = numScore >= 70 ? '#10b981' : '#ff7675';

        const card = document.createElement('div');
        card.className = 'sector-card';
        card.innerHTML = `
            <div class="sector-info">
                <h3>${sector.name}</h3>
                <p>${sector.description}</p>
            </div>
            <div class="sector-meta">
                <span>Último Score: <strong style="color: ${scoreColor};">${sector.score}</strong></span>
                <button class="btn-outline-sm" onclick="deleteSector(${sector.id})">Excluir</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

/**
 * 3. ENVIA UM NOVO SETOR PARA O BANCO (MÉTODO POST)
 */
function setupFormListener() {
    const form = document.getElementById('sectorForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nameInput = document.getElementById('sectorName');
        const descInput = document.getElementById('sectorDesc');

        const dadosNovoSetor = {
            name: nameInput.value.trim(),
            description: descInput.value.trim()
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosNovoSetor)
            });

            if (response.ok) {
                console.log("[SENSUS TCC] Setor cadastrado com sucesso no SQLite!");
                
                form.reset(); // Reseta o formulário
                await carregarSetores(); // Recarrega a lista trazendo o dado oficial do banco
                
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o topo
            } else {
                alert("Erro ao salvar o setor no servidor back-end.");
            }
        } catch (error) {
            console.error("[SENSUS TCC] Erro na requisição de cadastro:", error);
            alert("Não foi possível conectar ao servidor back-end. Ele está ligado?");
        }
    });
}

/**
 * 4. REMOVE UM SETOR DO BANCO PELO ID (MÉTODO DELETE)
 */
async function deleteSector(id) {
    if (confirm("Tem certeza que deseja remover este setor do mapeamento de 5S?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                console.log(`[SENSUS TCC] Setor ID ${id} deletado com sucesso do SQLite!`);
                await carregarSetores(); // Recarrega a tela atualizada direto do banco
            } else {
                alert("Erro ao remover o setor no servidor.");
            }
        } catch (error) {
            console.error("[SENSUS TCC] Erro na requisição de exclusão:", error);
        }
    }
}