import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { actionType, inputText } = await req.json();

    if (!inputText) {
      return NextResponse.json({ error: 'Input text is required' }, { status: 400 });
    }

    // تعریف پرامپت‌ها بر اساس سناریو
    let systemPrompt = "";
    if (actionType === 'summarize_email') {
      systemPrompt = "You are an executive assistant. Summarize the following email/text into 3 bullet points with action items.";
    } else if (actionType === 'extract_leads') {
      systemPrompt = "Extract client names, budget (if mentioned), and key requirements from this text. Return as JSON.";
    } else if (actionType === 'generate_reply') {
      systemPrompt = "Write a professional, high-converting business reply to this inquiry.";
    } else {
      systemPrompt = "Analyze and optimize the provided text.";
    }

    // فراخوانی API هوش مصنوعی (OpenAI)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: inputText }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const result = data.choices[0]?.message?.content || "No response generated.";

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ error: 'Server error during processing' }, { status: 500 });
  }
}
