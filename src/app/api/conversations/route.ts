import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { conversations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const convos = await db
    .select({
      characterId: conversations.characterId,
      lastMessagePreview: conversations.lastMessagePreview,
      updatedAt: conversations.updatedAt,
    })
    .from(conversations)
    .where(eq(conversations.userId, session.user.id));

  return NextResponse.json(convos);
}
