import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonList,
  IonLabel,
  IonItem,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { SessionVaultService, UnlockMode } from '../core/session-vault.service';
import { Session } from '../models/session';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    IonButton,
    IonList,
    IonLabel,
    IonItem,
  ],
})
export class Tab1Page implements OnInit{
  session: Session | null = null;

  constructor(private sessionVault: SessionVaultService) {}
  
  async ngOnInit() {
    this.session = await this.sessionVault.getSession();
  }

  async storeSession(): Promise<void> {
    await this.sessionVault.storeSession({
      email: 'test@ionic.io',
      firstName: 'Tessa',
      lastName: 'Testsmith',
      accessToken: '4abf1d79-143c-4b89-b478-19607eb5ce97',
      refreshToken: '565111b6-66c3-4527-9238-6ea2cc017126',
    });
    this.session = await this.sessionVault.getSession();
  }

  async clear(): Promise<void> {
    await this.sessionVault.clearSession();
    this.session = await this.sessionVault.getSession();
  }

  async changeUnlockMode(mode: UnlockMode) {
    await this.sessionVault.updateUnlockMode(mode);
  }

  async updateSession(): Promise<void> {
    await this.sessionVault.storeSession({
      email: 'delcio@ionic.io',
      firstName: 'Delcio',
      lastName: 'Delciopolanco',
      accessToken: '4abf1d79-143c-4b89-b478-19607eb5ce97',
      refreshToken: '565111b6-66c3-4527-9238-6ea2cc017126',
    });
    this.session = await this.sessionVault.getSession();
  }
}
