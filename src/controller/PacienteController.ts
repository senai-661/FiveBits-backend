import type { Request, Response } from "express";
import Paciente from "../model/Paciente.js";
import type { PacienteDTO } from "../interface/PacienteDTO.js" // Importa a interface DTO definida na Interface

/**
 * Classe responsável por receber a requisição do paciente, 
 * processar essa requisição e devolver a resposta adequada.
 * * Estende a classe Paciente para seguir o padrão de arquitetura proposto.
 */
class PacienteController extends Paciente {

    /**
     * Faz a chamada ao modelo para obter a lista de pacientes e devolve ao cliente.
     * * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Lista de todos os pacientes em ordem alfabética
     * @returns (500) Erro na consulta ao banco de dados
     */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            // Chama o método listarPacientes da classe Paciente (Model)
            const listarPacientes: Array<Paciente> | null = await Paciente.listarPacientes();

            // Retorna status 200 (OK) e a lista de pacientes em formato JSON
            return res.status(200).json(listarPacientes);
        } catch (error) {
            // Log de erro para depuração
            console.error(`Erro ao consultar modelo: ${error}`);

            // Retorna status 500 (Internal Server Error)
            return res.status(500).json({ mensagem: "Não foi possível acessar a lista de pacientes." });
        }
    }

    /**
     * Faz a chamada ao modelo para inserir um novo paciente.
     * * @param req Requisição do cliente contendo o corpo (body) com os dados do paciente
     * @param res Resposta do servidor
     * @returns (201) Mensagem de sucesso no cadastro
     * @returns (400) Erro nos dados enviados ou falha no cadastro
     * @returns (500) Erro interno no processamento do modelo
     */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            // Extrai os dados do corpo da requisição
            const dadosRecebidosPaciente: PacienteDTO = req.body;

            // Chama o método cadastrarPaciente do Model, que retorna um booleano
            const respostaModelo = await Paciente.cadastrarPaciente(dadosRecebidosPaciente);

            // Verifica se o cadastro foi realizado com sucesso no banco
            if (respostaModelo) {
                // Status 201 (Created) para novos registros
                return res.status(201).json({ mensagem: "Paciente cadastrado com sucesso." });
            } else {
                // Status 400 (Bad Request) se houver erro de negócio (ex: CPF duplicado)
                return res.status(400).json({ mensagem: "Erro ao cadastrar paciente. Verifique os dados." });
            }
        } catch (error) {
            // Log de erro inesperado no console
            console.error(`Erro no processamento do modelo: ${error}`);

            // Status 500 (Internal Server Error)
            return res.status(500).json({ mensagem: "Não foi possível inserir o paciente devido a um erro interno." });
        }
    }

    static async paciente(req: Request, res: Response): Promise<Response> {
        try {
            const idPaciente: number = parseInt(req.params.idPaciente as string);
            const respostaModelo = await Paciente.listarPaciente(idPaciente);
            return res.status(200).json(respostaModelo);
        } catch (error) {
            console.error(`Erro no modelo ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível obter informação de Paciente" });
        }
    }
}

export default PacienteController;