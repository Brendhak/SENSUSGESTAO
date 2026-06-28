import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite (database.db).');
    }
});

db.serialize(() => {
    // 1. Criação da Tabela de Setores
    db.run(`
        CREATE TABLE IF NOT EXISTS setores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            score TEXT DEFAULT '0%'
        )
    `, (err) => {
        if (!err) {
            // Se a tabela estiver vazia, insere os dois setores padrão do sistema
            db.get("SELECT COUNT(*) as count FROM setores", [], (err, row) => {
                if (row && row.count === 0) {
                    const stmt = db.prepare("INSERT INTO setores (name, description, score) VALUES (?, ?, ?)");
                    stmt.run("Almoxarifado Geral", "Espaço físico de armazenamento de insumos. Exige atenção estrita aos sensos Seiri e Seiton.", "85%");
                    stmt.run("Escritório Administrativo", "Área de computadores e arquivos digitais. Foco na eliminação de excesso de papelada (Seiri).", "40%");
                    stmt.finalize();
                }
            });
        }
    });

    // 2. Criação da Tabela de Auditorias (Histórico do Checklist)
    db.run(`
        CREATE TABLE IF NOT EXISTS auditorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            setor_id INTEGER,
            percentualGeral INTEGER NOT NULL,
            seiri INTEGER NOT NULL,
            seiton INTEGER NOT NULL,
            seiso INTEGER NOT NULL,
            seiketsu INTEGER NOT NULL,
            shitsuke INTEGER NOT NULL,
            data TEXT NOT NULL,
            FOREIGN KEY (setor_id) REFERENCES setores(id) ON DELETE SET NULL
        )
    `);
});

export default db;