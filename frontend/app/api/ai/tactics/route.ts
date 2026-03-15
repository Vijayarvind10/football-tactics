import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message, context } = await req.json() as { message: string; context?: object };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const systemPrompt = `You are a football tactics analyst with deep knowledge of European football.
You analyze formations, playing styles, and tactical setups for clubs in the Premier League, La Liga, Bundesliga, Serie A, and Ligue 1.
When asked about tactics, provide specific, insightful analysis based on formation strengths/weaknesses, pressing systems, and historical matchup data.
Be concise but insightful. Format responses clearly.
${context ? `Context: ${JSON.stringify(context)}` : ""}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: message }],
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Claude API error" }, { status: 502 });
  }

  const data = await response.json() as { content: Array<{ type: string; text: string }> };
  const text = data.content.find((c) => c.type === "text")?.text ?? "";

  return NextResponse.json({ response: text });
}
