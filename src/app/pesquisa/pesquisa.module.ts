import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PesquisaComponent } from './pesquisa.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
//import { AngularFireDatabaseModule } from '@angular/fire/database';
import { InfoModule } from '../info/info.module';

@NgModule({
  declarations: [PesquisaComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,   
    //AngularFireDatabaseModule,
    InfoModule
  ]
})
export class PesquisaModule { }
