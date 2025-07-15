import {Injectable} from '@angular/core'; 
import { Meta, Title } from '@angular/platform-browser';

@Injectable()
export class SEOService {
  constructor(private title: Title, private meta: Meta) { }

  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  updateDescription(desc: string) {
    this.meta.updateTag({ name: 'description', content: desc })
  }

  updateOgUrl(url: string) {
    this.meta.updateTag({ name: 'og:url', content: url })
  }

  updateOgTitle(url: string) {
    this.meta.updateTag({ name: 'og:title', content: url })
  }

  updateOgDescription(url: string) {
    this.meta.updateTag({ name: 'og:description', content: url })
  }

  updateOgImageSSL(url: string) {
    this.meta.updateTag({ name: 'og:image:secure_url', itemprop: 'image', content: url })
  }

  updateOgImage(url: string) {
    this.meta.updateTag({ name: 'og:image', itemprop: 'image', content: url })
  }

  updateOgType(url: string) {
    this.meta.updateTag({ name: 'og:type', content: url })
  }

  updateOgUpdateTime(url: string) {
    this.meta.updateTag({ name: 'og:updated_time', content: url })
  }

  updateOgUpdateSiteName(url: string) {
    this.meta.updateTag({ name: 'og:site_name', content: url })
  }

  updateGbAppId() {
    this.meta.updateTag({ name: 'fb:app_id', content: '458904768579712' })
  }
}