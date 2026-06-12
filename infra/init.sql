-- ==========================================
-- 1. LIMPEZA DO BANCO DE DADOS (DROPS)
-- A ordem deve respeitar as dependências (tabelas com FKs primeiro)
-- ==========================================
DROP TABLE IF EXISTS Consulta CASCADE;
DROP TABLE IF EXISTS Usuario CASCADE;
DROP TABLE IF EXISTS Medico CASCADE;
DROP TABLE IF EXISTS Paciente CASCADE;


-- ==========================================
-- 2. CRIAÇÃO DAS TABELAS (DDL)
-- ==========================================

-- Tabela Paciente (Sem email/senha, focado apenas em dados pessoais)
CREATE TABLE Paciente (
    id_paciente INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    cpf CHAR(11) UNIQUE NOT NULL, 
    telefone VARCHAR(20),
    data_nascimento DATE NOT NULL,
    situacao BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabela Medico (Sem email/senha, focado apenas em dados profissionais)
CREATE TABLE Medico(
    id_medico INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    crm VARCHAR(13) UNIQUE NOT NULL,
    especialidade VARCHAR(100) NOT NULL,
    valor_consulta DECIMAL(6,2) NOT NULL,
    situacao BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabela Usuario (Centraliza a autenticação e autorização)
CREATE TABLE Usuario (
    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'MEDICO', 'PACIENTE')),
    id_medico INTEGER,
    id_paciente INTEGER,
    situacao BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_medico) REFERENCES Medico (id_medico),
    FOREIGN KEY (id_paciente) REFERENCES Paciente (id_paciente),
    -- Restrição para garantir que um usuário não seja médico e paciente ao mesmo tempo
    CHECK (
        (role = 'ADMIN' AND id_medico IS NULL AND id_paciente IS NULL) OR
        (role = 'MEDICO' AND id_medico IS NOT NULL AND id_paciente IS NULL) OR
        (role = 'PACIENTE' AND id_paciente IS NOT NULL AND id_medico IS NULL)
    )
);

-- Tabela Consulta 
CREATE TABLE Consulta (
    id_consulta INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_medico INTEGER NOT NULL,
    data_hora TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'Confirmado' CHECK (status IN ('Pendente', 'Confirmado', 'Cancelado', 'Concluido')),
    modalidade VARCHAR(30) DEFAULT 'Pessoalmente' CHECK (modalidade IN ('Pessoalmente', 'Telemedicina')),
    triagem_sintomas VARCHAR(100) NOT NULL,
    situacao BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_paciente) REFERENCES Paciente (id_paciente),
    FOREIGN KEY (id_medico) REFERENCES Medico (id_medico)
);


-- ==========================================
-- 3. INSERÇÃO DOS DADOS (DML)
-- ==========================================

-- Inserindo os Pacientes
INSERT INTO Paciente (nome, cpf, telefone, data_nascimento) VALUES 
('Ana Beatriz Silva', '12345678901', '11984521736', '1990-05-15'),
('Carlos Eduardo Souza', '23456789012', '21972635481', '1985-10-20'),
('Mariana Luz Ferreira', '34567890123', '31991827364', '1992-03-12'),
('Ricardo Alves Pereira', '45678901234', '41988223344', '1978-07-25'),
('Juliana Costa Moraes', '56789012345', '51981112233', '2000-12-05'),
('Fernando Gomes Lima', '67890123456', '61995556677', '1988-01-30'),
('Patrícia Rocha Santos', '78901234567', '71987778899', '1995-09-18'),
('Lucas Mendes Vieira', '89012345678', '81992223311', '1982-06-14'),
('Beatriz Antunes Melo', '90123456789', '91983334422', '1991-11-22'),
('Gustavo Henrique Paz', '01234567890', '48994445566', '1975-04-10');

-- Inserindo os Médicos
INSERT INTO Medico (nome, crm, especialidade, valor_consulta) VALUES 
('Dr. Roberto Kalil', 'CRM12345SP', 'Cardiologia', 450.00),
('Dra. Ludhmila Hajjar', 'CRM23456SP', 'Cardiologia', 500.00),
('Dr. Drauzio Varella', 'CRM34567SP', 'Clínica Geral', 350.00),
('Dra. Angelita Gama', 'CRM45678SP', 'Coloproctologia', 600.00),
('Dr. Miguel Srougi', 'CRM56789SP', 'Urologia', 550.00),
('Dra. Margareth Dalcolmo', 'CRM67890RJ', 'Pneumologia', 400.00),
('Dr. Paulo Niemeyer', 'CRM78901RJ', 'Neurocirurgia', 850.00),
('Dra. Nise Yamaguchi', 'CRM89012SP', 'Oncologia', 480.00),
('Dr. Fábio Jatene', 'CRM90123SP', 'Cirurgia Cardiovascular', 700.00),
('Dra. Mayana Zatz', 'CRM01234SP', 'Genética Médica', 520.00);

-- Inserindo os Usuários de acesso (vinculando com as tabelas acima)
-- Para os Pacientes (IDs de 1 a 10)
INSERT INTO Usuario (email, senha, role, id_paciente) VALUES
('ana.beatriz@gmail.com', '$hoje12', 'PACIENTE', 1),
('carlos.edu@outlook.com', '$Livia@25', 'PACIENTE', 2),
('mari.luz@yahoo.com.br', '$hamburguer', 'PACIENTE', 3),
('ricardo.ap@hotmail.com', '$hot', 'PACIENTE', 4),
('ju.moraes@gmail.com', '$dog22', 'PACIENTE', 5),
('fernando.g@uol.com.br', 'Pituco98', 'PACIENTE', 6),
('paty.rocha@gmail.com', 'Romeu00', 'PACIENTE', 7),
('lucas.mendes@icloud.com', 'Devsio', 'PACIENTE', 8),
('antunes.bea@gmail.com', 'loinv44', 'PACIENTE', 9),
('gustavo.paz@outlook.com', '09livoii', 'PACIENTE', 10);

-- Para os Médicos (IDs de 1 a 10)
INSERT INTO Usuario (email, senha, role, id_medico) VALUES
('roberto.kalil@hospital.com', 'jioL3', 'MEDICO', 1),
('ludhmila.hajjar@hospital.com', 'Sesi89', 'MEDICO', 2),
('drauzio.varella@hospital.com', 'Senai987', 'MEDICO', 3),
('angelita.gama@hospital.com', 'criativaSenha', 'MEDICO', 4),
('miguel.srougi@hospital.com', 'eitaLiv', 'MEDICO', 5),
('margareth.dalcolmo@hospital.com', 'ezoN2', 'MEDICO', 6),
('paulo.niemeyer@hospital.com', 'Jaoliv', 'MEDICO', 7),
('nise.yamaguchi@hospital.com', 'PedroLov', 'MEDICO', 8),
('fabio.jatene@hospital.com', '987RR', 'MEDICO', 9),
('mayana.zatz@hospital.com', 'ty&&7', 'MEDICO', 10);

-- Inserindo as Consultas
INSERT INTO Consulta (id_paciente, id_medico, data_hora, status, modalidade, triagem_sintomas) VALUES 
(1, 1, '2026-02-15 14:30:00', 'Confirmado',  'Pessoalmente', 'Dor no peito e cansaço excessivo'),
(2, 2, '2026-02-16 09:20:00', 'Pendente', 'Pessoalmente', 'Palpitação e tontura'),
(3, 3, '2026-02-17 21:00:00', 'Confirmado', 'Pessoalmente', 'Febre persistente e dor de garganta'),
(4, 4, '2026-02-18 08:50:00', 'Cancelado', 'Pessoalmente', 'Dores abdominais agudas'),
(5, 5, '2026-02-19 15:10:00', 'Confirmado', 'Pessoalmente', 'Dificuldade urinária'),
(6, 6, '2026-02-20 17:30:00', 'Pendente', 'Pessoalmente', 'Falta de ar e tosse seca'),
(7, 7, '2026-02-21 10:40:00', 'Confirmado', 'Pessoalmente', 'Dores de cabeça intensas'),
(8, 8, '2026-02-22 19:00:00', 'Concluido', 'Pessoalmente', 'Acompanhamento de tratamento oncológico'),
(9, 9, '2026-02-23 16:30:00', 'Confirmado', 'Pessoalmente', 'Avaliação pré-operatória cardiovascular'),
(10, 10, '2026-02-24 11:30:00', 'Confirmado', 'Pessoalmente', 'Consulta de rotina genética');

-- Inserindo o Admin
INSERT INTO Usuario (email, senha, role) VALUES
('admin@email.com', 'admin', 'ADMIN');

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

-- ==========================================
-- CRIAÇÃO DAS PROCEDURE DO BANCO DE DADOS
-- ==========================================

-- 1. Procedure para Cadastrar Pacientes
CREATE OR REPLACE PROCEDURE sp_cadastrar_paciente(
    p_nome          VARCHAR(50),   
    p_cpf           CHAR(11),      
    p_telefone      VARCHAR(20),   
    p_data_nascimento DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Verifica CPF duplicado em pacientes ativos
    IF EXISTS (SELECT 1 FROM paciente WHERE cpf = p_cpf AND situacao = TRUE) THEN
        RAISE EXCEPTION 'CPF já cadastrado.';
    END IF;

    INSERT INTO Paciente (
        nome,
        cpf,
        telefone,
        data_nascimento
    )
    VALUES (
        p_nome,
        p_cpf,
        p_telefone,
        p_data_nascimento
    );

EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'CPF já cadastrado (violação de unicidade).';
END;
$$;

-- 2. Procedure para Deletar Pacientes
CREATE OR REPLACE PROCEDURE sp_deletar_paciente(
    p_id INTEGER
)
LANGUAGE SQL
AS $$
    UPDATE Paciente
    SET situacao = FALSE
    WHERE id_paciente = p_id;
$$;

-- 3. Procedure para Atualizar Pacientes
CREATE OR REPLACE PROCEDURE sp_atualizar_paciente(
    p_id_paciente INTEGER,
    p_nome VARCHAR(50),
    p_cpf VARCHAR(11),
    p_telefone VARCHAR(20),
    p_data_nascimento DATE
)
LANGUAGE SQL
AS $$
    UPDATE Paciente
    SET
        nome = p_nome,
        cpf = p_cpf,
        telefone = p_telefone,
        data_nascimento = p_data_nascimento
    WHERE id_paciente = p_id_paciente;
$$;
    
-- 4. Procedure para Cadastrar Medico    
CREATE OR REPLACE PROCEDURE sp_cadastrar_medico(
    p_nome           VARCHAR(50),
    p_crm            VARCHAR(13),
    p_especialidade  VARCHAR(100),
    p_valor_consulta DECIMAL(6,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO medico (
        nome,
        crm,
        especialidade,
        valor_consulta
    )
    VALUES (
        p_nome,
        p_crm,
        p_especialidade,
        p_valor_consulta
    );
END;
$$;

-- 5. Procedure para Deletar Medico
CREATE OR REPLACE PROCEDURE sp_deletar_medico(
    p_id_medico INTEGER
)
LANGUAGE SQL
AS $$
    UPDATE medico 
    SET situacao = FALSE
    WHERE id_medico = p_id_medico;
$$;

-- 6. Procedure para Atualizar Medico
CREATE OR REPLACE PROCEDURE sp_atualizar_medico(
    p_id_medico     INTEGER,
    p_nome          VARCHAR(50),
    p_crm           VARCHAR(13),
    p_especialidade VARCHAR(100),
    p_valor_consulta DECIMAL(6,2)
)
LANGUAGE SQL
AS $$
    UPDATE medico 
    SET 
        nome           = p_nome, 
        crm            = p_crm, 
        especialidade  = p_especialidade, 
        valor_consulta = p_valor_consulta
    WHERE id_medico = p_id_medico;
$$;

CREATE OR REPLACE PROCEDURE sp_agendar_consulta(
    p_id_paciente      INTEGER,
    p_id_medico        INTEGER,
    p_data_hora        TIMESTAMP,
    p_modalidade       VARCHAR(30),
    p_triagem_sintomas VARCHAR(100),
    p_status           VARCHAR(20) DEFAULT 'Pendente'   -- parâmetro com DEFAULT fica por último
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_status NOT IN ('Pendente', 'Confirmado') THEN
        RAISE EXCEPTION 'Status inválido. Use Pendente ou Confirmado.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM Consulta
        WHERE id_medico = p_id_medico
          AND data_hora = p_data_hora
          AND status NOT IN ('Cancelado')
          AND situacao = TRUE
    ) THEN
        RAISE EXCEPTION 'Médico já possui consulta agendada neste horário.';
    END IF;

    INSERT INTO Consulta (
        id_paciente, id_medico, data_hora, status,
        modalidade, triagem_sintomas, situacao
    )
    VALUES (
        p_id_paciente, p_id_medico, p_data_hora, p_status,
        COALESCE(p_modalidade, 'Pessoalmente'), p_triagem_sintomas, TRUE
    );

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'Paciente ou médico não encontrado.';
END;
$$;


-----------------------------------------------------------------------------



CREATE OR REPLACE PROCEDURE sp_atualizar_consulta(
    p_id_consulta      INTEGER,
    p_id_medico        INTEGER      DEFAULT NULL,   -- novo
    p_status           VARCHAR(20)  DEFAULT NULL,
    p_data_hora        TIMESTAMP    DEFAULT NULL,
    p_modalidade       VARCHAR(30)  DEFAULT NULL,
    p_triagem_sintomas VARCHAR(100) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM Consulta
        WHERE id_consulta = p_id_consulta AND situacao = TRUE
    ) THEN
        RAISE EXCEPTION 'Consulta não encontrada ou inativa. ID: %', p_id_consulta;
    END IF;

    IF EXISTS (
        SELECT 1 FROM Consulta
        WHERE id_consulta = p_id_consulta
          AND status IN ('Concluido', 'Cancelado')
    ) THEN
        RAISE EXCEPTION 'Não é possível alterar uma consulta concluída ou cancelada.';
    END IF;

    IF p_status IS NOT NULL AND p_status NOT IN ('Pendente', 'Confirmado', 'Concluido', 'Cancelado') THEN
        RAISE EXCEPTION 'Status inválido: %. Use Pendente, Confirmado, Concluido ou Cancelado.', p_status;
    END IF;

    -- Verifica se o novo médico existe
    IF p_id_medico IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM Medico WHERE id_medico = p_id_medico
    ) THEN
        RAISE EXCEPTION 'Médico não encontrado. ID: %', p_id_medico;
    END IF;

    -- Verifica conflito de horário do novo médico
    IF p_id_medico IS NOT NULL AND EXISTS (
        SELECT 1 FROM Consulta
        WHERE id_medico = p_id_medico
          AND data_hora = COALESCE(p_data_hora, (SELECT data_hora FROM Consulta WHERE id_consulta = p_id_consulta))
          AND status NOT IN ('Cancelado')
          AND situacao = TRUE
          AND id_consulta <> p_id_consulta
    ) THEN
        RAISE EXCEPTION 'Novo médico já possui consulta agendada neste horário.';
    END IF;

    UPDATE Consulta
    SET
        id_medico        = COALESCE(p_id_medico,        id_medico),
        status           = COALESCE(p_status,           status),
        data_hora        = COALESCE(p_data_hora,        data_hora),
        modalidade       = COALESCE(p_modalidade,       modalidade),
        triagem_sintomas = COALESCE(p_triagem_sintomas, triagem_sintomas)
    WHERE id_consulta = p_id_consulta;

    RAISE NOTICE 'Consulta % atualizada com sucesso.', p_id_consulta;

EXCEPTION
    WHEN check_violation THEN
        RAISE EXCEPTION 'Valor inválido para modalidade.';
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'Médico não encontrado.';
END;
$$;



-----------------------------------------------------------------------------------------



CREATE OR REPLACE PROCEDURE sp_cancelar_consulta(
    p_id_consulta INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Verifica se a consulta existe e está ativa
    IF NOT EXISTS (
        SELECT 1 FROM Consulta
        WHERE id_consulta = p_id_consulta AND situacao = TRUE
    ) THEN
        RAISE EXCEPTION 'Consulta não encontrada ou já inativa. ID: %', p_id_consulta;
    END IF;

    -- Impede cancelar consulta já concluída
    IF EXISTS (
        SELECT 1 FROM Consulta
        WHERE id_consulta = p_id_consulta AND status = 'Concluido'
    ) THEN
        RAISE EXCEPTION 'Não é possível cancelar uma consulta já concluída.';
    END IF;

    -- Impede cancelar consulta já cancelada
    IF EXISTS (
        SELECT 1 FROM Consulta
        WHERE id_consulta = p_id_consulta AND status = 'Cancelado'
    ) THEN
        RAISE EXCEPTION 'Consulta já está cancelada. ID: %', p_id_consulta;
    END IF;

    UPDATE Consulta
    SET
        status   = 'Cancelado',
        situacao = FALSE
    WHERE id_consulta = p_id_consulta;

    RAISE NOTICE 'Consulta % cancelada com sucesso.', p_id_consulta;
END;
$$;

