export async function clipboardWriteText(data: string) {
  try {
    await navigator.clipboard.writeText(data)
  } catch (e) {
    console.error('Error writing to clipboard', e)
  }
}
