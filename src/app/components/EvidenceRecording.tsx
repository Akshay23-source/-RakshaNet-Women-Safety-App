import React, { useState, useRef, useEffect } from 'react'
import { Video, Mic, Square, Play, Trash2, Download, Camera, Volume2 } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { BackButton } from './BackButton'
import { toast } from 'sonner@2.0.3'

interface EvidenceRecordingProps {
  onBack?: () => void
}

export function EvidenceRecording({ onBack }: EvidenceRecordingProps = {}) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingType, setRecordingType] = useState<'audio' | 'video' | 'auto' | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [recordingTime, setRecordingTime] = useState(0)
  const [voiceActivated, setVoiceActivated] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown')
  const [permissionError, setPermissionError] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<any>(null)
  
  // Check permissions on mount
  useEffect(() => {
    checkPermissions()
    
    // Setup voice recognition for "help" trigger
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('')
          .toLowerCase()
        
        if (transcript.includes('help') && !isRecording) {
          toast.warning('Help detected! Starting emergency recording...')
          startRecording('auto')
        }
      }
    }
    
    return () => {
      stopRecording()
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])
  
  const checkPermissions = async () => {
    try {
      // Check if we're in a secure context (HTTPS or localhost)
      if (!window.isSecureContext) {
        setPermissionStatus('denied')
        setPermissionError('Camera/Microphone requires HTTPS or localhost')
        return
      }
      
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionStatus('denied')
        setPermissionError('Recording not supported in this browser')
        return
      }
      
      setPermissionStatus('prompt')
    } catch (error) {
      console.error('Permission check error:', error)
      setPermissionStatus('unknown')
    }
  }
  
  const requestPermission = async (type: 'audio' | 'video' | 'auto') => {
    try {
      setPermissionError(null)
      
      // Determine constraints
      let constraints: MediaStreamConstraints
      if (type === 'audio') {
        constraints = { audio: true, video: false }
      } else if (type === 'video') {
        constraints = { video: true, audio: true }
      } else {
        constraints = { video: true, audio: true }
      }
      
      // Request permission by trying to get media
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      // Permission granted! Stop the stream (we'll request again when actually recording)
      stream.getTracks().forEach(track => track.stop())
      
      setPermissionStatus('granted')
      toast.success('Permission granted!', {
        description: 'You can now start recording'
      })
      
      // Automatically start recording after permission is granted
      setTimeout(() => {
        startRecording(type)
      }, 500)
      
    } catch (error: any) {
      console.error('Permission request error:', error)
      setPermissionStatus('denied')
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setPermissionError('Permission denied by user or browser')
        toast.error('Permission Denied', {
          description: 'Please allow camera/microphone access in your browser settings',
          duration: 8000
        })
      } else if (error.name === 'NotFoundError') {
        setPermissionError('No camera or microphone found')
        toast.error('Device Not Found', {
          description: 'Please connect a camera/microphone device'
        })
      } else if (error.name === 'NotReadableError') {
        setPermissionError('Device already in use')
        toast.error('Device In Use', {
          description: 'Please close other apps using the camera/microphone'
        })
      } else {
        setPermissionError(error.message || 'Unknown error')
        toast.error('Permission Error', {
          description: error.message || 'Unable to access camera/microphone'
        })
      }
    }
  }
  
  const setupAudioVisualization = (stream: MediaStream) => {
    try {
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(stream)
      
      analyser.fftSize = 256
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      
      microphone.connect(analyser)
      
      audioContextRef.current = audioContext
      analyserRef.current = analyser
      
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / bufferLength
          setAudioLevel(Math.min(100, (average / 255) * 100))
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
        }
      }
      
      updateAudioLevel()
    } catch (error) {
      console.log('Audio visualization not available')
    }
  }
  
  const toggleVoiceActivation = () => {
    if (!voiceActivated && recognitionRef.current) {
      recognitionRef.current.start()
      setVoiceActivated(true)
      toast.success('Voice activation enabled. Say "help" to auto-record.')
    } else if (recognitionRef.current) {
      recognitionRef.current.stop()
      setVoiceActivated(false)
      toast.info('Voice activation disabled.')
    }
  }
  
  const startRecording = async (type: 'audio' | 'video' | 'auto') => {
    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Recording not supported in this browser')
        return
      }
      
      // Set constraints based on recording type
      let constraints: MediaStreamConstraints
      
      if (type === 'audio') {
        constraints = { audio: true, video: false }
      } else if (type === 'video') {
        constraints = { 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }, 
          audio: true 
        }
      } else {
        constraints = { 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }, 
          audio: true 
        }
      }
      
      console.log('📹 Requesting media access with constraints:', constraints)
      
      // Request media access
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      console.log('✅ Media access granted!', {
        audioTracks: stream.getAudioTracks().length,
        videoTracks: stream.getVideoTracks().length
      })
      
      streamRef.current = stream
      setPermissionStatus('granted')
      
      // Show video preview if video is being recorded
      if ((type === 'video' || type === 'auto') && videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      
      // Setup audio visualization
      if (stream.getAudioTracks().length > 0) {
        setupAudioVisualization(stream)
      }
      
      // Determine the MIME type
      let mimeType = 'video/webm'
      if (type === 'audio') {
        mimeType = 'audio/webm'
      }
      
      // Check for supported MIME types
      const options: MediaRecorderOptions = {}
      if (MediaRecorder.isTypeSupported(mimeType)) {
        options.mimeType = mimeType
      }
      
      const mediaRecorder = new MediaRecorder(stream, options)
      
      mediaRecorderRef.current = mediaRecorder
      const chunks: Blob[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        setRecordedChunks(chunks)
        stream.getTracks().forEach(track => track.stop())
        
        // Clean up video preview
        if (videoRef.current) {
          videoRef.current.srcObject = null
        }
        
        // Stop audio visualization
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        if (audioContextRef.current) {
          audioContextRef.current.close()
        }
        setAudioLevel(0)
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingType(type)
      setRecordingTime(0)
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
      const typeLabel = type === 'auto' ? 'Auto (Audio + Video)' : type === 'video' ? 'Video + Audio' : 'Audio Only'
      toast.success(`${typeLabel} recording started`, {
        description: type === 'auto' ? 'Recording both audio and video streams' : undefined
      })
      
    } catch (error: any) {
      console.error('❌ Recording error:', error.name, error.message)
      setPermissionStatus('denied')
      setPermissionError(error.message)
      
      // Handle different error types with specific guidance
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        // Permission denied - provide detailed instructions
        toast.error('Camera/Microphone Access Denied', {
          description: 'Click "Allow" in the browser permission prompt, or check address bar for camera icon',
          duration: 10000
        })
        
        // Show additional help message in console
        console.log('🔧 PERMISSION HELP:')
        console.log('1. Look for camera 🎥 icon in browser address bar')
        console.log('2. Click it and select "Allow"')
        console.log('3. Reload page if needed')
        console.log('4. Or open Settings > Privacy > Camera/Microphone')
        console.log('5. In preview mode: Open app in new tab or deploy to production')
        
      } else if (error.name === 'NotFoundError') {
        toast.error('No Camera/Microphone Found', {
          description: 'Please connect a camera or microphone device and try again'
        })
      } else if (error.name === 'NotReadableError') {
        toast.error('Device Already In Use', {
          description: 'Close other apps using the camera/microphone and try again'
        })
      } else if (error.name === 'OverconstrainedError') {
        toast.error('Camera Quality Not Supported', {
          description: 'Your device does not support the requested video quality'
        })
      } else if (error.name === 'TypeError') {
        toast.error('Browser Not Supported', {
          description: 'This browser does not support media recording. Try Chrome, Firefox, or Safari'
        })
      } else {
        toast.error('Cannot Access Camera/Microphone', {
          description: error.message || 'Please check browser settings and permissions'
        })
      }
    }
  }
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      
      toast.success('Recording stopped and saved as evidence')
    }
  }
  
  const downloadRecording = () => {
    if (recordedChunks.length === 0) return
    
    const blob = new Blob(recordedChunks, {
      type: recordingType === 'audio' ? 'audio/webm' : 'video/webm'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `evidence_${recordingType}_${Date.now()}.webm`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Evidence downloaded')
  }
  
  const deleteRecording = () => {
    setRecordedChunks([])
    setRecordingTime(0)
    setRecordingType(null)
    toast.info('Recording deleted')
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2">
            <Video className="w-5 h-5 text-red-500" />
            Evidence Recording
          </h3>
          {isRecording && (
            <Badge className="bg-red-600 animate-pulse">
              Recording {formatTime(recordingTime)}
            </Badge>
          )}
        </div>
        
        {/* Voice Activation Toggle */}
        <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div>
            <p className="text-sm">Voice-Activated Recording</p>
            <p className="text-xs text-gray-600">Auto-record when you say "help"</p>
          </div>
          <Button
            size="sm"
            variant={voiceActivated ? 'default' : 'outline'}
            className={voiceActivated ? 'bg-green-600 hover:bg-green-700' : ''}
            onClick={toggleVoiceActivation}
          >
            {voiceActivated ? 'Active' : 'Enable'}
          </Button>
        </div>
        
        {/* Recording Controls - Show when not recording and no recorded chunks */}
        {!isRecording && recordedChunks.length === 0 && (
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => startRecording('audio')}
              className="flex flex-col items-center gap-2 bg-blue-600 hover:bg-blue-700 h-auto py-4"
            >
              <Mic className="w-6 h-6" />
              <span className="text-sm">Audio</span>
            </Button>
            <Button
              onClick={() => startRecording('video')}
              className="flex flex-col items-center gap-2 bg-purple-600 hover:bg-purple-700 h-auto py-4"
            >
              <Video className="w-6 h-6" />
              <span className="text-sm">Video</span>
            </Button>
            <Button
              onClick={() => startRecording('auto')}
              className="flex flex-col items-center gap-2 bg-green-600 hover:bg-green-700 h-auto py-4"
            >
              <div className="flex gap-1">
                <Mic className="w-5 h-5" />
                <Video className="w-5 h-5" />
              </div>
              <span className="text-sm">Auto</span>
            </Button>
          </div>
        )}
        
        {/* Active Recording Display */}
        {isRecording && (
          <div className="space-y-3">
            {/* Recording Type Indicator */}
            <div className="flex items-center justify-center gap-3 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
              {recordingType === 'audio' && (
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">Recording Audio Only</span>
                </div>
              )}
              {recordingType === 'video' && (
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-600" />
                  <span className="text-sm">Recording Video + Audio</span>
                </div>
              )}
              {recordingType === 'auto' && (
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-green-600" />
                  <Video className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Recording Auto (Both Streams)</span>
                </div>
              )}
            </div>
            
            {/* Video Preview (for video and auto modes) */}
            {(recordingType === 'video' || recordingType === 'auto') && (
              <div className="relative rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  LIVE
                </div>
                {recordingType === 'auto' && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs">
                    Video + Audio
                  </div>
                )}
              </div>
            )}
            
            {/* Audio Visualization (for audio mode or as secondary for auto/video) */}
            {recordingType === 'audio' && (
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Mic className="w-6 h-6 text-blue-600" />
                  <span className="text-sm text-blue-900">Recording Audio</span>
                </div>
                <div className="relative h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-100"
                    style={{ width: `${audioLevel}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* Audio Level Indicator for Video/Auto modes */}
            {(recordingType === 'video' || recordingType === 'auto') && (
              <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                <Volume2 className="w-4 h-4 text-gray-600" />
                <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 transition-all duration-100"
                    style={{ width: `${audioLevel}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">Audio Level</span>
              </div>
            )}
            
            {/* Stop Recording Button */}
            <Button
              onClick={stopRecording}
              className="w-full bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
              size="lg"
            >
              <Square className="w-5 h-5 fill-current" />
              Stop Recording
            </Button>
          </div>
        )}
        
        {/* Recorded Evidence Actions */}
        {recordedChunks.length > 0 && !isRecording && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  {recordingType === 'audio' && <Mic className="w-5 h-5 text-white" />}
                  {recordingType === 'video' && <Video className="w-5 h-5 text-white" />}
                  {recordingType === 'auto' && (
                    <div className="flex gap-0.5">
                      <Mic className="w-4 h-4 text-white" />
                      <Video className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm">
                    {recordingType === 'audio' && 'Audio Evidence'}
                    {recordingType === 'video' && 'Video Evidence'}
                    {recordingType === 'auto' && 'Audio + Video Evidence'}
                  </p>
                  <p className="text-xs text-gray-600">Duration: {formatTime(recordingTime)}</p>
                </div>
              </div>
              <Play className="w-5 h-5 text-green-600" />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={downloadRecording}
                className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button
                onClick={deleteRecording}
                variant="outline"
                className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
            
            <Button
              onClick={() => {
                deleteRecording()
              }}
              className="w-full"
              variant="outline"
            >
              Record New Evidence
            </Button>
          </div>
        )}
        
        {/* Info Note */}
        {!isRecording && recordedChunks.length === 0 && (
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                💡 <strong>How to enable permissions:</strong>
              </p>
              <ul className="text-xs text-blue-800 mt-2 ml-4 space-y-1">
                <li>• Click the camera icon in your browser's address bar</li>
                <li>• Select "Allow" for camera and microphone access</li>
                <li>• Or visit browser settings to manage site permissions</li>
                <li>• In preview mode, open the app in a new tab for full access</li>
              </ul>
            </div>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                ⚠️ <strong>Preview Environment:</strong> If permissions are blocked in this preview, 
                the app will work correctly when deployed to a production URL with HTTPS.
              </p>
            </div>
          </div>
        )}
      </div>
      {onBack && (
        <div className="mt-4">
          <BackButton onClick={onBack} />
        </div>
      )}
    </Card>
  )
}