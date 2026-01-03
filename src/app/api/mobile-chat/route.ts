// src/app/api/mobile-chat/route.ts in your Next.js App
import { chat } from '@/ai/flows/chat';
import { generateImage } from '@/ai/flows/generate-image';
import { processAudio } from '@/ai/flows/process-audio';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { action, payload } = body;

  try {
    switch (action) {
      case 'chat':
        const chatRes = await chat(payload);
        return NextResponse.json(chatRes);
      
      case 'image':
        const imgRes = await generateImage(payload);
        return NextResponse.json(imgRes);

      case 'audio':
        const audioRes = await processAudio(payload);
        return NextResponse.json(audioRes);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
