import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.css']
})
export class SobreComponent implements OnInit {

  mobileMenu = false;
  teste = true;

  constructor() { 
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
  }

  ngOnInit(): void {
  }

}
