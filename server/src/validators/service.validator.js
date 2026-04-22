const { z } = require('zod');

const addServiceSchema = z.object({
  particulars:   z.string().min(1, 'Particulars are required'),
  financialYear: z.string().regex(/^\d{2,4}-\d{2}$/, 'Format must be YY-YY or YYYY-YY'),
  amount:        z.coerce.number({ invalid_type_error: 'Amount must be a number' }).positive(),
  entryType:     z.enum(['professional', 'ope'], {
                   errorMap: () => ({ message: 'Must be professional or ope' })
                 }),
  subNote:       z.string().optional(),
  dateAdded:     z.string().optional(),
});

module.exports = { addServiceSchema };
