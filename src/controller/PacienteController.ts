import type { Request, Response } from "express";
import Paciente from "../model/Paciente.js"; // Usado apenas para tipagem e instanciação
import PacienteRepository from "../repositories/PacienteRepository.js"; // Responsável pelo acesso ao banco
import type { PacienteDTO } from "../interface/PacienteDTO.js" // Importa a interface DTO do paciente

/**
 * Classe responsável por receber a requisição do paciente, 
 * processar essa requisição e devolver a resposta adequada.
 */
class PacienteController {

    /**
     * Faz a chamada ao repositório para obter a lista de pacientes e devolve ao cliente.
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Lista de todos os pacientes em ordem alfabética
     * @returns (500) Erro na consulta ao banco de dados
     */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listarPacientes: Array<Paciente> | null = await PacienteRepository.listarPacientes();

            return res.status(200).json(listarPacientes);
        } catch (error) {
            console.error(`Erro ao consultar modelo: ${error}`);

            return res.status(500).json({ mensagem: "Não foi possível acessar a lista de pacientes." });
        }
    }

    /**
     * Faz a chamada ao repositório para inserir um novo paciente.
     * @param req Requisição do cliente contendo o corpo (body) com os dados do paciente
     * @param res Resposta do servidor
     * @returns (201) Mensagem de sucesso no cadastro
     * @returns (400) Erro nos dados enviados ou falha no cadastro
     * @returns (500) Erro interno no processamento do modelo
     */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidosPaciente: PacienteDTO = req.body;

            const respostaModelo = await PacienteRepository.cadastrarPaciente(dadosRecebidosPaciente);

            if (respostaModelo) {
                return res.status(201).json({ mensagem: "Paciente cadastrado com sucesso." });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar paciente. Verifique os dados." });
            }
        } catch (error) {
            console.error(`Erro no processamento do modelo: ${error}`);

            return res.status(500).json({ mensagem: "Não foi possível inserir o paciente devido a um erro interno." });
        }
    }

    /**
     * Faz a chamada ao repositório para obter um paciente pelo ID e devolve ao cliente.
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Lista um objeto paciente pelo ID
     * @returns (500) Erro na consulta ao banco de dados
     */
    static async paciente(req: Request, res: Response): Promise<Response> {
        try {
            const idPaciente: number = parseInt(req.params.idPaciente as string);

            const respostaModelo = await PacienteRepository.listarPaciente(idPaciente);

            return res.status(200).json(respostaModelo);
        } catch (error) {
            console.error(`Erro ao consultar modelo: ${error}`);

            return res.status(500).json({ mensagem: "Não foi possível obter informação de Paciente" });
        }
    }

    /**
     * Método para remover um paciente do banco de dados
     * 
     * @param req Objeto de requisição HTTP com o ID do paciente a ser o removido.
     * @param res Objeto de resposta HTTP.
     * @returns Mensagem de sucesso ou erro em formato JSON.
     */
    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idPaciente = parseInt(req.params.idPaciente as string);

            const result = await PacienteRepository.deletarPaciente(idPaciente);

            if (result) {
                return res.status(200).json({ mensagem: 'Paciente removido com sucesso.' });
            } else {
                return res.status(404).json({ mensagem: 'Paciente não encontrado para exclusão.' });
            }
        } catch (error) {
            console.error(`Erro ao remover o Paciente. ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao remover Paciente.' });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            // 1. Validação do ID
            const idPaciente = Number(req.params.idPaciente ?? req.params.id);

            if (isNaN(idPaciente)) {
                return res.status(400).json({
                    mensagem: "ID inválido. A atualização requer um identificador numérico."
                });
            }

            const { nome, cpf, telefone, dataNascimento, situacao }: PacienteDTO = req.body;

            // 2. Validação de Regra de Negócio: Campos obrigatórios conforme o DTO
            if (!nome || !cpf || !dataNascimento) {
                return res.status(400).json({
                    mensagem: "Nome, CPF e Data de Nascimento são obrigatórios."
                });
            }

            const dataNascimentoParsed = new Date(dataNascimento);

            if (Number.isNaN(dataNascimentoParsed.getTime())) {
                return res.status(400).json({
                    mensagem: "Data de Nascimento inválida. Use o formato YYYY-MM-DD."
                });
            }

            // 3. Instanciação e Configuração
            const paciente = new Paciente(
                nome,
                cpf,
                dataNascimentoParsed,
                telefone, // Opcional
                situacao ?? true // Default caso não seja enviado
            );

            // Atribuindo o ID para garantir que o Update saiba quem alterar
            paciente.setIdPaciente(idPaciente);

            // 4. Persistência
            const result = await PacienteRepository.atualizarPaciente(paciente);

            if (result) {
                return res.status(200).json({ mensagem: "Paciente atualizado com sucesso." });
            }

            // Verifica se o paciente não foi encontrado ou se o CPF já existe
            return res.status(400).json({
                mensagem: "Falha na atualização: paciente não encontrado ou dados inválidos."
            });

        } catch (error) {
            console.error(`[ERRO NA ATUALIZAÇÃO DE PACIENTE]: ${error}`);

            return res.status(500).json({
                mensagem: "Erro interno ao atualizar os dados do paciente."
            });
        }
    }
}

export default PacienteController;