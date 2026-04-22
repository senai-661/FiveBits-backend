/**
 * Interface DTO para transferência de dados do Paciente
 */
export interface PacienteDTO {
    idPaciente?: number;
    nome: string;
    cpf: string;
    telefone?: string;
    dataNascimento: Date;
    situacao?: boolean;
}