import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationExtras, Params, Router, RouterLinkActive } from '@angular/router';
import { FirestoreService } from 'src/shared/service/firestore.service';
import { SEOService } from 'src/shared/service/SEOService.service';
import Swal from 'sweetalert2';
import { ContoModel } from 'src/shared/model/conto.model';
import { map, filter, mergeMap } from 'rxjs/operators';
import { ComentarioModel } from 'src/shared/model/comentario.model';
import * as moment from 'moment';

@Component({
  selector: 'app-leitura',
  templateUrl: './leitura.component.html',
  styleUrls: ['./leitura.component.css', './../../assets/css/bootstrap/bootstrap.min.css']
})
export class LeituraComponent implements OnInit, OnDestroy {
  mobileMenu = false;
  darkMode = true;
  fontSize = 1.2;

  conto = null;
  showMenuFont = true;
  clearMenuShow = false;

  displayShare = false;
  textSelect = '';
  idsInSelect = [];

  translateFreases = [];
  contoEditado = [];

  contoType = 'conto';

  displayComentar = false;

  commentWarning = false;

  comentariosList: ComentarioModel[] = [];
  loadComentario = false;
  esconde = true;

  readInfo: { contoId: string, contoType: string, finish: boolean, initLong: number, init: string, finishTime: string, finishLong: number, exitLong: number, exit: string, timeRead: string, timeExit: string };
  saveFirstTime = false;
  currentReadInfoId = undefined;
  changeUrl = false;

  liberarCurtir = true;

  contosLinks = [];
  blogsLinks = [];
  miniLinks = [];
  
  displayInfo = false;
  objInfo = null;
  firstAcess = true;
  abrir = 'abrirNovo';
  abrindoOutraVez = false;

  urlCopy = '';
  // ESSA REGRA É COM lookbehind > regex = /.*?[.!?](?![.!?])(?<!\b\w\w\.)/g; // NAVEGADORES ANTIGOS AINDA NÃO SUPORTAM
  // REGRA ABAIXO SUPORTA SAFARI E OUTROS
  regex = /(?! )(.*?(\b\w\w\.))*.*?[.?!]/g;
  
  escondidoAutomatic = false;

  constructor(private route: ActivatedRoute, private router: Router, private fireStoreService: FirestoreService, private _seoService: SEOService) {    
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      this.fontSize = 3.5;
      this.mobileMenu = true;
      this.clearMenuShow = true;

      setTimeout(() => {
        // Animação menu
        var fontMenu = document.getElementById('fontMenu');
        fontMenu.className = 'fontMenuFixClose';

        var config = document.getElementById('configId');
        if (config !== null)
          config.className = 'configOpenFix';
      }, 150);

      this.showMenuFont = false;
      setTimeout(() => {
        var fontMenu = document.getElementById('fontMenu');
        fontMenu.className = 'fontMenuOpen';

        var config = document.getElementById('configId');
        if (config !== null)
          config.className = 'configClose';
      }, 200);

      setTimeout(() => {
        var fontMenu = document.getElementById('fontMenu');
        fontMenu.className = 'fontMenuFix';

        var config = document.getElementById('configId');
        if (config !== null)
          config.className = 'configCloseFix';
        this.showMenuFont = true;
      }, 650);
    }

    setTimeout(() => {
      // Animação texto
      this.fontSize = this.mobileMenu ? 3.5 : 1.2;
      var leituraAnim = document.getElementById('leitura');
      if (leituraAnim !== null)
        leituraAnim.className = 'leituraAnim';

      var clearId = document.getElementById('clearId');
      if (clearId != null)
        clearId.className = 'clearCloseFix';
      var clearSpanId = document.getElementById('clearSpanId');
      if (clearSpanId != null)
        clearSpanId.className = 'clearCloseFix tooltiptext';
        this.clearMenuShow = false;
    }, 150);

    // Fixar a primeira parte após animação
    setTimeout(() => {
      var leituraAnim = document.getElementById('leitura');
      if (leituraAnim !== null) {
        leituraAnim.className = 'leituraAnimFix ';
      }
    }, 1100);

    if (this.mobileMenu) {
      setTimeout(() => {
        var fontMenu = document.getElementById('fontMenu');
        fontMenu.className = 'fontMenuOpen';
      }, 150);

      setTimeout(() => {
        var fontMenu = document.getElementById('fontMenu');
        fontMenu.className = 'fontMenuFix';
      }, 650);
    }
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    let comentariosDiv = (document.getElementById("comentarios") as HTMLInputElement);
    let endPage = 0;
    if (comentariosDiv !== null)
      endPage = comentariosDiv.offsetTop - document.documentElement.clientHeight;

    var currentScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var totalScroll = document.documentElement.scrollTop;
    let scrollLocation = (totalScroll / endPage) * 100;
    
    if (scrollLocation >= 99 && !this.escondidoAutomatic) {
      if (this.mobileMenu && this.showMenuFont) {
        this.escondidoAutomatic = true;
        this.openCloseFontMenu(true, true);
      }

      if (!this.commentWarning) {
        this.commentWarning = true;
        this.aviso('Que tal deixar um comentário sobre o que achou?');
        
        // Guardar apenas a primeira vez que chegar no final
        if (!this.readInfo.finish) {
          // Inserir informações do objeto de leitura
          let currentHour = moment.now();
          this.readInfo.finishTime = moment(currentHour).format('DD/MM/YYYY, hh:mm:ss');
          this.readInfo.finishLong = currentHour;
          this.readInfo.timeRead = this.convertMiliToTime(moment.duration(moment(currentHour).diff(this.readInfo.initLong)).asMilliseconds());
          this.readInfo.finish = true;
          this.saveFirstTime = true;
          this.fireStoreService.edit(this.readInfo, this.currentReadInfoId);

          // Salvar como lido + 1
          this.fireStoreService.getCapa(this.readInfo.contoId, this.readInfo.contoType).subscribe(res => {
            let conto: ContoModel = res.data() as ContoModel;
            if (conto !== null && conto !== undefined) {
              this.fireStoreService.updateLeitura(this.conto.capa.id, this.contoType, conto.leituras + 1);
            }
          });
        }
      }
    } else if (this.mobileMenu && (scrollLocation < 98 && this.escondidoAutomatic)) {
      this.escondidoAutomatic = false;
      this.openCloseFontMenu(false);
    }
  }

  ngOnDestroy(): void {
    this.exitConto();
  }

  async exitConto() {
    if (!this.changeUrl) {
      // Inserir informações do objeto de leitura
      this.changeUrl = true;
      let currentHour = moment.now();
      this.readInfo.exit = moment(currentHour).format('DD/MM/YYYY, hh:mm:ss');
      this.readInfo.exitLong = currentHour;
      this.readInfo.timeExit = this.convertMiliToTime(moment.duration(moment(currentHour).diff(this.readInfo.initLong)).asMilliseconds());
      
      // Editar readInfo no firebase
      await this.fireStoreService.edit(this.readInfo, this.currentReadInfoId);
    }
  }

  convertMiliToTime(miliseconds): string {
    var ms = miliseconds % 1000;
    miliseconds = (miliseconds - ms) / 1000;
    var secs = miliseconds % 60;
    miliseconds = (miliseconds - secs) / 60;
    var mins = miliseconds % 60;
    var hrs = (miliseconds - mins) / 60;

    return this.pad(hrs) + ':' + this.pad(mins) + ':' + this.pad(secs) + '.' + this.pad(ms, 3);
  }

  curtir() {
    if (this.liberarCurtir) {
      // Salvar curtida + 1
      this.liberarCurtir = false;
      this.fireStoreService.getCapa(this.readInfo.contoId, this.readInfo.contoType).subscribe(res => {
        let conto: ContoModel = res.data() as ContoModel;
        if (conto !== null && conto !== undefined) {
          this.fireStoreService.updateCurtida(this.conto.capa.id, this.contoType, conto.curtidas + 1);
        }
      });
    }
  }

  pad(n, z?) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

  loadComentarios() {
    if (!this.loadComentario) {
      this.loadComentario = true;
      this.fireStoreService.getComentarios(this.conto.capa.id).then(res => {
        res.forEach(doc => {
            let comentario = doc.data() as ComentarioModel;
            if (comentario !== undefined && comentario !== null)
              this.comentariosList.push(comentario);
        });

        if (this.comentariosList.length <= 0) {
          this.aviso('Este ' + this.contoType + ' ainda não possuí comentários.');
        }
        
        this.esconde = false;
        this.loadComentario = false;
      });
    }
  }

  esconderComentarios() {
    this.esconde = !this.esconde;
  }

  selectFrase(frase, index) {
    var fraseObj = document.getElementById('frase' + index);
    if (fraseObj.className.includes('selectFrase')) {
      let elementIndex = this.idsInSelect.find(element => element.index === index);
      const indexRemove = this.idsInSelect.indexOf(elementIndex);
      this.idsInSelect.splice(indexRemove, 1);
      fraseObj.className = this.darkMode ? 'darkModeText selector currentFont' : 'dayModeText selector currentFont';

      // Só tirar quando for tirar a última frase
      if (this.idsInSelect.length <= 0)
        this.openClearMenu(false);
    } else {
      fraseObj.className = 'selectFrase selector currentFont';
      this.idsInSelect.push({index: index, frase: frase});
      
      // Só mostrar animação abrindo na primeira seleção
      if (this.idsInSelect.length === 1)
        this.openClearMenu(true);
    }  
  }

  ngOnInit(): void {
    // Criar objeto de info de leitura e evento ao sair do conto
    this.readInfo = {contoId: '', contoType: '', initLong: 0, exitLong: 0, init: '', exit: '', finish: false, finishTime: '', finishLong: 0, timeRead: '', timeExit: ''};

    this.changeUrl = false;
    this.router.events.subscribe((val) => {
      this.exitConto();
    });

    // Carregar conto
    this.route.queryParams.subscribe(params => {
      let contoId = params['contoId'];
      this.contoType = params['contoType'];

      if (contoId === undefined) {
        this.route.params.subscribe((paramsLink: Params) => {
          this.contoType = paramsLink.contoType;
          contoId = paramsLink.contoId;
          
          this.readInfo.contoId = contoId;
          this.readInfo.contoType = this.contoType;
              
          // Salvar readInfo vazio no firebase (ESTÁ LENDO)
          this.currentReadInfoId = 'readinfo--' + this.readInfo.contoId + '-' + this.fireStoreService.saveReadInfo(this.readInfo, this.readInfo.contoId);
          
          this.loadConto(contoId, this.contoType);
        });
      } else {
        this.readInfo.contoId = contoId;
        this.readInfo.contoType = this.contoType;
            
        // Salvar readInfo vazio no firebase (ESTÁ LENDO)
        this.currentReadInfoId = 'readinfo--' + this.readInfo.contoId + '-' + this.fireStoreService.saveReadInfo(this.readInfo, this.readInfo.contoId);
        
        this.loadConto(contoId, this.contoType);
      }
    });

    // Jogar scroll pra cima
    window.scrollTo(0, 0);
  }

  loadConto(contoId, contoType) {
    if (contoId === undefined || contoType === undefined) {
      this.router.navigate(['/']);
    }

    this.urlCopy = 'https://www.fernandome.com.br/leitura/' + contoType + '/' + contoId;
    this.fireStoreService.getLeituraById(contoId, contoType).subscribe(res => {
      this.conto = res.data();

      if (this.conto !== null && this.conto !== undefined) {
        // Editar traduções
        if (this.conto.titulo === 'Tovarishch') {
          this.editarConto();
        }
        
        // Change
        this.loadInfosLink(contoType, contoId);
        
        // Inserir informações do objeto de leitura
        let currentHour = moment.now();
        this.readInfo.init = moment(currentHour).format('DD/MM/YYYY, hh:mm:ss');
        this.readInfo.initLong = currentHour;
      } else {
        if (contoId === undefined || contoType !== undefined)
          this.aviso('Não foi possível localizar o ' + contoType + '.');
        this.router.navigate(['/']);
      }
    });
  }

  shareQuoteSocial() {
    if (this.idsInSelect.length <= 0) {
      this.aviso('Selecione a parte que deseja compartilhar.');
    } else {
      if (this.showMenuFont && this.mobileMenu)
       this.openCloseFontMenu(true);

      // Montar frase
      this.textSelect = '';
      
      let arrayOrder = this.idsInSelect.sort(function (a, b) {
        if (a.index > b.index)
          return 1;
        if (a.index < b.index)
          return -1;
        return 0;
      });

      for (let element of arrayOrder) {
        this.textSelect = this.textSelect + ' ' + element.frase;
      }

      this.displayShare = true;
    }
  }

  shareSocial() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.urlCopy; //window.location.href;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.aviso('Link de compartilhamento copiado.');
  }

  closeShare($event: any) {
    this.displayShare = false;
    if ($event.opcao === 'compartilhar' || $event.opcao === 'enviado') {
      this.setAllFrasesToWhite();
    }
  }
  
  // Esc
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (!this.displayComentar && !this.displayShare) {
      this.setAllFrasesToWhite();
    }
  }

  comentar() {
    if (this.showMenuFont && this.mobileMenu)
      this.openCloseFontMenu(true);

    // Montar frase
    this.textSelect = '';
    let arrayOrder = this.idsInSelect.sort(function (a, b) {
      if (a.index > b.index)
        return 1;
      if (a.index < b.index)
        return -1;
      return 0;
    });

    for (let element of arrayOrder) {
      this.textSelect = this.textSelect + ' ' + element.frase;
    }

    if (this.textSelect.length > 500)
      this.aviso('Você não pode comentar citando mais de 500 caracteres, e no momento, você tem ' + this.textSelect.length + ' selecionados.')
    else
      this.displayComentar = true;
  }

  closeComentar($event: any) {
    this.displayComentar = false;
    if ($event.opcao === 'compartilhar') {
      this.setAllFrasesToWhite();
      this.aviso('Comentário salvo! Muito obrigado.');
    }
  }

  setAllFrasesToWhite() {
    for (let element of this.idsInSelect) {
      var fraseObj = document.getElementById('frase' + element.index);
      fraseObj.className = this.darkMode ? 'darkModeText selector currentFont' : 'dayModeText selector currentFont';
    }

    // Só faz animação se existir algo selecionado
    if (this.idsInSelect.length >= 1)
      this.openClearMenu(false);

    this.idsInSelect = [];
    this.textSelect = '';    
  }

  openCloseFontMenu(button, automatic = false) {
    if (button) {
      setTimeout(() => {
        this.showMenuFont = false;
        var fontMenu = document.getElementById('fontMenu');
        fontMenu.className = 'fontMenuClose';
        
        var config = document.getElementById('configId');
        if (config !== null)
          config.className = 'configOpen';

        if (!automatic)
          this.escondidoAutomatic = false;
      }, 150);

      setTimeout(() => {
        var fontMenu = document.getElementById('fontMenu');
        fontMenu.className = 'fontMenuFixClose';

        var config = document.getElementById('configId');
        if (config !== null)
          config.className = 'configOpenFix';
      }, 650);
    } else if(!this.showMenuFont && !button) {
      setTimeout(() => {
        var fontMenu = document.getElementById('fontMenu');
        fontMenu.className = 'fontMenuOpen';

        var config = document.getElementById('configId');
        if (config !== null)
          config.className = 'configClose';
      }, 150);

      setTimeout(() => {
        var fontMenu = document.getElementById('fontMenu');
        fontMenu.className = 'fontMenuFix';

        var config = document.getElementById('configId');
        if (config !== null)
          config.className = 'configCloseFix';
        this.showMenuFont = true;
      }, 650);
    }
  }

  openClearMenu(select) {
    if (select) {
      this.clearMenuShow = true;
      setTimeout(() => {
        var clearId = document.getElementById('clearId');
        if (clearId != null)
          clearId.className = 'cleargOpen';
        var clearSpanId = document.getElementById('clearSpanId');
        if (clearSpanId != null)
          clearSpanId.className = 'cleargOpen tooltiptext';
      }, 150);

      setTimeout(() => {
        var clearId = document.getElementById('clearId');
        if (clearId != null)
          clearId.className = 'clearOpenFix';
        var clearSpanId = document.getElementById('clearSpanId');
        if (clearSpanId != null)
          clearSpanId.className = 'clearOpenFix tooltiptext';
      }, 650);
    } else {
      setTimeout(() => {
        var clearId = document.getElementById('clearId');
        if (clearId != null)
          clearId.className = 'clearClose';
        var clearSpanId = document.getElementById('clearSpanId');
        if (clearSpanId != null)
          clearSpanId.className = 'clearClose tooltiptext';
      }, 150);

      setTimeout(() => {
        var clearId = document.getElementById('clearId');
        if (clearId != null)
          clearId.className = 'clearCloseFix';
        var clearSpanId = document.getElementById('clearSpanId');
        if (clearSpanId != null)
          clearSpanId.className = 'clearCloseFix tooltiptext';
        this.clearMenuShow = false;
      }, 650);
    }
  }

  changeMode() {
    this.darkMode = !this.darkMode;
  }

  aumentarFontSize() {
    let limitTop = this.mobileMenu ? 5 : 2;
    if ((this.fontSize + 0.1) < limitTop)
    this.fontSize = this.fontSize + 0.1;
  }

  diminuirFontSize() {
    let limitMin = this.mobileMenu ? 3.5 : 0.8;
    if ((this.fontSize - 0.1) > limitMin)
      this.fontSize = this.fontSize - 0.1;
  }

  getContoLinks(contoLink: string[]) {
    this.fireStoreService.getCapasContos().then(res => {
      res.forEach(doc => {
        let conto = doc.data() as ContoModel;
        if (conto !== undefined && conto !== null && contoLink.findIndex(x => x === doc.id) >= 0) {
          conto.id = doc.id;
          this.contosLinks.push(conto);
        }
      });
    });
  }
  
  getBlogLinks(blogLink: string[]) {
    this.fireStoreService.getCapasBlogs().then(res => {
      res.forEach(doc => {
        let conto = doc.data() as ContoModel;
        if (conto !== undefined && conto !== null && blogLink.findIndex(x => x === doc.id) >= 0) {
          conto.id = doc.id;
          this.blogsLinks.push(conto);
        }
      });
    });
  }
  
  getMiniLinks(miniLinks: string[]) {
    this.fireStoreService.getCapasMinicontos().then(res => {
      res.forEach(doc => {
        let conto = doc.data() as ContoModel;
        if (conto !== undefined && conto !== null && miniLinks.findIndex(x => x === doc.id) >= 0) {
          conto.id = doc.id;
          this.miniLinks.push(conto);
        }
      });
    });
  }

  exitCapa(objectId) {
    var capa = document.getElementById(objectId);
    if (capa !== null) {
      let currentClasses = capa.className;
      capa.className += ' efeitoHoverInverso';

      setTimeout(() => {
        let correctClass = currentClasses.split('efeitoHoverInverso');
        capa.className = correctClass.length > 0 ? correctClass[0] : currentClasses; 
      }, 300);
    }
  }

  loadInfosLink(contoType, contoId) {
    this.fireStoreService.getCapa(contoId, contoType).subscribe(res => {
      let conto: ContoModel = res.data() as ContoModel;
      
      // Inserir infos de contos lincados
      this.conto.contoLink = conto.contoLink;
      this.conto.blogLink = conto.blogLink;

      this.contosLinks = [];
      this.blogsLinks = [];
      this.miniLinks = [];

      if (conto.blogLink && conto.blogLink.length > 0 && conto.blogLink[0] != '') {
        this.getBlogLinks(conto.blogLink);
      } else {
        if (conto.contoLink && conto.contoLink.length > 0 && conto.contoLink[0] != '')
          this.getContoLinks(conto.contoLink);
        
        if (conto.miniLink && conto.miniLink.length > 0 && conto.miniLink[0] != '')
          this.getMiniLinks(conto.miniLink);
      }

      if (conto !== null && conto !== undefined) {
          this._seoService.updateOgImage('https://fernandome.com.br/assets/images/share/ogImages/' + contoType + '/' + contoId);
          this._seoService.updateOgUrl('https://www.fernandome.com.br/leitura/' + contoType + '/' + contoId);
          this._seoService.updateTitle('Lendo ' + contoType + ' ' + conto.titulo);
          this._seoService.updateDescription(conto.descricao);
          this._seoService.updateOgTitle('Lendo ' + contoType + ' ' + conto.titulo);
          this._seoService.updateOgDescription(conto.descricao);
          //this._seoService.updateOgType('website');
          //this._seoService.updateOgUpdateTime('1440432930');
          //this._seoService.updateOgUpdateSiteName('Fernando Muniz Erthal');
          //this._seoService.updateGbAppId();
      }
    });
  }
  
  openInfo(obj) {
    if (!this.displayInfo) {
      this.abrir = 'abrirNovo';
      this.displayInfo = true;
      this.objInfo = obj;
    } else {
        // Se for o mesmo conto, apenas baixar
        if (this.objInfo.id === obj.id) {
          this.abrir = 'fechar';
        } else {
          // Se não for, abaixar e subir o novo
          let objSave = obj;
          this.abrir = 'fecharEAbrir';
          this.abrindoOutraVez = true;
          setTimeout(() => {
            this.abrir = 'abrirNovo';
            this.displayInfo = true;
            this.objInfo = objSave;
          }, 300);
        }
    }
  }

  closeInfo($event: any) {
    if (!this.abrindoOutraVez) {
      this.displayInfo = false;
      if ($event.opcao === 'ler') {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            'contoId': $event.contoId,
            'contoType': $event.contoType
          }
        };

        // Jogar scroll pra cima
        window.scrollTo(0, 0);

        this.router.navigate(['/leitura'], navigationExtras);
      } else if ($event.opcao === 'close') {      
        this.objInfo = null;
      }
    } else {
      this.abrindoOutraVez = false;
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
    
    let color =  this.darkMode ? 'white' : 'black';
    toastSending.fire({
      icon: 'info',
      background: this.darkMode ? 'currentColor' : 'ghostwhite',
      iconColor: color,
      title: '<span style="color:' + color + '">' + message + '</span>'
    });
  }

  changeTraduction(frase) {
      let fraseAux = frase.frase;
      frase.frase = frase.translate;
      frase.translate = fraseAux;
      frase.traduzido = !frase.traduzido;
  }

  editarConto() {
    this.confirmarTraducao();
    for(let paragrafo of this.conto.texto) {
      let paragrafoNovo = [];
      if (paragrafo.includes('%')) {
        let paragrafoArray = paragrafo.split('%');
        let primeiraParte = paragrafoArray[0];
        let traducao = paragrafoArray[1];
      
        let iteracao1 = primeiraParte.match(this.regex);
        if (iteracao1 !== null)
          for(let frase of iteracao1)
            paragrafoNovo.push({frase: frase, traduzido: false, translate: ''});
        else
          paragrafoNovo.push({frase: primeiraParte[0], traduzido: false, translate: ''});

        if (paragrafoNovo.length > 0) {
          let lastRegister = paragrafoNovo[paragrafoNovo.length - 1];
          paragrafoNovo[paragrafoNovo.length - 1] = ({frase: lastRegister.frase, traduzido: false, translate: traducao});
        }
        
        if (paragrafoArray.length > 2) {
          let iteracao2 = paragrafoArray[2].match(this.regex);
          if (iteracao2 !== null)
           for(let frase of iteracao2)
            paragrafoNovo.push({frase: frase, traduzido: false, translate: ''});
        }
        
        this.contoEditado.push(paragrafoNovo);
      } else {
        for(let frase of paragrafo.match(this.regex))
          paragrafoNovo.push({frase: frase, traduzido: false, translate: ''});
        this.contoEditado.push(paragrafoNovo);
      }
    }
  }

  confirmarTraducao() {
    Swal.fire({
      title: '<span style="color: white">Antes de ler</span>',
      text: 'Este conto possui partes escritas em outro idioma. É recomendado a leitura com tradução apenas na releitura, para assim, ter uma experiência diferente e completa.',
      showCancelButton: false,
      background: 'currentColor',
      confirmButtonText: 'Continuar',
      confirmButtonColor: 'black',
    });
  }
}
