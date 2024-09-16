import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai'; // Adjusted import based on the latest library version

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_API_BASE, // Ensure API key is provided
});

// Named export for handling POST requests
export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      messages: [{ role: 'user', content: message }],
    });

    if (completion.choices.length) {
      return NextResponse.json({ result: completion.choices[0].message.content }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'No response from OpenAI' }, { status: 500 });
    }
  } catch (error: any) {
    // Improved error handling
    if (error.response) {
      // API error from OpenAI
      console.error('OpenAI API error:', error.response.data);
      return NextResponse.json({ error: error.response.data.error.message }, { status: error.response.status });
    } else if (error.request) {
      // Network or request error
      console.error('Network error or no response received:', error.message);
      return NextResponse.json({ error: 'No response received from OpenAI API' }, { status: 500 });
    } else {
      // Other errors (e.g., setup, coding)
      console.error('Unexpected error:', error.message);
      return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
    }
  }
}
