import { Injectable } from '@angular/core';
import {
  BrowserVault,
  DeviceSecurityType,
  IdentityVaultConfig,
  Vault,
  VaultType,
} from '@ionic-enterprise/identity-vault';
import { VaultFactory } from './vault.factory';
import { Session } from '../models/session';

export type UnlockMode =
  | 'BiometricsWithPasscode'
  | 'InMemory'
  | 'SecureStorage';

@Injectable({
  providedIn: 'root',
})
export class SessionVaultService {
  private vault: BrowserVault | Vault;

  constructor() {
    this.vault = VaultFactory.create();
  }

  async initialize(): Promise<void> {
    try {
      await this.vault.initialize({
        key: 'io.ionic.gettingstartvault',
        type: VaultType.SecureStorage,
        deviceSecurityType: DeviceSecurityType.None,
        lockAfterBackgrounded:6000, // 1 min
      });
    } catch (e: unknown) {
      await this.vault.clear();
    }
  }

  async storeSession(session: Session): Promise<void> {
    this.vault.setValue('session', session);
  }

  async update(session: Session): Promise<void> {
    const value = this.vault.getValue<Session>('session');
    const newThings = Object.assign(value, session);
    this.vault.setValue('session', newThings);
  }

  async getSession(): Promise<Session | null> {
    if (await this.vault.isEmpty()) {
      return null;
    }
    return this.vault.getValue<Session>('session');
  }

  async clearSession(): Promise<void> {
    await this.vault.clear();
  }

  async updateUnlockMode(mode: UnlockMode): Promise<void> {
    const type =
      mode === 'BiometricsWithPasscode'
        ? VaultType.DeviceSecurity
        : mode === 'InMemory'
        ? VaultType.InMemory
        : VaultType.SecureStorage;
    await this.vault.updateConfig({
      ...(this.vault.config as IdentityVaultConfig),
      type,
    });
  }
}
