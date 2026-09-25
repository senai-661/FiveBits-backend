import { DatabaseModel } from "./DatabaseModel.js"; // Importa a classe de conexão
import type { ConsultaDTO } from "../interface/ConsultaDTO.js"; // Importa a interface DTO da consulta

const database = new DatabaseModel().pool; // Inicializa o pool

class Consulta {
    private idConsulta: number = 0;
    private idPaciente: number = 0;
    private idMedico: number = 0;
    private dataHora: Date;
    private status: string;
    private modalidade: string;
    private triagemSintomas: string;
    private situacao: boolean = true

    // Constructor da Classe Consulta
    constructor(
        _dataHora: Date,
        _modalidade: string,
        _triagemSintomas: string,
        _idPaciente?: number, // ? = Opcional
        _idMedico?: number, // ? = Opcional
        _status?: string, // ? = Opcional
        _situacao?: boolean // ? = Opcional
    ) {
        this.dataHora = _dataHora;
        this.idPaciente = _idPaciente || 0; // Opcional
        this.idMedico = _idMedico || 0; // Opcional
        this.status = _status || ""; // Opcional
        this.modalidade = _modalidade;
        this.triagemSintomas = _triagemSintomas;
        this.situacao = _situacao || false; // Opcional
    }

    // Métodos GET e SET (Encapsulamento)
    public getIdConsulta(): number {
        return this.idConsulta;
    }
    public setIdConsulta(_idConsulta: number): void {
        this.idConsulta = _idConsulta;
    }

    public getIdPaciente(): number {
        return this.idPaciente;
    }
    public setIdPaciente(idPaciente: number): void {
        this.idPaciente = idPaciente;
    }

    public getIdMedico(): number {
        return this.idMedico;
    }
    public setIdMedico(_idMedico: number): void {
        this.idMedico = _idMedico;
    }

    public getDataHora(): Date {
        return this.dataHora;
    }
    public setDataHora(_dataHora: Date): void {
        this.dataHora = _dataHora;
    }

    public getStatus(): string {
        return this.status;
    }
    public setStatus(_status: string): void {
        this.status = _status;
    }

    public getModalidade(): string {
        return this.modalidade;
    }
    public setModalidade(_modalidade: string): void {
        this.modalidade = _modalidade;
    }

    public getTriagemSintomas(): string {
        return this.triagemSintomas;
    }
    public setTriagemSintomas(_triagemSintomas: string): void {
        this.triagemSintomas = _triagemSintomas;
    }

    public getSituacao(): boolean {
        return this.situacao;
    }
    public setSituacao(_situacao: boolean): void {
        this.situacao = _situacao;
    }

}

export default Consulta;