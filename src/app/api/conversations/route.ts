import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { conversations, messages } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// DELETE /api/conversations?characterId=X  → delete all messages + conversation
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const characterId = req.nextUrl.searchParams.get('characterId');
  if (!characterId) return NextResponse.json({ error: 'Missing characterId' }, { status: 400 });

  const [convo] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.userId, session.user.id), eq(conversations.characterId, characterId)))
    .limit(1);

  if (convo) {
    await db.delete(messages).where(eq(messages.conversationId, convo.id));
    await db.delete(conversations).where(eq(conversations.id, convo.id));
  }

  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const convos = await db
    .selectDistinct({
      characterId: conversations.characterId,
      lastMessagePreview: conversations.lastMessagePreview,
      updatedAt: conversations.updatedAt,
    })
    .from(conversations)
    .innerJoin(messages, eq(messages.conversationId, conversations.id))
    .where(eq(conversations.userId, session.user.id));

  return NextResponse.json(convos);
}
