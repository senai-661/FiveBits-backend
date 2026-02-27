/**
 * Interface DTO para transferência de dados do Consulta
 */
export interface ConsultaDTO {
    idConsulta: number;
    idPaciente?: number;
    idMedico?: number;
    dataHora: Date;
    status?: string;
    modalidade: string;
    triagemSintomas: string;
    situacao?: boolean;
}