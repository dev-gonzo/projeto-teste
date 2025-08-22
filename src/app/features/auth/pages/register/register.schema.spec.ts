import * as yup from 'yup';
import { registerSchema, RegisterFormData } from './register.schema';

describe('Register Schema', () => {
  const validFormData: RegisterFormData = {
    nome: 'João Silva',
    email: 'joao@example.com',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    telefone: '(11) 1234-5678',
    celular: '(11) 98765-4321',
    senha: 'MinhaSenh@123',
    confirmarSenha: 'MinhaSenh@123'
  };

  describe('nome validation', () => {
    it('should be required', async () => {
      const invalidData = { ...validFormData, nome: '' };
      
      try {
        await registerSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
        expect((error as yup.ValidationError).message).toContain('Nome é obrigatório');
      }
    });

    it('should require minimum 2 characters', async () => {
      const invalidData = { ...validFormData, nome: 'A' };
      
      try {
        await registerSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
          expect((error as yup.ValidationError).message).toContain('Nome deve ter pelo menos 2 caracteres');
       }
    });

    it('should require maximum 100 characters', async () => {
      const longName = 'A'.repeat(101);
      const invalidData = { ...validFormData, nome: longName };
      
      try {
        await registerSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
          expect((error as yup.ValidationError).message).toContain('Nome deve ter no máximo 100 caracteres');
      }
    });

    it('should accept valid name with minimum length', async () => {
      const validData = { ...validFormData, nome: 'Jo' };
      
      const result = await registerSchema.validate(validData);
      expect(result).toEqual(validData);
    });

    it('should accept valid name with maximum length', async () => {
      const maxName = 'A'.repeat(100);
      const validData = { ...validFormData, nome: maxName };
      
      const result = await registerSchema.validate(validData);
      expect(result).toEqual(validData);
    });
  });

  describe('email validation', () => {
    it('should be required', async () => {
      const invalidData = { ...validFormData, email: '' };
      
      try {
        await registerSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
          expect((error as yup.ValidationError).message).toContain('Email é obrigatório');
      }
    });

    it('should have valid format', async () => {
      const invalidData = { ...validFormData, email: 'invalid-email' };
      
      try {
        await registerSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
          expect((error as yup.ValidationError).message).toContain('Email deve ter um formato válido');
      }
    });

    it('should require maximum 100 characters', async () => {
      const longEmail = 'a'.repeat(90) + '@domain.com';
      const invalidData = { ...validFormData, email: longEmail };
      
      try {
        await registerSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
          expect((error as yup.ValidationError).message).toContain('E-mail deve ter no máximo 100 caracteres');
      }
    });

    it('should accept valid email', async () => {
      const validData = { ...validFormData, email: 'user@domain.com' };
      
      const result = await registerSchema.validate(validData);
      expect(result).toEqual(validData);
    });
  });

  describe('cpf validation', () => {
    it('should be required', async () => {
      const invalidData = { ...validFormData, cpf: '' };
      
      try {
        await registerSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
          expect((error as yup.ValidationError).message).toContain('CPF é obrigatório');
      }
    });

    it('should have valid format', async () => {
      const invalidData = { ...validFormData, cpf: '12345678900' };
      
      try {
        await registerSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
          expect((error as yup.ValidationError).message).toContain('CPF deve ter um formato válido (000.000.000-00)');
      }
    });

    it('should accept valid CPF format', async () => {
      const validData = { ...validFormData, cpf: '987.654.321-00' };
      
      const result = await registerSchema.validate(validData);
      expect(result).toEqual(validData);
    });

    it('should reject CPF with wrong format', async () => {
      const testCases = [
        '123.456.789-0',    
        '123.456.78-00',    
        '12.456.789-00',    
        '123-456-789-00',   
        '123.456.789.00'    
      ];

      for (const cpf of testCases) {
        const invalidData = { ...validFormData, cpf };
        try {
          await registerSchema.validate(invalidData);
          fail(`Expected validation to throw an error for CPF: ${cpf}`);
        } catch (error: unknown) {
            expect((error as yup.ValidationError).message).toContain('CPF deve ter um formato válido (000.000.000-00)');
        }
      }
    });
  });

  describe('rg validation', () => {
    it('should be required', async () => {
      const invalidData = { ...validFormData, rg: '' };
      
      try {
        await registerSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
          expect((error as yup.ValidationError).message).toContain('RG é obrigatório');
      }
    });

    it('should have valid format', async () => {
      const invalidData = { ...validFormData, rg: '123456789' };
      
      try {
        await registerSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
          expect((error as yup.ValidationError).message).toContain('RG deve ter um formato válido (00.000.000-0)');
      }
    });

    it('should accept valid RG format', async () => {
      const validData = { ...validFormData, rg: '98.765.432-1' };
      
      const result = await registerSchema.validate(validData);
      expect(result).toEqual(validData);
    });

    it('should reject RG with wrong format', async () => {
      const testCases = [
        '12.345.678',       
        '12.345.678-',      
        '12.345.67-8',      
        '1.345.678-9',      
        '12-345-678-9',     
        '12.345.678.9'      
      ];

      for (const rg of testCases) {
        const invalidData = { ...validFormData, rg };
        try {
          await registerSchema.validate(invalidData);
          fail(`Expected validation to throw an error for RG: ${rg}`);
        } catch (error: unknown) {
            expect((error as yup.ValidationError).message).toContain('RG deve ter um formato válido (00.000.000-0)');
        }
      }
    });
  });

  describe('telefone validation', () => {
    it('should be required', async () => {
      const invalidData = { ...validFormData, telefone: '' };
      
      try {
        await registerSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
          expect((error as yup.ValidationError).message).toContain('Telefone é obrigatório');
      }
    });

    it('should have valid format', async () => {
      const invalidData = { ...validFormData, telefone: '1112345678' };
      
      try {
        await registerSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
          expect((error as yup.ValidationError).message).toContain('Telefone deve ter um formato válido ((00) 0000-0000)');
      }
    });

    it('should accept valid telefone format', async () => {
      const validData = { ...validFormData, telefone: '(21) 9876-5432' };
      
      const result = await registerSchema.validate(validData);
      expect(result).toEqual(validData);
    });

    it('should reject telefone with wrong format', async () => {
      const testCases = [
        '(11) 1234-567',    
        '(11) 1234-56789',  
        '11 1234-5678',     
        '(1) 1234-5678',    
        '(111) 1234-5678',  
        '11-1234-5678'      
      ];

      for (const telefone of testCases) {
        const invalidData = { ...validFormData, telefone };
        try {
          await registerSchema.validate(invalidData);
          fail(`Expected validation to throw an error for telefone: ${telefone}`);
        } catch (error: unknown) {
            expect((error as yup.ValidationError).message).toContain('Telefone deve ter um formato válido ((00) 0000-0000)');
        }
      }
    });
  });

  describe('celular validation', () => {
    it('should be required', async () => {
      const invalidData = { ...validFormData, celular: '' };
      
      try {
        await registerSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
          expect((error as yup.ValidationError).message).toContain('Celular é obrigatório');
      }
    });

    it('should have valid format', async () => {
      const invalidData = { ...validFormData, celular: '11987654321' };
      
      try {
        await registerSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
          expect((error as yup.ValidationError).message).toContain('Celular deve ter um formato válido ((00) 00000-0000)');
      }
    });

    it('should accept valid celular format', async () => {
      const validData = { ...validFormData, celular: '(21) 98765-4321' };
      
      const result = await registerSchema.validate(validData);
      expect(result).toEqual(validData);
    });

    it('should reject celular with wrong format', async () => {
      const testCases = [
        '(11) 9876-5432',   
        '(11) 987654321',   
        '11 98765-4321',    
        '(1) 98765-4321',   
        '(111) 98765-4321', 
        '11-98765-4321'     
      ];

      for (const celular of testCases) {
        const invalidData = { ...validFormData, celular };
        try {
          await registerSchema.validate(invalidData);
          fail(`Expected validation to throw an error for celular: ${celular}`);
        } catch (error: unknown) {
            expect((error as yup.ValidationError).message).toContain('Celular deve ter um formato válido ((00) 00000-0000)');
        }
      }
    });
  });

  describe('complete form validation', () => {
    it('should validate complete valid form', async () => {
      const result = await registerSchema.validate(validFormData);
      expect(result).toEqual(validFormData);
    });

    it('should reject form with multiple invalid fields', async () => {
      const invalidData = {
        nome: '',
        email: 'invalid-email',
        cpf: '123',
        rg: '456',
        telefone: '789',
        celular: '012'
      };
      
      try {
        await registerSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should validate with abortEarly: false to get all errors', async () => {
      const invalidData = {
        nome: '',
        email: 'invalid-email',
        cpf: '123',
        rg: '456',
        telefone: '789',
        celular: '012'
      };
      
      try {
        await registerSchema.validate(invalidData, { abortEarly: false });
        fail('Expected validation to throw an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('type inference', () => {
    it('should infer correct type from schema', () => {
      type InferredType = yup.InferType<typeof registerSchema>;
      
      const testData: InferredType = {
        nome: 'Test User',
        email: 'test@example.com',
        cpf: '123.456.789-00',
        rg: '12.345.678-9',
        telefone: '(11) 1234-5678',
        celular: '(11) 98765-4321',
        senha: 'TesteSenha@123',
        confirmarSenha: 'TesteSenha@123'
      };
      
      expect(testData).toBeDefined();
    });
  });

  describe('validation options', () => {
    it('should work with strict mode', async () => {
      const result = await registerSchema.validate(validFormData, { strict: true });
      expect(result).toEqual(validFormData);
    });
  });
});