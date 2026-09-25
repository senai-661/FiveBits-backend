import { type MedicoDTO } from "../interface/MedicoDTO.js";
import { DatabaseModel } from "../model/DatabaseModel.js";
import Medico from "../model/Medico.js";

const database = new DatabaseModel().pool;

export class MedicoRepository {
     static async cadastrarMedico(MedicoRepository: MedicoDTO): Promise<boolean> {
        try {
            const queryInsertMedico = `CALL sp_cadastrar_medico($1, $2, $3, $4);`;

            const respostaBD = await database.query(queryInsertMedico, [
                MedicoRepository.nome.toUpperCase(),
                MedicoRepository.crm,
                MedicoRepository.especialidade,
                MedicoRepository.valorConsulta
            ]);

            console.info(`Medico cadastrado com sucesso. ${respostaBD.command}`);
            return true;
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
            const querySelectMedicos = `SELECT * FROM vw_medicos ORDER BY nome ASC;`;
            const respostaBD = await database.query(querySelectMedicos);

            respostaBD.rows.forEach((medicoBD: any) => {
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
            const querySelectMedico = `SELECT * FROM vw_medicos WHERE id_medico=$1;`;

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
            const queryDeleteMedico = `CALL sp_deletar_medico($1);`;

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

        const sql = `CALL sp_atualizar_medico($1, $2, $3, $4, $5);`;

        const valores = [
            medico.getIdMedico(),
            medico.getNome(),
            medico.getCrm(),
            medico.getEspecialidade(),
            medico.getValorConsulta()
        ];

        const medicoExistente = await conexao.query(
            `SELECT 1 FROM medico WHERE id_medico = $1 AND situacao = TRUE`,
            [medico.getIdMedico()]
        );

        if (medicoExistente.rowCount === 0) {
            return false;
        }

        await conexao.query(sql, valores);

        return true;

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
export default MedicoRepository;