import { NextResponse } from 'next/server';
import { clubMembersRepo } from '@/lib/supabase';
import { clubMemberSchema } from '@/lib/validations/adminSchemas';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const member = await clubMembersRepo.getById(id);
    if (!member) {
      return NextResponse.json({ success: false, error: 'Club member not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: member });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching club member';
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
    const validatedData = clubMemberSchema.parse(body);
    const updated = await clubMembersRepo.update(id, validatedData);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Member not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      const err = error as unknown as { errors: unknown };
      return NextResponse.json({ success: false, error: 'Validation failed', details: err.errors }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Error updating member';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    if (!['Active', 'Inactive', 'Suspended'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }
    const updated = await clubMembersRepo.updateStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Member not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating status';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await clubMembersRepo.delete(id);
    return NextResponse.json({ success });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error deleting member';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
