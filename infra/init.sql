
CREATE TABLE Paciente (
    id_paciente INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome_paciente VARCHAR(50) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
	telefone VARCHAR (20),
    senha_paciente VARCHAR(255) NOT NULL, 
   	data_nascimento DATE NOT NULL,
    situacao BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Medico(
 	id_medico INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome_medico VARCHAR(50) NOT NULL,
    crm VARCHAR(13) UNIQUE NOT NULL,
    especialidade VARCHAR(100) NOT NULL,
    valor_consulta DECIMAL (6,2) NOT NULL,
	senha_medico VARCHAR (255) NOT NULL,
    situacao BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Consulta (
    id_consulta INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_medico INTEGER NOT NULL,
    data_hora DATE,
    status VARCHAR(50) DEFAULT 'Confirmado',
    modalidade VARCHAR(30) DEFAULT 'Pessoalmente',
    triagem_sintomas VARCHAR(100) NOT NULL,
	FOREIGN KEY (id_paciente) REFERENCES Paciente (id_paciente),
	FOREIGN KEY (id_medico) REFERENCES Medico (id_medico),
    situacao BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO Paciente (nome_paciente, cpf, email, telefone, senha_paciente, data_nascimento) VALUES 
('Ana Beatriz Silva', '12345678901', 'ana.beatriz@gmail.com', '11984521736', '$hoje12', '1990-05-15'),
('Carlos Eduardo Souza', '23456789012', 'carlos.edu@outlook.com', '21972635481', '$Livia@25', '1985-10-20'),
('Mariana Luz Ferreira', '34567890123', 'mari.luz@yahoo.com.br', '31991827364', '$hamburguer', '1992-03-12'),
('Ricardo Alves Pereira', '45678901234', 'ricardo.ap@hotmail.com', '41988223344', '$hot', '1978-07-25'),
('Juliana Costa Moraes', '56789012345', 'ju.moraes@gmail.com', '51981112233', '$dog22', '2000-12-05'),
('Fernando Gomes Lima', '67890123456', 'fernando.g@uol.com.br', '61995556677', 'Pituco98', '1988-01-30'),
('Patrícia Rocha Santos', '78901234567', 'paty.rocha@gmail.com', '71987778899', 'Romeu00', '1995-09-18'),
('Lucas Mendes Vieira', '89012345678', 'lucas.mendes@icloud.com', '81992223311', 'Devsio', '1982-06-14'),
('Beatriz Antunes Melo', '90123456789', 'antunes.bea@gmail.com', '91983334422', 'loinv44', '1991-11-22'),
('Gustavo Henrique Paz', '01234567890', 'gustavo.paz@outlook.com', '48994445566', '09livoii', '1975-04-10');

INSERT INTO Medico (nome_medico, crm, especialidade, valor_consulta, senha_medico) VALUES 
('Dr. Roberto Kalil', 'CRM12345SP', 'Cardiologia', 450.00, 'jioL3'),
('Dra. Ludhmila Hajjar', 'CRM23456SP', 'Cardiologia', 500.00,'Sesi89'),
('Dr. Drauzio Varella', 'CRM34567SP', 'Clínica Geral', 350.00,'Senai987'),
('Dra. Angelita Gama', 'CRM45678SP', 'Coloproctologia', 600.00, 'criativaSenha'),
('Dr. Miguel Srougi', 'CRM56789SP', 'Urologia', 550.00, 'eitaLiv'),
('Dra. Margareth Dalcolmo', 'CRM67890RJ', 'Pneumologia', 400.00, 'ezoN2'),
('Dr. Paulo Niemeyer', 'CRM78901RJ', 'Neurocirurgia', 850.00, 'Jaoliv'),
('Dra. Nise Yamaguchi', 'CRM89012SP', 'Oncologia', 480.00, 'PedroLov'),
('Dr. Fábio Jatene', 'CRM90123SP', 'Cirurgia Cardiovascular', 700.00, '987RR'),
('Dra. Mayana Zatz', 'CRM01234SP', 'Genética Médica', 520.00, 'ty&&7');

INSERT INTO Consulta (id_paciente, id_medico, data_hora, status, modalidade, triagem_sintomas) VALUES 
(1, 1, '2026-02-15', 'Pessoalmente', 'Confirmado', 'Dor no peito e cansaço excessivo'),
(2, 2, '2026-02-16', 'Pessoalmente', 'Pendente', 'Palpitação e tontura'),
(3, 3, '2026-02-17', 'Pessoalmente', 'Confirmado', 'Febre persistente e dor de garganta'),
(4, 4, '2026-02-18', 'Pessoalmente', 'Cancelado', 'Dores abdominais agudas'),
(5, 5, '2026-02-19', 'Pessoalmente', 'Confirmado', 'Dificuldade urinária'),
(6, 6, '2026-02-20', 'Pessoalmente', 'Pendente', 'Falta de ar e tosse seca'),
(7, 7, '2026-02-21', 'Pessoalmente', 'Confirmado', 'Dores de cabeça intensas'),
(8, 8, '2026-02-22', 'Pessoalmente', 'Concluido', 'Acompanhamento de tratamento oncológico'),
(9, 9, '2026-02-23', 'Pessoalmente', 'Confirmado', 'Avaliação pré-operatória cardiovascular'),
(10, 10, '2026-02-24', 'Pessoalmente', 'Confirmado', 'Consulta de rotina genética');
