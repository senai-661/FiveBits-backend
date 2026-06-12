import type { Request, Response } from "express";
import { Router } from "express";
// Importa o controller de cada classe
import PacienteController from "./controller/PacienteController.js";
import MedicoController from "./controller/MedicoController.js";
import ConsultaController from "./controller/ConsultaController.js";
import { Auth } from "./middlewares/Auth.js";

const router = Router();

/**
 * Rota raiz da API para teste de conexão
 */
router.get("/api", (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "Olá, seja bem-vindo ao sistema MedFlow!" });
});

/**
 * Endpoints (rotas) para Paciente
 * Seguindo as regras da Sprint: substantivos no plural e letras minúsculas.
 */

// Retorna a lista com todos os pacientes (Ordem Alfabética)
router.get("/api/pacientes", Auth.verifyToken ,PacienteController.todos);
// Insere um novo paciente no banco de dados (rota pública para registro)
router.post("/api/pacientes", PacienteController.novo);
// Retorna o paciente pelo ID
router.get("/api/pacientes/:idPaciente", Auth.verifyToken ,PacienteController.paciente);
// Deleta o paciente pelo ID
router.delete("/api/pacientes/:idPaciente", Auth.verifyToken ,PacienteController.remover);
// Atualiza um paciente pelo ID
router.put("/api/pacientes/:idPaciente", Auth.verifyToken ,PacienteController.atualizar);


// Retorna a lista com todos os médicos (Ordem Alfabética)
router.get("/api/medicos", Auth.verifyToken ,MedicoController.todos);
// Insere um novo médico no banco de dados
router.post("/api/medicos", Auth.verifyToken ,MedicoController.novo);
// Retorna o médico pelo ID
router.get("/api/medicos/:idMedico", Auth.verifyToken ,MedicoController.medico);
// Deleta o médico pelo ID
router.delete("/api/medicos/:idMedico", Auth.verifyToken ,MedicoController.remover);
// Atualiza um médico pelo ID
router.put("/api/medicos/:idMedico", Auth.verifyToken ,MedicoController.atualizar);

// Retorna a lista com todas as consultas
router.get("/api/consultas", Auth.verifyToken ,ConsultaController.todos);
// Cadastra uma nova consulta
router.post("/api/consultas", Auth.verifyToken ,ConsultaController.novo);
// Retorna a consulta pelo ID
router.get("/api/consultas/:idConsulta", Auth.verifyToken ,ConsultaController.consulta);
// Deleta uma consulta pelo ID
router.delete("/api/consultas/:idConsulta", Auth.verifyToken ,ConsultaController.remover);
// Atualiza uma consulta pelo ID
router.put("/api/consultas/:idConsulta",  Auth.verifyToken ,ConsultaController.atualizar);


router.post('/api/login', Auth.validacaoUsuario);

export { router };