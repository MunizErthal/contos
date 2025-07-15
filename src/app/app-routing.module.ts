import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogComponent } from './blog/blog.component';
import { ContatoComponent } from './contato/contato.component';
import { ContosComponent } from './contos/contos.component';
import { EscrevendoComponent } from './escrevendo/escrevendo.component';
import { HomeComponent } from './home/home.component';
import { LeituraComponent } from './leitura/leitura.component';
import { MinicontosComponent } from './minicontos/minicontos.component';
import { PesquisaComponent } from './pesquisa/pesquisa.component';
import { SobreComponent } from './sobre/sobre.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'contos', component: ContosComponent},
  {path: 'conto', component: ContosComponent},
  {path: 'minicontos', component: MinicontosComponent},
  {path: 'miniconto', component: MinicontosComponent},
  {path: 'blogs', component: BlogComponent},
  {path: 'blog', component: BlogComponent},
  {path: 'sobre', component: SobreComponent},
  {path: 'contato', component: ContatoComponent},
  {path: 'escrevendo', component: EscrevendoComponent},
  {path: 'pesquisa', component: PesquisaComponent},
  {path: 'pesquisar', component: PesquisaComponent},
  {
    path: 'leitura', component: LeituraComponent, 
    data: {
        title: 'About',
        description:'Description Meta Tag Content',
        ogUrl: 'your og url',
        ogTitle: 'your og title',
        ogDescription: 'your og description',
        ogImage: 'your og image'
    }
  },
  {
    path: 'leitura/:contoType/:contoId', component: LeituraComponent, 
    data: {
        title: 'About',
        description:'Description Meta Tag Content',
        ogUrl: 'your og url',
        ogTitle: 'your og title',
        ogDescription: 'your og description',
        ogImage: 'your og image'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
