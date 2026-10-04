import { NextResponse } from 'next/server';
import { clubMembersRepo } from '@/lib/supabase';
import { clubMemberSchema } from '@/lib/validations/adminSchemas';

export async function GET() {
  try {
    const members = await clubMembersRepo.getAll();
    return NextResponse.json({ success: true, data: members });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch club members';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = clubMemberSchema.parse(body);
    const newMember = await clubMembersRepo.create(validatedData);
    return NextResponse.json({ success: true, data: newMember }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      const err = error as unknown as { errors: unknown };
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : 'Failed to create club member';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
