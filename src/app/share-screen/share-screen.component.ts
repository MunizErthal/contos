import {Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';

// V2
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

@Component({
  selector: 'app-share-screen',
  templateUrl: './share-screen.component.html',
  styleUrls: ['./share-screen.component.css']
})
export class ShareScreenComponent implements OnInit, OnChanges {

  @Input() display = false;
  @Input() darkMode = false;
  @Input() textSelect = '';
  @Input() contoId = '';
  @Output() onCloseDialog: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('clone') clone;

  @ViewChild('imageFinal') imageFinal: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  @ViewChild('divPrint') divPrint: ElementRef;

  iphone = false;
  colorSelect = 'white';
  backgroundSelect = 'starsBlackSTORIE';

  fechando = false;
  mobileMenu = false;
  shareAberto = false;
  withBG = false;
  size = 'STORIE';

  supportCharacteres = true;
  charachteresCount = 0;
  limitSize = 500;

  scrollLocation = 0;

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

    if (navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)) {
      this.iphone = true;
    }
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.display) {
      setTimeout(() => {
        var shareModal = document.getElementById('shareModalId');
        shareModal.className = this.mobileMenu ? 'shareMobile shareOpenMobile' : 'share shareOpen';
        this.shareAberto = true;
      }, 100);

      this.verifySizeLimit();
    }
  }

  verifySizeLimit() {
    var textSearch = document.getElementById('textSearch');
    let styleTextMobileSelect = this.size === 'STORIE' ? 'storieTextTypeSelectMobile currentFont' : 'feedTextTypeSelectMobile currentFont';
    textSearch.className = this.mobileMenu ? styleTextMobileSelect + ' selector shareWindows currentFont' : 'feedTextTypeSelect selector shareWindows currentFont';

    this.charachteresCount = this.textSelect.length;
      if (this.charachteresCount > this.limitSize) {
        this.supportCharacteres = false;
      } else {
        this.supportCharacteres = true;
      }
  }

  changeStyle(style, textColor, withBG) {
    this.backgroundSelect = style + this.size;
    this.colorSelect = textColor;
    this.withBG = withBG;
  }

  downloadImage() {
    if (!this.supportCharacteres) {
      var textSearch = document.getElementById('textSearch');
      let styleTextMobileSelect = this.size === 'STORIE' ? ' storieTextTypeSelectMobile currentFont' : 'feedTextTypeSelectMobile currentFont';
      textSearch.className = this.mobileMenu ? 'limitErrorMobile ' + styleTextMobileSelect + ' selector shareWindows currentFont' : 'limitError feedTextTypeSelect selector shareWindows currentFont';
      return;
    }

    var divPrint = document.getElementById('divPrint');
    var textSearch = document.getElementById('textSearch');
    var imagePrint = document.getElementById('imagePrint');
    var divTextImage = document.getElementById('divTextImage');
    var pName = document.getElementById('pName');

    // Change image
    divPrint.className = this.size === 'STORIE' ? 'container shareWindows divPrincipalPrintSTORIE currentFont' : 'container shareWindows divPrincipalPrintFEED currentFont';

    // Change text
    divTextImage.className = this.size === 'STORIE' ? 'divTextsPrint currentFont' : 'divTextsFEEDPrint currentFont';
    textSearch.className = 'textTypeSelectPrint selector shareWindows currentFont';
    pName.className =  this.mobileMenu ? 'pNameClassPrintMobile selector shareWindows currentFont' : 'pNameClassPrint selector shareWindows currentFont';

    var imagePrint = document.getElementById('imagePrint');
    if (imagePrint !== null)
      imagePrint.className = this.size === 'STORIE' ? 'shareWindows imagePrincipalPrintSTORIE currentFont' : 'shareWindows imagePrincipalPrintFEED currentFont';

    //fazer o clone aqui... 
    let clone = divPrint.cloneNode(true);
    var downloadDiv = document.getElementById('download'); 
    downloadDiv.style.width = '1080px';
    downloadDiv.style.height = this.size === 'STORIE' ? '1920px' : '1080px';
    downloadDiv.style.opacity = '1';
    downloadDiv.appendChild(clone);
    
    // Voltar
    // Change image
    divPrint.className = this.mobileMenu ? 'container shareWindows divInfoMobile divPrincipalSTORIEMobile currentFont' : 'container shareWindows divPrincipalSTORIE currentFont';

    // Change text
    let styleTextMobileSelect = this.size === 'STORIE' ? 'storieTextTypeSelectMobile currentFont' : 'feedTextTypeSelectMobile currentFont';
    textSearch.className = this.mobileMenu ? styleTextMobileSelect + ' selector shareWindows currentFont' : 'feedTextTypeSelect selector shareWindows currentFont';
    divTextImage.className = this.size === 'STORIE' ? (this.mobileMenu ? 'divTextsMobile' : 'divTexts') : (this.mobileMenu ? 'divTextsFEEDMobile' : 'divTextsFEED');
    pName.className = this.mobileMenu ? 'pNameClassMobile selector shareWindows currentFont' : 'pNameClass selector shareWindows currentFont';

    var imagePrint = document.getElementById('imagePrint');

    if (imagePrint !== null)
      imagePrint.className = this.size === 'STORIE' ? 'rounded float-start shareWindows' + (this.mobileMenu ? ' storieSizeMobile' : ' storieSize') : (this.mobileMenu ? ' feedSizeMobile' : ' feedSize');

    let page = this;
    htmlToImage.toPng(downloadDiv).then(function (dataUrl) {
        downloadDiv.removeChild(clone); 
        downloadDiv.style.width = '0px';
        downloadDiv.style.height = '0px';
        page.download(dataUrl);
      })
      .catch(function (error) {
        downloadDiv.style.width = '0px';
        downloadDiv.style.height = '0px';
        console.log('error', error);
      });
  }

  // Esc
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (this.display) {
      this.close('close');
    }
  }

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement) {
    if (this.shareAberto) {
      let insideInfoWindow = ((event.target as HTMLInputElement).className.includes('shareWindows'));

      if (!insideInfoWindow) {
        this.close('close');
      }
    }
  }

  close(opcao) {
    if (!this.fechando) {
      this.fechando = true;
      var shareModal = document.getElementById('shareModalId');
      let currentClasses = shareModal.className;
      let correctClass = this.mobileMenu ? currentClasses.split('shareOpenMobile') : currentClasses.split('shareOpen');

      shareModal.className = this.mobileMenu ? correctClass[0] + ' shareCloseMobile' : correctClass[0] + ' shareClose';

      setTimeout(() => {
        this.fechando = false;
        this.shareAberto = false;
        shareModal.className = 'shareHidden';
        this.onCloseDialog.emit({opcao: opcao});
      }, 250);
    }
  }

  download(imageSrc) {
    const blobData = this.convertBase64ToBlobData(imageSrc.split('base64,')[1]);
    let downloadName = this.contoId + '-fernandome-' + new Date().getTime();
    if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE
      window.navigator.msSaveOrOpenBlob(blobData, downloadName);
    } else { // chrome
      const blob = new Blob([blobData], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadName;
      link.click();
      this.close('compartilhar');
    }
  }

  instagramShare() {
    
  }

  convertBase64ToBlobData(base64Data: string, contentType: string = 'image/png', sliceSize=512) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  changeSizeToStorie() {
    if (this.size === 'STORIE')
      return;

    this.size = 'STORIE';
    this.limitSize = 500; 
    this.verifySizeLimit();
    this.backgroundSelect = this.backgroundSelect.split('FEED')[0] + this.size;
    var imagePrint = document.getElementById('imagePrint');
    if (imagePrint !== null)
      imagePrint.className = this.mobileMenu ? 'shareWindows storieSizeMobile' : 'shareWindows storieSize';

    var divTextImage = document.getElementById('divTextImage');
    if (divTextImage !== null)
      divTextImage.className = this.mobileMenu ? 'shareWindows divTextsMobile' : 'shareWindows divTexts';
      
    var divTextImageEnd = document.getElementById('divTextImageEnd');
    if (divTextImageEnd !== null)
      divTextImageEnd.className = 'shareWindows divTextEnd';
  }

  changeSizeToFeed() {
    if (this.size === 'FEED')
      return;
    
    this.size = 'FEED';
    this.limitSize = 185;
    this.verifySizeLimit();
    this.backgroundSelect = this.backgroundSelect.split('STORIE')[0] + this.size;
    var imagePrint = document.getElementById('imagePrint');
    if (imagePrint !== null)
      imagePrint.className = this.mobileMenu ? 'shareWindows feedSizeMobile' : 'shareWindows feedSize';

    var divTextImage = document.getElementById('divTextImage');
    if (divTextImage !== null)
      divTextImage.className = this.mobileMenu ? 'shareWindows divTextsFEEDMobile' : 'shareWindows divTextsFEED';
      
    var divTextImageEnd = document.getElementById('divTextImageEnd');
    if (divTextImageEnd !== null)
      divTextImageEnd.className = 'shareWindows divTextEndFEED';
  }
}
