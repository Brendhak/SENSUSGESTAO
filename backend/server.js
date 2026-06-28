import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
const PORT = 3000;

// Middleware de segurança e leitura de dados
app.use(cors()); 
app.use(express.json());

// ==========================================
// ENDPOINTS: SETORES
// ==========================================

// 1. Listar todos os setores
app.get('/api/setores', (req, res) => {
    db.all("SELECT * FROM setores ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 2. Cadastrar novo setor
app.post('/api/setores', (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ error: "Nome e descrição são obrigatórios." });
    }

    const query = `INSERT INTO setores (name, description, score) VALUES (?, ?, '0%')`;
    db.run(query, [name, description], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            id: this.lastID, 
            name, 
            description, 
            score: '0%' 
        });
    });
});

// 3. Deletar um setor (CORRIGIDO: Agora é uma rota real do Express integrada ao SQLite)
app.delete('/api/setores/:id', (req, res) => {
    const { id } = req.params;
    
    db.run("DELETE FROM setores WHERE id = ?", [id], function (err) {
        if (err) {
            console.error("[SENSUS BANCO] Erro ao deletar:", err.message);
            return res.status(500).json({ error: err.message });
        }
        
        console.log(`[SENSUS BANCO] Setor ID ${id} removido com sucesso.`);
        res.json({ message: "Setor removido com sucesso.", deleyedId: id });
    });
});


// ==========================================
// ENDPOINTS: AUDITORIAS (CHECKLIST & DASHBOARD)
// ==========================================

// 4. Salvar uma nova auditoria e atualizar o Score do respectivo setor automaticamente
app.post('/api/auditorias', (req, res) => {
    const { percentualGeral, detalhes, data, setorId } = req.body;

    if (percentualGeral === undefined || !detalhes) {
        return res.status(400).json({ error: "Dados da auditoria incompletos." });
    }

    const insertAuditoriaQuery = `
        INSERT INTO auditorias (setor_id, percentualGeral, seiri, seiton, seiso, seiketsu, shitsuke, data) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
        setorId || null,
        percentualGeral,
        detalhes.seiri,
        detalhes.seiton,
        detalhes.seiso,
        detalhes.seiketsu,
        detalhes.shitsuke,
        data
    ];

    db.run(insertAuditoriaQuery, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });

        if (setorId) {
            const updateSectorQuery = `UPDATE setores SET score = ? WHERE id = ?`;
            db.run(updateSectorQuery, [`${percentualGeral}%`, setorId]);
        }

        res.status(201).json({ id: this.lastID, message: "Auditoria processada e salva com sucesso!" });
    });
});

// 5. Buscar a última auditoria realizada (Alimenta o topo e textos do Dashboard)
app.get('/api/auditorias/ultima', (req, res) => {
    const query = `
        SELECT a.*, s.name as nome_setor 
        FROM auditorias a 
        LEFT JOIN setores s ON a.setor_id = s.id 
        ORDER BY a.id DESC LIMIT 1
    `;
    
    db.get(query, [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: "Nenhuma auditoria cadastrada no sistema." });
        
        res.json({
            percentualGeral: row.percentualGeral,
            nomeSetor: row.nome_setor || "Geral",
            detalhes: {
                seiri: row.seiri,
                seiton: row.seiton,
                seiso: row.seiso,
                seiketsu: row.seiketsu,
                shitsuke: row.shitsuke
            },
            data: row.data
        });
    });
});

// 6. Buscar TODAS as auditorias (para somar o total real e desenhar o histórico de rendimento)
app.get('/api/auditorias', (req, res) => {
    const query = `
        SELECT percentualGeral, data 
        FROM auditorias 
        ORDER BY id ASC
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 7. Registrar uma nova tarefa baseada em um alerta
app.post('/api/tarefas', (req, res) => {
    const { descricao } = req.body;
    console.log(`[TCC Sensus] Nova tarefa adicionada ao plano de ação: ${descricao}`);
    res.status(201).json({ message: "Tarefa adicionada ao plano de ação com sucesso!" });
});


// ==========================================
// INICIALIZAÇÃO DO SERVIDOR (MUITO IMPORTANTE!)
// ==========================================
app.listen(PORT, () => {
    console.log(`=============================================================`);
    console.log(`  Sensus 5S - API BACK-END ATIVA                           `);
    console.log(`  Endereço local: http://localhost:${PORT}                  `);
    console.log(`=============================================================`);
});