import { telemetryRepository, TelemetryRepository } from '@/repositories/telemetry.repository';
import { SessionSyncPayload } from '@/models/telemetry.dto';
import { AppError } from '@/core/error'; // Sesuaikan dengan file AppError Anda

export class TelemetryService {
  constructor(private repo: TelemetryRepository) {}

  async syncTelemetrySession(
    data: SessionSyncPayload,
    rawText: string,
    signature: string
  ) {
    // Validasi dummy / signature check
    if (!signature || signature.trim() === '') {
      throw new AppError(401, 'ERR_UNAUTHORIZED', 'Signature perangkat tidak valid');
    }

    const savedSession = await this.repo.saveSessionWithInteractions(data);

    return {
      sessionId: savedSession.sessionId,
      syncedRecordsCount: savedSession.interactions.length,
      ingestedAt: new Date().toISOString(),
    };
  }

  async getSessionById(sessionId: string, devicePseudoId: string) {
    const session = await this.repo.findSessionByIdAndDevice(sessionId, devicePseudoId);
    if (!session) {
      throw new AppError(404, 'ERR_NOT_FOUND', 'Data sesi tidak ditemukan atau akses ditolak');
    }
    return session;
  }
}

export const telemetryService = new TelemetryService(telemetryRepository);