import React, { useState, useEffect, useRef } from "react";
import {
  Mic, MicOff, Send, X, Bot, Sparkles, User, ChevronDown,
  Droplets, Sprout, TrendingUp, HelpCircle, AlertCircle, RefreshCw
} from "lucide-react";
import { useFarm } from "../context/FarmContext";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../i18n";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export const FarmAIAssistant: React.FC = () => {
  const { farm, fields, selectedField } = useFarm();
  const { farmerProfile } = useAuth();
  const { language, t, formatYield } = useI18n();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activePlot = selectedField || fields[0] || null;
  const currentYield = activePlot?.predictedYieldTonnesHa || activePlot?.predictedYield || 139.6;
  const currentQ = activePlot?.predictedYieldQAcre || 565.0;
  const yFmt = formatYield(currentYield, currentQ);

  const initialGreeting = language === "mr"
    ? `नमस्कार! मी तुमचा AgriVision कृषी सहाय्यक आहे. मी तुमच्या "${activePlot?.name || 'प्लॉट १'}" (${activePlot?.cropVariety || 'Co 86032'}) साठी पाणी, खत, हवामान आणि उत्पादनाविषयी सल्ला देऊ शकतो. तुम्ही बोलून किंवा लिहून प्रश्न विचारू शकता.`
    : language === "hi"
    ? `नमस्ते! मैं आपका AgriVision कृषि सहायक हूँ। मैं आपके "${activePlot?.name || 'प्लॉट 1'}" (${activePlot?.cropVariety || 'Co 86032'}) के लिए पानी, खाद, मौसम और पैदावार पर सलाह दे सकता हूँ। आप बोलकर या लिखकर पूछ सकते हैं।`
    : `Hello! I am your AgriVision Farm Assistant. I am grounded with live data for "${activePlot?.name || 'Plot 1'}" (${activePlot?.cropVariety || 'Co 86032'}). Ask me anything about irrigation, NPK fertilizers, pests, or expected yield via voice or text!`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Update initial message if language changes and chat is at start
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === "welcome-1") {
      setMessages([
        {
          id: "welcome-1",
          sender: "bot",
          text: initialGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [language, activePlot?.name, activePlot?.cropVariety]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Map app language to speech recognition locale
      const langMap: Record<string, string> = {
        mr: "mr-IN",
        hi: "hi-IN",
        en: "en-IN",
        gu: "gu-IN",
        kn: "kn-IN",
        te: "te-IN",
        ta: "ta-IN",
        pa: "pa-IN"
      };
      recognition.lang = langMap[language] || "mr-IN";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendQuery(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn("Speech API init failed:", e);
      setSpeechSupported(false);
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      const langMap: Record<string, string> = {
        mr: "mr-IN",
        hi: "hi-IN",
        en: "en-IN",
        gu: "gu-IN",
        kn: "kn-IN",
        te: "te-IN",
        ta: "ta-IN",
        pa: "pa-IN"
      };
      recognitionRef.current.lang = langMap[language] || "mr-IN";
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Recognition start error:", err);
      }
    }
  };

  // Sugarcane Farm Knowledge Grounded Response Engine
  const generateFarmResponse = (query: string): string => {
    const q = query.toLowerCase();
    const plotName = activePlot?.name || (language === "mr" ? "प्लॉट १" : "Plot 1");
    const caneVariety = activePlot?.cropVariety || "Co 86032";
    const moisture = 35.2;
    const irrigationFreq = activePlot?.irrigationFrequency || "2 times/week";
    const nitrogen = activePlot?.nitrogen || 240;
    const phosphorus = activePlot?.phosphorus || 80;
    const potassium = activePlot?.potassium || 160;
    const yieldEst = yFmt.primary;

    if (language === "mr") {
      // Marathi Responses
      if (q.includes("पाणी") || q.includes("सिंचन") || q.includes("water") || q.includes("ओलावा")) {
        return `💧 **${plotName} साठी पाणी सल्ला:**\nसध्या तुमच्या शेतातील मुळांच्या भागातील ओलावा **${moisture}%** (पुरेसा) आहे. तुमची सध्याची सिंचन पद्धत **${irrigationFreq}** योग्य सुरू आहे. पुढील ३ दिवस पाऊस अपेक्षित नसल्यामुळे, परवा सकाळी ठिबक सिंचनाने ४५ मिनिटे पाणी द्यावे.`;
      }
      if (q.includes("खत") || q.includes("npk") || q.includes("युरिया") || q.includes("पोटॅश") || q.includes("fertilizer")) {
        return `🌱 **${plotName} (${caneVariety}) साठी खत नियोजन:**\nतुमच्या जमिनीत सध्या **N: ${nitrogen} kg, P: ${phosphorus} kg, K: ${potassium} kg/ha** आहे.\n• कांडी वाढ जोमदार होण्यासाठी प्रति एकरी २५ किलो युरिया द्यावा.\n• व्हीएसआय (VSI) मानकानुसार पोटॅशची मात्रा योग्य ठेवली तर रसातील ब्रिक्स (साखर) प्रमाण वाढेल.`;
      }
      if (q.includes("उत्पादन") || q.includes("yield") || q.includes("अंदाज") || q.includes("टन") || q.includes("एकर")) {
        return `📈 **अपेक्षित उत्पादन अंदाज:**\n${plotName} साठी सध्याचा अपेक्षित उत्पादन अंदाज **${yieldEst}** आहे. पाण्याचा योग्य ताण टाळल्यास आणि वेळेवर खते दिल्यास उत्पादन सरासरीपेक्षा ५ ते १० टक्क्यांनी वाढू शकते.`;
      }
      if (q.includes("कीड") || q.includes("रोग") || q.includes("pest") || q.includes("कीटक") || q.includes("नियंत्रण")) {
        return `🛡️ **कीड व रोग नियंत्रण सल्ला:**\n${caneVariety} वाणासाठी सध्या खोडकिडीचा धोका कमी आहे. जैविक नियंत्रणासाठी ट्रायकोड्रमा अथवा ट्रायकोकार्ड वापरणे फायदेशीर ठरेल. रासायनिक फवारणीची सध्या आवश्यकता नाही.`;
      }
      if (q.includes("हवामान") || q.includes("तापमान") || q.includes("पाऊस") || q.includes("weather")) {
        return `☀️ **हवामान स्थिती:**\nतापमान २९.५°C असून सूर्यप्रकाश ८.४ तास मिळत आहे. उसाच्या वाढीसाठी हे हवामान अतिशय अनुकूल आहे. पुढील २४ तासांत पावसाची शक्यता कमी आहे.`;
      }
      return `🌾 **${plotName} (${caneVariety}) सद्यस्थिती:**\nतुमचा ऊस सध्या जोमदार वाढीच्या टप्प्यात असून पिकाची स्थिती उत्तम आहे. अंदाजित उत्पादन **${yieldEst}** आहे. पाणी किंवा खताविषयी काही विशिष्ट प्रश्न विचारायचा आहे का?`;
    } else {
      // English Responses
      if (q.includes("water") || q.includes("irrigation") || q.includes("moisture")) {
        return `💧 **Irrigation Advice for ${plotName}:**\nCurrent root-zone moisture is **${moisture}%** (adequate). With your current schedule of **${irrigationFreq}**, soil moisture is balanced. Since no major rain is predicted over the next 3 days, run drip irrigation for 45 minutes the day after tomorrow.`;
      }
      if (q.includes("fertilizer") || q.includes("npk") || q.includes("nitrogen") || q.includes("urea") || q.includes("nutrient")) {
        return `🌱 **Fertilizer Recommendation for ${plotName} (${caneVariety}):**\nCurrent soil nutrients are **N: ${nitrogen} kg, P: ${phosphorus} kg, K: ${potassium} kg/ha**.\n• Apply 25 kg/acre urea top-dressing during tillering/stalk elongation.\n• Ensure potassium levels are maintained to maximize sugar recovery (Brix).`;
      }
      if (q.includes("yield") || q.includes("forecast") || q.includes("estimate") || q.includes("production")) {
        return `📈 **Yield Forecast:**\nThe current predicted yield for ${plotName} is **${yieldEst}**.\nHealthy tillering and canopy index (NDVI: 0.84) place your expected crop 14.2 Q/acre above the regional benchmark.`;
      }
      if (q.includes("pest") || q.includes("disease") || q.includes("borer") || q.includes("bug")) {
        return `🛡️ **Crop Health & Pest Advice:**\nFor ${caneVariety}, early shoot borer risk is low under current humidity. Prefer integrated bio-control (Trichogramma egg parasitoids) instead of unnecessary chemical sprays.`;
      }
      if (q.includes("weather") || q.includes("rain") || q.includes("temp") || q.includes("sun")) {
        return `☀️ **Agro-Weather Conditions:**\nTemperature is 29.5°C with 8.4 hours of sunlight. These conditions are optimal for cane elongation. No severe heat or drought stresses detected.`;
      }
      return `🌾 **Farm Overview for ${plotName} (${caneVariety}):**\nYour sugarcane crop is in the grand growth stage with healthy vegetative vigor. Current predicted yield is **${yieldEst}** with **${moisture}%** root moisture. Ask me about irrigation timing, NPK fertilizer dosing, or pest management!`;
    }
  };

  const handleSendQuery = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Fast simulated response delivery
    setTimeout(() => {
      const botAnswer = generateFarmResponse(text);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const quickPrompts = language === "mr" ? [
    "माझ्या उसाला पाणी कधी द्यावे?",
    "खताची (NPK) मात्रा काय द्यावी?",
    "अपेक्षित उत्पादन किती होईल?",
    "कीड किंवा रोगाचा काही धोका आहे का?"
  ] : [
    "When should I irrigate my sugarcane?",
    "What fertilizer dose is recommended?",
    "What is the expected yield?",
    "Is there any pest or disease risk?"
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* FLOATING ACTION BUTTON (ALWAYS VISIBLE AT BOTTOM RIGHT)     */}
      {/* ========================================================= */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 bg-black hover:bg-neutral-900 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
            aria-label="Open Farm AI Voice Assistant"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>

            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <div className="text-left">
                <span className="text-xs font-bold block leading-tight">
                  {language === "mr" ? "कृषी सहाय्यक" : "Farm AI Bot"}
                </span>
                <span className="text-[10px] text-neutral-400 font-medium leading-none block mt-0.5">
                  {language === "mr" ? "बोलून किंवा लिहून विचारा" : "Voice & Text AI"}
                </span>
              </div>
            </div>

            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white ml-1">
              <Mic className="w-3.5 h-3.5" />
            </div>
          </button>
        )}

        {/* ========================================================= */}
        {/* EXPANDED CHAT MODAL                                      */}
        {/* ========================================================= */}
        {isOpen && (
          <div className="w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-[#E5E5E5] flex flex-col overflow-hidden animate-fade-in font-sans">
            
            {/* Modal Header */}
            <div className="bg-black text-white p-4 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {language === "mr" ? "AgriVision कृषी सहाय्यक" : "AgriVision Farm AI"}
                    </h3>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                      LIVE
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">
                    {activePlot?.name || "Plot 1"} • {activePlot?.cropVariety || "Co 86032"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Farm Context Status Pill Banner */}
            <div className="bg-neutral-50 px-4 py-2 border-b border-[#EBEBEB] flex items-center justify-between text-[11px] text-[#6F6F6F] shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="font-medium text-black">
                  {language === "mr" ? "शेत माहिती जोडली आहे" : "Farm Telemetry Linked"}
                </span>
              </div>
              <span className="font-mono text-[10px] text-neutral-500">
                {yFmt.primary}
              </span>
            </div>

            {/* Messages Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAFBFB]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                      msg.sender === "user"
                        ? "bg-black text-white rounded-br-none"
                        : "bg-white text-neutral-900 border border-[#EBEBEB] rounded-bl-none"
                    }`}
                  >
                    <div className="whitespace-pre-line">
                      {msg.text}
                    </div>
                  </div>
                  <span className="text-[9px] text-[#9E9E9E] mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-[#EBEBEB] w-20 text-neutral-500 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Quick Prompts */}
            <div className="px-3 py-2 bg-white border-t border-[#F0F0F0] overflow-x-auto no-scrollbar shrink-0">
              <div className="flex items-center gap-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendQuery(prompt)}
                    className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[11px] text-neutral-700 whitespace-nowrap transition-colors shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Status Pill if Listening */}
            {isListening && (
              <div className="bg-red-50 text-red-700 px-4 py-2 text-xs flex items-center justify-between border-t border-red-200 animate-pulse shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span className="font-semibold">
                    {language === "mr" ? "ऐकत आहे... बोला!" : "Listening... Speak now!"}
                  </span>
                </div>
                <button
                  onClick={toggleListening}
                  className="text-[10px] font-bold underline"
                >
                  {language === "mr" ? "थांबवा" : "Stop"}
                </button>
              </div>
            )}

            {/* Chat Input Bar */}
            <div className="p-3 bg-white border-t border-[#EBEBEB] flex items-center gap-2 shrink-0">
              
              {/* Mic Speech-to-Text Button */}
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? "bg-red-600 text-white animate-pulse shadow-md"
                      : "bg-neutral-100 hover:bg-neutral-200 text-black border border-[#E5E5E5]"
                  }`}
                  title={language === "mr" ? "माईक वापरून बोला" : "Click to speak via microphone"}
                  aria-label="Voice input"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-700" />}
                </button>
              )}

              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendQuery();
                }}
                placeholder={
                  isListening
                    ? (language === "mr" ? "आवाज रेकॉर्ड होत आहे..." : "Recording voice...")
                    : (language === "mr" ? "शेतीबद्दल काहीही विचारा..." : "Ask anything about your farm...")
                }
                className="flex-1 bg-neutral-100 text-xs text-black placeholder:text-[#888888] px-3.5 py-2.5 rounded-full border border-transparent focus:border-black focus:bg-white focus:outline-none transition-all"
              />

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendQuery()}
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-full bg-black hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-black text-white flex items-center justify-center transition-all shrink-0 active:scale-95"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>

            </div>

          </div>
        )}
      </div>
    </>
  );
};
