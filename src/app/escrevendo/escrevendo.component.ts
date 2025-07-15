import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EscrevendoModel } from 'src/shared/model/escrevendo.model';
import { FirestoreService } from 'src/shared/service/firestore.service';
import { SearchEventService } from 'src/shared/service/search-event.service';

@Component({
  selector: 'app-escrevendo',
  templateUrl: './escrevendo.component.html',
  styleUrls: ['./escrevendo.component.css']
})
export class EscrevendoComponent implements OnInit {

  mobileMenu = false;
  escrevendoList: EscrevendoModel[] = [];

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

      this.getEscrevendo();
   }

  ngOnInit(): void {
  }


  openInfo(obj) {
    
  }

  getEscrevendo() {
    this.fireStoreService.getEscrevendo().then(res => {
      res.forEach(doc => {
        let conto = doc.data() as EscrevendoModel;
        conto.id = doc.id;

        if (conto !== undefined && conto !== null)
          this.escrevendoList.push(conto);
      });
    });
  }
}
