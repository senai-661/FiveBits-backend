/**
 * Interface DTO para transferência de dados do Usuario
 */

export type UsuarioRole = 'ADMIN' | 'MEDICO' | 'PACIENTE';

export interface LoginDTO {
    email: string;
    senha: string;
}

export interface UsuarioLogadoDTO {
    id_usuario: number;
    nome: string;
    email: string;
    role: UsuarioRole;
    situacao: boolean;
}

export interface AuthResponseDTO {
    auth: boolean;
    token: string | null;
    usuario?: UsuarioLogadoDTO;
    message?: string;
}