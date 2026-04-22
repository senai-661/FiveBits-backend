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

<<<<<<< enzo_cassao
    /**
    * Método para remover um medico do banco de dados
    * 
    * @param req Objeto de requisição HTTP com o ID do medico a ser removido.
    * @param res Objeto de resposta HTTP.
    * @returns Mensagem de sucesso ou erro em formato JSON.
    */
    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            // Lê o parâmetro "id" da URL e converte para número inteiro
            const idMedico = parseInt(req.params.id as string);

            // Chama o método do model para remover (logicamente) o Medico com o ID informado
            const result = await Medico.deletarMedico(idMedico);

            // Verifica o retorno do model: true = remoção bem-sucedida, false = falha
            if (result) {
                return res.status(200).json({ mensagem: 'Medico removido com sucesso.' });
            } else {
                // Retorna status HTTP 404 (Not Found) se o Medico não foi encontrado ou já estava inativo
                return res.status(404).json({ mensagem: 'Medico não encontrado para exclusão.' });
            }
        } catch (error) {
            // Exibe o erro no console e retorna status HTTP 500 em caso de exceção
            console.error("Erro ao remover o Medico: ", error);
            return res.status(500).json({ mensagem: 'Erro ao remover o Medico.' });
        }
    }
=======
    static async atualizar(req: Request, res: Response): Promise<Response> {
    try {
       
        const idMedico = Number(req.params.idMedico ?? req.params.id);

        if (isNaN(idMedico)) {
            return res.status(400).json({ 
                mensagem: "ID inválido. A atualização requer um identificador numérico." 
            });
        }

        const { nome, crm, especialidade, valorConsulta, emailMedico, senhaMedico, situacao }: MedicoDTO = req.body;

        
        if (!nome || !crm || !especialidade || !valorConsulta || !emailMedico || !senhaMedico) {
            return res.status(400).json({ 
                mensagem: "Todos os campos (nome, crm, especialidade, valor, email e senha) são obrigatórios." 
            });
        }

      
        const medico = new Medico(
            nome,
            crm,
            especialidade,
            valorConsulta,
            emailMedico,
            senhaMedico,
            situacao ?? true
        );
        medico.setIdMedico(idMedico);

        
        const result = await Medico.atualizarMedico(medico);

       
        if (result) {
            return res.status(200).json({ mensagem: "Médico atualizado com sucesso." });
        }

        return res.status(404).json({ mensagem: "Médico não encontrado para atualização." });

    } catch (error) {
        console.error(`[ERRO NA ATUALIZAÇÃO DE MÉDICO]: ${error}`);
        return res.status(500).json({ 
            mensagem: "Erro interno ao atualizar os dados do médico." 
        });
    }
}
>>>>>>> features
}

export default MedicoController