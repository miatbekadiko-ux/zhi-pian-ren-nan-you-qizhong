import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [user] = await db.select({
    id: users.id,
    email: users.email,
    nickname: users.nickname,
    birthday: users.birthday,
    language: users.language,
    createdAt: users.createdAt,
  }).from(users).where(eq(users.id, session.user.id)).limit(1);

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { nickname, birthday, language } = await req.json();

  await db.update(users).set({
    ...(nickname !== undefined && { nickname }),
    ...(birthday !== undefined && { birthday }),
    ...(language !== undefined && { language }),
    updatedAt: new Date(),
  }).where(eq(users.id, session.user.id));

  return NextResponse.json({ ok: true });
}
