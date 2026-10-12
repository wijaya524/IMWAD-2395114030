import { NextRequest, NextResponse } from 'next/server';
import { SessionSyncPayloadSchema } from '@/models/telemetry.dto';
import { telemetryService } from '@/services/telemetry.service';
import { AppError } from '@/core/error';

export async function POST(req: NextRequest) {
  try {
    const appVersion = req.headers.get('X-App-Version');
    const deviceSignature = req.headers.get('X-Device-Signature');

    if (!appVersion || !deviceSignature) {
      return NextResponse.json(
        { status: 'ERROR', error_code: 'ERR_UNAUTHORIZED', message: 'Signature perangkat tidak valid' },
        { status: 401 }
      );
    }

    const rawText = await req.text();
    if (Buffer.byteLength(rawText, 'utf8') > 500 * 1024) {
      return NextResponse.json(
        { status: 'ERROR', error_code: 'ERR_PAYLOAD_TOO_LARGE', message: 'Ukuran payload melampaui 500 KB' },
        { status: 413 }
      );
    }

    let rawBody;
    try {
      rawBody = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { status: 'ERROR', error_code: 'ERR_MALFORMED_JSON', message: 'Format JSON atau enum tidak valid' },
        { status: 400 }
      );
    }

    const parseResult = SessionSyncPayloadSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const isIntegrityError = parseResult.error.issues.some((issue) =>
        issue.message.includes('integritas')
      );
      return NextResponse.json(
        {
          status: 'ERROR',
          error_code: isIntegrityError ? 'ERR_INTEGRITY_VIOLATION' : 'ERR_INVALID_SCHEMA',
          message: parseResult.error.issues[0]?.message || 'Format JSON atau enum tidak valid',
        },
        { status: isIntegrityError ? 422 : 400 }
      );
    }

    const result = await telemetryService.syncTelemetrySession(
      parseResult.data,
      rawText,
      deviceSignature
    );

    return NextResponse.json(
      {
        status: 'SUCCESS',
        message: 'Session telemetry successfully ingested.',
        data: {
          session_id: result.sessionId,
          synced_records_count: result.syncedRecordsCount,
          ingested_at: result.ingestedAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Telemtry Ingest Error:', error);
    if (error instanceof AppError) {
      return NextResponse.json(
        { status: 'ERROR', error_code: error.errorCode, message: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { status: 'ERROR', error_code: 'ERR_INTERNAL_SERVER', message: 'Kesalahan internal server' },
      { status: 500 }
    );
  }
}