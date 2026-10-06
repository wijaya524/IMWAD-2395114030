import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/core/db';
import { AppError } from '@/core/error';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const devicePseudoId = req.headers.get('X-Device-Id');

    if (!devicePseudoId) {
      return NextResponse.json(
        { status: 'ERROR', error_code: 'ERR_UNAUTHORIZED', message: 'Header identitas perangkat wajib disertakan' },
        { status: 401 }
      );
    }

    // Pengecekan Anti-BOLA: Kueri dikunci dengan kombinasi sessionId dan devicePseudoId
    const session = await prisma.gameSession.findFirst({
      where: {
        sessionId: id,
        devicePseudoId: devicePseudoId,
      },
      include: {
        interactions: {
          include: { adaptiveHint: true },
        },
      },
    });

    if (!session) {
      // Jika data ada milik perangkat lain atau tidak ada sama sekali, tolak dengan 404/403
      return NextResponse.json(
        { status: 'ERROR', error_code: 'ERR_NOT_FOUND', message: 'Data sesi tidak ditemukan atau akses ditolak' },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: 'SUCCESS', data: session }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'ERROR', error_code: 'ERR_INTERNAL_SERVER', message: error.message || 'Kesalahan internal server' },
      { status: 500 }
    );
  }
}