import type { Request, Response } from "express";
import ConsultaRepository from "../repositories/ConsultaRepository.js"; // Importa o model da consulta
import type { ConsultaDTO } from "../interface/ConsultaDTO.js"; // Importa a interface DTO da consulta
import Consulta from "../model/Consulta.js";

/**
 * Classe responsável por receber a requisição de Consulta, 
 * processar essa requisição e devolver a resposta adequada.
 * Removido o "extends Consulta" para garantir o princípio de Responsabilidade Única (SRP).
 */
class ConsultaController {

    /**
     * Faz a chamada ao modelo para obter a lista de Consultas e devolve ao cliente.
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Lista de todas as Consultas
     * @returns (500) Erro na consulta ao banco de dados
     */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            // Chama o método estático listarConsultas do Model
            const listarConsultas: Array<ConsultaDTO> | null = await ConsultaRepository.listarConsultas();

            return res.status(200).json(listarConsultas);
        } catch (error) {
            console.error(`Erro ao consultar modelo: ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível acessar a lista de Consultas." });
        }
    }

    /**
     * Faz a chamada ao modelo para inserir uma nova Consulta.
     * @param req Requisição do cliente contendo o corpo (body) com os dados
     * @param res Resposta do servidor
     * @returns (201) Mensagem de sucesso no cadastro
     * @returns (400) Erro nos dados enviados ou falha no cadastro
     * @returns (500) Erro interno no processamento do modelo
     */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidosConsulta: ConsultaDTO = req.body;

            // Chama o método estático do Model
            const respostaModelo = await ConsultaRepository.cadastrarConsulta(dadosRecebidosConsulta);

            if (respostaModelo) {
                return res.status(201).json({ mensagem: "Consulta cadastrada com sucesso." });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar consulta. Verifique os dados." });
            }
        } catch (error) {
            console.error(`Erro no processamento do modelo: ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível inserir a consulta devido a um erro interno." });
        }
    }

    /**
     * Faz a chamada ao modelo para obter uma consulta pelo ID.
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Objeto consulta
     * @returns (500) Erro na consulta ao banco de dados
     */
    static async consulta(req: Request, res: Response): Promise<Response> {
        try {
            const idConsulta: number = parseInt(req.params.idConsulta as string);

            // Chama o método estático do Model
            const respostaModelo = await ConsultaRepository.listarConsulta(idConsulta);
            return res.status(200).json(respostaModelo);
        } catch (error) {
            console.error(`Erro no modelo: ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível obter informação da consulta." });
        }
    }

    /**
     * Remove (logicamente) uma consulta.
     * @param req Objeto de requisição HTTP com o ID da consulta.
     * @param res Objeto de resposta HTTP.
     */
    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idConsulta = parseInt(req.params.idConsulta as string);

            const result = await ConsultaRepository.deletarConsulta(idConsulta);

            if (result) {
                return res.status(200).json({ mensagem: 'Consulta removida com sucesso.' });
            } else {
                return res.status(404).json({ mensagem: 'Consulta não encontrada para exclusão.' });
            }
        } catch (error) {
            console.error(`Erro ao remover Consulta: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao remover Consulta.' });
        }
    }

    /**
     * Atualiza os dados de uma consulta.
     * @param req Objeto de requisição HTTP.
     * @param res Objeto de resposta HTTP.
     */
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            // 1. Validação do ID da Consulta via URL
            const idConsulta = Number(req.params.idConsulta ?? req.params.id);

            if (isNaN(idConsulta)) {
                return res.status(400).json({ 
                    mensagem: "ID da consulta inválido." 
                });
            }

            // 2. Extração de dados
            const corpo = req.body as ConsultaDTO & {
                idPaciente?: number;
                idMedico?: number;
            };
            const idPaciente = corpo.idPaciente ?? corpo.paciente?.idPaciente;
            const idMedico = corpo.idMedico ?? corpo.medico?.idMedico;
            const { dataHora, status, modalidade, triagemSintomas, situacao } = corpo;

            // 3. Validação de Campos Obrigatórios
            if (!dataHora || !modalidade || !triagemSintomas || !idPaciente || !idMedico) {
                return res.status(400).json({ 
                    mensagem: "ID do paciente, ID do médico, data/hora, modalidade e triagem são obrigatórios para atualizar a consulta." 
                });
            }

            // 4. Instanciação
            const consultaAtualizada = new Consulta(
                dataHora ? new Date(dataHora) : new Date(),
                modalidade,
                triagemSintomas,
                idPaciente,
                idMedico,
                status ?? 'Pendente',
                situacao ?? true
            );
            
            // Atribuição do ID usando os Setters Nativos definidos na refatoração anterior
            consultaAtualizada.setIdConsulta(idConsulta);

            // 5. Persistência chamando o Model
            const result = await ConsultaRepository.atualizarConsulta(consultaAtualizada);

            // 6. Resposta
            if (result) {
                return res.status(200).json({ mensagem: "Consulta atualizada com sucesso." });
            }

            return res.status(404).json({ mensagem: "Consulta não encontrada para atualização." });

        } catch (error) {
            console.error(`[ERRO NA ATUALIZAÇÃO DE CONSULTA]: ${error}`);
            return res.status(500).json({ 
                mensagem: "Erro interno ao atualizar os dados da consulta." 
            });
        }
    }
}

export default ConsultaController;