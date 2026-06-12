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


