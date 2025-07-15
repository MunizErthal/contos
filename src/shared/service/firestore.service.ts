import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ComentarioModel } from '../model/comentario.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) { }

  getLeituraById(contoId, contoType) {
    if (contoType === 'conto')
      return this.getContoById(contoId);
    else if (contoType === 'miniconto')
      return this.getMinicontoById(contoId);
    else if (contoType === 'blog')
      return this.getBlogById(contoId);
  }

  getContoById(contoId) {
      return this.firestore.collection('contos').doc(contoId).get();
  }

  getMinicontoById(contoId) {
    return this.firestore.collection('minicontos').doc(contoId).get();
  }

  getBlogById(contoId) {
    return this.firestore.collection('blog').doc(contoId).get();
  }

  getCapa(contoId, contoType) {
    if (contoType === 'conto')
      return this.getCapaContoById(contoId);
    else if (contoType === 'miniconto')
      return this.getCapaMinicontoById(contoId);
    else if (contoType === 'blog')
      return this.getCapaBlogById(contoId);
  }

  getCapaContoById(contoId) {
    return this.firestore.collection('capas').doc(contoId).get();
  }

  getCapaMinicontoById(contoId) {
    return this.firestore.collection('capas-minicontos').doc(contoId).get();
  }

  getCapaBlogById(contoId) {
    return this.firestore.collection('capas-blog').doc(contoId).get();
  }

  getCapasContos() {
    let capasRef = this.firestore.collection('capas').ref;
    return capasRef.where('show', '==', true).orderBy('index', 'desc').get();
  }

  getCapasMinicontos() {
    let capasRef = this.firestore.collection('capas-minicontos').ref;
    return capasRef.orderBy('index', 'desc').get();
  }
  
  getCapasBlogs() {
    let capasRef = this.firestore.collection('capas-blog').ref;
    return capasRef.orderBy('index').get();
  }

  getEscrevendo() {
    let capasRef = this.firestore.collection('escrevendo').ref;
    return capasRef.orderBy('index').get();
  }

  getCapasContosByParam(param) {
    let capasRef = this.firestore.collection('capas').ref;
    return capasRef.where('titulo', '>=', 'param').where('tag', 'array-contains', param).orderBy('titulo').get();
  }

  insertComentario(nome, comentario, visible, frase, contoId, type) {
    let dateNow = new Date().getTime();
    let comentarioObj = new ComentarioModel(nome, comentario, !visible, frase, contoId, type, dateNow);
    return this.firestore.collection('comentarios').doc('comentario-' + nome + '-' + contoId + '-' + dateNow).set(JSON.parse(JSON.stringify(comentarioObj)));
  }

  getComentarios(contoId) {
    let capasRef = this.firestore.collection('comentarios').ref;
    return capasRef.where('contoId', '==', contoId).where('visible', '==', true).orderBy('dateNow').get();
  }

  saveReadInfo(readInfo, contoId) {
    let dateNow = new Date().getTime();
    this.firestore.collection('readinfo').doc('readinfo-' + '-' + contoId + '-' + dateNow).set(JSON.parse(JSON.stringify(readInfo)));
    return dateNow;
  }

  edit(readInfo, documentId) {
    let dateNow = new Date().getTime();
    this.firestore.collection('readinfo').doc(documentId).update(JSON.parse(JSON.stringify(readInfo)));
    return dateNow;
  }

  getLeituras(contoId, type) {
    return this.firestore.collection(type).doc(contoId).get();
  }

  updateLeitura(contoId, contoType, quantity) {
    if (contoType === 'conto')
      this.firestore.collection('capas').doc(contoId).update({'leituras': quantity});
    else if (contoType === 'miniconto')
      this.firestore.collection('capas-minicontos').doc(contoId).update({'leituras': quantity});
    else if (contoType === 'blog')
      this.firestore.collection('capas-blog').doc(contoId).update({'leituras': quantity});
  }

  updateCurtida(contoId, contoType, quantity) {
    if (contoType === 'conto')
      this.firestore.collection('capas').doc(contoId).update({'curtidas': quantity});
    else if (contoType === 'miniconto')
      this.firestore.collection('capas-minicontos').doc(contoId).update({'curtidas': quantity});
    else if (contoType === 'blog')
      this.firestore.collection('capas-blog').doc(contoId).update({'curtidas': quantity});
  }
}
