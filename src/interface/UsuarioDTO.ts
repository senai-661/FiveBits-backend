/**
 * Interface DTO para transferência de dados do Usuario
 */
export interface UsuarioDTO {
    idUsuario?: number;
    email: string;
    senha?: string;
    role: 'ADMIN' | 'MEDICO' | 'PACIENTE';
    idMedico?: number;
    idPaciente?: number;
    situacao?: boolean;
}
