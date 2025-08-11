import { Inject, Injectable } from '@angular/core';
import { Firestore, doc, getDoc, collection, getDocs, query, where, orderBy, setDoc, updateDoc } from '@angular/fire/firestore';
import { ComentarioModel } from '../model/comentario.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  @Inject(Firestore) firestore: Firestore;
  constructor() { }

  async getLeituraById(contoId: string, contoType: string) {
    if (contoType === 'conto')
      return this.getContoById(contoId);
    else if (contoType === 'miniconto')
      return this.getMinicontoById(contoId);
    else if (contoType === 'blog')
      return this.getBlogById(contoId);
    else
      return null;
  }

  getContoById(contoId: string) {
    const docRef = doc(this.firestore, 'contos', contoId);
    return getDoc(docRef);
  }

  getMinicontoById(contoId: string) {
    const docRef = doc(this.firestore, 'minicontos', contoId);
    return getDoc(docRef);
  }

  getBlogById(contoId: string) {
    const docRef = doc(this.firestore, 'blog', contoId);
    return getDoc(docRef);
  }

  async getCapa(contoId: string, contoType: string) {
    if (contoType === 'conto')
      return this.getCapaContoById(contoId);
    else if (contoType === 'miniconto')
      return this.getCapaMinicontoById(contoId);
    else if (contoType === 'blog')
      return this.getCapaBlogById(contoId);
    else
      return null;
  }

  getCapaContoById(contoId: string) {
    const docRef = doc(this.firestore, 'capas', contoId);
    return getDoc(docRef);
  }

  getCapaMinicontoById(contoId: string) {
    const docRef = doc(this.firestore, 'capas-minicontos', contoId);
    return getDoc(docRef);
  }

  getCapaBlogById(contoId: string) {
    const docRef = doc(this.firestore, 'capas-blog', contoId);
    return getDoc(docRef);
  }

  getCapasContos() {
    const colRef = collection(this.firestore, 'capas');
    const q = query(colRef, where('show', '==', true), orderBy('index', 'desc'));
    return getDocs(q);
  }

  getCapasMinicontos() {
    const colRef = collection(this.firestore, 'capas-minicontos');
    const q = query(colRef, orderBy('index', 'desc'));
    return getDocs(q);
  }

  getCapasBlogs() {
    const colRef = collection(this.firestore, 'capas-blog');
    const q = query(colRef, orderBy('index'));
    return getDocs(q);
  }

  getEscrevendo() {
    const colRef = collection(this.firestore, 'escrevendo');
    const q = query(colRef, orderBy('index'));
    return getDocs(q);
  }

  getCapasContosByParam(param: string) {
    const colRef = collection(this.firestore, 'capas');
    const q = query(
      colRef,
      where('titulo', '>=', param),
      where('tag', 'array-contains', param),
      orderBy('titulo')
    );
    return getDocs(q);
  }

  insertComentario(nome: string, comentario: string, visible: boolean, frase: string, contoId: string, type: string) {
    let dateNow = new Date().getTime();
    let comentarioObj = new ComentarioModel(nome, comentario, !visible, frase, contoId, type, dateNow);
    const docRef = doc(this.firestore, 'comentarios', `comentario-${nome}-${contoId}-${dateNow}`);
    return setDoc(docRef, JSON.parse(JSON.stringify(comentarioObj)));
  }

  getComentarios(contoId: string) {
    const colRef = collection(this.firestore, 'comentarios');
    const q = query(
      colRef,
      where('contoId', '==', contoId),
      where('visible', '==', true),
      orderBy('dateNow')
    );
    return getDocs(q);
  }

  async saveReadInfo(readInfo: any, contoId: string) {
    let dateNow = new Date().getTime();
    const docRef = doc(this.firestore, 'readinfo', `readinfo--${contoId}-${dateNow}`);
    await setDoc(docRef, JSON.parse(JSON.stringify(readInfo)));
    return dateNow;
  }

  async edit(readInfo: any, documentId: string) {
    let dateNow = new Date().getTime();
    const docRef = doc(this.firestore, 'readinfo', documentId);
    await updateDoc(docRef, JSON.parse(JSON.stringify(readInfo)));
    return dateNow;
  }

  getLeituras(contoId: string, type: string) {
    const docRef = doc(this.firestore, type, contoId);
    return getDoc(docRef);
  }

  updateLeitura(contoId: string, contoType: string, quantity: number) {
    let path = '';
    if (contoType === 'conto') path = 'capas';
    else if (contoType === 'miniconto') path = 'capas-minicontos';
    else if (contoType === 'blog') path = 'capas-blog';
    const docRef = doc(this.firestore, path, contoId);
    return updateDoc(docRef, { leituras: quantity });
  }

  updateCurtida(contoId: string, contoType: string, quantity: number) {
    let path = '';
    if (contoType === 'conto') path = 'capas';
    else if (contoType === 'miniconto') path = 'capas-minicontos';
    else if (contoType === 'blog') path = 'capas-blog';
    const docRef = doc(this.firestore, path, contoId);
    return updateDoc(docRef, { curtidas: quantity });
  }
}