import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password, birthday } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: '邮箱和密码不能为空' }, { status: 400 });
    }
    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing) {
      return NextResponse.json({ error: '该邮箱已注册' }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db.insert(users).values({ email, passwordHash, birthday: birthday ?? null }).returning({ id: users.id, email: users.email });
    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch {
    return NextResponse.json({ error: '服务器错误，请稍后重试' }, { status: 500 });
  }
}
