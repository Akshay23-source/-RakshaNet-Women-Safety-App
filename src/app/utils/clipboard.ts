/**
 * Safe clipboard copy utility with fallback for browsers with clipboard restrictions
 * Handles permissions issues and provides a fallback using document.execCommand
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (clipboardError) {
      // Clipboard API failed (e.g., permissions issue), try fallback
      console.log('Clipboard API failed, using fallback method')
    }
  }
  
  // Fallback method for browsers with clipboard restrictions
  try {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    textArea.setAttribute('readonly', '')
    document.body.appendChild(textArea)
    
    // For mobile devices
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      const range = document.createRange()
      range.selectNodeContents(textArea)
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
      textArea.setSelectionRange(0, 999999)
    } else {
      textArea.select()
    }
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    return successful
  } catch (err) {
    console.error('All clipboard methods failed:', err)
    return false
  }
}

/**
 * Copy text with user feedback via toast
 * @param text - Text to copy
 * @param successMessage - Message to show on success
 * @param errorMessage - Message to show on error
 * @param toast - Toast function (optional)
 */
export async function copyWithToast(
  text: string,
  successMessage: string = 'Copied to clipboard!',
  errorMessage: string = 'Failed to copy. Please try again.',
  toast?: any
): Promise<boolean> {
  const copied = await copyToClipboard(text)
  
  if (toast) {
    if (copied) {
      toast.success(successMessage)
    } else {
      toast.error(errorMessage)
    }
  }
  
  return copied
}
