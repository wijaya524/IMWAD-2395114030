import { z } from 'zod';

export const DirectiveTypeEnum = z.enum([
  'NONE',
  'GENERAL_HINT',
  'SPECIFIC_VISUAL_CUE',
  'FALLBACK_STATIC',
]);

export const ModuleTypeEnum = z.enum([
  'WAKE_UP',
  'BATHING',
  'BRUSHING_TEETH',
  'WEARING_UNIFORM',
  'PREPARING_BOOKS',
  'BREAKFAST',
  'FAREWELL',
]);

export const AdaptiveHintLogSchema = z.object({
  confidence_score: z.number().min(0.0).max(1.0),
  directive_type: DirectiveTypeEnum,
  is_fallback: z.boolean(),
  execution_time_ms: z.number().int().nonnegative().max(3000),
});

export const InteractionLogSchema = z.object({
  module_type: ModuleTypeEnum,
  selected_object_id: z.string().min(1).max(100),
  is_correct: z.boolean(),
  attempt_index: z.number().int().positive(),
  timestamp: z.string().datetime(),
  ai_hint: AdaptiveHintLogSchema.optional(),
});

export const SessionSyncPayloadSchema = z
  .object({
    session_id: z.string().uuid(),
    device_pseudo_id: z.string().min(1).max(64),
    started_at: z.string().datetime(),
    completed_at: z.string().datetime().nullable(),
    is_completed: z.boolean(),
    interactions: z.array(InteractionLogSchema).min(1),
  })
  .refine(
    (data) => {
      if (data.completed_at) {
        return new Date(data.completed_at).getTime() >= new Date(data.started_at).getTime();
      }
      return true;
    },
    {
      message: 'Pelanggaran integritas: completed_at tidak boleh mendahului started_at',
      path: ['completed_at'],
    }
  );

export type SessionSyncPayload = z.infer<typeof SessionSyncPayloadSchema>;