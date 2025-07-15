import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { ContoModel } from 'src/shared/model/conto.model';
import { FirestoreService } from 'src/shared/service/firestore.service';
import { SearchEventService } from 'src/shared/service/search-event.service';
import { SEOService } from 'src/shared/service/SEOService.service';
import { map, filter, mergeMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pesquisa',
  templateUrl: './pesquisa.component.html',
  styleUrls: ['./pesquisa.component.css', './../../assets/css/bootstrap/bootstrap.min.css']
})
export class PesquisaComponent implements OnInit {

  mobileMenu = false;
  searchParam = '';

  initBaseGetAll = false;
  initSearch = false;

  filterList: ContoModel[] = []; 
  contosList: ContoModel[] = [];

  filterListMinicontos: ContoModel[] = []; 
  minicontosList: ContoModel[] = [];

  filterListBlogs: ContoModel[] = []; 
  blogsList: ContoModel[] = [];

  // Infos
  
  getInfos = false;
  firstAcess = true;
  abrir = 'abrirNovo';
  abrindoOutraVez = false;
  clickAnimationRun = false;
  displayInfo = false;
  objInfo = null;
  animacaoIntro = true;

  constructor(private router: Router, private route: ActivatedRoute, private sarchEventService: SearchEventService, private fireStoreService: FirestoreService, private _seoService: SEOService) { 
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

    this.getAllContos();

    // Fazer isso para WEB
    if (!this.mobileMenu) {
      let paramRouteSearch = this.route.snapshot.paramMap.get('searchParam');
      if(paramRouteSearch.length > 0 || paramRouteSearch !== '') {
        this.searchParam = paramRouteSearch;
        this.changeSearchParam();
      }
      
      this.sarchEventService.getObservable().subscribe((data) => {
        this.searchParam = data.searchParam;
        this.changeSearchParam();
      });
    }
  }

  ngOnInit(): void {
    
  }

  getAllContos() {
    this.initBaseGetAll = true;
    this.fireStoreService.getCapasContos().then(res => {
      res.forEach(doc => {
        let conto = doc.data() as ContoModel;
        conto.id = doc.id;

        if (conto !== undefined && conto !== null)
          this.contosList.push(conto);
      });
    });
    
    this.loadCapasMinicontos();
  }

  loadCapasMinicontos() {
    this.fireStoreService.getCapasMinicontos().then(res => {
      res.forEach(doc => {
        let conto = doc.data() as ContoModel;
        conto.id = doc.id;

        if (conto !== undefined && conto !== null)
          this.minicontosList.push(conto);
      });

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
          this.blogsList.push(conto);
      });
      
      this.initBaseGetAll = false;
    });
  }

  changeSearchParam() {
    if (!this.initSearch) {
      this.initSearch = true;

      // fazer sumir
      var allContos = document.getElementById('allContos');
      if (allContos)
        allContos.className = 'capaClose';

      // Fixar a primeira parte após animação
      setTimeout(() => {
        var allContos = document.getElementById('allContos');
        if (allContos)
          allContos.className = 'capaCloseFix';
      }, 500);

      this.changeSearchParamContos();
      this.changeSearchParamMinicontos();
      this.changeSearchParamBlogs();

      var allContos = document.getElementById('allContos');
      if (allContos)
        allContos.className = 'capaShow';

      // Fixar a primeira parte após animação
      setTimeout(() => {
        var allContos = document.getElementById('allContos');
        if (allContos)
          allContos.className = 'capaOpenFix';
      }, 500);
      
      this.initSearch = false;
    }
  }
  
  changeSearchParamBlogs() {
    if (this.initBaseGetAll) {
      setTimeout(() => {
        this.changeSearchParamBlogs();
      }, 500);
    }

    if (this.blogsList.length < 0) {
      // this.aviso('Não foram encontrados resultados.');
    }

    this.filterListBlogs = [];
    if (this.searchParam.length > 0 || this.searchParam !== '') {
      
      // Pesquisa pelo nome
      let filterListName = [];
      this.blogsList.filter(item => {
          if((item as ContoModel).titulo.toUpperCase().includes(this.searchParam.toUpperCase())) {
            filterListName.push(item);
          }
        }
      );

      // Pesquisa pela tag
      let filterListTag = [];
      this.blogsList.filter(item => {
          for(let tagItem of (item as ContoModel).tag) {
            if (tagItem.toUpperCase().includes(this.searchParam.toUpperCase())) {
              filterListTag.push(item);
            }
          }
        }
      );

      // Pesquisa pela categoria
      let filterListCategoria = [];
      this.blogsList.filter(item => {
          if((item as ContoModel).categoria.toUpperCase().includes(this.searchParam.toUpperCase())) {
            filterListCategoria.push(item);
          }
        }
      );

      // Adiciona os contos filtrados pela tag que são diferentes da primeira lista na lista
      for (let conto of filterListTag) {
        if (!filterListName.includes(conto)) {
          filterListName.push(conto);
        }
      }

      // Adiciona os contos filtrados pela categoria que são diferentes da primeira lista na lista
      for (let conto of filterListCategoria) {
        if (!filterListName.includes(conto)) {
          filterListName.push(conto);
        }
      }

      // Lista final agora está em ordem, começando pelos que tem nome igual ao pesquisado.
      this.filterListBlogs = filterListName;
      
      // Mostrar > Não sabe o nome? Que tal tentar procurar por um genêro ou tag?
      if (this.filterListBlogs.length < 0) {

      }
    }
  }

  changeSearchParamMinicontos() {
    if (this.initBaseGetAll) {
      setTimeout(() => {
        this.changeSearchParamMinicontos();
      }, 500);
    }

    if (this.minicontosList.length < 0) {
      // Mensagem de contos não encontrados
    }

    this.filterListMinicontos = [];
    if (this.searchParam.length > 0 || this.searchParam !== '') {
      
      // Pesquisa pelo nome
      let filterListName = [];
      this.minicontosList.filter(item => {
          if((item as ContoModel).titulo.toUpperCase().includes(this.searchParam.toUpperCase())) {
            filterListName.push(item);
          }
        }
      );

      // Pesquisa pela tag
      let filterListTag = [];
      this.minicontosList.filter(item => {
          for(let tagItem of (item as ContoModel).tag) {
            if (tagItem.toUpperCase().includes(this.searchParam.toUpperCase())) {
              filterListTag.push(item);
            }
          }
        }
      );

      // Pesquisa pela categoria
      let filterListCategoria = [];
      this.minicontosList.filter(item => {
          if((item as ContoModel).categoria.toUpperCase().includes(this.searchParam.toUpperCase())) {
            filterListCategoria.push(item);
          }
        }
      );

      // Adiciona os contos filtrados pela tag que são diferentes da primeira lista na lista
      for (let conto of filterListTag) {
        if (!filterListName.includes(conto)) {
          filterListName.push(conto);
        }
      }

      // Adiciona os contos filtrados pela categoria que são diferentes da primeira lista na lista
      for (let conto of filterListCategoria) {
        if (!filterListName.includes(conto)) {
          filterListName.push(conto);
        }
      }

      // Lista final agora está em ordem, começando pelos que tem nome igual ao pesquisado.
      this.filterListMinicontos = filterListName;
      
      // Mostrar > Não sabe o nome? Que tal tentar procurar por um genêro ou tag?
      if (this.filterListMinicontos.length < 0) {

      }
    }
  }

  changeSearchParamContos() {
    if (this.initBaseGetAll) {
      setTimeout(() => {
        this.changeSearchParamContos();
      }, 500);
    }

    if (this.contosList.length < 0) {
      // Mensagem de contos não encontrados
    }

    this.filterList = [];
    if (this.searchParam.length > 0 || this.searchParam !== '') {
      
      // Pesquisa pelo nome
      let filterListName = [];
      this.contosList.filter(item => {
          if((item as ContoModel).titulo.toUpperCase().includes(this.searchParam.toUpperCase())) {
            filterListName.push(item);
          }
        }
      );

      // Pesquisa pela tag
      let filterListTag = [];
      this.contosList.filter(item => {
          for(let tagItem of (item as ContoModel).tag) {
            if (tagItem.toUpperCase().includes(this.searchParam.toUpperCase())) {
              filterListTag.push(item);
            }
          }
        }
      );

      // Pesquisa pela categoria
      let filterListCategoria = [];
      this.contosList.filter(item => {
          if((item as ContoModel).categoria.toUpperCase().includes(this.searchParam.toUpperCase())) {
            filterListCategoria.push(item);
          }
        }
      );

      // Adiciona os contos filtrados pela tag que são diferentes da primeira lista na lista
      for (let conto of filterListTag) {
        if (!filterListName.includes(conto)) {
          filterListName.push(conto);
        }
      }

      // Adiciona os contos filtrados pela categoria que são diferentes da primeira lista na lista
      for (let conto of filterListCategoria) {
        if (!filterListName.includes(conto)) {
          filterListName.push(conto);
        }
      }

      // Lista final agora está em ordem, começando pelos que tem nome igual ao pesquisado.
      this.filterList = filterListName;
      
      // Mostrar > Não sabe o nome? Que tal tentar procurar por um genêro ou tag?
      if (this.filterList.length < 0) {

      }
    }
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
        
        this.searchParam = '';
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

    this.searchParam = '';
    this.router.navigate(['/contos']);
  }

  goMinicontos() {
    if (!this.mobileMenu) {    
      document.getElementById("minicontosMenu").className = 'navbar-brand active opcao currentFont';
      document.getElementById("contosMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("blogMenu").className = 'navbar-brand opcao currentFont';
    }

    this.searchParam = '';
    this.router.navigate(['/minicontos']);
  }
  
  goBlog() {
    if (!this.mobileMenu) {    
      document.getElementById("minicontosMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("contosMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("blogMenu").className = 'navbar-brand active opcao currentFont';
    }

    this.searchParam = '';
    this.router.navigate(['/blog']);
  }

  aviso(message) {
    const toastSending = Swal.mixin({
      toast: true,
      position: 'top',
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
    })
    
    let color = 'white';
    toastSending.fire({
      icon: 'info',
      background: 'currentColor',
      iconColor: color,
      title: '<span style="color:' + color + '">' + message + '</span>'
    });
  }
}
