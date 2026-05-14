import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { conversations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 删除该用户所有 conversations，messages 会因为 onDelete: 'cascade' 自动级联删除
  await db.delete(conversations).where(eq(conversations.userId, session.user.id));

  return NextResponse.json({ ok: true });
}