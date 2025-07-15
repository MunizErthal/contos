import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComentarComponent } from './comentar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [ComentarComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule    
  ],
  exports: [ComentarComponent]
})
export class ComentarModule { }
