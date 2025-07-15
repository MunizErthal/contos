import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareScreenComponent } from './share-screen.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [ShareScreenComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule    
  ],
  exports: [ShareScreenComponent]
})
export class ShareScreenModule { }
