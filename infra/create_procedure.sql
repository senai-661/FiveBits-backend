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
LANGUAGE SQL
AS $$
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
    
-- 4. Procedure para Cadastrar Medico    
CREATE OR REPLACE PROCEDURE sp_cadastrar_medico(
    nome VARCHAR (50),
    crm VARCHAR (13),
    especialidade VARCHAR (100),
	valor_consulta DECIMAL (6,2)
)
LANGUAGE SQL
AS $$
    INSERT INTO medico (
        nome,
        crm,
        especialidade,
        valor_consulta
    )
    VALUES (
        nome,
        crm,
        especialidade,
        valor_consulta
    );
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