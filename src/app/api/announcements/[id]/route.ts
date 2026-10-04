import { NextResponse } from 'next/server';
import { announcementsRepo } from '@/lib/supabase';
import { announcementSchema } from '@/lib/validations/adminSchemas';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await announcementsRepo.getById(id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Announcement not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching announcement';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = announcementSchema.parse(body);
    const updated = await announcementsRepo.update(id, validatedData);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Announcement not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      const err = error as unknown as { errors: unknown };
      return NextResponse.json({ success: false, error: 'Validation failed', details: err.errors }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Error updating announcement';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await announcementsRepo.update(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Announcement not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error modifying announcement';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await announcementsRepo.delete(id);
    return NextResponse.json({ success });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error deleting announcement';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
