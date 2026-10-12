import { NextRequest, NextResponse } from 'next/server';
import { PredictDirectiveSchema } from '@/models/ai.dto';
import { decisionTreeEngine } from '@/ai/decisionTreeEngine';

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          status: 'ERROR',
          error_code: 'ERR_MALFORMED_JSON',
          message: 'Format request body JSON tidak valid',
        },
        { status: 400 }
      );
    }

    const parseResult = PredictDirectiveSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          status: 'ERROR',
          error_code: 'ERR_INVALID_SCHEMA',
          message: parseResult.error.issues[0]?.message || 'Validasi schema gagal',
          details: parseResult.error.issues,
        },
        { status: 400 }
      );
    }

    // Eksekusi inferensi Decision Tree Engine (< 10 ms)
    const prediction = decisionTreeEngine.predict(parseResult.data);

    return NextResponse.json(
      {
        status: 'SUCCESS',
        message: 'AI adaptive directive evaluated successfully.',
        data: {
          directive_type: prediction.directiveType,
          confidence_score: prediction.confidenceScore,
          is_fallback: prediction.isFallback,
          execution_time_ms: prediction.executionTimeMs,
          explanation_rules: prediction.explanationRules,
          probabilities: prediction.probabilities,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('AI Predict Route Error:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        error_code: 'ERR_INTERNAL_SERVER',
        message: error.message || 'Kesalahan internal server pada AI Inference Engine',
      },
      { status: 500 }
    );
  }
}

// Endpoint GET opsional untuk audit metadata model oleh guru/developer
export async function GET() {
  const metadata = decisionTreeEngine.getMetadata();
  return NextResponse.json(
    {
      status: 'SUCCESS',
      message: 'Decision Tree model metadata loaded.',
      data: metadata,
    },
    { status: 200 }
  );
}
