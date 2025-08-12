import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ContatoModule } from './contato/contato.module';
import { HomeModule } from './home/home.module';
import { LeituraModule } from './leitura/leitura.module';

import { environment } from '../environments/environment';
import { SobreModule } from './sobre/sobre.module';
import { PesquisaModule } from './pesquisa/pesquisa.module';
import { ContosModule } from './contos/contos.module';
import { BlogModule } from './blog/blog.module';
import { MinicontosModule } from './minicontos/minicontos.module';
import { EscrevendoModule } from './escrevendo/escrevendo.module';
import { HttpClientModule } from '@angular/common/http';

import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { SEOService } from 'src/shared/service/SEOService.service';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HomeModule,
    LeituraModule,
    BlogModule,
    MinicontosModule,
    PesquisaModule,
    ContosModule,
    SobreModule,
    EscrevendoModule,
    HammerModule,
    ContatoModule,
    //HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
    SEOService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
