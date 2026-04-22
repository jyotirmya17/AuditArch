const { z } = require('zod');

const createClientSchema = z.object({
  name:    z.string().min(1, 'Client name is required'),
  address: z.string().min(1, 'Address is required'),
});

module.exports = { createClientSchema };
