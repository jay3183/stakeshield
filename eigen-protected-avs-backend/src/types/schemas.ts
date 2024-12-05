import { z } from 'zod';

export const addressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
export const stakeSchema = z.string().regex(/^\d+$/);

export const operatorSchema = z.object({
  address: addressSchema,
  stake: stakeSchema.optional(),
});

export const stakeUpdateSchema = z.object({
  stake: z.string().regex(/^\d+$/)
}); 