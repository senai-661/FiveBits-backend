import { DatabaseModel } from "./DatabaseModel.js"; // Importa a classe de conexão
import { type MedicoDTO } from "../interface/MedicoDTO.js"; // Importa a interface DTO do Médico

const database = new DatabaseModel().pool; // Inicializa o pool

class Medico {
    private idMedico: number = 0;
    private nome: string;
    private crm: string;
    private especialidade: string;
    private valorConsulta: number;
    private situacao: boolean = true;

    // Constructor da Classe Médico
    constructor( 
        _nome: string,
        _crm: string,
        _especialidade: string,
        _valorConsulta: number,
        _situacao?: boolean // ? = Opcional
    ) {
        this.nome = _nome;
        this.crm = _crm;
        this.especialidade = _especialidade;
        this.valorConsulta = _valorConsulta;
        this.situacao = _situacao || false; // Opcional
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

    public getSituacao(): boolean {
        return this.situacao;
    }
    public setSituacao(_situacao: boolean): void {
        this.situacao = _situacao
    }

    // Insere um médico no banco de dados
  static async cadastrarMedico(Medico: MedicoDTO): Promise<boolean> {
        try {
            const queryInsertMedico = `INSERT INTO Medico (nome, crm, especialidade, valor_consulta) VALUES
                                       ($1, $2, $3, $4) RETURNING id_medico;`;

            const respostaBD = await database.query(queryInsertMedico, [
                Medico.nome.toUpperCase(),
                Medico.crm,
                Medico.especialidade,
                Medico.valorConsulta
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
            const querySelectMedicos = `SELECT * FROM Medico WHERE situacao=TRUE ORDER BY nome ASC;`;
            const respostaBD = await database.query(querySelectMedicos);

            respostaBD.rows.forEach((medicoBD) => {
                const novo = new Medico(
                    medicoBD.nome,
                    medicoBD.crm,
                    medicoBD.especialidade,
                    medicoBD.valor_consulta,
                    medicoBD.situacao
                );

                novo.setIdMedico(medicoBD.id_medico);
                listaMedicos.push(novo);
            });

            return listaMedicos;
        } catch (error) {
            console.error(`Erro ao listar médicos: ${error}`);
            return null;
        }
    }

    // Lista um médico pelo ID
    static async listarMedico(idMedico: number): Promise<Medico | null> {
        try {
            const querySelectMedico = `SELECT * FROM Medico WHERE id_medico=$1 AND situacao=TRUE;`;

            const respostaBD = await database.query(querySelectMedico, [idMedico]);

            const novoMedico: Medico = new Medico(
                respostaBD.rows[0].nome,
                respostaBD.rows[0].crm,
                respostaBD.rows[0].especialidade,
                respostaBD.rows[0].valor_consulta,
                respostaBD.rows[0].situacao
            );

            novoMedico.setIdMedico(respostaBD.rows[0].id_medico);
            novoMedico.setSituacao(respostaBD.rows[0].situacao);

            return novoMedico;
        } catch (error) {
            console.error(`Erro ao buscar médico no banco de dados. ${error}`);
            return null;
        }
    }

    static async deletarMedico(idMedico: number): Promise<boolean> {
        try {
            const queryDeleteMedico = `UPDATE Medico SET situacao = FALSE WHERE id_medico = $1`;

            const respostaBD = await database.query(queryDeleteMedico, [idMedico]);

            if(respostaBD.rowCount != 0) {
                console.info(`Medico removido com sucesso`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao remover Medico do banco de dados. ${error}`);
            return false;
        }
    }
    static async atualizarMedico(medico: Medico): Promise<boolean> {
    let conexao: any;

    try {
        conexao = await database.connect(); 

        const sql = `
            UPDATE Medico 
            SET 
                nome = $1, 
                crm = $2, 
                especialidade = $3, 
                valor_consulta = $4, 
                situacao = $5
            WHERE id_medico = $6
        `;

        const valores = [
            medico.getNome(),
            medico.getCrm(),
            medico.getEspecialidade(),
            medico.getValorConsulta(),
            medico.getSituacao() !== undefined ? medico.getSituacao() : true,
            medico.getIdMedico()
        ];

        const result = await conexao.query(sql, valores);

        // Retorna true se o registro foi encontrado e alterado
        return result.rowCount > 0;

    } catch (error) {
        console.error(`[MODEL ERROR]: Falha ao atualizar médico: ${error}`);
        throw error;
    } finally {
        if (conexao) {
            conexao.release();
        }
    }
}
}

export default Medico;