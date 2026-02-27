import { DatabaseModel } from "./DatabaseModel.js"; // Importa a classe de conexão
import { type MedicoDTO } from "../interface/MedicoDTO.js";

const database = new DatabaseModel().pool; // Inicializa o pool

class Medico {
    private idMedico: number = 0;
    private nome: string;
    private crm: string;
    private especialidade: string;
    private valorConsulta: number;
    private senhaMedico: string;
    private situacao: boolean = true;

    constructor(
        _nome: string,
        _crm: string,
        _especialidade: string,
        _valorConsulta: number,
        _senhaMedico: string,
        _situacao?: boolean
    ) {
        this.nome = _nome;
        this.crm = _crm;
        this.especialidade = _especialidade;
        this.valorConsulta = _valorConsulta;
        this.senhaMedico = _senhaMedico;
        this.situacao = _situacao || false;
    }

    // Métodos GET e SET (Encapsulamento)
    public getIdMedico(): number {
        return this.idMedico;
    }
    public setIdMedico(idMedico: number): void {
        this.idMedico = idMedico;
    }

    public getNome(): string {
        return this.nome;
    }
    public setNome(_nome: string): void {
        this.nome = _nome;
    }

    public getCrm(): string {
        return this.crm;
    }
    public setCrm(_crm: string): void {
        this.crm = _crm;
    }

    public getEspecialidade(): string {
        return this.especialidade;
    }
    public setEspecialidade(_especialidade: string): void {
        this.especialidade = _especialidade;
    }

    public getValorConsulta(): number {
        return this.valorConsulta;
    }
    public setValorConsulta(_valorConsulta: number): void {
        this.valorConsulta = _valorConsulta;
    }

    public getSenhaMedico(): string {
        return this.senhaMedico;
    }
    public setSenhaMedico(_senhaMedico: string): void {
        this.senhaMedico = _senhaMedico;
    }

    public getSituacao(): boolean {
        return this.situacao;
    }
    public setSituacao(_situacao: boolean): void {
        this.situacao = _situacao
    }

    static async cadastrarMedico(Medico: MedicoDTO): Promise<boolean> {
        try {
            const queryInsertMedico = `INSERT INTO Medico (nome_medico, crm, especialidade, valor_consulta, senha_medico) VALUES
                                       ($1, $2, $3, $4, $5) RETURNING id_medico;`;

            const respostaBD = await database.query(queryInsertMedico, [
                Medico.nome.toUpperCase(),
                Medico.crm,
                Medico.especialidade,
                Medico.valorConsulta,
                Medico.senhaMedico
            ]);

            if (respostaBD.rows.length > 0) {
                console.info(`Medico cadastrado com sucesso. ID: ${respostaBD.rows[0].id_medico}.`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro na consulta ao banco de dados. ${error}`);
            return false;
        }
    }

    // Lista todos os Médicos em ordem alfabética (Regra da Sprint 04)
    static async listarMedicos(): Promise<Array<Medico> | null> {
        try {
            let listaMedicos: Array<Medico> = [];
            // Regra da Sprint: Ordem Alfabética para entidades principais
            const querySelectMedicos = `SELECT * FROM Medico ORDER BY nome_medico ASC WHERE situacao=TRUE;`;
            const respostaBD = await database.query(querySelectMedicos);

            respostaBD.rows.forEach((medicoBD) => {
                const novo = new Medico(
                    medicoBD.nome_medico,
                    medicoBD.crm,
                    medicoBD.especialidade,
                    medicoBD.valor_consulta,
                    medicoBD.senha_medico,
                    medicoBD.situacao
                );
                novo.setIdMedico(medicoBD.idMedico);
                listaMedicos.push(novo);
            });

            return listaMedicos;
        } catch (error) {
            console.error(`Erro ao listar médicos: ${error}`);
            return null;
        }
    }

    static async listarMedico(idMedico: number): Promise<Medico | null> {
        try {
            const querySelectMedico = `SELECT * FROM Medico WHERE id_medico=$1 AND situacao=TRUE;`;

            const respostaBD = await database.query(querySelectMedico, [idMedico]);

            const novoMedico: Medico = new Medico(
                respostaBD.rows[0].nome_medico,
                respostaBD.rows[0].crm,
                respostaBD.rows[0].especialidade,
                respostaBD.rows[0].valor_consulta,
                respostaBD.rows[0].senha_medico,
                respostaBD.rows[0].situacao
            );

            novoMedico.setIdMedico(respostaBD.rows[0].id_Medico);
            novoMedico.setSituacao(respostaBD.rows[0].situacao);

            return novoMedico;
        } catch (error) {
            console.error(`Erro ao buscar médico no banco de dados. ${error}`);
            return null;
        }
    }
}

export default Medico;