import { DatabaseModel } from "./DatabaseModel.js"; // Importa a classe de conexão
import { type PacienteDTO } from "../interface/PacienteDTO.js"; // Importa a interface DTO do Paciente

const database = new DatabaseModel().pool; // Inicializa o pool

// Criação da classe do Paciente
class Paciente {
    private idPaciente: number = 0;
    private nome: string;
    private cpf: string;
    private telefone: string;
    private dataNascimento: Date;
    private situacao: boolean = true;

    // Constructor da Classe Paciente
    constructor(
        _nome: string,
        _cpf: string,
        _dataNascimento: Date,
        _telefone?: string, // ? = Opcional
        _situacao?: boolean // ? = Opcional
    ) {
        this.nome = _nome;
        this.cpf = _cpf;
        this.telefone = _telefone || ""; // Opcional
        this.dataNascimento = _dataNascimento;
        this.situacao = _situacao || false; // Opcional
    }

    // Métodos GET e SET (Encapsulamento)
    public getIdPaciente(): number {
        return this.idPaciente;
    }
    public setIdPaciente(idPaciente: number): void {
        this.idPaciente = idPaciente;
    }

    public getNome(): string {
        return this.nome;
    }
    public setNome(_nome: string): void {
        this.nome = _nome;
    }

    public getCpf(): string {
        return this.cpf;
    }
    public setCpf(_cpf: string): void {
        this.cpf = _cpf;
    }

    public getTelefone(): string {
        return this.telefone;
    }
    public setTelefone(_telefone: string): void {
        this.telefone = _telefone;
    }

    public getDataNascimento(): Date {
        return this.dataNascimento;
    }
    public setDataNascimento(_dataNascimento: Date): void {
        this.dataNascimento = _dataNascimento;
    }

    public getSituacao(): boolean {
        return this.situacao;
    }
    public setSituacao(_situacao: boolean): void {
        this.situacao = _situacao;
    }

    //Insere um paciente no banco de dados
    static async cadastrarPaciente(paciente: PacienteDTO): Promise<boolean> {
        try {
            // Normaliza o CPF removendo quaisquer caracteres que não sejam dígitos
            const cpfNormalized = (paciente.cpf || "").toString().replace(/\D/g, "");

            // Verifica se o CPF já existe para evitar violação da restrição de unicidade
            const checkCpfSql = `SELECT 1 FROM paciente WHERE cpf = $1 AND situacao = TRUE;`;
            const cpfExists = await database.query(checkCpfSql, [cpfNormalized]);

            if (cpfExists.rows.length > 0) {
                console.warn(`Tentativa de cadastrar CPF duplicado: ${cpfNormalized}`);
                return false;
            }

            const queryInsertPaciente = `CALL sp_cadastrar_paciente($1, $2, $3, $4);`;

            const respostaBD = await database.query(queryInsertPaciente, [
                paciente.nome.toUpperCase(),
                cpfNormalized,
                paciente.telefone,
                paciente.dataNascimento ? paciente.dataNascimento.toString().split('T')[0] : null
            ]);

            console.info(`Paciente cadastrado com sucesso. ${respostaBD.command}`);
            return true;
        } catch (error) {
            console.error(`Erro na consulta ao banco de dados: ${error}`);
            return false;
        }
    }

    // Lista todos os pacientes em ordem alfabética (Regra da Sprint 04)
    static async listarPacientes(): Promise<Array<Paciente> | null> {
        try {
            let listaPacientes: Array<Paciente> = [];
            // Regra da Sprint: Ordem Alfabética para entidades principais
            const querySelectPacientes = `SELECT * FROM vw_pacientes ORDER BY nome ASC;`;
            const respostaBD = await database.query(querySelectPacientes);

            respostaBD.rows.forEach((pacienteBD) => {
                const novo = new Paciente(
                    pacienteBD.nome,
                    pacienteBD.cpf,
                    pacienteBD.data_nascimento.toISOString().split('T')[0],
                    pacienteBD.telefone,
                    pacienteBD.situacao
                );

                novo.setIdPaciente(pacienteBD.id_paciente);
                listaPacientes.push(novo);
            });

            return listaPacientes;
        } catch (error) {
            console.error(`Erro ao listar pacientes: ${error}`);
            return null;
        }
    }

    // Lista um paciente pelo ID 
    static async listarPaciente(idPaciente: number): Promise<Paciente | null> {
        try {
            const querySelectPaciente = `SELECT * FROM vw_pacientes WHERE id_paciente=$1;`;

            const respostaBD = await database.query(querySelectPaciente, [idPaciente]);

            const novoPaciente: Paciente = new Paciente(
                respostaBD.rows[0].nome,
                respostaBD.rows[0].cpf,
                respostaBD.rows[0].data_nascimento.toISOString().split('T')[0],
                respostaBD.rows[0].telefone,
                respostaBD.rows[0].situacao
            );

            novoPaciente.setIdPaciente(respostaBD.rows[0].id_paciente);
            novoPaciente.setSituacao(respostaBD.rows[0].situacao);

            return novoPaciente;
        } catch (error) {
            console.error(`Erro ao buscar paciente no banco de dados. ${error}`);
            return null;
        }
    }

    static async deletarPaciente(idPaciente: number): Promise<boolean> {
        try {
            const queryDeletePaciente = `CALL sp_deletar_paciente($1);`;

            const respostaBD = await database.query(queryDeletePaciente, [idPaciente]);

            if (respostaBD.rowCount != 0) {
                console.info(`Paciente removido com sucesso`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao remover Paciente do banco de dados. ${error}`);
            return false;
        }
    }

    static async atualizarPaciente(paciente: Paciente): Promise<boolean> {
        let conexao: any;

        try {
            conexao = await database.connect();

            // 1. Verifica se o CPF já existe em outro paciente
            const checkCpfSql = `
            SELECT id_paciente FROM paciente 
            WHERE cpf = $1 AND id_paciente != $2
        `;
            // Normaliza o CPF antes de verificar
            const cpfNormalized = (paciente.getCpf() || "").toString().replace(/\D/g, "");

            const checkCpfResult = await conexao.query(checkCpfSql, [
                cpfNormalized,
                paciente.getIdPaciente()
            ]);

            // Se o CPF já existe em outro paciente, rejeita a atualização
            if (checkCpfResult.rows.length > 0) {
                console.error(`[MODEL ERROR]: CPF ${paciente.getCpf()} já existe em outro paciente`);
                return false;
            }

            const pacienteResult = await conexao.query(
                "SELECT 1 FROM paciente WHERE id_paciente = $1",
                [paciente.getIdPaciente()]
            );

            if (pacienteResult.rows.length === 0) {
                return false;
            }

            // 2. Procede com a atualização se o CPF é válido
            const sql = `CALL sp_atualizar_paciente($1, $2, $3, $4, $5)`;

            // Formata data para YYYY-MM-DD ou NULL
            const dataNascimentoFormatted = paciente.getDataNascimento()
                ? paciente.getDataNascimento().toISOString().split('T')[0]
                : null;

            const valores = [
                // Ordem esperada pela procedure: id, nome, cpf, telefone, data_nascimento
                paciente.getIdPaciente(),
                paciente.getNome(),
                cpfNormalized,
                paciente.getTelefone() || null,
                dataNascimentoFormatted
            ];

            const result = await conexao.query(sql, valores);

            return result.command === "CALL";

        } catch (error) {
            console.error(`[MODEL ERROR]: Falha ao atualizar paciente no banco: ${error}`);
            throw error; // Repassa o erro para o Controller tratar no try/catch de lá
        } finally {
            if (conexao) {
                conexao.release();
            }
        }
    }
}

export default Paciente;
