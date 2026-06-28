CREATE TABLE [empresas] (
  [id_empresa] int PRIMARY KEY IDENTITY(1, 1),
  [razao_social] varchar(150) NOT NULL,
  [cnpj] varchar(18) UNIQUE NOT NULL,
  [data_cadastro] datetime DEFAULT (now())
)
GO

CREATE TABLE [usuarios] (
  [id_usuario] int PRIMARY KEY IDENTITY(1, 1),
  [id_empresa] int NOT NULL,
  [nome] varchar(100) NOT NULL,
  [email] varchar(100) UNIQUE NOT NULL,
  [senha_hash] varchar(255) NOT NULL,
  [perfil] varchar(255) DEFAULT 'COLABORADOR'
)
GO

CREATE TABLE [setores] (
  [id_setor] int PRIMARY KEY IDENTITY(1, 1),
  [id_empresa] int NOT NULL,
  [nome_setor] varchar(100) NOT NULL,
  [descricao] text
)
GO

CREATE TABLE [perguntas_checklist] (
  [id_pergunta] int PRIMARY KEY IDENTITY(1, 1),
  [senso] varchar(255),
  [descricao_pergunta] text NOT NULL
)
GO

CREATE TABLE [auditorias] (
  [id_auditoria] int PRIMARY KEY IDENTITY(1, 1),
  [id_setor] int NOT NULL,
  [id_usuario_auditor] int NOT NULL,
  [data_auditoria] datetime DEFAULT (now()),
  [pontuacao_geral] decimal
)
GO

CREATE TABLE [respostas_auditoria] (
  [id_resposta] int PRIMARY KEY IDENTITY(1, 1),
  [id_auditoria] int NOT NULL,
  [id_pergunta] int NOT NULL,
  [conforme] boolean NOT NULL,
  [observacao] text
)
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'ADMIN ou COLABORADOR',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'usuarios',
@level2type = N'Column', @level2name = 'perfil';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'SEIRI, SEITON, SEISO, SEIKETSU, SHITSUKE',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'perguntas_checklist',
@level2type = N'Column', @level2name = 'senso';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'true = Conforme, false = Não Conforme',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'respostas_auditoria',
@level2type = N'Column', @level2name = 'conforme';
GO

ALTER TABLE [usuarios] ADD FOREIGN KEY ([id_empresa]) REFERENCES [empresas] ([id_empresa]) ON DELETE CASCADE
GO

ALTER TABLE [setores] ADD FOREIGN KEY ([id_empresa]) REFERENCES [empresas] ([id_empresa]) ON DELETE CASCADE
GO

ALTER TABLE [auditorias] ADD FOREIGN KEY ([id_setor]) REFERENCES [setores] ([id_setor]) ON DELETE CASCADE
GO

ALTER TABLE [auditorias] ADD FOREIGN KEY ([id_usuario_auditor]) REFERENCES [usuarios] ([id_usuario])
GO

ALTER TABLE [respostas_auditoria] ADD FOREIGN KEY ([id_auditoria]) REFERENCES [auditorias] ([id_auditoria]) ON DELETE CASCADE
GO

ALTER TABLE [respostas_auditoria] ADD FOREIGN KEY ([id_pergunta]) REFERENCES [perguntas_checklist] ([id_pergunta])
GO
