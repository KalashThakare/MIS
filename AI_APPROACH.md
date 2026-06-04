# AI Approach - Meeting Analysis

## Prompt Design

Wrote a strict system prompt that tells the model exactly what to extract - summary, action items, decisions, and follow-ups and returns only JSON. No preamble, no markdown. Kept temperature at `0` to reduce creative deviation.

## Citation Strategy

Every generated item must include at least one `timestamp` reference pointing back to the exact transcript segment it came from. This makes every output traceable you can always verify what the model said against what was actually spoken.

## Hallucination Prevention

The system prompt explicitly forbids the model from inventing attendees, tasks, or outcomes not present in the transcript. Action items are only extracted when a speaker explicitly assigns or accepts a task words like "I will", "can you", or direct acceptance are the signal.

## Output Validation

After the model responds, the raw string is parsed as JSON before anything is saved. If parsing fails, the request throws rather than persisting garbage. Citation timestamps are structurally validated against the transcript segments before the analysis is stored.

## Known Limitations

- If the transcript is vague or speakers don't explicitly assign tasks, the model may miss action items it will not infer.
- Due dates for action items cannot be reliably extracted even if a deadline is mentioned in the transcript, confirming and setting it accurately needs human review since the model can misinterpret relative dates like "by Friday" or "end of week".
- Citation accuracy depends on transcript quality; missing or wrong timestamps in the input produce unreliable citations.
- The model is only as good as the prompt version in use if the prompt changes, older analyses are not retroactively updated, which is why `promptVersion` is stored alongside each result.
