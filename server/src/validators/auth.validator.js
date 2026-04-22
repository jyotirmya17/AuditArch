const { z } = require('zod');

const profileSchema = z.object({
  firmName:       z.string().min(1, 'Firm name is required'),
  designation:    z.string().default('Chartered Accountants'),
  addressLine1:   z.string().min(1, 'Address is required'),
  addressLine2:   z.string().optional(),
  city:           z.string().default('Jaipur'),
  bankAccountHolderName: z.string().min(1, 'Bank holder name is required'),
  accountNumber:  z.string().min(1, 'Account number is required'),
  bankName:       z.string().min(1, 'Bank name is required'),
  branchName:     z.string().default('Main Branch'), // Default provided for missing frontend field
  ifscCode:       z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
  billPrefix:     z.string().min(1).max(5, 'Prefix max 5 characters'),
});

const signupSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  profile:  profileSchema.optional(), // Profile can be sent during signup
});

const loginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

module.exports = { signupSchema, loginSchema, profileSchema };
