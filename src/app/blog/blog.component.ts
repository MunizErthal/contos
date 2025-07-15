import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ContoModel } from 'src/shared/model/conto.model';
import { FirestoreService } from 'src/shared/service/firestore.service';
import { SearchEventService } from 'src/shared/service/search-event.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css', './../../assets/css/bootstrap/bootstrap.min.css']
})
export class BlogComponent implements OnInit {

  mobileMenu = false;
  contosList: ContoModel[] = [];

  // Infos
  getInfos = false;
  firstAcess = true;
  abrir = 'abrirNovo';
  abrindoOutraVez = false;
  clickAnimationRun = false;
  displayInfo = false;
  objInfo = null;
  animacaoIntro = true;

  constructor(private router: Router, private route: ActivatedRoute, private sarchEventService: SearchEventService, private fireStoreService: FirestoreService) {
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

    if (this.mobileMenu)
      document.getElementById("pesquisarMenu").className = 'navbar-brand opcao currentFont';
    document.getElementById("homeMenu").className = 'navbar-brand opcao currentFont';
    document.getElementById("sobreMenu").className = 'navbar-brand opcao currentFont';
    document.getElementById("contatoMenu").className = 'navbar-brand opcao currentFont';
    document.getElementById("escrevendoMenu").className = 'navbar-brand opcao currentFont';

    setTimeout(() => {
      var leituraAnim = document.getElementById('introAnim');
      if (leituraAnim)
        leituraAnim.className = 'intro';
    }, 150);

    // Fixar a primeira parte após animação
    setTimeout(() => {
      var leituraAnim = document.getElementById('introAnim');
      if (leituraAnim)
        leituraAnim.className = 'fix';
    }, 1100);

    this.getAllBlogs();
  }

  ngOnInit(): void {
  }

  getAllBlogs() {
    this.fireStoreService.getCapasBlogs().then(res => {
      res.forEach(doc => {
        let conto = doc.data() as ContoModel;
        conto.id = doc.id;

        if (conto !== undefined && conto !== null)
          this.contosList.push(conto);
      });
    });
    
  }

  
  verifyInfos() {
    // Verificar se já carregou
    if (this.getInfos === true) {
      setTimeout(() => {
        this.verifyInfos();
      }, 150);
    } else {
      var welcomePt1 = document.getElementById('welcomePt1');
      if(welcomePt1)
        welcomePt1.className = 'welcomeExit currentFont currentFont';
      
      var welcomePt2 = document.getElementById('welcomePt2');
      if(welcomePt1)
        welcomePt2.className = 'welcomeExit currentFont currentFont';
      
      // Esperar sair a animação pra aparecer
      setTimeout(() => {
        this.animacaoIntro = false;

        setTimeout(() => {
          var conteudo = document.getElementById('conteudo');
          if(conteudo)
            conteudo.className = 'introCont';
        
          setTimeout(() => {
            if(conteudo)
              conteudo.className = 'ficaAberto';
          }, 500);
        }, 1000);
      }, 800);
    }
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

        this.router.navigate(['/leitura'], navigationExtras);
      } else if ($event.opcao === 'close') {      
        this.objInfo = null;
      }
    } else {
      this.abrindoOutraVez = false;
    }
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
}
