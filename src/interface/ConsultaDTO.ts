/**
 * Interface DTO para transferência de dados do Consulta
 */
export interface ConsultaDTO {
    idConsulta?: number;
    idPaciente: number;
    idMedico: number;
    dataHora: Date;
    status?: 'Pendente' | 'Confirmado' | 'Cancelado' | 'Concluido';
    modalidade?: 'Pessoalmente' | 'Telemedicina';
    triagemSintomas: string;
    situacao?: boolean;
}