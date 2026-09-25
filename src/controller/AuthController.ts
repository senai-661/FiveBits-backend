import type { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";
import type { LoginDTO } from "../interface/UsuarioDTO.js";

const authService = new AuthService();

export class AuthController {
    /**
     * Endpoint POST /api/login
     */
    static async login(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.body) {
                return res.status(400).json({ message: "Corpo da requisição é obrigatório" });
            }

            const credenciais = req.body as LoginDTO;
            const resultado = await authService.autenticar(credenciais);

            return res.status(resultado.status).json(resultado.data);
        } catch (error) {
            console.error(`Erro durante autenticação: ${error}`);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}