import { Platform } from "react-native";

/**
 * Helper to download files on the web platform
 * Returns true if the file was downloaded successfully (meaning we're on the web)
 */
export function downloadFileOnWeb(
  content: string,
  fileName: string,
  mimeType: string,
): boolean {
  if (Platform.OS !== "web") return false;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return true;
}
