import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EscrevendoComponent } from './escrevendo.component';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { InfoModule } from '../info/info.module';

@NgModule({
  declarations: [EscrevendoComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,   
    AngularFireDatabaseModule,
    InfoModule
  ]
})
export class EscrevendoModule { }
