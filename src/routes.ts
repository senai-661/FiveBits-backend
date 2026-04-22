import type { Request, Response } from "express";
import { Router } from "express";
// Importa o controller de cada classe
import PacienteController from "./controller/PacienteController.js";
import MedicoController from "./controller/MedicoController.js";
import ConsultaController from "./controller/ConsultaController.js";

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
router.get("/api/pacientes", PacienteController.todos);
// Insere um novo paciente no banco de dados
router.post("/api/pacientes", PacienteController.novo);
// Retorna o paciente pelo ID
router.get("/api/pacientes/:idPaciente", PacienteController.paciente);
// Atualiza um paciente pelo ID
router.put("/api/pacientes/:idPaciente", PacienteController.atualizar);


// Retorna a lista com todos os médicos (Ordem Alfabética)
router.get("/api/medicos", MedicoController.todos);
// Insere um novo médico no banco de dados
router.post("/api/medicos", MedicoController.novo);
// Retorna o médico pelo ID
router.get("/api/medicos/:idMedico", MedicoController.medico);
router.put("/api/medicos/:idMedico", MedicoController.atualizar);

// Retorna a lista com todas as consultas
router.get("/api/consultas", ConsultaController.todos);
// Cadastra uma nova consulta
router.post("/api/consultas", ConsultaController.novo);
// Retorna a consulta pelo ID
router.get("/api/consultas/:idConsulta", ConsultaController.consulta)

export { router };