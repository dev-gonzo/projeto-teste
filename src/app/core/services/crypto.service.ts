import { secretKeyEnvironment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
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

  set(key: string, value: string): void{
    const encryptedKey = this.hashKey(key);
    const encryptedValue = this.encrypt(value);
    localStorage.setItem(encryptedKey, encryptedValue);
  }

  get(key: string): string | null {
    const encryptedKey = this.hashKey(key);
    const encryptedValue = localStorage.getItem(encryptedKey);
    if(!encryptedValue) return null;
    return this.decrypt(encryptedValue);
  }

  remove(key: string): void {
    const encryptedKey = this.hashKey(key);
    localStorage.removeItem(encryptedKey);
  }
}
