import {Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css', './../../assets/css/bootstrap/bootstrap.min.css']
})
export class InfoComponent implements OnInit, OnChanges {
  @Input() display = false;
  @Input() objInfo = null;
  @Input() abrir = 'abrirNovo';
  @Output() onCloseDialog: EventEmitter<any> = new EventEmitter<any>();

  currentWidth: any;
  
  fechando = false;
  mobileMenu = false;

  constructor(private _eref: ElementRef) {
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
    this.currentWidth = window.innerWidth;
  }

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement) {
    if (this.display) {
      let insideCapas = ((event.target as HTMLInputElement).className.includes('capa'));
      let insideInfoWindow = ((event.target as HTMLInputElement).className.includes('infoWindows'));

      if (!insideCapas && !insideInfoWindow) {
        this.closePromotion();
      }
    }
  }

  ngOnChanges() {
    if (this.display && !this.fechando && this.abrir === 'abrirNovo') {
      setTimeout(() => {
        var infoModal = document.getElementById('infoModalId');
        infoModal.className = this.mobileMenu ? 'infoMobile infoOpenMobile' : 'info infoOpen';
      }, 100);
    } else if (this.abrir === 'fechar') {
        this.closePromotion();
    } else if (this.abrir === 'fecharEAbrir') {
      this.closePromotion();
    }
  }

  // Esc
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (this.display) {
      this.closePromotion();
    }
  }

  closePromotion() {
    if (!this.fechando) {
      this.fechando = true;
      var infoModal = document.getElementById('infoModalId');
      let currentClasses = infoModal.className;
      let correctClass = this.mobileMenu ? currentClasses.split('infoOpenMobile') : currentClasses.split('infoOpen');

      infoModal.className = this.mobileMenu ? correctClass[0] + ' infoCloseMobile' : correctClass[0] + ' infoClose';

      setTimeout(() => {
        this.fechando = false;
        infoModal.className = 'infoHidden';
        this.onCloseDialog.emit({opcao: 'close'});
      }, 250);
    }
  }

  leitura() {
    if (!this.fechando) {
      this.fechando = true;
      var infoModal = document.getElementById('infoModalId');
      let currentClasses = infoModal.className;
      let correctClass = this.mobileMenu ? currentClasses.split('infoOpenMobile') : currentClasses.split('infoOpen');

      infoModal.className = this.mobileMenu ? correctClass[0] + ' infoCloseMobile' : correctClass[0] + ' infoClose';

      setTimeout(() => {
        this.fechando = false;
        infoModal.className = 'infoHidden';

        //if (this.objInfo.bilbboConto) {
        //  this.confirmarBilbbo();
        //  this.onCloseDialog.emit({opcao: 'close'});
        //} else {
          this.onCloseDialog.emit({
            opcao: 'ler', 
            contoId: this.objInfo.id, 
            contoTitulo: this.objInfo.titulo, 
            contoType: this.objInfo.type, 
            contoDescricao: this.objInfo.descricao, 
          });
        //}
      }, 250);
    }
  }

  aviso(message) {
    const toastSending = Swal.mixin({
      toast: true,
      position: 'top',
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
    })
    
    toastSending.fire({
      icon: 'info',
      background: 'currentColor',
      iconColor: 'white',
      title: '<span style="color: white;">' + message + '</span>'
    });
  }

  confirmarBilbbo() {
    let linkOpen = this.objInfo.link;
    Swal.fire({
      title: '<span style="color: white">Aviso de redirecionamento</span>',
      text: 'Este conto foi escrito por mim, mas publicado em outro local. Para leitura você será redirecionado. Deseja continuar?',
      showCancelButton: true,
      background: 'currentColor',
      confirmButtonText: 'Sim',
      confirmButtonColor: 'black',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.value) {
        window.open(linkOpen);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.aviso('Os contos marcados com o selo de uma editora sempre irão redirecioná-lo.');
      }
    })
  }
}
