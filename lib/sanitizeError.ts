/** Map internal generation failures to safe user-facing copy */
export function sanitizeGenerationError(raw: string | undefined | null): string {
  if (!raw?.trim()) return "Generation failed. You can retry from your library."
  const msg = raw.trim()
  const lower = msg.toLowerCase()

  if (lower.includes("openai_api_key") || lower.includes("api key")) {
    return "Story generation is not configured (missing API key on the server)."
  }
  if (lower.includes("429") || lower.includes("rate limit") || lower.includes("quota")) {
    return "The writing service is busy. Wait a moment and retry."
  }
  if (lower.includes("timeout") || lower.includes("etimedout")) {
    return "Generation timed out. Retry from your library."
  }
  if (lower.includes("json") || lower.includes("payload") || lower.includes("empty")) {
    return "The story came back malformed. Retry to summon it again."
  }
  // Avoid leaking stack traces / provider internals
  if (msg.length > 160 || lower.includes("at handler") || lower.includes("stack")) {
    return "Something went wrong while writing. Retry from your library."
  }
  return msg
}
