import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Bot, User, Mic, MicOff, Globe } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { BackButton } from './BackButton'
import { aiAPI } from '../utils/api'
import { toast } from 'sonner@2.0.3'

const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English' },
  { code: 'hi-IN', name: 'हिन्दी (Hindi)' },
  { code: 'bn-IN', name: 'বাংলা (Bengali)' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)' },
  { code: 'mr-IN', name: 'मराठी (Marathi)' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
  { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml-IN', name: 'മലയാളം (Malayalam)' },
  { code: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)' }
]

interface Message {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: string
}

interface AIAssistantProps {
  onBack?: () => void
}

export function AIAssistant({ onBack }: AIAssistantProps = {}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hi! I'm your Safety Help Assistant. How may I help you?",
      timestamp: new Date().toISOString()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en-US')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = selectedLanguage
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }
      
      recognitionRef.current.onerror = () => {
        setIsListening(false)
        toast.error('Voice recognition error. Please try again.')
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
    
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [selectedLanguage])
  
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition not supported in this browser')
      return
    }
    
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.lang = selectedLanguage
      recognitionRef.current.start()
      setIsListening(true)
      toast.info('Listening... Speak now')
    }
  }
  
  const speakText = (text: string) => {
    if (synthRef.current && voiceEnabled) {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0
      utterance.lang = selectedLanguage
      synthRef.current.speak(utterance)
    }
  }
  
  const getComprehensiveResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    
    // Location-based queries
    if (lowerQuery.includes('police') || lowerQuery.includes('station')) {
      return `📍 NEAREST POLICE STATIONS (Example Data)

🚔 Koramangala Police Station
📍 Distance: 1.2 km away
📮 Address: 80 Feet Road, Koramangala, Bangalore
📞 Phone: +91-80-25533470

🚔 HSR Layout Police Station
📍 Distance: 2.5 km away
📮 Address: HSR Layout Sector 1, Bangalore
📞 Phone: +91-80-22340823

🚔 BTM Layout Police Station
📍 Distance: 3.1 km away
📮 Address: BTM Layout 2nd Stage, Bangalore
📞 Phone: +91-80-26685388

🚨 EMERGENCY NUMBERS:
🚓 Police: 100
👩 Women Helpline: 1091
🆘 Emergency: 112

Note: This is example data. In production, actual nearby stations would be shown based on your real-time location.`
    }
    
    if (lowerQuery.includes('hospital') || lowerQuery.includes('medical') || lowerQuery.includes('doctor')) {
      return `🏥 NEAREST HOSPITALS (Example Data)

🏥 Columbia Asia Hospital
📍 Distance: 1.5 km away
📮 Address: Sarjapur Road, Bangalore
📞 Phone: +91-80-66554444

🏥 Manipal Hospital
📍 Distance: 2.8 km away
📮 Address: HAL Airport Road, Bangalore
📞 Phone: +91-80-25023344

🏥 Apollo Hospital
📍 Distance: 3.2 km away
📮 Address: Bannerghatta Road, Bangalore
📞 Phone: +91-80-26630400

🚨 EMERGENCY NUMBERS:
🚑 Ambulance: 108
🏥 Medical Emergency: 102

Note: This is example data. In production, actual nearby hospitals would be shown based on your real-time location.`
    }
    
    if (lowerQuery.includes('safe route') || lowerQuery.includes('route') || lowerQuery.includes('path')) {
      return `🗺️ SAFE ROUTE PLANNING

Safety Factors We Analyze:
✅ Street lighting conditions
✅ CCTV coverage
✅ Population density
✅ Historical crime data
✅ Police patrol routes

🛡️ Recommendations:
1️⃣ Prefer main roads over shortcuts
2️⃣ Stay in well-lit areas
3️⃣ Avoid isolated areas after dark
4️⃣ Share live location with trusted contacts

💡 Would you like me to plan a specific route for you? Please provide your destination and I'll give you detailed safety guidance.`
    }
    
    if (lowerQuery.includes('emergency') || lowerQuery.includes('help') || lowerQuery.includes('danger')) {
      return `🚨 EMERGENCY ASSISTANCE

⚡ IMMEDIATE ACTIONS:
1️⃣ Press the SOS button on home screen
2️⃣ Call 1091 (Women Helpline)
3️⃣ Call 100 (Police)
4️⃣ Call 112 (All Emergencies)

📱 RakshaNet App Features:
✅ One-tap SOS activation
✅ Automatic location sharing
✅ Emergency contact alerts
✅ Evidence recording
✅ Nearby helper notification

📞 Additional Support Numbers:
👩 National Commission for Women: 7827170170
🏠 Domestic Violence Helpline: 181
⚖️ Legal Aid: Available 24/7

❓ Are you in immediate danger? Let me know how I can help you right now!`
    }
    
    if (lowerQuery.includes('self defense') || lowerQuery.includes('defend') || lowerQuery.includes('protect')) {
      return `🥋 SELF-DEFENSE TIPS & RESOURCES

🤜 Basic Self-Defense Techniques:
1️⃣ Palm strike to nose/chin
2️⃣ Elbow strike to ribs/face
3️⃣ Knee to groin area
4️⃣ Eye gouging if necessary
5️⃣ Scream loudly to attract attention

🛡️ Safety Tools:
✅ Pepper spray (legal in India)
✅ Personal alarm device
✅ Whistle (highly effective)
✅ Mobile phone SOS feature

🏋️ Training Classes Available:
🥊 Krav Maga training centers
👊 Women's self-defense workshops
👮 Police-conducted safety programs

🧠 Mental Preparation:
💭 Trust your instincts always
👀 Stay aware of surroundings
💪 Project confidence
🚪 Plan escape routes in advance

Would you like information about self-defense classes near you?`
    }
    
    if (lowerQuery.includes('harassment') || lowerQuery.includes('stalking') || lowerQuery.includes('abuse')) {
      return `⚖️ HARASSMENT & STALKING ASSISTANCE

🚨 Immediate Steps:
1️⃣ Document everything (messages, photos, incidents)
2️⃣ Inform trusted family members/friends
3️⃣ File police complaint immediately
4️⃣ Consider obtaining restraining order

📜 Your Legal Rights:
✅ IPC Section 354A (Sexual Harassment)
✅ Section 354D (Stalking)
✅ Section 509 (Insulting modesty)
✅ IT Act for cyber harassment

👮 How to File Complaint:
1️⃣ Visit nearest police station
2️⃣ File written complaint with all evidence
3️⃣ Request copy of FIR
4️⃣ Follow up regularly on case progress

📞 Support Services:
👩 Women Helpline: 1091
📞 NCW: 7827170170
⚖️ Legal Aid: Free services available
🤝 Counseling: Available through NGOs

Would you like help locating the nearest police station or legal aid center?`
    }
    
    if (lowerQuery.includes('lawyer') || lowerQuery.includes('legal') || lowerQuery.includes('rights')) {
      return `⚖️ LEGAL RIGHTS & ASSISTANCE

📜 Your Legal Rights:
✅ Right to file FIR (police cannot refuse)
✅ Right to free legal aid
✅ Right to privacy during investigation
✅ Right to protection from accused
✅ Right to speedy trial

🏛️ Free Legal Aid Available Through:
• District Legal Services Authority
• State Legal Services Authority
• National Legal Services Authority
• NGO legal support programs

📞 How to Access Legal Aid:
1️⃣ Visit nearest Legal Services Authority
2️⃣ Call 15100 (Legal Aid Helpline)
3️⃣ Approach women's police station
4️⃣ Contact NCW: 7827170170

📖 Important Laws for Women's Safety:
• Domestic Violence Act, 2005
• Sexual Harassment at Workplace Act, 2013
• Dowry Prohibition Act
• IPC Sections 354, 375, 376, 498A, 509

Would you like contact details for legal aid centers in your area?`
    }
    
    if (lowerQuery.includes('night') || lowerQuery.includes('travel') || lowerQuery.includes('late')) {
      return `🌙 NIGHT TRAVEL SAFETY TIPS

🚗 Before Traveling:
1️⃣ Share live location with trusted contacts
2️⃣ Note vehicle/driver details
3️⃣ Sit behind driver in taxi/cab
4️⃣ Keep phone fully charged and accessible
5️⃣ Plan route in advance

👀 During Travel:
✅ Stay alert, avoid sleeping
✅ Keep emergency numbers ready
✅ Trust your instincts always
✅ Avoid isolated/dark areas
✅ Keep doors locked

🚕 Safe Transportation Options:
• Use verified cab services (Uber/Ola)
• Women-only cab services (available in major cities)
• Public transport with CCTV cameras
• Travel with companion when possible

📱 RakshaNet Emergency Features:
✅ Share trip details automatically
✅ One-tap SOS activation
✅ Automatic location tracking
✅ Emergency contact instant alerts

Would you like information about safe public transport options in your area?`
    }
    
    if (lowerQuery.includes('accommodation') || lowerQuery.includes('hotel') || lowerQuery.includes('stay')) {
      return `🏨 SAFE ACCOMMODATION TIPS

✅ Verified Safe Stays:
• Hotels with 24/7 security cameras
• Women-only hostels
• PG accommodations with proper safety measures
• Verified Airbnb listings with good reviews

🔍 Safety Checklist Before Booking:
1️⃣ Check door locks and window security
2️⃣ Verify emergency exits
3️⃣ Confirm 24/7 security personnel presence
4️⃣ Keep room number private
5️⃣ Use door chain/latch always

🛡️ Room Safety Tips:
• Don't open door without proper verification
• Keep valuables in room safe
• Note emergency contact numbers
• Share location with family/friends

📞 Emergency Contacts:
🏨 Hotel security desk
👮 Local police: 100
👩 Women Helpline: 1091

Would you like recommendations for safe accommodation options?`
    }
    
    // General safety advice
    if (lowerQuery.includes('safety') || lowerQuery.includes('tips') || lowerQuery.includes('advice')) {
      return `🛡️ COMPREHENSIVE SAFETY TIPS

👤 Personal Safety:
✅ Always trust your instincts
✅ Stay aware of surroundings
✅ Avoid isolated areas, especially at night
✅ Keep phone charged at all times
✅ Share location with trusted contacts

💻 Digital Safety:
• Don't share personal info online with strangers
• Use strong, unique passwords
• Enable two-factor authentication
• Be cautious of strangers online
• Report suspicious behavior immediately

🛠️ Safety Tools to Carry:
1️⃣ RakshaNet SOS app feature
2️⃣ Personal alarm/whistle
3️⃣ Pepper spray (legal in India)
4️⃣ Mobile location sharing enabled
5️⃣ Emergency contact quick dial

🤝 Community Safety:
• Join local safety groups
• Report suspicious activity
• Help others in need
• Participate in awareness programs

📞 24/7 Support Numbers:
👩 Women Helpline: 1091
🚓 Police: 100
🆘 Emergency: 112
🚑 Medical: 108

What specific safety information do you need? I'm here to help!`
    }
    
    // Default comprehensive response
    return `👋 Hi! I'm your AI Safety Assistant. I can help you with:

🚨 Emergency Services:
• Police stations & emergency numbers
• Hospitals & medical facilities
• Quick SOS activation guidance

🗺️ Location Services:
• Safe route planning tips
• Finding nearby safety locations
• Real-time location sharing guidance

🛡️ Safety Information:
• Self-defense techniques
• Personal safety tips
• Threat assessment & prevention

⚖️ Legal Assistance:
• How to file complaints
• Free legal aid information
• Women's rights & laws

📚 Resources:
• Safety awareness
• Travel safety tips
• Accommodation safety

🆘 Crisis Support:
• Harassment assistance
• Domestic violence help
• Mental health support

💬 Just ask me anything! I'm here 24/7 to provide detailed, accurate safety information.

Try asking about:
• "Nearest police station"
• "Self defense tips"
• "Legal rights"
• "Night travel safety"
• "Emergency help"`
  }
  
  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setLoading(true)
    
    try {
      // Get comprehensive local response
      const localResponse = getComprehensiveResponse(currentInput)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: localResponse,
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, aiMessage])
      speakText(localResponse)
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Even on error, provide helpful response
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I'm here to help! Please ask me about emergency services, safety tips, legal rights, or any safety-related information you need.",
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }
  
  const quickActions = [
    'Nearest police station',
    'Find safe route',
    'Emergency tips',
    'Safe accommodation',
    'Legal rights',
    'Self defense tips'
  ]
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      {onBack && <BackButton onClick={onBack} />}
      <div className="h-[600px] flex flex-col bg-white rounded-xl shadow-lg">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6" />
            <div>
              <h3 className="text-white">AI Safety Assistant</h3>
              <p className="text-xs text-red-100">Available 24/7 • Multilingual Support</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-[140px] h-8 bg-white/10 text-white border-white/30">
                <Globe className="w-3 h-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              size="sm"
              variant="ghost"
              className={`text-white hover:bg-red-700 ${voiceEnabled ? 'bg-red-700' : ''}`}
              onClick={() => {
                setVoiceEnabled(!voiceEnabled)
                toast.success(voiceEnabled ? 'Voice responses disabled' : 'Voice responses enabled')
              }}
            >
              {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
            {isListening && (
              <Badge className="bg-green-500 animate-pulse">Listening...</Badge>
            )}
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'ai' ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                {message.sender === 'ai' ? (
                  <Bot className="w-5 h-5 text-red-600" />
                ) : (
                  <User className="w-5 h-5 text-blue-600" />
                )}
              </div>
              
              <div className={`max-w-[70%] rounded-2xl p-3 ${
                message.sender === 'ai'
                  ? 'bg-gray-100'
                  : 'bg-blue-500 text-white'
              }`}>
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'ai' ? 'text-gray-500' : 'text-blue-100'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <Bot className="w-5 h-5 text-red-600" />
              </div>
              <div className="bg-gray-100 rounded-2xl p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick Actions */}
        <div className="p-3 border-t bg-gray-50">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickActions.map((action) => (
              <Button
                key={action}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput(action)
                  setTimeout(() => handleSend(), 100)
                }}
                className="whitespace-nowrap text-xs"
              >
                {action}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Button
              onClick={toggleVoiceInput}
              disabled={loading}
              variant="outline"
              className={isListening ? 'bg-red-100 border-red-300' : ''}
            >
              {isListening ? <MicOff className="w-4 h-4 text-red-600" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about safety..."
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-red-600 hover:bg-red-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}