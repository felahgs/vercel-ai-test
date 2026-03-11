import { streamText, type UIMessage, convertToModelMessages, tool, stepCountIs } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    // system: `When the user asks about the weather or temperature somewhere, call the weather tool with a single "location" string (e.g. city name or "São Paulo"). Do not add extra fields.`,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      weather: tool({
        description: 'Get the current weather temperature in Celsius for a given location. Call this when the user asks about weather, temperature, or how hot/cold it is somewhere.',
        inputSchema: z.object({
          location: z.string().describe('City or place name, e.g. "London" or "New York"'),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
      convertFahrenheitToCelsius: tool({
        description: 'Convert a temperature in fahrenheit to celsius',
        inputSchema: z.object({
          temperature: z
            .number()
            .describe('The temperature in fahrenheit to convert'),
        }),
        execute: async ({ temperature }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9));
          return {
            celsius,
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}

