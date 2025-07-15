import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeituraComponent } from './leitura.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareScreenModule } from '../share-screen/share-screen.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ComentarModule } from '../comentar/comentar.module';
import { MomentModule } from 'ngx-moment';
import { InfoModule } from '../info/info.module';

@NgModule({
  declarations: [LeituraComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ShareScreenModule,
    ComentarModule,
    MomentModule,
    SweetAlert2Module.forRoot(),
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    InfoModule
  ]
})
export class LeituraModule { }
