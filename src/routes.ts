import type { Request, Response } from "express";
import { Router } from "express";
import PacienteController from "./controller/PacienteController.js";

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

export { router };