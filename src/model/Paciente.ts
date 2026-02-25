import { DatabaseModel } from "./DatabaseModel.js"; // Importa a classe de conexão
import { type PacienteDTO } from "../interface/PacienteDTO.js";

const database = new DatabaseModel().pool; // Inicializa o pool

class Paciente {
    private idPaciente: number = 0;
    private nome: string;
    private cpf: string;
    private email: string;
    private telefone: string;
    private senha: string;
    private dataNascimento: Date;
    private situacao: boolean = true;

    constructor(
        _nome: string,
        _cpf: string,
        _email: string,
        _senha: string,
        _dataNascimento: Date,
        _telefone?: string,
        _situacao?: boolean
    ) {
        this.nome = _nome;
        this.cpf = _cpf;
        this.email = _email;
        this.senha = _senha;
        this.dataNascimento = _dataNascimento;
        this.telefone = _telefone || "";
        this.situacao = _situacao || false;
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

    public getEmail(): string {
        return this.email;
    }
    public setEmail(_email: string): void {
        this.email = _email;
    }

    public getTelefone(): string {
        return this.telefone;
    }
    public setTelefone(_telefone: string): void {
        this.telefone = _telefone;
    }

    public getSenha(): string {
        return this.senha;
    }
    public setSenha(_senha: string): void {
        this.senha = _senha;
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

    /**
     * Insere um paciente no banco de dados
     */
    static async cadastrarPaciente(paciente: PacienteDTO): Promise<boolean> {
        try {
            const queryInsert = `INSERT INTO Paciente (nome_paciente, cpf, email, telefone, senha, data_nascimento)
                                VALUES ($1, $2, $3, $4, $5, $6)
                                RETURNING id_paciente;`;

            const respostaBD = await database.query(queryInsert, [
                paciente.nome.toUpperCase(),
                paciente.cpf,
                paciente.email.toLowerCase(), // Email geralmente em minúsculo
                paciente.telefone,
                paciente.senha,
                paciente.dataNascimento
            ]);

            if (respostaBD.rows.length > 0) {
                console.info(`Paciente cadastrado com sucesso. ID: ${respostaBD.rows[0].id_paciente}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Erro na consulta ao banco de dados: ${error}`);
            return false;
        }
    }

    /**
     * Lista todos os pacientes em ordem alfabética (Regra da Sprint 04)
     */
    static async listarPacientes(): Promise<Array<Paciente> | null> {
        try {
            let listaPacientes: Array<Paciente> = [];
            // Regra da Sprint: Ordem Alfabética para entidades principais
            const querySelect = `SELECT * FROM Paciente ORDER BY nome_paciente ASC WHERE situacaco=TRUE;`;
            const respostaBD = await database.query(querySelect);

            respostaBD.rows.forEach((pacienteBD) => {
                const novo = new Paciente(
                    pacienteBD.nome_paciente,
                    pacienteBD.cpf,
                    pacienteBD.email,
                    pacienteBD.telefone,
                    pacienteBD.senha,
                    pacienteBD.data_nascimento,
                    pacienteBD.situacaco
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
}

export default Paciente;