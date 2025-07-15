
export class ComentarioModel {
    nome: string;
    comentario: string;
    visible: boolean;
    frase: string;
    contoId: string;
    type: string;
    dateNow: number;

    constructor(nome, comentario, visible, frase, contoId, type, dateNow) {
        this.nome = nome;
        this.comentario = comentario;
        this.visible = visible;
        this.frase = frase;
        this.contoId = contoId;
        this.type = type;
        this.dateNow = dateNow;
    }
}