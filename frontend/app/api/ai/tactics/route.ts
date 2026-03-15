import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message, context } = await req.json() as { message: string; context?: object };

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
  }

  const systemPrompt = `You are a football tactics analyst with deep knowledge of European football.
You analyze formations, playing styles, and tactical setups for clubs in the Premier League, La Liga, Bundesliga, Serie A, and Ligue 1.
When asked about tactics, provide specific, insightful analysis based on formation strengths/weaknesses, pressing systems, and historical matchup data.
Be concise but insightful. Format responses clearly.
${context ? `Context: ${JSON.stringify(context)}` : ""}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: `Groq API error: ${err}` }, { status: 502 });
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  const text = data.choices[0]?.message.content ?? "";

  return NextResponse.json({ response: text });
}
