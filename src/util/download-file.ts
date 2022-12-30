export function downloadFile(name: string, uri: string) {
  const a = document.createElement("a");
  a.href = uri;
  a.download = name;
  a.click();
}
