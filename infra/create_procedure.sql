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


CREATE OR REPLACE PROCEDURE sp_deletar_paciente(
    p_id INTEGER
)
LANGUAGE SQL
AS $$
    UPDATE Paciente
    SET situacao = FALSE
    WHERE id_paciente = p_id;
$$;


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