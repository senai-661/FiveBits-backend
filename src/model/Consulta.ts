import { DatabaseModel } from "./DatabaseModel.js"; // Importa a classe de conexão
import type { ConsultaDTO } from "../interface/ConsultaDTO.js";

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

    constructor(
        _dataHora: Date,
        _modalidade: string,
        _triagemSintomas: string,
        _status?: string,
        _situacao?: boolean
    ) {
        this.dataHora = _dataHora;
        this.modalidade = _modalidade;
        this.triagemSintomas = _triagemSintomas;
        this.status = _status || "";
        this.situacao = _situacao || false;
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

    public getStatus(): string {
        return this.status;
    }
    public setStatus(_status: string): void {
        this.status = _status;
    }

    public getDataHora(): Date {
        return this.dataHora;
    }
    public setDataHora(_dataHora: Date): void {
        this.dataHora = _dataHora;
    }

    public getSituacao(): boolean {
        return this.situacao;
    }
    public setSituacao(_situacao: boolean): void {
        this.situacao = _situacao;
    }

    static async cadastrarConsulta(Consulta: ConsultaDTO): Promise<boolean> {
        try {
            const queryInsertConsulta = `INSERT INTO Consulta (id_paciente, id_medico, data_hora, status, modalidade, triagem_sintomas) VALUES 
                                           ($1, $2, $3, $4, $5, $6) RETURNING id_consulta;`;

            const respostaBD = await database.query(queryInsertConsulta, [
                Consulta.idPaciente,
                Consulta.idMedico,
                Consulta.dataHora,
                Consulta.modalidade,
                Consulta.status,
                Consulta.triagemSintomas,
                Consulta.situacao
            ]);

            if (respostaBD.rows.length > 0) {
                console.info(`Consulta agendada com sucesso. ID: ${respostaBD.rows[0].id_consulta}.`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro na consulta ao banco de dados. ${error}`);
            return false;
        }
    }

    static async listarConsultas(): Promise<Array<Consulta> | null> {
        try {
            let listaConsultas: Array<Consulta> = [];
            // Regra da Sprint: Ordem Alfabética para entidades principais
            const querySelectConsulta = `SELECT * FROM Consulta WHERE situacao=TRUE;`;
            const respostaBD = await database.query(querySelectConsulta);

            respostaBD.rows.forEach((consultaBD) => {
                const novo = new Consulta(
                    consultaBD.dataHora,
                    consultaBD.modalidade,
                    consultaBD.triagemSintomas,
                    consultaBD.status,
                    consultaBD.situacao
                );

                novo.setIdConsulta(consultaBD.id_consulta);
                novo.setIdPaciente(consultaBD.id_paciente);
                novo.setIdMedico(consultaBD.id_medico);
                listaConsultas.push(novo);
            });

            return listaConsultas;
        } catch (error) {
            console.error(`Erro ao listar consultas: ${error}`);
            return null;
        }
    }

    static async listarConsulta(idConsulta: number): Promise<Consulta | null> {
        try {
            const querySelectConsulta = `SELECT * FROM Consulta WHERE id_Consulta=$1 AND situacao=TRUE;`;

            const respostaBD = await database.query(querySelectConsulta, [idConsulta]);

            const novaConsulta: Consulta = new Consulta(
                respostaBD.rows[0].dataHora,
                respostaBD.rows[0].modalidade,
                respostaBD.rows[0].triagemSintomas,
                respostaBD.rows[0].status,
                respostaBD.rows[0].situacao
            );

            novaConsulta.setIdConsulta(respostaBD.rows[0].id_consulta);
            novaConsulta.setIdMedico(respostaBD.rows[0].id_medico);
            novaConsulta.setIdPaciente(respostaBD.rows[0].id_paciente);

            return novaConsulta;
        } catch (error) {
            console.error(`Erro ao buscar consulta no banco de dados. ${error}`);
            return null;
        }
    }
}

export default Consulta;