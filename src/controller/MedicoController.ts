import type { Request, Response } from "express";
import Medico from "../model/Medico.js"; // Importa o model do médico
import type { MedicoDTO } from "../interface/MedicoDTO.js"; // Importa a interface DTO do médico

/**
 * Classe responsável por receber a requisição do Medico, 
 * processar essa requisição e devolver a resposta adequada.
 * * Estende a classe Medico para seguir o padrão de arquitetura proposto.
 */
class MedicoController extends Medico {

    /**
     * Faz a chamada ao modelo para obter a lista de Medicos e devolve ao cliente.
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Lista de todos os Medicos em ordem alfabética
     * @returns (500) Erro na consulta ao banco de dados
     */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            // Chama o método listarMedicos da classe Medico (Model)
            const listarMedicos: Array<Medico> | null = await Medico.listarMedicos();

            // Retorna status 200 (OK) e a lista de Medicos em formato JSON
            return res.status(200).json(listarMedicos);
        } catch (error) {
            // Log de erro para depuração
            console.error(`Erro ao consultar modelo: ${error}`);

            // Retorna status 500 (Internal Server Error)
            return res.status(500).json({ mensagem: "Não foi possível acessar a lista de Medicos." });
        }
    }

    /**
     * Faz a chamada ao modelo para inserir um novo Medico.
     * @param req Requisição do cliente contendo o corpo (body) com os dados do Medico
     * @param res Resposta do servidor
     * @returns (201) Mensagem de sucesso no cadastro
     * @returns (400) Erro nos dados enviados ou falha no cadastro
     * @returns (500) Erro interno no processamento do modelo
     */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            // Extrai os dados do corpo da requisição
            const dadosRecebidosMedico: MedicoDTO = req.body;

            // Chama o método cadastrarMedico do Model, que retorna um booleano
            const respostaModelo = await Medico.cadastrarMedico(dadosRecebidosMedico);

            // Verifica se o cadastro foi realizado com sucesso no banco
            if (respostaModelo) {
                // Status 201 (Created) para novos registros
                return res.status(201).json({ mensagem: "Medico cadastrado com sucesso." });
            } else {
                // Status 400 (Bad Request) se houver erro de negócio (ex: CPF duplicado)
                return res.status(400).json({ mensagem: "Erro ao cadastrar Medico. Verifique os dados." });
            }
        } catch (error) {
            // Log de erro inesperado no console
            console.error(`Erro no processamento do modelo: ${error}`);

            // Status 500 (Internal Server Error)
            return res.status(500).json({ mensagem: "Não foi possível inserir o Medico devido a um erro interno." });
        }
    }

    /**
     * Faz a chamada ao modelo para obter o ID de um médico e devolve ao cliente.
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Lista um objeto Medico pelo ID
     * @returns (500) Erro na consulta ao banco de dados
     */
    static async medico(req: Request, res: Response): Promise<Response> {
        try {
            // Chama o ID do médico
            const idMedico: number = parseInt(req.params.idMedico as string);

            // Chama o método listarMedico do Model, que retorna um objeto do tipo medico
            const respostaModelo = await Medico.listarMedico(idMedico);

            // Retorna status 200 (OK) e a lista de Consultas em formato JSON
            return res.status(200).json(respostaModelo);
        } catch (error) {
            // Log de erro para depuração
            console.error(`Erro no modelo ${error}`);

            // Status 500 (Internal Server Error)
            return res.status(500).json({ mensagem: "Não foi possível obter informação de Medico" });
        }
    }
}

export default MedicoController