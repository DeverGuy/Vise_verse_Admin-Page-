import { NextResponse } from 'next/server';
import { announcementsRepo } from '@/lib/supabase';
import { announcementSchema } from '@/lib/validations/adminSchemas';

export async function GET() {
  try {
    const list = await announcementsRepo.getAll();
    return NextResponse.json({ success: true, data: list });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch announcements';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = announcementSchema.parse(body);
    const newAnn = await announcementsRepo.create({
      ...validatedData,
      author: body.author || 'Admin Team'
    });
    return NextResponse.json({ success: true, data: newAnn }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      const err = error as unknown as { errors: unknown };
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : 'Failed to create announcement';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
