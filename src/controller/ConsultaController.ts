import type { Request, Response } from "express";
import Consulta from "../model/Consulta.js"; // Importa o model da consulta
import type { ConsultaDTO } from "../interface/ConsultaDTO.js"; // Importa a interface DTO da consulta

/**
 * Classe responsável por receber a requisição do Consulta, 
 * processar essa requisição e devolver a resposta adequada.
 * * Estende a classe Consulta para seguir o padrão de arquitetura proposto.
 */
class ConsultaController extends Consulta {

    /**
     * Faz a chamada ao modelo para obter a lista de Consultas e devolve ao cliente.
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Lista de todos os Consultas em ordem alfabética
     * @returns (500) Erro na consulta ao banco de dados
     */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            // Chama o método listarConsultas da classe Consulta (Model)
            const listarConsultas: Array<Consulta> | null = await Consulta.listarConsultas();

            // Retorna status 200 (OK) e a lista de Consultas em formato JSON
            return res.status(200).json(listarConsultas);
        } catch (error) {
            // Log de erro para depuração
            console.error(`Erro ao consultar modelo: ${error}`);

            // Retorna status 500 (Internal Server Error)
            return res.status(500).json({ mensagem: "Não foi possível acessar a lista de Consultas." });
        }
    }

    /**
     * Faz a chamada ao modelo para inserir um novo Consulta.
     * @param req Requisição do cliente contendo o corpo (body) com os dados do Consulta
     * @param res Resposta do servidor
     * @returns (201) Mensagem de sucesso no cadastro
     * @returns (400) Erro nos dados enviados ou falha no cadastro
     * @returns (500) Erro interno no processamento do modelo
     */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            // Extrai os dados do corpo da requisição
            const dadosRecebidosConsulta: ConsultaDTO = req.body;

            // Chama o método cadastrarConsulta do Model, que retorna um booleano
            const respostaModelo = await Consulta.cadastrarConsulta(dadosRecebidosConsulta);

            // Verifica se o agendamento foi realizado com sucesso no banco
            if (respostaModelo) {
                // Status 201 (Created) para novos registros
                return res.status(201).json({ mensagem: "Consulta cadastrado com sucesso." });
            } else {
                // Status 400 (Bad Request) se houver erro de negócio (ex: CPF duplicado)
                return res.status(400).json({ mensagem: "Erro ao cadastrar consulta. Verifique os dados." });
            }
        } catch (error) {
            // Log de erro inesperado no console
            console.error(`Erro no processamento do modelo: ${error}`);

            // Status 500 (Internal Server Error)
            return res.status(500).json({ mensagem: "Não foi possível inserir o consulta devido a um erro interno." });
        }
    }

    /**
     * Faz a chamada ao modelo para obter o ID de uma consulta e devolve ao cliente.
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Lista um objeto consulta pelo ID
     * @returns (500) Erro na consulta ao banco de dados
     */
    static async consulta(req: Request, res: Response): Promise<Response> {
        try {
            // Chama o ID da consulta
            const idConsulta: number = parseInt(req.params.idConsulta as string);

            // Chama o método listarConsulta do Model, que retorna um objeto do tipo consulta
            const respostaModelo = await Consulta.listarConsulta(idConsulta);

            // Retorna status 200 (OK) e a lista de Consultas em formato JSON
            return res.status(200).json(respostaModelo);
        } catch (error) {
            // Log de erro para depuração
            console.error(`Erro no modelo ${error}`);

            // Status 500 (Internal Server Error)
            return res.status(500).json({ mensagem: "Não foi possível obter informação de consulta" });
        }
    }
}

export default ConsultaController;