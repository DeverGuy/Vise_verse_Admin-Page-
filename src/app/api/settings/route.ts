import { NextResponse } from 'next/server';
import { settingsRepo } from '@/lib/supabase';
import { fullSettingsSchema } from '@/lib/validations/adminSchemas';

export async function GET() {
  try {
    const settings = await settingsRepo.get();
    return NextResponse.json({ success: true, data: settings });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch admin settings';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validatedData = fullSettingsSchema.parse(body);
    const updated = await settingsRepo.update(validatedData);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      const err = error as unknown as { errors: unknown };
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : 'Failed to update admin settings';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
