import OpenAI from "openai";
import { env } from './env';

const baseUrl = "https://api.groq.com/openai/v1";

export const groqClient = new OpenAI({
    apiKey: env.groq_api_key,
    baseURL: baseUrl,
    maxRetries: 1,
});

export async function generateResponse() {
    const response = await groqClient.responses.create({
        model: "openai/gpt-oss-20b",
        input: "Explain the importance of fast language models",
    });

    console.log(response.output_text);

}

