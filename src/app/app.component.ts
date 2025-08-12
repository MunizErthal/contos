import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { SearchEventService } from 'src/shared/service/search-event.service';
import { SEOService } from 'src/shared/service/SEOService.service';
import { FirestoreService } from 'src/shared/service/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './../assets/css/bootstrap/bootstrap.min.css']
})
export class AppComponent {
  title = 'Fernando Muniz Erthal';
  mobileMenu = false;
  searchParam = '';

  showMenus = true;
  scrollLocation = 0;

  @ViewChild('navBar') navBar: ElementRef;

  lastRoute = 1;

  constructor(public router: Router, private route: ActivatedRoute, private fireStoreService: FirestoreService, private sarchEventService: SearchEventService, private _eref: ElementRef, private _seoService: SEOService) {
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      this.mobileMenu = true;
    } else {
      router.events.subscribe((val) => {
          if (val instanceof NavigationEnd) {
            if ((val as NavigationEnd).url.includes('leitura')) {
              this.searchParam = '';
            } else {
              let originalBreak = (val as NavigationEnd).url.split('//');
              let urlArray = originalBreak.length > 1 ? originalBreak[1].split('/') : originalBreak[0].split('/');
              let urlArraySize = urlArray.length > 0 ? urlArray.length - 1 : 0;
              let firstLatter = urlArray[urlArraySize].substr(0, 1);
              let resto = urlArray[urlArraySize].substr(1);
              let titlePage = resto.length > 0 ? ' - ' + firstLatter.toUpperCase() + resto : '';
              titlePage = titlePage.includes(';') ? titlePage.split(';')[0] : titlePage;
              
              this._seoService.updateTitle('Fernando Muniz Erthal' + titlePage);
              this._seoService.updateOgTitle('Fernando Muniz Erthal' + titlePage);
            }
          }
      });
    }

    setTimeout(() => {
      this.setCurrentRoute();
    }, 500);
  }

  onSwipeLeft(evt) {
    if (this.mobileMenu) {
      let inputMenu = (document.getElementById("buttonCloseMenu") as HTMLInputElement);
      inputMenu.checked = true;
      let openSwipeDiv = (document.getElementById("openSwipeDiv") as HTMLInputElement);
      openSwipeDiv.style.width = '100vw';
    }
  }

  onSwipeRight(evt) {
    if (this.mobileMenu) {
      let inputMenu = (document.getElementById("buttonCloseMenu") as HTMLInputElement);
      inputMenu.checked = false;
      let openSwipeDiv = (document.getElementById("openSwipeDiv") as HTMLInputElement);
      openSwipeDiv.style.width = '5vw';
    }
  }

  closeMenuNav() {
    let inputMenu = (document.getElementById("buttonCloseMenu") as HTMLInputElement);
    inputMenu.checked = false;
    let openSwipeDiv = (document.getElementById("openSwipeDiv") as HTMLInputElement);
    openSwipeDiv.style.width = '5vw';
  }

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement) {
    if (this.mobileMenu) {
      let inputMenu = (document.getElementById("buttonCloseMenu") as HTMLInputElement);
      if (event.target !== inputMenu) {
        let menu = (document.getElementById("menuToggle") as HTMLInputElement);
        if (!menu.contains(targetElement)) {
          inputMenu.checked = false;
          let openSwipeDiv = (document.getElementById("openSwipeDiv") as HTMLInputElement);
          openSwipeDiv.style.width = '5vw';
        }
      }      
    }
  }

  verifyMenu() {
    if ((document.getElementById("buttonCloseMenu") as HTMLInputElement).checked) {
      let openSwipeDiv = (document.getElementById("openSwipeDiv") as HTMLInputElement);
      openSwipeDiv.style.width = '100vw';
    } else {
      let openSwipeDiv = (document.getElementById("openSwipeDiv") as HTMLInputElement);
      openSwipeDiv.style.width = '5vw';
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
    this.scrollLocation = (totalScroll / endPage) * 100;

    if (!this.mobileMenu) {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        document.getElementById("pesquisarId").style.fontSize = "0vw";
        document.getElementById("minicontosMenu").style.fontSize = "0vw";
        document.getElementById("blogMenu").style.fontSize = "0vw";
        document.getElementById("contosMenu").style.fontSize = "0vw";
        document.getElementById("pesquisarInputId").style.width = "0%";
        document.getElementById("navbar").style.height = "4vw";
        document.getElementById("logo").classList.add("shrink");
      } else {
        document.getElementById("pesquisarId").style.fontSize = "1.3vw";
        document.getElementById("minicontosMenu").style.fontSize = "1.3vw";
        document.getElementById("blogMenu").style.fontSize = "1.3vw";
        document.getElementById("contosMenu").style.fontSize = "1.3vw";
        document.getElementById("pesquisarInputId").style.width = "100%";
        document.getElementById("navbar").style.height = "7vw";
        document.getElementById("logo").classList.remove("shrink");
      }
    }
  }

  setCurrentRoute() {
    if (window.location.href === undefined)
      this.changeMenu(1);
    else if(window.location.href.indexOf('home') >= 0) {
      this.changeMenu(1);
    } else if (window.location.href.indexOf('contos') >= 0 || window.location.href.indexOf('conto') >= 0) {
      this.desativarMenuColor();
      //this.router.navigate(['/contos']);
    } else if (window.location.href.indexOf('minicontos') >= 0 || window.location.href.indexOf('miniconto') >= 0) {
      this.desativarMenuColor();
      //this.router.navigate(['/minicontos']);
    } else if (window.location.href.indexOf('blogs') >= 0 || window.location.href.indexOf('blog') >= 0) {
      this.desativarMenuColor();
      //this.router.navigate(['/blog']);
    } else if (window.location.href.indexOf('sobre') >= 0) {
      this.changeMenu(2);
    } else if (window.location.href.indexOf('contato') >= 0) {
      this.changeMenu(3);
    } else if (window.location.href.indexOf('escrevendo') >= 0) {
      this.changeMenu(4);
    } else if (window.location.href.indexOf('pesquisa') >= 0 || window.location.href.indexOf('pesquisar') >= 0) {
      this.changeMenu(5);
    }  else {
      this.changeMenu(1);
    }
  }

  desativarMenuColor() {
    let pesquisaMenu = document.getElementById("pesquisarMenu");
    let homeMenu = document.getElementById("homeMenu");
    let sobreMenu = document.getElementById("sobreMenu");
    let contatoMenu = document.getElementById("contatoMenu");
    let escrevendoMenu = document.getElementById("escrevendoMenu");

    if (pesquisaMenu !== null)
      pesquisaMenu.className = 'navbar-brand opcao currentFont';
    if (homeMenu !== null)
      homeMenu.className = 'navbar-brand opcao currentFont';
    if (sobreMenu !== null)
      sobreMenu.className = 'navbar-brand opcao currentFont';
    if (contatoMenu !== null)
      contatoMenu.className = 'navbar-brand opcao currentFont';
    if (escrevendoMenu !== null)
      escrevendoMenu.className = 'navbar-brand opcao currentFont';
  }

  changeMenu(menuId, param = '') {
    if (this.mobileMenu) {
      (document.getElementById("buttonCloseMenu") as HTMLInputElement).checked = false;
      let openSwipeDiv = (document.getElementById("openSwipeDiv") as HTMLInputElement);
      openSwipeDiv.style.width = '5vw';
    }

    if(menuId === 1) {
      if (this.mobileMenu)
        document.getElementById("pesquisarMenu").className = 'navbar-brand opcao currentFont';
        
      document.getElementById("homeMenu").className = 'navbar-brand opcao active currentFont';
      document.getElementById("sobreMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("contatoMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("escrevendoMenu").className = 'navbar-brand opcao currentFont';
      
      if (!this.mobileMenu) {
        document.getElementById("minicontosMenu").className = 'navbar-brand opcao currentFont';
        document.getElementById("contosMenu").className = 'navbar-brand opcao currentFont';
        document.getElementById("blogMenu").className = 'navbar-brand opcao currentFont';
      }

      this.searchParam = '';
      this.router.navigate(['/']);
    } else if (menuId === 2) {
      if (this.mobileMenu)
        document.getElementById("pesquisarMenu").className = 'navbar-brand opcao currentFont';
        
      document.getElementById("homeMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("sobreMenu").className = 'navbar-brand opcao active currentFont';
      document.getElementById("contatoMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("escrevendoMenu").className = 'navbar-brand opcao currentFont';
      
      if (!this.mobileMenu) {
        document.getElementById("minicontosMenu").className = 'navbar-brand opcao currentFont';
        document.getElementById("contosMenu").className = 'navbar-brand opcao currentFont';
        document.getElementById("blogMenu").className = 'navbar-brand opcao currentFont';
      }

      this.searchParam = '';
      this.router.navigate(['/sobre']);
    } else if (menuId === 3) {
      if (this.mobileMenu)
        document.getElementById("pesquisarMenu").className = 'navbar-brand opcao currentFont';
        
      document.getElementById("homeMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("sobreMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("contatoMenu").className = 'navbar-brand opcao active currentFont';
      document.getElementById("escrevendoMenu").className = 'navbar-brand opcao currentFont';

      if (!this.mobileMenu) {
        document.getElementById("minicontosMenu").className = 'navbar-brand opcao currentFont';
        document.getElementById("contosMenu").className = 'navbar-brand opcao currentFont';
        document.getElementById("blogMenu").className = 'navbar-brand opcao currentFont';
      }

      this.searchParam = '';
      this.router.navigate(['/contato']);
    } else if (menuId === 4) {
      if (this.mobileMenu)
        document.getElementById("pesquisarMenu").className = 'navbar-brand opcao currentFont';

      document.getElementById("homeMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("sobreMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("contatoMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("escrevendoMenu").className = 'navbar-brand opcao active currentFont';

      if (!this.mobileMenu) {
        document.getElementById("minicontosMenu").className = 'navbar-brand opcao currentFont';
        document.getElementById("contosMenu").className = 'navbar-brand opcao currentFont';
        document.getElementById("blogMenu").className = 'navbar-brand opcao currentFont';
      }

      this.searchParam = '';
      this.router.navigate(['/escrevendo']);
    } else if (menuId === 5) {
      document.getElementById("homeMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("sobreMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("contatoMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("escrevendoMenu").className = 'navbar-brand opcao currentFont';

      if (!this.mobileMenu) {
        document.getElementById("minicontosMenu").className = 'navbar-brand opcao currentFont';
        document.getElementById("contosMenu").className = 'navbar-brand opcao currentFont';
        document.getElementById("blogMenu").className = 'navbar-brand opcao currentFont';
      }

      if (this.mobileMenu)
        document.getElementById("pesquisarMenu").className = 'navbar-brand opcao active currentFont';
      
        
      this.lastRoute = this.verifyCurrentRouteToBackSearch();
      console.log(this.lastRoute);
      this.router.navigate(['/pesquisa', { searchParam: param }]);
    }
  }

  changeSearchParam() {
    if (this.searchParam.length <= 0 || this.searchParam === '') {
      if (this.lastRoute > 0)
        this.changeMenu(this.lastRoute);
      else 
        this.goToCategory(this.lastRoute);
    } else {
      this.sarchEventService.publishSomeData({
        searchParam: this.searchParam
      });
      if (window.location.href.indexOf('pesquisa') < 0)
        this.changeMenu(5, this.searchParam);
    }
  }

  goToCategory(category) {
    if (category === -1) {
      this.desativarMenuColor();
      this.router.navigate(['/conto']);
    } else if (category === -2) {
      this.desativarMenuColor();
      this.router.navigate(['/miniconto']);
    } else if (category === -3) {
      this.desativarMenuColor();
      this.router.navigate(['/blog']);
    } else {
      this.changeMenu(1);
    }
  }

  verifyCurrentRouteToBackSearch() {
    if (window.location.href == undefined)
      return 1;
    else if(window.location.href.indexOf('home') >= 0) {
      return 1;
    } else if (window.location.href.indexOf('contos') >= 0 || window.location.href.indexOf('conto') >= 0) {
      return -1;
    } else if (window.location.href.indexOf('minicontos') >= 0 || window.location.href.indexOf('miniconto') >= 0) {
      return -2;
    } else if (window.location.href.indexOf('blogs') >= 0 || window.location.href.indexOf('blog') >= 0) {
      return -3;
    } else if (window.location.href.indexOf('sobre') >= 0) {
      return 2;
    } else if (window.location.href.indexOf('contato') >= 0) {
      return 3;
    } else if (window.location.href.indexOf('escrevendo') >= 0) {
      return 4;
    } else if (window.location.href.indexOf('pesquisa') >= 0 || window.location.href.indexOf('pesquisar') >= 0) {
      return 5;
    }  else {
      return 1;
    }
  }

  exitSearchParam() {
    if (this.searchParam.length <= 0 || this.searchParam === '') {
      if (this.lastRoute > 0)
        this.changeMenu(this.lastRoute);
      else 
        this.goToCategory(this.lastRoute);
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

  goInstagram() {
    window.open('https://www.instagram.com/fernandom.erthal/');
  }
}
