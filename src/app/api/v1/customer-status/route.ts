import { NextRequest, NextResponse } from 'next/server';
import { bannerService } from '@/services/banner-service';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  const customerId = searchParams.get('customerId');

  if (!projectId || !customerId) {
    return NextResponse.json(
      { pastDue: false, error: 'Missing projectId or customerId' },
      {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );
  }

  try {
    const status = await bannerService.getCustomerBannerStatus(projectId, customerId);

    return NextResponse.json(status, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { pastDue: false, error: err.message },
      {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
}

