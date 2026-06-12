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