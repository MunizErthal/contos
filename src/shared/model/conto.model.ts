import { CategoriaModel } from "./categoria.model";

export class ContoModel {

    id: string;
    index: number;
    titulo: string;
    descricao: string;
    categoria: string;

    nomeId: string;
    nextOne: string;
    bilbboConto: boolean;
    link: string;

    type: string;
    tag: string[];

    leituras: number;
    curtidas: number;
    
    blogLink: string[];
    contoLink: string[];
    miniLink: string[];

    constructor(titulo, descricao, categoria, nextOne, bilbboConto, index, leituras, curtidas) {
        this.index = index;
        this.titulo = titulo;
        this.descricao = descricao;
        this.categoria = categoria;
        this.nextOne = nextOne;
        this.bilbboConto = bilbboConto;
        this.leituras = leituras;
        this.curtidas = curtidas;
        this.blogLink = [];
        this.contoLink = [];
        this.miniLink = [];
    }
}