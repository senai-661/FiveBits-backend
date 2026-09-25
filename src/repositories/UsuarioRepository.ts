import { DatabaseModel } from "../model/DatabaseModel.js";
import type { UsuarioRole } from "../interface/UsuarioDTO.js";

// Interface para tipar o retorno do usuário no banco
export interface UsuarioAutenticacao {
    id: number;
    nome: string;
    email: string;
    senha?: string;
    role: UsuarioRole;
    situacao: boolean;
}

export class UsuarioRepository {
    private pool = new DatabaseModel().pool;

    /**
     * Busca o registro de autenticação pelo e-mail na view vw_autenticacao
     * @param email Email do usuário
     * @returns Dados do usuário se encontrado, ou null
     */
    async findByEmail(email: string): Promise<UsuarioAutenticacao | null> {
        const query = `
            SELECT
                id,
                nome,
                email,
                senha,
                role,
                situacao
            FROM vw_autenticacao
            WHERE email = $1;
        `;

        const result = await this.pool.query(query, [email]);

        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0] as UsuarioAutenticacao;
    }
}