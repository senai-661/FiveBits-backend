-- ==========================================
-- 1. LIMPEZA DO BANCO DE DADOS (DROPS)
-- A ordem deve respeitar as dependências (tabelas com FKs primeiro)
-- ==========================================
DROP TABLE IF EXISTS Consulta;
DROP TABLE IF EXISTS Usuario;
DROP TABLE IF EXISTS Medico;
DROP TABLE IF EXISTS Paciente;


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
