import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { conversations, messages, affection } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getAIReply } from '@/lib/ai';
import { shouldGenerateImage, generateCharacterImage } from '@/lib/image';
import { seedCharacters } from '@/db/seed';

async function getOrCreateConversation(userId: string, characterId: string) {
  const [existing] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.userId, userId), eq(conversations.characterId, characterId)))
    .limit(1);
  if (existing) return existing;
  const [created] = await db
    .insert(conversations)
    .values({ userId, characterId })
    .returning();
  return created;
}

// GET /api/chat?characterId=X  → load last 50 messages
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const characterId = req.nextUrl.searchParams.get('characterId') ?? 'pei';
  await seedCharacters();

  const convo = await getOrCreateConversation(session.user.id, characterId);
  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, convo.id))
    .orderBy(desc(messages.createdAt))
    .limit(50);

  return NextResponse.json({ conversationId: convo.id, messages: msgs.reverse() });
}

// POST /api/chat  → send message, get AI reply
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { characterId, content } = await req.json();
  if (!characterId || !content?.trim()) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  await seedCharacters();
  const convo = await getOrCreateConversation(session.user.id, characterId);

  // Save user message
  const [userMsg] = await db
    .insert(messages)
    .values({ conversationId: convo.id, role: 'user', content: content.trim() })
    .returning();

  // Get last 50 messages for context (excluding the one just inserted)
  const history = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, convo.id))
    .orderBy(desc(messages.createdAt))
    .limit(51);
  const contextMessages = history
    .filter(m => m.id !== userMsg.id)
    .reverse()
    .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

  // Get affection stage
  const [aff] = await db
    .select()
    .from(affection)
    .where(and(eq(affection.userId, session.user.id), eq(affection.characterId, characterId)))
    .limit(1);
  const stage = aff?.stage ?? '陌生人';

  // Get AI reply
  const aiText = await getAIReply(characterId, contextMessages, content.trim(), stage);

  // Trigger image generation if user message matches keywords
  const imageUrl = shouldGenerateImage(content.trim())
    ? await generateCharacterImage(characterId)
    : null;

  // Save AI message
  const [aiMsg] = await db
    .insert(messages)
    .values({ conversationId: convo.id, role: 'assistant', content: aiText, imageUrl })
    .returning();

  // Update conversation timestamp and last preview
  await db
    .update(conversations)
    .set({ updatedAt: new Date(), lastMessagePreview: aiText.slice(0, 60) })
    .where(eq(conversations.id, convo.id));

  return NextResponse.json({ userMessage: userMsg, aiMessage: aiMsg });
}
