/**
 * Interface DTO para transferência de dados do Paciente
 */
export interface PacienteDTO {
    nome: string;
    cpf: string;
    email: string;
    senha: string;
    dataNascimento: Date;
    telefone?: string;
    situacao?: boolean
}
