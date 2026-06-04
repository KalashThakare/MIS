import { TranscriptEntry } from "../../../modules/meetings/types/meetings.type";
import { MeetingAnalysisResponse } from "../../../modules/meetings/types/meeting-analysis.types";
import { AppError } from "../../errors/AppError";
import { groqClient } from "../../../config/groq";
import { buildMeetingUserPrompt, MEETING_SYSTEM_PROMPT } from "../../prompts/meeting-analysis.prompt";

export class GroqService {

  async analyzeMeeting(transcript: TranscriptEntry[]): Promise<MeetingAnalysisResponse> {
    const response = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: MEETING_SYSTEM_PROMPT },
        { role: "user",   content: buildMeetingUserPrompt(transcript) },
      ],
      temperature: 0,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new AppError("No response from Groq.", 500);
    }

    return JSON.parse(content);
  }
}
