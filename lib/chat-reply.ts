/**
 * Extracts a trimmed bot reply string from an n8n webhook payload without
 * throwing on null, primitive, or unexpected shapes.
 */
export function extractChatReply(data: unknown): string {
  let candidate: unknown = "";

  if (Array.isArray(data) && data.length > 0) {
    const first = data[0];
    if (first && typeof first === "object" && "output" in first) {
      candidate = (first as { output: unknown }).output;
    }
  } else if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    candidate = obj.response ?? obj.reply ?? obj.output ?? "";
  }

  return typeof candidate === "string" ? candidate.trim() : "";
}

export function formatBotMessage(text: string): string {
  if (/\d+\.\s+/.test(text)) {
    return text;
  }

  let formattedText = text.split(/\n\n|\n/).join("\n\n");

  if (text.includes(", ") && !text.includes("\n") && text.length > 100) {
    const parts = text.split(": ");
    if (parts.length > 1) {
      const intro = parts[0] + ":";
      const items = parts[1].split(", ").map((item) => "• " + item.trim());
      formattedText = `${intro}\n\n${items.join("\n")}`;
    }
  }

  return formattedText;
}
