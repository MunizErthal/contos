import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';  
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { InfoModule } from '../info/info.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule, 
    BrowserAnimationsModule,
    ReactiveFormsModule,
    InfoModule,
    HammerModule
  ]
})
export class HomeModule { }
