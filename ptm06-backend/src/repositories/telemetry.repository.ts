import { prisma } from '@/core/db';
import { SessionSyncPayload } from '@/models/telemetry.dto';

export class TelemetryRepository {
  async saveSessionWithInteractions(data: SessionSyncPayload) {
    return prisma.$transaction(async (tx) => {
      // 1. Simpan atau perbarui GameSession
      const session = await tx.gameSession.upsert({
        where: { sessionId: data.session_id },
        update: {
          completedAt: data.completed_at ? new Date(data.completed_at) : null,
          isCompleted: data.is_completed,
        },
        create: {
          sessionId: data.session_id,
          devicePseudoId: data.device_pseudo_id,
          startedAt: new Date(data.started_at),
          completedAt: data.completed_at ? new Date(data.completed_at) : null,
          isCompleted: data.is_completed,
        },
      });

      // 2. Simpan setiap interaction log beserta adaptive hint-nya
      const createdInteractions = [];
      for (const item of data.interactions) {
        const interaction = await tx.interactionLog.create({
          data: {
            sessionId: session.sessionId,
            moduleType: item.module_type,
            selectedObjectId: item.selected_object_id,
            isCorrect: item.is_correct,
            attemptIndex: item.attempt_index,
            timestamp: new Date(item.timestamp),
            ...(item.ai_hint && {
              adaptiveHint: {
                create: {
                  confidenceScore: item.ai_hint.confidence_score,
                  directiveType: item.ai_hint.directive_type,
                  isFallback: item.ai_hint.is_fallback,
                  executionTimeMs: item.ai_hint.execution_time_ms,
                },
              },
            }),
          },
        });
        createdInteractions.push(interaction);
      }

      return { ...session, interactions: createdInteractions };
    });
  }

  async findSessionByIdAndDevice(sessionId: string, devicePseudoId: string) {
    return prisma.gameSession.findFirst({
      where: {
        sessionId,
        devicePseudoId,
      },
      include: {
        interactions: {
          include: { adaptiveHint: true },
        },
      },
    });
  }
}

export const telemetryRepository = new TelemetryRepository();