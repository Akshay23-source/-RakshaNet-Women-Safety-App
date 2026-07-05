// Voice command utilities using Web Speech API

export const initVoiceCommands = (onSOSCommand: () => void) => {
  // Check browser support
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  
  if (!SpeechRecognition) {
    console.warn('Speech recognition not supported in this browser')
    return null
  }
  
  const recognition = new SpeechRecognition()
  recognition.continuous = true
  recognition.interimResults = false
  recognition.lang = 'en-US'
  
  const sosKeywords = ['help me', 'emergency', 'sos', 'danger', 'help']
  
  recognition.onresult = (event: any) => {
    const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase()
    console.log('Voice command detected:', transcript)
    
    // Check if any SOS keyword is present
    for (const keyword of sosKeywords) {
      if (transcript.includes(keyword)) {
        console.log('SOS keyword detected:', keyword)
        onSOSCommand()
        break
      }
    }
  }
  
  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error)
  }
  
  return recognition
}

export const speak = (text: string, lang: string = 'en-US') => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported')
    return
  }
  
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 1.0
  utterance.pitch = 1.0
  utterance.volume = 1.0
  
  window.speechSynthesis.speak(utterance)
}

export const speakEmergency = () => {
  speak('Emergency SOS activated. Alerting your emergency contacts and nearby helpers. Stay calm. Help is on the way.')
}

export const speakSOSResolved = () => {
  speak('Emergency resolved. You are marked as safe. Thank you for using RakshaNet.')
}

export const speakHelperFound = (count: number) => {
  speak(`${count} helper${count > 1 ? 's' : ''} found nearby. Sending alert.`)
}
