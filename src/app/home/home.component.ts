import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FirestoreService } from 'src/shared/service/firestore.service';
import { ContoModel } from "./../../shared/model/conto.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './../../assets/css/bootstrap/bootstrap.min.css']
})
export class HomeComponent implements OnInit {

  contosList: ContoModel[] = [];
  start = 0;
  end = 4;

  mobileMenu = false;
  getInfos = false;
  animacaoIntro = true;

  nextExist = true;
  beforeExist = false;
  nextAnimation = false;
  beforeAnimation = false;

  minicontosList: ContoModel[] = [];
  startMiniconto = 0;
  endMiniconto = 4;

  minicontoNextExist = true;
  minicontoBeforeExist = false;
  minicontoNextAnimation = false;
  minicontoBeforeAnimation = false;
  
  blogList: ContoModel[] = [];
  startBlog = 0;
  endBlog = 4;

  blogNextExist = true;
  blogBeforeExist = false;
  blogNextAnimation = false;
  blogBeforeAnimation = false;

  firstAcess = true;
  abrir = 'abrirNovo';
  abrindoOutraVez = false;

  clickAnimationRun = false;
  clickAnimationRunMiniconto = false;
  clickAnimationRunBlog = false;

  displayInfo = false;
  objInfo = null;

  currentScrollConto = 0;
  currentScrollMiniconto = 0;
  currentScrollBlog = 0;

  constructor(private route: ActivatedRoute, private router: Router, private fireStoreService: FirestoreService) {
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

    // UMA VEZ POR DIA
    //let dt = new Date();
    //if ((dt.getDate() + '-' + dt.getMonth()) === localStorage.getItem('dateLastAcess')) {
    //  this.firstAcess = false;
    //} else {
    //  console.log(localStorage.getItem(dt.getDate() + '-' + dt.getMonth()));
    //  localStorage.setItem('dateLastAcess', dt.getDate() + '-' + dt.getMonth());
    //}

    // APENAS AO ACESSAR URL
    if (this.firstAcess) {
      // Mostrar primeira parte
      setTimeout(() => {
        var welcomePt1 = document.getElementById('welcomePt1');
        if(welcomePt1)
          welcomePt1.className = 'welcomeIntro currentFont';
      }, 150); 

      // Fixar a primeira parte após animação
      setTimeout(() => {
        var welcomePt1 = document.getElementById('welcomePt1');
        if(welcomePt1)
          welcomePt1.className = 'ficaAberto currentFont';
      }, 1500);

      // Aguardar 1 segundo e mostrar a segunda
      setTimeout(() => {
        // Mostrar
        var welcomePt2 = document.getElementById('welcomePt2');
        if(welcomePt2)
          welcomePt2.className = 'welcomeIntro currentFont';
    
        // Fixar a segunda parte após animação
        setTimeout(() => {
          if(welcomePt2)
            welcomePt2.className = 'ficaAberto currentFont';
        }, 1000);

        // Depois de 1 segundo e meio verificar se da pra fechar
        setTimeout(() => {
          this.verifyInfos();
        }, 2000);
      }, 1700);
    } else {
        this.animacaoIntro = false;

        setTimeout(() => {
          var conteudo = document.getElementById('conteudo');
          if(conteudo)
            conteudo.className = 'introCont';
        
          setTimeout(() => {
            if(conteudo)
              conteudo.className = 'ficaAberto';
          }, 500);
        }, 800);
    }

    this.loadCapasContos();
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
        welcomePt1.className = 'welcomeExit currentFont';
      
      var welcomePt2 = document.getElementById('welcomePt2');
      if(welcomePt1)
        welcomePt2.className = 'welcomeExit currentFont';
      
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

  loadCapasContos() {
    this.getInfos = true;
    this.fireStoreService.getCapasContos().then(res => {
      res.forEach(doc => {
        let conto = doc.data() as ContoModel;
        conto.id = doc.id;

        if (conto !== undefined && conto !== null)
          this.contosList.push(conto);
      });
      
      this.nextExist = (this.contosList.length >= 6);
      // Carregar minicontos
      this.loadCapasMinicontos();
    });
  }

  loadCapasMinicontos() {
    this.fireStoreService.getCapasMinicontos().then(res => {
      res.forEach(doc => {
        let conto = doc.data() as ContoModel;
        conto.id = doc.id;
        
        if (conto !== undefined && conto !== null)
          this.minicontosList.push(conto);
      });
      
      this.minicontoNextExist = (this.minicontosList.length >= 6);
      // Carregar minicontos
      this.loadCapasBlogs();
    });
  }

  loadCapasBlogs() {
    this.fireStoreService.getCapasBlogs().then(res => {
      res.forEach(doc => {
        let conto = doc.data() as ContoModel;
        conto.id = doc.id;

        if (conto !== undefined && conto !== null)
          this.blogList.push(conto);
      });
      
      this.blogNextExist = (this.blogList.length >= 6);
      this.getInfos = false;
    });
  }

  ngOnInit(): void {

  }

  next() {
    if (this.end + 2 <= this.contosList.length) {  
      if (!this.clickAnimationRun) {
        this.clickAnimationRun = true;
        setTimeout(() => {
          this.nextAnimation = false;
            this.start = this.start + 1;
            this.end = this.end + 1;
            this.beforeExist = true;

            if (this.end + 2 <= this.contosList.length) {
              this.nextExist = true;
            } else {
              this.nextExist = false;
            }

            this.clickAnimationRun = false;

            var nextCapa = document.getElementById('nextCapa');
            if (nextCapa !== null) {
              let nextCapaCurrentClass = nextCapa.className;
              nextCapa.className += ' aparecer';
              setTimeout(() => {
                let correctClass = nextCapaCurrentClass.split('aparecer');
                nextCapa.className = 'rounded float-start';
              }, 300);
            }

        }, 500);
        this.nextAnimation = true;
      }
    }
  }

  before() {
    if (this.start !== 0) {
      
      if (!this.clickAnimationRun) {
        this.clickAnimationRun = true;
        setTimeout(() => {
          this.beforeAnimation = false;
          this.start = this.start - 1;
          this.end = this.end - 1;
          this.nextExist = true;

          if (this.start - 1 < 0) {
            this.beforeExist = false;
          } else {
            this.beforeExist = true;
          }

          this.clickAnimationRun = false;
          var beforeCapa = document.getElementById('beforeCapa');
          if (beforeCapa !== null) {
            let beforeCapaCurrentClass = beforeCapa.className;
            beforeCapa.className += ' aparecer';
            setTimeout(() => {
              let correctClass = beforeCapaCurrentClass.split('aparecer');
              beforeCapa.className = 'rounded float-start';
            }, 300);
          }
        }, 500);
        this.beforeAnimation = true;
      }
    }
  }
  
  nextMiniconto() {
    if (this.endMiniconto + 2 <= this.minicontosList.length) {
      if (!this.clickAnimationRunMiniconto) {
        this.clickAnimationRunMiniconto = true;
        setTimeout(() => {
          this.minicontoNextAnimation = false;
            this.startMiniconto = this.startMiniconto + 1;
            this.endMiniconto = this.endMiniconto + 1;
            this.minicontoBeforeExist = true;

            if (this.endMiniconto + 2 <= this.minicontosList.length) {
              this.minicontoNextExist = true;
            } else {
              this.minicontoNextExist = false;
            }

            this.clickAnimationRunMiniconto = false;

            var nextCapaMiniconto = document.getElementById('nextCapaMiniconto');
            if (nextCapaMiniconto !== null) {
              let nextCapaCurrentClass = nextCapaMiniconto.className;
              nextCapaMiniconto.className += ' aparecer';
              setTimeout(() => {
                let correctClass = nextCapaCurrentClass.split('aparecer');
                nextCapaMiniconto.className = 'rounded float-start';
              }, 300);
            }

        }, 500);
        this.minicontoNextAnimation = true;
      }
    }
  }

  beforeMiniconto() {
    if (this.startMiniconto !== 0) {
      
      if (!this.clickAnimationRunMiniconto) {
        this.clickAnimationRunMiniconto = true;
        setTimeout(() => {
          this.minicontoBeforeAnimation = false;
          this.startMiniconto = this.startMiniconto - 1;
          this.endMiniconto = this.endMiniconto - 1;
          this.minicontoNextExist = true;

          if (this.startMiniconto - 1 < 0) {
            this.minicontoBeforeExist = false;
          } else {
            this.minicontoBeforeExist = true;
          }

          this.clickAnimationRunMiniconto = false;
          var beforeCapa = document.getElementById('beforeCapaMiniconto');
          if (beforeCapa !== null) {
            let beforeCapaCurrentClass = beforeCapa.className;
            beforeCapa.className += ' aparecer';
            setTimeout(() => {
              let correctClass = beforeCapaCurrentClass.split('aparecer');
              beforeCapa.className = 'rounded float-start';
            }, 300);
          }
        }, 500);
        this.minicontoBeforeAnimation = true;
      }
    }
  }

  nextBlog() {
    if (this.endBlog + 2 <= this.blogList.length) {  
      if (!this.clickAnimationRunBlog) {
        this.clickAnimationRunBlog = true;
        setTimeout(() => {
          this.blogNextAnimation = false;
            this.startBlog = this.startBlog + 1;
            this.endBlog = this.endBlog + 1;
            this.blogBeforeExist = true;

            if (this.endBlog + 2 <= this.blogList.length) {
              this.blogNextExist = true;
            } else {
              this.blogNextExist = false;
            }

            this.clickAnimationRunBlog = false;

            var nextCapaBlog = document.getElementById('nextCapaBlog');
            if (nextCapaBlog !== null) {
              let nextCapaCurrentClass = nextCapaBlog.className;
              nextCapaBlog.className += ' aparecer';
              setTimeout(() => {
                let correctClass = nextCapaCurrentClass.split('aparecer');
                nextCapaBlog.className = 'rounded float-start';
              }, 300);
            }

        }, 500);
        this.blogNextAnimation = true;
      }
    }
  }

  beforeBlog() {
    if (this.startBlog !== 0) {
      
      if (!this.clickAnimationRunBlog) {
        this.clickAnimationRunBlog = true;
        setTimeout(() => {
          this.blogBeforeAnimation = false;
          this.startBlog = this.startBlog - 1;
          this.endBlog = this.endBlog - 1;
          this.blogNextExist = true;

          if (this.startBlog - 1 < 0) {
            this.blogBeforeExist = false;
          } else {
            this.blogBeforeExist = true;
          }

          this.clickAnimationRunBlog = false;
          var beforeCapa = document.getElementById('beforeCapaBlog');
          if (beforeCapa !== null) {
            let beforeCapaCurrentClass = beforeCapa.className;
            beforeCapa.className += ' aparecer';
            setTimeout(() => {
              let correctClass = beforeCapaCurrentClass.split('aparecer');
              beforeCapa.className = 'rounded float-start';
            }, 300);
          }
        }, 500);
        this.blogBeforeAnimation = true;
      }
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

  goContos() {
    if (!this.mobileMenu) {
      document.getElementById("minicontosMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("contosMenu").className = 'navbar-brand active opcao currentFont';
      document.getElementById("blogMenu").className = 'navbar-brand opcao currentFont';
    }
    this.router.navigate(['/contos']);
  }

  goMinicontos() {
    if (!this.mobileMenu) {
      document.getElementById("minicontosMenu").className = 'navbar-brand active opcao currentFont';
      document.getElementById("contosMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("blogMenu").className = 'navbar-brand opcao currentFont';
    }

    this.router.navigate(['/minicontos']);
  }
  
  goBlog() {
    if (!this.mobileMenu) {
      document.getElementById("minicontosMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("contosMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("blogMenu").className = 'navbar-brand active opcao currentFont';
    }
    
    this.router.navigate(['/blog']);
  }

  contoAleatorio() {
    let min = 0;
    let max = this.contosList.length - 1;
    let random = (Math.random() * (max - min) + min).toFixed();

    let navigationExtras: NavigationExtras = {
      queryParams: {
        'contoId': this.contosList[random].id,
        'contoType': this.contosList[random].type
      }
    };

    this.router.navigate(['/leitura'], navigationExtras);
  }

  miniAleatorio() {
    let filteredMiniContos = this.minicontosList;//.filter(x => !x.bilbboConto);
    let min = 0;
    let max = filteredMiniContos.length - 1;
    let random = (Math.random() * (max - min) + min).toFixed();

    let navigationExtras: NavigationExtras = {
      queryParams: {
        'contoId': filteredMiniContos[random].id,
        'contoType': filteredMiniContos[random].type
      }
    };

    this.router.navigate(['/leitura'], navigationExtras);
  }

  blogAleatorio() {
    let min = 0;
    let max = this.blogList.length - 1;
    let random = (Math.random() * (max - min) + min).toFixed();

    let navigationExtras: NavigationExtras = {
      queryParams: {
        'contoId': this.blogList[random].id,
        'contoType': this.blogList[random].type
      }
    };

    this.router.navigate(['/leitura'], navigationExtras);
  }
}
