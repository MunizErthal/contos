import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './blog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { InfoModule } from '../info/info.module';



@NgModule({
  declarations: [BlogComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,   
    AngularFireDatabaseModule,
    InfoModule
  ]
})
export class BlogModule { }
