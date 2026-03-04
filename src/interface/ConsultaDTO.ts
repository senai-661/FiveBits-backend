/**
 * Interface DTO para transferência de dados do Consulta
 */
export interface ConsultaDTO {
    idConsulta: number;
    idPaciente?: number; // Opcional
    idMedico?: number; // Opcional
    dataHora: Date;
    status?: string; // Opcional
    modalidade: string;
    triagemSintomas: string;
    situacao?: boolean; // Opcional
}