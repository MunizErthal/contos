import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SobreComponent } from './sobre.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SobreComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,    
  ]
})
export class SobreModule { }
