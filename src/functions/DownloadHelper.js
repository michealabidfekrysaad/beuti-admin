export function downloadAsCSV(content, filename, contentType) {
  // Create a blob
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);

  // Create a link to download it
  const pom = document.createElement('a');
  pom.href = url;
  pom.setAttribute('download', filename);
  pom.click();
}
