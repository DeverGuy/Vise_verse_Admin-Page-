import { NextResponse } from 'next/server';
import { dashboardRepo, auditLogsRepo } from '@/lib/supabase';

export async function GET() {
  try {
    const stats = await dashboardRepo.getStats();
    const recentActivities = await auditLogsRepo.getAll();
    return NextResponse.json({ success: true, data: { stats, recentActivities } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch dashboard statistics';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, stats, logEntry, logId } = body;

    if (action === 'UPDATE_STATS' && stats) {
      const updated = await dashboardRepo.updateStats(stats);
      const recentActivities = await auditLogsRepo.getAll();
      return NextResponse.json({ success: true, data: { stats: updated, recentActivities } });
    }

    if (action === 'ADD_LOG' && logEntry) {
      const newLog = await auditLogsRepo.log(logEntry.category || 'Admin', logEntry.title, logEntry.status || 'Active');
      const recentActivities = await auditLogsRepo.getAll();
      return NextResponse.json({ success: true, data: { newLog, recentActivities } });
    }

    if (action === 'DELETE_LOG' && logId) {
      await auditLogsRepo.delete(logId);
      const recentActivities = await auditLogsRepo.getAll();
      return NextResponse.json({ success: true, data: { recentActivities } });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to process dashboard action';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

