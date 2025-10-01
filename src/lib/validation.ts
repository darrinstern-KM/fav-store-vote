import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters'),
  zipCode: z.string().regex(/^\d{5}$/, 'ZIP code must be 5 digits'),
});

// Vote validation schema
export const voteSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  email: z.string().email('Invalid email address').max(255).optional().or(z.literal('')),
  phone: z.string().max(20, 'Phone number must be less than 20 characters').optional().or(z.literal('')),
  city: z.string().trim().min(1, 'City is required').max(100, 'City must be less than 100 characters'),
  state: z.string().trim().min(2, 'State is required').max(2, 'State must be 2 characters'),
  testimonial: z.string().max(1000, 'Testimonial must be less than 1000 characters').optional().or(z.literal('')),
  smsConsent: z.boolean(),
}).refine(data => data.email || data.phone, {
  message: 'Either email or phone number is required',
  path: ['email'],
});

// Store submission validation schema
export const storeSubmissionSchema = z.object({
  storeName: z.string().trim().min(1, 'Store name is required').max(200, 'Store name must be less than 200 characters'),
  address: z.string().trim().min(1, 'Address is required').max(200, 'Address must be less than 200 characters'),
  city: z.string().trim().min(1, 'City is required').max(100, 'City must be less than 100 characters'),
  state: z.string().trim().min(2, 'State is required').max(2, 'State must be 2 characters'),
  zipCode: z.string().regex(/^\d{5}$/, 'ZIP code must be 5 digits'),
  category: z.string().min(1, 'Category is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type VoteInput = z.infer<typeof voteSchema>;
export type StoreSubmissionInput = z.infer<typeof storeSubmissionSchema>;
