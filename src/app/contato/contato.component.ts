import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormspreeService } from 'src/shared/service/formspree.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css', './../../assets/css/bootstrap/bootstrap.min.css']
})
export class ContatoComponent implements OnInit {

  mobileMenu = false;
  nome = '';
  assunto = '';
  email = '';
  mensagem = '';

  public mailForm: UntypedFormGroup;

  constructor(private route: Router, private formspreeService: FormspreeService) {
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

  sendMail(): void {
    if (!(this.nome !== '' && this.assunto !== '' && this.email !== '' && this.mensagem !== '')) {
      this.aviso();
      return;
    }

    let toastSending = this.enviando();
    let data = {'name': this.nome, 'email': this.email, 'subject': this.assunto, 'message': this.mensagem};
    this.formspreeService.sendMail(data).subscribe( res => {
      toastSending.close();
      this.sucesso();

      document.getElementById("contatoMenu").className = 'navbar-brand opcao currentFont';
      document.getElementById("homeMenu").className = 'navbar-brand opcao active currentFont';
      this.route.navigateByUrl('home');
    }, error => {
      toastSending.close();
      this.erro();
    });
  }

  aviso() {
    const toastSending = Swal.mixin({
      toast: true,
      position: 'top',
      timer: 93000,
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    toastSending.fire({
      icon: 'info',
      background: 'currentColor',
      iconColor: 'white',
      title: '<span style="color:white">Por favor, preencha todos os campos.</span>'
    });
  }

  goInstagram() {
    window.open('https://www.instagram.com/fernandom.erthal/');
  }
  
  erro() {
    const toastSending = Swal.mixin({
      toast: true,
      position: 'top',
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    toastSending.fire({
      icon: 'error',
      background: 'currentColor',
      iconColor: 'white',
      title: '<span style="color: white">Ocorreu um erro ao enviar o email.</span>'
    });
  }

  sucesso() {
    const toastSending = Swal.mixin({
      toast: true,
      position: 'top',
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    toastSending.fire({
      icon: 'success',
      background: 'currentColor',
      iconColor: 'white',
      title: '<span style="color:white">Enviado! Muito obrigado pelo contato.</span>',
    });
  }

  enviando() {
    const toastSending = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    toastSending.fire({
      background: 'currentColor',
      iconColor: 'white',
      title: '<span style="color:white">Enviando...</span>',
    });

    return toastSending;
  }
}
