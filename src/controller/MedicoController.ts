import type {Request, Response} from "express"
import Medico from "../model/Medico.js";  
import type { MedicoDTO } from "../interface/MedicoDTO.js";
import MedicoRepository from "../repositories/MedicoRepository.js";

/**
 * Controller responsável por manipular requisições HTTP relacionadas a Médicos.
 */
class MedicoController {

    /**
     * Obtém a lista de todos os médicos.
     */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const medicos = await MedicoRepository.listarMedicos();
            return res.status(200).json(medicos ?? []);
        } catch (error) {
            console.error(`[ERRO - MedicoController.todos]: ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível acessar a lista de Médicos." });
        }
    }

    /**
     * Insere um novo médico.
     */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const dadosMedico: MedicoDTO = req.body;

            // Validação simples dos campos obrigatórios da requisição
            if (!dadosMedico.nome || !dadosMedico.crm || !dadosMedico.especialidade || dadosMedico.valorConsulta === undefined) {
                return res.status(400).json({ 
                    mensagem: "Dados incompletos. Os campos nome, crm, especialidade e valorConsulta são obrigatórios." 
                });
            }

            const sucesso = await MedicoRepository.cadastrarMedico(dadosMedico);

            if (sucesso) {
                return res.status(201).json({ mensagem: "Médico cadastrado com sucesso." });
            }

            return res.status(400).json({ mensagem: "Erro ao cadastrar Médico. Verifique os dados enviados." });
        } catch (error) {
            console.error(`[ERRO - MedicoController.novo]: ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível inserir o Médico devido a um erro interno." });
        }
    }

    /**
     * Busca um médico pelo seu ID.
     */
    static async medico(req: Request, res: Response): Promise<Response> {
        try {
            const idMedico = Number(req.params.idMedico ?? req.params.id);

            if (isNaN(idMedico)) {
                return res.status(400).json({ mensagem: "ID inválido. Informe um número válido." });
            }

            const medicoEncontrado = await MedicoRepository.listarMedico(idMedico);

            if (!medicoEncontrado) {
                return res.status(404).json({ mensagem: "Médico não encontrado." });
            }

            return res.status(200).json(medicoEncontrado);
        } catch (error) {
            console.error(`[ERRO - MedicoController.medico]: ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível obter informações do Médico." });
        }
    }

    /**
     * Remove um médico pelo ID.
     */
    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idMedico = Number(req.params.idMedico ?? req.params.id);

            if (isNaN(idMedico)) {
                return res.status(400).json({ mensagem: "ID inválido. Informe um número válido." });
            }

            const removido = await MedicoRepository.deletarMedico(idMedico);

            if (removido) {
                return res.status(200).json({ mensagem: "Médico removido com sucesso." });
            }

            return res.status(404).json({ mensagem: "Médico não encontrado para exclusão." });
        } catch (error) {
            console.error(`[ERRO - MedicoController.remover]: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao remover o Médico." });
        }
    }

    /**
     * Atualiza os dados de um médico existente.
     */
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const idMedico = Number(req.params.idMedico ?? req.params.id);

            if (isNaN(idMedico)) {
                return res.status(400).json({ mensagem: "ID inválido. A atualização requer um identificador numérico." });
            }

            const { nome, crm, especialidade, valorConsulta, situacao }: MedicoDTO = req.body;

            if (!nome || !crm || !especialidade || valorConsulta === undefined) {
                return res.status(400).json({ 
                    mensagem: "Todos os campos (nome, crm, especialidade, valorConsulta) são obrigatórios." 
                });
            }

            const medico = new Medico(
                nome,
                crm,
                especialidade,
                valorConsulta,
                situacao ?? true,
                
            );

            const atualizado = await MedicoRepository.atualizarMedico(medico);

            if (atualizado) {
                return res.status(200).json({ mensagem: "Médico atualizado com sucesso." });
            }

            return res.status(404).json({ mensagem: "Médico não encontrado para atualização." });
        } catch (error) {
            console.error(`[ERRO - MedicoController.atualizar]: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno ao atualizar os dados do médico." });
        }
    }
}

export default MedicoController;