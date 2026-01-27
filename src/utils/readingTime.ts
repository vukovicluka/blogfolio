/**
 * Calculate estimated reading time for a given text
 * @param text - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Formatted reading time string (e.g., "3 min read")
 */
export function calculateReadingTime(
  text: string,
  wordsPerMinute: number = 200,
): string {
  // Remove markdown syntax for more accurate word count
  const plainText = text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    // Remove inline code
    .replace(/`[^`]*`/g, "")
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove markdown links but keep the text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove markdown images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
    // Remove markdown headers
    .replace(/#{1,6}\s/g, "")
    // Remove bold/italic markers
    .replace(/[*_]{1,3}/g, "")
    // Remove blockquote markers
    .replace(/^>\s/gm, "");

  // Count words
  const words = plainText.trim().split(/\s+/).filter((word) => word.length > 0);
  const wordCount = words.length;

  // Calculate reading time in minutes
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  // Return formatted string
  return `${minutes} min read`;
}
