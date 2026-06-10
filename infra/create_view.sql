-- ==========================================
-- CRIAÇÃO DAS VIEWS DO BANCO DE DADOS
-- ==========================================

-- 1. View para Pacientes Ativos
CREATE OR REPLACE VIEW vw_pacientes AS
SELECT
    id_paciente,
    nome,
    cpf,
    telefone,
    data_nascimento,
    situacao
FROM Paciente
WHERE situacao = TRUE;

-- 2. View para Médicos Ativos
CREATE OR REPLACE VIEW vw_medicos AS
SELECT
    id_medico,
    nome,
    crm,
    especialidade,
    valor_consulta,
    situacao
FROM Medico
WHERE situacao = TRUE;

-- 3. View para Detalhes de Consultas Ativas
CREATE OR REPLACE VIEW vw_consultas_detalhes AS
SELECT
    c.id_consulta,
    c.data_hora,
    c.modalidade,
    c.triagem_sintomas,
    c.status,
    c.situacao,
    c.id_paciente,
    c.id_medico,
    p.nome AS paciente_nome,
    p.cpf AS paciente_cpf,
    p.telefone AS paciente_telefone,
    p.data_nascimento AS paciente_data_nascimento,
    p.situacao AS paciente_situacao,
    m.nome AS medico_nome,
    m.crm AS medico_crm,
    m.especialidade AS medico_especialidade,
    m.valor_consulta AS medico_valor_consulta,
    m.situacao AS medico_situacao
FROM Consulta c
JOIN Paciente p ON p.id_paciente = c.id_paciente AND p.situacao = TRUE
JOIN Medico m ON m.id_medico = c.id_medico AND m.situacao = TRUE
WHERE c.situacao = TRUE;

-- 4. View Geral de Usuários (sem a coluna de senha por motivos de segurança)
CREATE OR REPLACE VIEW vw_usuarios AS
SELECT
    u.id_usuario AS id,
    COALESCE(m.nome, p.nome) AS nome,
    u.email,
    u.role,
    u.id_medico,
    u.id_paciente,
    u.situacao
FROM Usuario u
LEFT JOIN Medico m ON u.id_medico = m.id_medico
LEFT JOIN Paciente p ON u.id_paciente = p.id_paciente;

-- 5. View Específica para Autenticação (contém a coluna senha necessária para login)
CREATE OR REPLACE VIEW vw_autenticacao AS
SELECT
    u.id_usuario AS id,
    COALESCE(m.nome, p.nome) AS nome,
    u.email,
    u.senha,
    u.role,
    u.situacao
FROM Usuario u
LEFT JOIN Medico m ON u.id_medico = m.id_medico
LEFT JOIN Paciente p ON u.id_paciente = p.id_paciente;
