import { TestBed } from '@angular/core/testing';
import * as CryptoJs from 'crypto-js';

import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;
  let mockSecretKey = 'minha-chave-secreta-de-teste';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CryptoService],
    });
    service = TestBed.inject(CryptoService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('encrypt', () => {
    it('deve criptografar um valor e retornar uma string diferente da original', () => {
      const originalValue = 'dados_secretos';
      const encryptedValue = service.encrypt(originalValue);

      expect(encryptedValue).toBeInstanceOf(String);
      expect(encryptedValue).not.toBeNull();
      expect(encryptedValue).not.toEqual(originalValue);
    });
  });

  describe('decrypt', () => {
    it('deve descriptografar um valor corretamente e retornar a string original', () => {
      const originalValue = 'meu-valor-original-123';
      const encryptedValue = service.encrypt(originalValue);
      const decryptedValue = service.decrypt(encryptedValue);

      expect(decryptedValue).toEqual(originalValue);
    });

    it('deve retornar uma string vazia ao tentar descriptografar um valor inválido', () => {
      const invalidEncryptedValue = 'valor-invalido-que-nao-foi-criptografado';
      expect(() => service.decrypt(invalidEncryptedValue)).toThrow();
    });

    it('deve retornar uma string vazia se a chave secreta estiver errada', () => {
      const originalValue = 'valor-a-ser-criptografado';
      const correctEncryptedValue = CryptoJs.AES.encrypt(
        originalValue,
        mockSecretKey
      ).toString();

      mockSecretKey = 'chave-errada';
      const newServiceWithWrongKey = new CryptoService();
      const decryptedValue = newServiceWithWrongKey.decrypt(
        correctEncryptedValue
      );

      expect(() => service.decrypt(decryptedValue)).toThrow();
    });
  });

  describe('hashKey', () => {
    it('deve criar um hash SHA256 de uma chave concatenada com a chave secreta', () => {
      const key = 'minha_chave';
      const hashedKey = service.hashKey(key);

      const expectedHash = CryptoJs.HmacSHA256(key, mockSecretKey).toString();

      expect(hashedKey).toBeInstanceOf(String);
      expect(hashedKey).toEqual(expectedHash);
    });

    it('deve retornar hashes diferentes para chaves diferentes', () => {
      const key1 = 'chave1';
      const key2 = 'chave2';

      const hash1 = service.hashKey(key1);
      const hash2 = service.hashKey(key2);

      expect(hash1).not.toEqual(hash2);
    });
  });
});