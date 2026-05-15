import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const messageId = Number(req.nextUrl.searchParams.get('messageId'));
  if (!messageId) return NextResponse.json({ error: 'Missing messageId' }, { status: 400 });

  const [msg] = await db.select().from(messages).where(eq(messages.id, messageId)).limit(1);
  return NextResponse.json({ imageUrl: msg?.imageUrl ?? null });
}
