import type { Request, Response } from "express";
import Paciente from "../model/Paciente.js"; // Importa o model do Paciente
import type { PacienteDTO } from "../interface/PacienteDTO.js" // Importa a interface DTO do paciente

/**
 * Classe responsável por receber a requisição do paciente, 
 * processar essa requisição e devolver a resposta adequada.
 * Estende a classe Paciente para seguir o padrão de arquitetura proposto.
 */
class PacienteController extends Paciente {

    /**
     * Faz a chamada ao modelo para obter a lista de pacientes e devolve ao cliente.
     * @param req Requisição do cliente
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
     * @param req Requisição do cliente contendo o corpo (body) com os dados do paciente
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

    /**
     * Faz a chamada ao modelo para obter o ID de um paciente e devolve ao cliente.
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Lista um objeto paciente pelo ID
     * @returns (500) Erro na consulta ao banco de dados
     */
    static async paciente(req: Request, res: Response): Promise<Response> {
        try {
            // Chama o ID do paciente
            const idPaciente: number = parseInt(req.params.idPaciente as string);

            // Chama o método listarPaciente do Model, que retorna um objeto do tipo paciente
            const respostaModelo = await Paciente.listarPaciente(idPaciente);

            // Retorna status 200 (OK) e a lista de pacientes em formato JSON
            return res.status(200).json(respostaModelo);
        } catch (error) {
            // Log de erro para depuração
            console.error(`Erro ao consultar modelo: ${error}`);

            // Status 500 (Internal Server Error)
            return res.status(500).json({ mensagem: "Não foi possível obter informação de Paciente" });
        }
    }

    /**
     * Método para remover um medico do banco de dados
     * 
     * @param req Objeto de requisição HTTP com o ID do medico a ser o removido.
     * @param res Objeto de resposta HTTP.
     * @returns Mensagem de sucesso ou erro em formato JSON.
     */
    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idPaciente = parseInt(req.params.idPaciente as string);

            const result = await Paciente.deletarPaciente(idPaciente);

            if(result) {
                return res.status(200).json({ mensagem: 'Paciente removido com sucesso.'});
            } else {
                return res.status(404).json({ mensagem: 'Paciente não encontrado para exclusão.'});
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

        // 3. Validação de Regra de Negócio: Campos obrigatórios conforme o DTO
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

        // 4. Instanciação e Configuração:
        // Criamos o objeto Paciente (ajuste o nome da classe conforme seu projeto)
        const paciente = new Paciente(
            nome,
            cpf,
            dataNascimentoParsed,
            telefone, // Opcional
            situacao ?? true // Default caso não seja enviado
        );
        
        // Atribuindo o ID para garantir que o Update saiba quem alterar
        paciente.setIdPaciente(idPaciente); 

        // 5. Persistência
        const result = await Paciente.atualizarPaciente(paciente);

   
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