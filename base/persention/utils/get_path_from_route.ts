export default function getLastSegment(path: string): string {
  const segments = path.split("/");
  return segments.pop() || ""; // Return last segment or empty string
}
