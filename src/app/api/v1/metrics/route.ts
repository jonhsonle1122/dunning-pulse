import { NextRequest, NextResponse } from 'next/server';
import { dunningService } from '@/services/dunning-service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get('accountId') || 'acc_demo_01';

  try {
    const metrics = dunningService.getMetrics(accountId);
    return NextResponse.json(metrics);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

