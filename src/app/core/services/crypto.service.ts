import { Injectable } from '@angular/core';
import * as CryptoJs from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private readonly secretKey: string = environment.secretKey!;
  
  constructor() { if (!this.secretKey) { throw new Error('A chave secreta para criptografia não foi configurada.'); } }

  encrypt(value: string): string {
    return CryptoJs.AES.encrypt(value, this.secretKey).toString();
  }

  decrypt(valueToDecrypt: string): string {
    try {
      const bytes = CryptoJs.AES.decrypt(valueToDecrypt, this.secretKey);
      const decrypted = bytes.toString(CryptoJs.enc.Utf8);
      if (!decrypted) {
        throw new Error('Falha na descriptografia: resultado vazio');
      }
      return decrypted;
    } catch (error) {
      if (!(error instanceof Error)) {
        throw new Error(String(error));
      }
      throw error;
    }
  }

  hashKey(key: string): string {
    return CryptoJs.HmacSHA256(key, this.secretKey).toString();
  }

}
