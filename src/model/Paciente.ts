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

}

export default Paciente;