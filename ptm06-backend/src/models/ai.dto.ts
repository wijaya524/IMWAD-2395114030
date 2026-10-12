import { z } from 'zod';

export const PredictDirectiveSchema = z.object({
  moduleType: z.enum([
    'WAKE_UP',
    'BATHING',
    'BRUSHING_TEETH',
    'WEARING_UNIFORM',
    'PREPARING_BOOKS',
    'BREAKFAST',
    'FAREWELL',
  ]),
  attemptIndex: z.number().int().min(1, 'attemptIndex minimal 1'),
  idleTimeMs: z.number().min(0, 'idleTimeMs tidak boleh negatif'),
  consecutiveFailures: z.number().int().min(0, 'consecutiveFailures tidak boleh negatif'),
  isDistractorClicked: z.union([z.boolean(), z.number().int().min(0).max(1)]),
});

export type PredictDirectiveInput = z.infer<typeof PredictDirectiveSchema>;
