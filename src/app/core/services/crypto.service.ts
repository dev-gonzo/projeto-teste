import { Injectable } from '@angular/core';
import * as CryptoJs from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private readonly secretKey: string = 'Application@secret_key';

  constructor() { }

  encrypt(value: string): string {
    return CryptoJs.AES.encrypt(value, this.secretKey).toString();
  }

  decrypt(valueToDecrypt: string): string {
    try {
      const bytes = CryptoJs.AES.decrypt(valueToDecrypt, this.secretKey);
      return bytes.toString(CryptoJs.enc.Utf8);
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
