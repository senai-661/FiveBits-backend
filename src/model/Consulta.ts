import { DatabaseModel } from "./DatabaseModel.js"; // Importa a classe de conexão
import type { ConsultaDTO } from "../interface/ConsultaDTO.js"; // Importa a interface DTO da consulta

const database = new DatabaseModel().pool; // Inicializa o pool

class Consulta {
    private idConsulta: number = 0;
    private idPaciente: number = 0;
    private idMedico: number = 0;
    private dataHora: Date;
    private status: string;
    private modalidade: string;
    private triagemSintomas: string;
    private situacao: boolean = true

    // Constructor da Classe Consulta
    constructor(
        _dataHora: Date,
        _modalidade: string,
        _triagemSintomas: string,
        _idPaciente?: number, // ? = Opcional
        _idMedico?: number, // ? = Opcional
        _status?: string, // ? = Opcional
        _situacao?: boolean // ? = Opcional
    ) {
        this.dataHora = _dataHora;
        this.idPaciente = _idPaciente || 0; // Opcional
        this.idMedico = _idMedico || 0; // Opcional
        this.status = _status || ""; // Opcional
        this.modalidade = _modalidade;
        this.triagemSintomas = _triagemSintomas;
        this.situacao = _situacao || false; // Opcional
    }

    // Métodos GET e SET (Encapsulamento)
    public getIdConsulta(): number {
        return this.idConsulta;
    }
    public setIdConsulta(_idConsulta: number): void {
        this.idConsulta = _idConsulta;
    }

    public getIdPaciente(): number {
        return this.idPaciente;
    }
    public setIdPaciente(idPaciente: number): void {
        this.idPaciente = idPaciente;
    }

    public getIdMedico(): number {
        return this.idMedico;
    }
    public setIdMedico(_idMedico: number): void {
        this.idMedico = _idMedico;
    }

    public getDataHora(): Date {
        return this.dataHora;
    }
    public setDataHora(_dataHora: Date): void {
        this.dataHora = _dataHora;
    }

    public getStatus(): string {
        return this.status;
    }
    public setStatus(_status: string): void {
        this.status = _status;
    }

    public getModalidade(): string {
        return this.modalidade;
    }
    public setModalidade(_modalidade: string): void {
        this.modalidade = _modalidade;
    }

    public getTriagemSintomas(): string {
        return this.triagemSintomas;
    }
    public setTriagemSintomas(_triagemSintomas: string): void {
        this.triagemSintomas = _triagemSintomas;
    }

    public getSituacao(): boolean {
        return this.situacao;
    }
    public setSituacao(_situacao: boolean): void {
        this.situacao = _situacao;
    }

    // Cadastra uma Consulta no banco de dados
    static async cadastrarConsulta(Consulta: ConsultaDTO): Promise<boolean> {
        try {
            const queryInsertConsulta = `CALL sp_agendar_consulta($1, $2, $3, $4, $5, $6);`;

            const valores = [
                Consulta.paciente.idPaciente,
                Consulta.medico.idMedico,
                // garante que seja timestamp compatível
                Consulta.dataHora ? new Date(Consulta.dataHora) : null,
                Consulta.modalidade,
                Consulta.triagemSintomas,
                Consulta.status ?? 'Pendente'
            ];

            // A procedure lança exceções em caso de erro (FK, conflito, etc.).
            await database.query(queryInsertConsulta, valores);

            console.info(`Consulta agendada com sucesso.`);
            return true;
        } catch (error) {
            console.error(`Erro na consulta ao banco de dados. ${error}`);
            return false;
        }
    }

    // Lista todas as Consultas com dados relacionados de Paciente e Médico
    static async listarConsultas(): Promise<Array<ConsultaDTO> | null> {
        try {
            let listaConsultas: Array<ConsultaDTO> = [];
            const querySelectConsulta = `
                SELECT *
                FROM vw_consultas_detalhes
                ORDER BY paciente_nome ASC, medico_nome ASC;
            `;
            const respostaBD = await database.query(querySelectConsulta);

            respostaBD.rows.forEach((consultaBD) => {
                const novo: ConsultaDTO = {
                    idConsulta: consultaBD.id_consulta,
                    dataHora: new Date(consultaBD.data_hora),
                    status: consultaBD.status,
                    modalidade: consultaBD.modalidade,
                    triagemSintomas: consultaBD.triagem_sintomas,
                    situacao: consultaBD.situacao,
                    paciente: {
                        idPaciente: consultaBD.id_paciente,
                        nomePaciente: consultaBD.paciente_nome,
                        cpf: consultaBD.paciente_cpf,
                        telefone: consultaBD.paciente_telefone || "",
                        dataNascimento: new Date(consultaBD.paciente_data_nascimento),
                        situacao: consultaBD.paciente_situacao
                    },
                    medico: {
                        idMedico: consultaBD.id_medico,
                        nomeMedico: consultaBD.medico_nome,
                        crm: consultaBD.medico_crm,
                        especialidade: consultaBD.medico_especialidade,
                        valorConsulta: Number(consultaBD.medico_valor_consulta),
                        situacao: consultaBD.medico_situacao
                    }
                };

                listaConsultas.push(novo);
            });

            return listaConsultas;
        } catch (error) {
            console.error(`Erro ao listar consultas: ${error}`);
            return null;
        }
    }

    // Lista uma consulta pelo ID com dados relacionados de Paciente e Médico
    static async listarConsulta(idConsulta: number): Promise<ConsultaDTO | null> {
        try {
            const querySelectConsulta = `
                SELECT *
                FROM vw_consultas_detalhes
                WHERE id_consulta = $1;
            `;

            const respostaBD = await database.query(querySelectConsulta, [idConsulta]);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const consultaBD = respostaBD.rows[0];

            const consulta: ConsultaDTO = {
                idConsulta: consultaBD.id_consulta,
                dataHora: new Date(consultaBD.data_hora),
                status: consultaBD.status,
                modalidade: consultaBD.modalidade,
                triagemSintomas: consultaBD.triagem_sintomas,
                situacao: consultaBD.situacao,
                paciente: {
                    idPaciente: consultaBD.id_paciente,
                    nomePaciente: consultaBD.paciente_nome,
                    cpf: consultaBD.paciente_cpf,
                    telefone: consultaBD.paciente_telefone || "",
                    dataNascimento: new Date(consultaBD.paciente_data_nascimento),
                    situacao: consultaBD.paciente_situacao
                },
                medico: {
                    idMedico: consultaBD.id_medico,
                    nomeMedico: consultaBD.medico_nome,
                    crm: consultaBD.medico_crm,
                    especialidade: consultaBD.medico_especialidade,
                    valorConsulta: Number(consultaBD.medico_valor_consulta),
                    situacao: consultaBD.medico_situacao
                }
            };

            return consulta;
        } catch (error) {
            console.error(`Erro ao buscar consulta no banco de dados. ${error}`);
            return null;
        }
    }

    static async deletarConsulta(idConsulta: number): Promise<boolean> {
        try {
            const queryDeleteConsulta = `CALL sp_cancelar_consulta($1);`;

            await database.query(queryDeleteConsulta, [idConsulta]);

            console.info(`Consulta removida com sucesso`);
            return true;
        } catch (error) {
            console.error(`Erro ao remover Consulta do banco de dados. ${error}`);
            return false;
        }
    }
    static async atualizarConsulta(consulta: Consulta): Promise<boolean> {
    let conexao: any;

    try {
        conexao = await database.connect(); 

        const sql = `CALL sp_atualizar_consulta($1, $2, $3, $4, $5, $6);`;

        const valores = [
            // 1: id_consulta
            consulta.getIdConsulta(),
            // 2: id_medico (pode ser null para manter)
            consulta.getIdMedico() || null,
            // 3: status (pode ser null)
            consulta.getStatus() || null,
            // 4: data_hora (pode ser null)
            consulta.getDataHora() || null,
            // 5: modalidade (pode ser null)
            consulta.getModalidade() || null,
            // 6: triagem_sintomas (pode ser null)
            consulta.getTriagemSintomas() || null
        ];

        const consultaExistente = await conexao.query(
            `SELECT 1 FROM consulta WHERE id_consulta = $1 AND situacao = TRUE`,
            [consulta.getIdConsulta()]
        );

        if (consultaExistente.rowCount === 0) {
            return false;
        }

        await conexao.query(sql, valores);

        return true;

    } catch (error) {
        console.error(`[MODEL ERROR]: Falha ao atualizar consulta no banco: ${error}`);
        throw error;
    } finally {
        if (conexao) {
            conexao.release();
        }
    }
}
}

export default Consulta;