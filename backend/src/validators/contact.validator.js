const { z } = require('zod');
const { CATEGORY_ALLOWLIST } = require('../constants/contactCategories');

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(80, 'Name is too long.').refine(v => !/^[^a-zA-Z]*$/.test(v), 'Please enter a valid name.'),
  email: z.string().trim().max(254, 'Email is too long.').email('Enter a valid email address.'),
  subject: z.string().trim().min(5, 'Subject must be at least 5 characters.').max(120, 'Subject is too long.').refine(v => !/^[^\w]+$/.test(v), 'Please enter a valid subject.'),
  category: z.enum(CATEGORY_ALLOWLIST, { errorMap: () => ({ message: 'Choose a contact category.' }) }),
  message: z.string().trim().min(20, 'Message must be at least 20 characters.').max(2000, 'Message is too long.').refine(v => !/^(.)\1+$/.test(v), 'Please enter a meaningful message.'),
  privacyAccepted: z.literal(true, { errorMap: () => ({ message: 'Please review and accept the Privacy Policy acknowledgement.' }) }),
  website: z.string().optional(),
  submissionStartedAt: z.number().optional()
}).strict();

module.exports = { contactSchema };
