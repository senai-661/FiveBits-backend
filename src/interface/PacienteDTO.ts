/**
 * Interface DTO para transferência de dados do Paciente
 */
export interface PacienteDTO {
    idPaciente: number;
    nome: string;
    cpf: string;
    email: string;
    telefone?: string; // Opcional
    senha: string;
    dataNascimento: Date;
    situacao?: boolean // Opcional
}