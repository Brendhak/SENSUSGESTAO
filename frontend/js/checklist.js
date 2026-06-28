// Armazena as notas de cada bloco (0 ou 1)
const totalQuestions = 5;
let scores = Array(totalQuestions).fill(null);

/**
 * Altera visualmente a aba ativa do menu lateral e exibe a respectiva seção do 5S
 */
function switchSenso(activeIndex) {
    const menuItems = document.querySelectorAll('#sensoMenu li');
    menuItems.forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    const sections = document.querySelectorAll('.senso-section');
    sections.forEach((section, index) => {
        if (index === activeIndex) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

/**
 * Define a nota da questão e altera a cor dos botões clicados
 */
function setQuestionScore(buttonElement, scoreValue) {
    // Seleciona os botões do grupo específico da pergunta clicada
    const buttonGroup = buttonElement.parentElement;
    const buttons = buttonGroup.querySelectorAll('.opt-btn');

    // Remove o estado ativo visual de ambos
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Adiciona a classe ativa no botão clicado
    buttonElement.classList.add('active');

    // Descobre qual é a seção pai para saber o índice do Senso (0 a 4)
    const sectionElement = buttonElement.closest('.senso-section');
    if (!sectionElement) return;

    // Extrai o número do ID (ex: "senso2" vira o índice 2)
    const sectionIndex = parseInt(sectionElement.id.replace('senso', ''), 10);

    // Atualiza o array global de notas
    scores[sectionIndex] = scoreValue;

    // Recalcula a nota geral
    calculateTotalScore();
}

/**
 * Calcula a porcentagem geral de conformidade e atualiza a interface
 */
function calculateTotalScore() {
    const answeredQuestions = scores.filter(score => score !== null);
    
    if (answeredQuestions.length === 0) {
        updateScoreUI(0, "Crítico");
        return;
    }

    const totalCurrentPoints = answeredQuestions.reduce((acc, curr) => acc + curr, 0);
    const percentage = Math.round((totalCurrentPoints / totalQuestions) * 100);

    let status = "Crítico";
    if (percentage >= 90) status = "Excelente";
    else if (percentage >= 70) status = "Bom";
    else if (percentage >= 50) status = "Regular";

    updateScoreUI(percentage, status);
}

function updateScoreUI(percentage, status) {
    const scoreLabel = document.getElementById('scoreLabel');
    const statusLabel = document.getElementById('statusLabel');

    if (scoreLabel) scoreLabel.textContent = `${percentage}%`;
    if (statusLabel) statusLabel.textContent = status;
}

// Envio dos dados para a API do Back-end
document.getElementById('auditForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const totalAnswered = scores.filter(score => score !== null).length;
    
    if (totalAnswered < totalQuestions) {
        alert(`Por favor, responda todas as etapas antes de salvar. (${totalAnswered}/${totalQuestions} respondidas)`);
        return;
    }

    const totalCurrentPoints = scores.reduce((acc, curr) => acc + curr, 0);
    const percentage = Math.round((totalCurrentPoints / totalQuestions) * 100);

    const dadosAuditoria = {
        percentualGeral: percentage,
        setorId: 1, 
        detalhes: {
            seiri: scores[0],
            seiton: scores[1],
            seiso: scores[2],
            seiketsu: scores[3],
            shitsuke: scores[4]
        },
        data: new Date().toLocaleDateString('pt-BR')
    };

    try {
        const response = await fetch("http://localhost:3000/api/auditorias", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAuditoria)
        });

        if (response.ok) {
            alert('Auditoria salva com sucesso no Banco de Dados!');
            window.location.href = "dashboard.html"; 
        }
    } catch (error) {
        alert("Erro ao conectar com o servidor para salvar a auditoria.");
    }
});