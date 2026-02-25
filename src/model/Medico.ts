import { DatabaseModel } from "./DatabaseModel.js"; // Importa a classe de conexão
import { type MedicoDTO } from "../interface/MedicoDTO.js";

const database = new DatabaseModel().pool; // Inicializa o pool

class Medico {
    private idMedico: number = 0;
    private nome: string;
    private crm: string;
    private especialidade: string;
    private valorConsulta: number;
    private senhaMedico: string;
    private situacao: boolean = true;

    constructor(
        _nome: string,
        _crm: string,
        _especialidade: string,
        _valorConsulta: number,
        _senhaMedico: string,
        _situacao?: boolean
    ) {
        this.nome = _nome;
        this.crm = _crm;
        this.especialidade = _especialidade;
        this.valorConsulta = _valorConsulta;
        this.senhaMedico = _senhaMedico;
        this.situacao = _situacao || false;
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

    public getSenhaMedico(): string {
        return this.senhaMedico;
    }
    public setSenhaMedico(_senhaMedico: string): void {
        this.senhaMedico = _senhaMedico;
    }
    
    public getSituacao(): boolean {
        return this.situacao;
    }
    public setSituacao(_situacao: boolean): void {
        this.situacao = _situacao
    }

}

export default Medico;