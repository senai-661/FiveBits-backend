import { DatabaseModel } from "./DatabaseModel.js"; // Importa a classe de conexão
import { type MedicoDTO } from "../interface/MedicoDTO.js"; // Importa a interface DTO do Médico

const database = new DatabaseModel().pool; // Inicializa o pool

class Medico {
    private idMedico: number = 0;
    private nome: string;
    private crm: string;
    private especialidade: string;
    private valorConsulta: number;
    private situacao: boolean = true;

    // Constructor da Classe Médico
    constructor( 
        _nome: string,
        _crm: string,
        _especialidade: string,
        _valorConsulta: number,
        _situacao?: boolean // ? = Opcional
    ) {
        this.nome = _nome;
        this.crm = _crm;
        this.especialidade = _especialidade;
        this.valorConsulta = _valorConsulta;
        this.situacao = _situacao || false; // Opcional
    }

    // Métodos GET e SET (Encapsulamento)
    public getIdMedico(): number {
        return this.idMedico;
    }
    public setIdMedico(idMedico: number): void {
        this.idMedico = idMedico;
    }

    public getNome(): string {
        return this.nome;
    }
    public setNome(_nome: string): void {
        this.nome = _nome;
    }

    public getCrm(): string {
        return this.crm;
    }
    public setCrm(_crm: string): void {
        this.crm = _crm;
    }

    public getEspecialidade(): string {
        return this.especialidade;
    }
    public setEspecialidade(_especialidade: string): void {
        this.especialidade = _especialidade;
    }

    public getValorConsulta(): number {
        return this.valorConsulta;
    }
    public setValorConsulta(_valorConsulta: number): void {
        this.valorConsulta = _valorConsulta;
    }

    public getSituacao(): boolean {
        return this.situacao;
    }
    public setSituacao(_situacao: boolean): void {
        this.situacao = _situacao
    }
}

export default Medico;
