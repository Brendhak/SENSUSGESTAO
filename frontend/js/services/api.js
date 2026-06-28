// Definição da URL base do seu servidor Node.js/Express
// Quando estiver rodando localmente, geralmente usa a porta 3000 ou 5000
const API_URL = 'http://localhost:3000/api';

/**
 * Serviço de Autenticação (Login)
 */
async function loginAuditor(email, senha) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });
        
        if (!response.ok) throw new Error('Falha na autenticação');
        
        const data = await response.json();
        // Salva o token de segurança no navegador (caso use JWT no back-end)
        if (data.token) localStorage.setItem('token_sensus5s', data.token);
        
        return data;
    } catch (error) {
        console.error('Erro no serviço de login:', error);
        throw error;
    }
}

/**
 * Serviços do Módulo de Setores
 */
async function buscarSetores() {
    try {
        const response = await fetch(`${API_URL}/setores`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token_sensus5s')}`
            }
        });
        if (!response.ok) throw new Error('Erro ao buscar setores');
        return await response.json();
    } catch (error) {
        console.error('Erro ao listar setores:', error);
        throw error;
    }
}

async function cadastrarSetor(nome_setor, descricao) {
    try {
        const response = await fetch(`${API_URL}/setores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token_sensus5s')}`
            },
            body: JSON.stringify({ nome_setor, descricao })
        });
        if (!response.ok) throw new Error('Erro ao cadastrar setor');
        return await response.json();
    } catch (error) {
        console.error('Erro ao criar setor:', error);
        throw error;
    }
}

async function deletarSetor(id_setor) {
    try {
        const response = await fetch(`${API_URL}/setores/${id_setor}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token_sensus5s')}`
            }
        });
        if (!response.ok) throw new Error('Erro ao deletar setor');
        return await response.json();
    } catch (error) {
        console.error('Erro ao remover setor:', error);
        throw error;
    }
}

/**
 * Serviços do Módulo de Auditorias e Dashboards
 */
async function salvarAuditoria(id_setor, id_usuario_auditor, respostas) {
    try {
        const response = await fetch(`${API_URL}/auditorias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token_sensus5s')}`
            },
            body: JSON.stringify({ id_setor, id_usuario_auditor, respostas })
        });
        if (!response.ok) throw new Error('Erro ao salvar dados da auditoria');
        return await response.json();
    } catch (error) {
        console.error('Erro ao processar auditoria:', error);
        throw error;
    }
}

async function buscarDadosDashboard() {
    try {
        const response = await fetch(`${API_URL}/auditorias/dashboard`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token_sensus5s')}`
            }
        });
        if (!response.ok) throw new Error('Erro ao alimentar dashboard');
        return await response.json();
    } catch (error) {
        console.error('Erro no serviço do dashboard:', error);
        throw error;
    }
}