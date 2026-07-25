const { z } = require('zod');
const CONTACT_CATEGORIES = require('../constants/contactCategories');

const contactSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be less than 80 characters")
    .trim()
    .refine(val => /[a-zA-Z]/.test(val), "Name must contain letters"),
  
  email: z.string()
    .min(1, "Email is required")
    .max(254, "Email is too long")
    .email("Enter a valid email address")
    .toLowerCase(),
    
  subject: z.string()
    .min(5, "Subject must be at least 5 characters")
    .max(120, "Subject must be less than 120 characters")
    .trim()
    .refine(val => /[a-zA-Z]/.test(val), "Subject must contain letters"),
    
  category: z.enum(CONTACT_CATEGORIES, {
    errorMap: () => ({ message: "Select a valid category" })
  }),
  
  message: z.string()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must be less than 2000 characters")
    .trim()
    .refine(val => /[a-zA-Z]/.test(val), "Message must contain readable text"),
    
  privacyAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the privacy policy" })
  }),
  
  _contact_identifier: z.string().max(0).optional() // Honeypot
}).strict();

module.exports = contactSchema;
