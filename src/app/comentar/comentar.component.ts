import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FirestoreService } from 'src/shared/service/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comentar',
  templateUrl: './comentar.component.html',
  styleUrls: ['./comentar.component.css']
})
export class ComentarComponent implements OnInit, OnChanges {

  @Input() display = false;
  @Input() darkMode = false;
  @Input() textSelect = '';
  @Input() contoId = '';
  @Input() contoType = '';
  @Input() contoTitulo = '';
  @Output() onCloseDialog: EventEmitter<any> = new EventEmitter<any>();
  
  comentarAberto = false;
  mobileMenu = false;
  fechandoComentar = false;

  comentario = '';
  nome = '';
  showAll;

  constructor(private fireStoreService: FirestoreService) {
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      this.mobileMenu = true;
    }
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.display) {
      setTimeout(() => {
        var comentarModal = document.getElementById('comentarModalId');
        comentarModal.className = this.mobileMenu ? 'comentarMobile comentarOpenMobile' : 'comentar comentarOpen';
        this.comentarAberto = true;
      }, 100);
    }
  }
  
  // Esc
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (this.display) {
      this.closeComentar('close');
    }
  }

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement) {
    if (this.comentarAberto) {
      let insideInfoWindow = ((event.target as HTMLInputElement).className.includes('comentarWindows'));

      if (!insideInfoWindow) {
        this.closeComentar('close');
      }
    }
  }

  closeComentar(opcao) {
    if (!this.fechandoComentar) {
      this.fechandoComentar = true;
      var comentarModal = document.getElementById('comentarModalId');
      let currentClasses = comentarModal.className;
      let correctClass = this.mobileMenu ? currentClasses.split('comentarOpenMobile') : currentClasses.split('comentarOpen');

      comentarModal.className = this.mobileMenu ? correctClass[0] + ' comentarCloseMobile' : correctClass[0] + ' comentarClose';

      setTimeout(() => {
        this.fechandoComentar = false;
        this.comentarAberto = false;
        comentarModal.className = 'comentarHidden';
        this.onCloseDialog.emit({opcao: opcao});
      }, 250);
    }
  }

  send() {
    let visibleValue = this.showAll === '' ? false : this.showAll;
    this.fireStoreService.insertComentario(this.nome, this.comentario, visibleValue, this.textSelect, this.contoId, this.contoType).then(res => {
      this.aviso('Comentário salvo! Muito obrigado.');
      this.nome = '';
      this.comentario = '';
      this.showAll = '';
      this.closeComentar('enviado');
    });
  }

  aviso(message) {
    const toastSending = Swal.mixin({
      toast: true,
      position: 'top',
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
    })
    
    let color =  this.darkMode ? 'white' : 'black';
    toastSending.fire({
      icon: 'info',
      background: this.darkMode ? 'currentColor' : 'ghostwhite',
      iconColor: color,
      title: '<span style="color:' + color + '">' + message + '</span>'
    });
  }
}
