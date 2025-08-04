import { Injectable } from '@angular/core';
import { secretKeyEnvironment } from '../../../environments/environment';
import * as CryptoJs from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private secretKey: string = secretKeyEnvironment.secretKey

  constructor() { }

  encrypt(value: string): string{
    return CryptoJs.AES.encrypt(value, this.secretKey).toString();
  }

  decrypt(valueToDecrypt: string): string {
    try{
      const bytes = CryptoJs.AES.decrypt(valueToDecrypt, this.secretKey);
      return bytes.toString(CryptoJs.enc.Utf8);
    }
    catch{
      return '';
    }
  }

  hashKey(key: string): string {
    return CryptoJs.SHA256(key + this.secretKey).toString();
  }

}
