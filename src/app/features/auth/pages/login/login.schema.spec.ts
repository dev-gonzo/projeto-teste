import * as yup from 'yup';
import { loginSchema, LoginFormData } from './login.schema';

describe('Login Schema', () => {
  const validFormData: LoginFormData = {
    email: 'user@example.com',
    password: 'password123'
  };

  describe('email validation', () => {
    it('should be required', async () => {
      const invalidData = { ...validFormData, email: '' };
      
      try {
        await loginSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
        expect((error as yup.ValidationError).message).toContain('Email é obrigatório');
      }
    });

    it('should have valid format', async () => {
      const invalidData = { ...validFormData, email: 'invalid-email' };
      
      try {
        await loginSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
        expect((error as yup.ValidationError).message).toContain('Email deve ter um formato válido');
      }
    });

    it('should require maximum 100 characters', async () => {
      const longEmail = 'a'.repeat(90) + '@domain.com';
      const invalidData = { ...validFormData, email: longEmail };
      
      try {
        await loginSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
        expect((error as yup.ValidationError).message).toContain('E-mail deve ter no máximo 100 caracteres');
      }
    });

    it('should accept valid email', async () => {
      const validData = { ...validFormData, email: 'user@domain.com' };
      
      const result = await loginSchema.validate(validData);
      expect(result).toEqual(validData);
    });

    it('should accept email with different domains', async () => {
      const testEmails = [
        'user@gmail.com',
        'test@company.co.uk',
        'admin@subdomain.example.org'
      ];

      for (const email of testEmails) {
        const validData = { ...validFormData, email };
        const result = await loginSchema.validate(validData);
        expect(result).toEqual(validData);
      }
    });

    it('should reject invalid email formats', async () => {
      const invalidEmails = [
        'plainaddress',
        '@missingdomain.com',
        'missing@.com',
        'spaces @domain.com',
        'double@@domain.com'
      ];

      for (const email of invalidEmails) {
        const invalidData = { ...validFormData, email };
        try {
          await loginSchema.validate(invalidData);
          fail(`Expected validation to throw an error for email: ${email}`);
        } catch (error: unknown) {
          expect((error as yup.ValidationError).message).toContain('Email deve ter um formato válido');
        }
      }
    });
  });

  describe('password validation', () => {
    it('should be required', async () => {
      const invalidData = { ...validFormData, password: '' };
      
      try {
        await loginSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
        expect((error as yup.ValidationError).message).toContain('Senha é obrigatória');
      }
    });

    it('should require minimum 6 characters', async () => {
      const invalidData = { ...validFormData, password: '12345' };
      
      try {
        await loginSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
        expect((error as yup.ValidationError).message).toContain('Senha deve ter pelo menos 6 caracteres');
      }
    });

    it('should require maximum 50 characters', async () => {
      const longPassword = 'a'.repeat(51);
      const invalidData = { ...validFormData, password: longPassword };
      
      try {
        await loginSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error: unknown) {
        expect((error as yup.ValidationError).message).toContain('Senha deve ter no máximo 50 caracteres');
      }
    });

    it('should accept valid password with minimum length', async () => {
      const validData = { ...validFormData, password: '123456' };
      
      const result = await loginSchema.validate(validData);
      expect(result).toEqual(validData);
    });

    it('should accept valid password with maximum length', async () => {
      const maxPassword = 'a'.repeat(50);
      const validData = { ...validFormData, password: maxPassword };
      
      const result = await loginSchema.validate(validData);
      expect(result).toEqual(validData);
    });

    it('should accept passwords with special characters', async () => {
      const specialPasswords = [
        'pass@123',
        'my-password!',
        'test_password#',
        'complex$pass%'
      ];

      for (const password of specialPasswords) {
        const validData = { ...validFormData, password };
        const result = await loginSchema.validate(validData);
        expect(result).toEqual(validData);
      }
    });
  });

  describe('complete form validation', () => {
    it('should validate complete valid form', async () => {
      const result = await loginSchema.validate(validFormData);
      expect(result).toEqual(validFormData);
    });

    it('should reject form with multiple invalid fields', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123'
      };
      
      try {
        await loginSchema.validate(invalidData);
        fail('Expected validation to throw an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should validate with abortEarly: false to get all errors', async () => {
      const invalidData = {
        email: '',
        password: ''
      };
      
      try {
        await loginSchema.validate(invalidData, { abortEarly: false });
        fail('Expected validation to throw an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('validation options', () => {
    it('should work with strict mode', async () => {
      const result = await loginSchema.validate(validFormData, { strict: true });
      expect(result).toEqual(validFormData);
    });

    it('should work with context', async () => {
      const context = { source: 'login-form' };
      const result = await loginSchema.validate(validFormData, { context });
      expect(result).toEqual(validFormData);
    });
  });

  describe('type inference', () => {
    it('should infer correct type from schema', () => {
      type InferredType = yup.InferType<typeof loginSchema>;
      
      const testData: InferredType = {
        email: 'test@example.com',
        password: 'testpassword'
      };
      
      expect(testData).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty object', async () => {
      const emptyData = {};
      
      try {
        await loginSchema.validate(emptyData);
        fail('Expected validation to throw an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle null values', async () => {
      const nullData = {
        email: null,
        password: null
      };
      
      try {
        await loginSchema.validate(nullData);
        fail('Expected validation to throw an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle undefined values', async () => {
      const undefinedData = {
        email: undefined,
        password: undefined
      };
      
      try {
        await loginSchema.validate(undefinedData);
        fail('Expected validation to throw an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});