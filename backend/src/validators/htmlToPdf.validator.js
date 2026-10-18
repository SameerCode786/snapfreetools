const { z } = require('zod');

const marginLengthRegex = /^\d+(\.\d+)?(mm|cm|in|px)?$/i;

const pdfSettingsSchema = z.object({
  screenSize: z.enum(['your_screen', 'desktop_hd', 'desktop', 'tablet', 'mobile'], {
    errorMap: () => ({ message: 'screenSize must be one of: your_screen, desktop_hd, desktop, tablet, mobile' })
  }).optional(),

  customScreenWidth: z.number({
    invalid_type_error: 'customScreenWidth must be a number'
  })
    .int('customScreenWidth must be an integer')
    .min(320, 'customScreenWidth must be at least 320px')
    .max(2560, 'customScreenWidth cannot exceed 2560px')
    .optional(),

  pageSize: z.enum(['A4', 'Letter', 'Legal', 'A3', 'A5', 'OneLongPage'], {
    errorMap: () => ({ message: 'pageSize must be one of: A4, Letter, Legal, A3, A5, OneLongPage' })
  }).optional().default('A4'),
  
  orientation: z.enum(['portrait', 'landscape'], {
    errorMap: () => ({ message: 'orientation must be portrait or landscape' })
  }).optional().default('portrait'),
  
  marginPreset: z.enum(['none', 'small', 'big', 'custom'], {
    errorMap: () => ({ message: 'marginPreset must be one of: none, small, big, custom' })
  }).optional(),

  mediaType: z.enum(['print', 'screen'], {
    errorMap: () => ({ message: 'mediaType must be print or screen' })
  }).optional().default('print'),
  
  scale: z.number({
    invalid_type_error: 'Scale must be a number'
  })
    .refine((val) => Number.isFinite(val), 'Scale must be a finite number')
    .refine((val) => val >= 0.1 && val <= 2.0, 'Scale must be between 0.1 and 2.0')
    .optional()
    .default(1.0),
    
  marginTop: z.string()
    .regex(marginLengthRegex, 'Invalid margin length format')
    .optional()
    .default('10mm'),
    
  marginRight: z.string()
    .regex(marginLengthRegex, 'Invalid margin length format')
    .optional()
    .default('10mm'),
    
  marginBottom: z.string()
    .regex(marginLengthRegex, 'Invalid margin length format')
    .optional()
    .default('10mm'),
    
  marginLeft: z.string()
    .regex(marginLengthRegex, 'Invalid margin length format')
    .optional()
    .default('10mm'),
    
  printBackground: z.boolean().optional().default(true),
  showFooter: z.boolean().optional().default(false),
  respectCssPageSize: z.boolean().optional().default(false),
  pageRanges: z.string()
    .regex(/^[\d\s\-,]+$/, 'Invalid page ranges format')
    .optional()
}).strict().superRefine((data, ctx) => {
  if (data.screenSize === 'your_screen' && data.customScreenWidth !== undefined) {
    if (!Number.isInteger(data.customScreenWidth) || data.customScreenWidth < 320 || data.customScreenWidth > 2560) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'customScreenWidth must be an integer between 320 and 2560',
        path: ['customScreenWidth']
      });
    }
  }
});

const htmlToPdfSchema = z.object({
  mode: z.enum(['url', 'html_paste', 'html_upload', 'zip'], {
    errorMap: () => ({ message: 'mode must be one of: url, html_paste, html_upload, zip' })
  }),
  
  url: z.string().optional(),
  htmlContent: z.string().optional(),
  settings: pdfSettingsSchema.optional().default({})
}).strict().superRefine((data, ctx) => {
  if (data.mode === 'url') {
    if (!data.url || typeof data.url !== 'string' || data.url.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'url is required when mode is url',
        path: ['url']
      });
    }
  }

  if (data.mode === 'html_paste') {
    if (!data.htmlContent || typeof data.htmlContent !== 'string' || data.htmlContent.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'htmlContent is required when mode is html_paste',
        path: ['htmlContent']
      });
    }
  }
});

module.exports = {
  htmlToPdfSchema,
  pdfSettingsSchema
};
