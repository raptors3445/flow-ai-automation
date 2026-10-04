import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { actionType, inputText, isDemoMode } = await req.json();

    if (!inputText) {
      return NextResponse.json({ error: 'Input text is required' }, { status: 400 });
    }

    // حالت دمو برای تست مجانی و بدون API Key
    if (isDemoMode || !process.env.OPENAI_API_KEY) {
      await new Promise((resolve) => setTimeout(resolve, 1200)); // شبیه‌سازی تاخیر شبکه
      
      const mockResponses = {
        summarize_email: "• Client requested budget revision for Q3 project.\n• Action Item: Send updated pricing proposal by Thursday.\n• Key Contact: Sarah Jenkins (Operations lead).",
        extract_leads: "{\n  \"client_name\": \"Apex Digital Solutions\",\n  \"estimated_budget\": \"$5,000 - $8,000\",\n  \"service_required\": \"Full-Stack Web App & Automation\",\n  \"urgency\": \"High\"\n}",
        generate_reply: "Hi Sarah,\n\nThank you for reaching out! We've reviewed your project scope and would be happy to assist with your automation pipeline.\n\nLet's schedule a 15-minute alignment call tomorrow to finalize deliverables.\n\nBest regards,\nDevelopment Team"
      };

      return NextResponse.json({
        success: true,
        result: mockResponses[actionType] || "Automated test response completed successfully.",
        isDemo: true
      });
    }

    // اتصال واقعی به OpenAI
    let systemPrompt = "You are an executive business automation AI.";
    if (actionType === 'summarize_email') systemPrompt = "Summarize the following text into 3 actionable bullet points.";
    if (actionType === 'extract_leads') systemPrompt = "Extract contact names, budgets, and services requested as clean JSON.";
    if (actionType === 'generate_reply') systemPrompt = "Draft a persuasive, professional client email response.";

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
      }),
    });

    const data = await response.json();
    return NextResponse.json({ success: true, result: data.choices[0]?.message?.content });

  } catch (error) {
    return NextResponse.json({ error: 'Server processing error' }, { status: 500 });
  }
}
