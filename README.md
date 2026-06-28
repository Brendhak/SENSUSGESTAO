# 📊 Sensus 5S — Plataforma de Monitoramento & Avaliação

> **Projeto de Extensão / TCC** > Sistema Full-Stack para otimização, auditoria e mapeamento de conformidade baseado na metodologia ágil japonesa 5S.

---

## 📌 Sobre o Projeto

O **Sensus 5S** é uma plataforma desenvolvida para gerenciar ciclos de auditorias em ambientes organizacionais. O sistema permite o mapeamento de setores físicos, a aplicação de checklists dinâmicos para os 5 sensos (*Seiri, Seiton, Seiso, Seiketsu, Shitsuke*) e a visualização analítica do rendimento histórico através de gráficos de tendência suaves.

### 🚀 Principais Funcionalidades
* **Painel Geral (Dashboard):** Gráfico de linha dinâmico que plota a tendência de desempenho e o índice de aderência acumulado das auditorias.
* **Checklist Inteligente:** Avaliação em tempo real com cálculo automatizado de pontuação e classificação de status do ambiente.
* **Gestão de Setores:** Cadastro, listagem e remoção de áreas físicas integrados ao banco de dados relacional.
* **Plano de Ação:** Geração de tarefas corretivas instantâneas baseadas nos alertas de desvios críticos do ambiente.

---

## 🏗️ Arquitetura do Sistema

O projeto adota uma arquitetura limpa com total separação de responsabilidades (Decoupled Full-Stack Architecture):

```text
SENSUSGESTAO/
├── backend/          # API RESTful em Node.js & Banco Relacional SQLite
├── frontend/         # Interface do Usuário (HTML5, CSS3 Vanilla, JavaScript ES6)
└── vercel.json       # Configuração de deploy estático





💾 Modelagem do Banco de Dados (Relacional)O banco de dados foi normalizado e estruturado seguindo regras rígidas de integridade referencial (ON DELETE CASCADE):TabelaFunçãoempresasSuporte multi-empresa (SaaS)usuariosGerenciamento de acessos (ADMIN / COLABORADOR)setoresÁreas físicas monitoradas dentro da empresaperguntas_checklistCadastro das perguntas base de cada SensoauditoriasCabeçalho e pontuação geral do ciclo avaliadorespostas_auditoriaItens específicos e conformidades da inspeção visual🛠️ Pré-requisitos para ExecuçãoAntes de começar, você precisará ter instalado em sua máquina:Node.js (Versão 18 ou superior)Um navegador web moderno (Edge, Chrome, Firefox)🚀 Como Rodar o Projeto (Passo a Passo)1. Clonar o RepositórioAbra o seu terminal e baixe o projeto do GitHub:Bashgit clone [https://github.com/SEU_USUARIO/sensus-5s.git](https://github.com/SEU_USUARIO/sensus-5s.git)
cd sensus-5s
2. Configurar e Lançar o Back-endNavegue até a pasta do servidor, instale as dependências necessárias e inicialize a API:Bashcd backend
npm install
npm start


Nota: Ao rodar o npm start pela primeira vez, o script database.js criará automaticamente o arquivo físico do banco database.db e aplicará uma carga inicial de dados (Populando a empresa de teste, o usuário Brenda, os setores iniciais e as perguntas dos sensos).A API estará ativa ouvindo na porta: http://localhost:30003. Executar o Front-endComo a interface foi construída de forma estática e autônoma para evitar gargalos de cache, você possui duas opções para abrir:Opção 1: Vá até a pasta frontend/pages/ usando o explorador de arquivos e dê dois cliques sobre o arquivo dashboard.html.Opção 2 (Recomendada): Abra a pasta frontend no seu VS Code, clique com o botão direito sobre o arquivo dashboard.html e selecione Open with Live Server.🧠 Tecnologias UtilizadasFront-end: HTML5, CSS3 (Componentização Minimalista), JavaScript Moderno (Async/Await Fetch API), Chart.js (Renderização de gráficos).Back-end: Node.js, Express.js (Roteamento de API), Cors.Banco de Dados: SQLite (sqlite3 driver assíncrono).Modelagem Conceitual: dbdiagram.io.