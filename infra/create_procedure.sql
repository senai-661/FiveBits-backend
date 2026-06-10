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

CREATE OR REPLACE PROCEDURE sp_deletar_medico(
    p_id_medico INTEGER
)
LANGUAGE SQL
AS $$
    UPDATE medico 
    SET situacao = FALSE
    WHERE id_medico = p_id_medico;
$$;

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