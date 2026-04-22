/**
 * Interface DTO para transferência de dados do Medico
 */
export interface MedicoDTO {
    idMedico?: number;
    nome: string;
    crm: string;
    especialidade: string;
    valorConsulta: number;
    situacao?: boolean;
}