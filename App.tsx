
import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MessageBubble } from './components/MessageBubble';
import { DisclaimerModal } from './components/DisclaimerModal';
import { CaseLawExplorer } from './components/CaseLawExplorer';
import { LearningPath } from './components/LearningPath';
import { QuizMode } from './components/QuizMode';
import { PoliceEncounterGuide } from './components/PoliceEncounterGuide';
import { Glossary } from './components/Glossary';
import { CivicsGuide } from './components/CivicsGuide';
import { DraftingLab } from './components/DraftingLab';
import { ScotusDocket } from './components/ScotusDocket';
import { StateLaws } from './components/StateLaws';
import { FoundingDocuments } from './components/FoundingDocuments';
import { Briefcase } from './components/Briefcase';
import { EducatorMode } from './components/EducatorMode';
import { TourModal } from './components/TourModal';
import { Tribute } from './components/Tribute';
import { JurySimulator } from './components/JurySimulator';
import { DeploymentGuide } from './components/DeploymentGuide';
import { GlobalRightsMap } from './components/GlobalRightsMap';
import { DebateDojo } from './components/DebateDojo';
import { LegalAidFinder } from './components/LegalAidFinder';
import { CivilRightsCenter } from './components/CivilRightsCenter';
import { sendMessageStream, resetChat } from './services/geminiService';
import { Message, Role, ChatState, AppView, TutorMode, Bookmark, UserStats } from './types';
// Fixed: Removed non-existent member LEGAL_FACTS from constants import
import { INITIAL_QUESTIONS } from './constants';

export const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('chat');
  
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const [tutorMode, setTutorMode] = useState<TutorMode>('standard');
  const [textSize, setTextSize] = useState<'small' | 'normal' | 'large'>('normal');
  const [voicePreference, setVoicePreference] = useState<string>(() => {
    return localStorage.getItem('amicus_voice_pref') || 'Fenrir';
  });

  const handleVoiceChange = (voice: string) => {
    setVoicePreference(voice);
    localStorage.setItem('amicus_voice_pref', voice);
  };

  const getTextSizeClass = () => {
      switch (textSize) {
          case 'small': return 'text-sm';
          case 'large': return 'text-lg';
          default: return 'text-base';
      }
  };

  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
        const saved = localStorage.getItem('amicus_user_stats');
        return saved ? JSON.parse(saved) : { xp: 0, level: 'Law Student', topicScores: {}, questionsAnswered: 0 };
    } catch (e) {
        return { xp: 0, level: 'Law Student', topicScores: {}, questionsAnswered: 0 };
    }
  });

  useEffect(() => {
    localStorage.setItem('amicus_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  const handleQuizResult = (topic: string, isCorrect: boolean) => {
      setUserStats(prev => {
          const newXP = isCorrect ? prev.xp + 10 : prev.xp;
          const currentTopicScore = prev.topicScores[topic] || 0;
          const newTopicScore = isCorrect ? currentTopicScore + 1 : currentTopicScore - 1;
          
          let newLevel: UserStats['level'] = prev.level;
          if (newXP > 100) newLevel = 'Associate';
          if (newXP > 500) newLevel = 'Senior Counsel';
          if (newXP > 1000) newLevel = 'Partner';

          return { ...prev, xp: newXP, level: newLevel, questionsAnswered: prev.questionsAnswered + 1, topicScores: { ...prev.topicScores, [topic]: newTopicScore } };
      });
  };

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
        const saved = localStorage.getItem('amicus_bookmarks');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('amicus_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (item: Bookmark) => {
    setBookmarks(prev => {
        const exists = prev.find(b => b.id === item.id);
        return exists ? prev.filter(b => b.id !== item.id) : [...prev, item];
    });
  };

  const [chatState, setChatState] = useState<ChatState>({ messages: [], isLoading: false, error: null });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const accepted = localStorage.getItem('amicus_disclaimer_accepted');
    if (accepted === 'true') {
        setShowDisclaimer(false);
        const tourTaken = localStorage.getItem('amicus_tour_taken');
        if (!tourTaken) setShowTour(true);
    }
  }, []);

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      if (isListening) {
        recognitionRef.current?.stop();
        return;
      }
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setInputValue(transcript);
      };
      recognition.onerror = (event: any) => {
          console.error("Speech Recognition Error:", event.error);
          setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      alert("Voice input is not supported in this browser.");
    }
  };

  const handleSend = async (message: string) => {
    if (!message.trim()) return;
    if (currentView !== 'chat') setCurrentView('chat');
    if (isListening) recognitionRef.current?.stop();

    const userMessage: Message = { id: Date.now().toString(), role: Role.USER, content: message, timestamp: new Date() };
    setChatState((prev) => ({ ...prev, messages: [...prev.messages, userMessage], isLoading: true, error: null }));
    setInputValue('');

    try {
      const stream = sendMessageStream(message, tutorMode, userStats);
      const modelMessageId = (Date.now() + 1).toString();
      let modelContent = "";

      for await (const chunk of stream) {
        modelContent = chunk.text;
        setChatState((prev) => {
          const newMessages = [...prev.messages];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg && lastMsg.role === Role.MODEL && lastMsg.id === modelMessageId) {
             lastMsg.content = modelContent;
             lastMsg.groundingSources = chunk.groundingSources;
             return { ...prev, messages: newMessages };
          } else {
             return { ...prev, messages: [...newMessages, { id: modelMessageId, role: Role.MODEL, content: modelContent, isStreaming: true, groundingSources: chunk.groundingSources, timestamp: new Date() }] };
          }
        });
      }
      setChatState(prev => {
          const newMessages = [...prev.messages];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg && lastMsg.role === Role.MODEL) lastMsg.isStreaming = false;
          return { ...prev, messages: newMessages, isLoading: false };
      });
    } catch (error) {
      setChatState((prev) => ({ ...prev, isLoading: false, error: "An error occurred. Please try again." }));
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatState.messages]);

  return (
    <div className={`flex h-full ${getTextSizeClass()}`}>
      {showDisclaimer && <DisclaimerModal onAccept={() => { localStorage.setItem('amicus_disclaimer_accepted', 'true'); setShowDisclaimer(false); setShowTour(true); }} />}
      <TourModal isOpen={showTour} onClose={() => { localStorage.setItem('amicus_tour_taken', 'true'); setShowTour(false); }} />

      <Sidebar 
         onClear={() => { resetChat(); setChatState({ messages: [], isLoading: false, error: null }); }} 
         isOpen={sidebarOpen} 
         toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
         currentView={currentView}
         onChangeView={setCurrentView}
         textSize={textSize}
         onTextSizeChange={setTextSize}
         userStats={userStats}
         voicePreference={voicePreference}
         onVoiceChange={handleVoiceChange}
      />

      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-legal-parchment">
        <div className="md:hidden h-16 bg-legal-navy border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-10 shadow-md">
            <div className="flex items-center gap-2">
                <span className="text-amber-500"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg></span>
                <span className="text-white font-serif font-bold text-lg">The People's Law</span>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="text-slate-400 p-2"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
        </div>

        <div className="flex-1 overflow-y-auto">
            {currentView === 'chat' ? (
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pb-32">
                        <div className="max-w-3xl mx-auto">
                            {chatState.messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in space-y-8">
                                    <h2 className="text-lg font-serif italic text-legal-charcoal mb-4 opacity-80 max-w-xl">"The law belongs to the people."</h2>
                                    <div>
                                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-legal-navy mb-3 tracking-tight">The People's Law</h1>
                                        <p className="text-slate-500 text-lg md:text-xl font-light">Your authoritative guide to US Law & Liberty.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mt-8">
                                        {INITIAL_QUESTIONS.map((q) => (
                                            <button key={q.id} onClick={() => handleSend(q.prompt)} className="text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all group">
                                                <div className="font-bold text-legal-navy group-hover:text-amber-700 mb-1">{q.title}</div>
                                                <div className="text-sm text-slate-500">{q.subtitle}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {chatState.messages.map((msg) => <MessageBubble key={msg.id} message={msg} voicePreference={voicePreference} />)}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full">
                    {currentView === 'explorer' && <CaseLawExplorer onSelectCase={handleSend} bookmarks={bookmarks} onToggleBookmark={toggleBookmark} />}
                    {currentView === 'learning' && <LearningPath completedTopics={new Set()} onToggleComplete={() => {}} onStartTopic={handleSend} />}
                    {currentView === 'quiz' && <QuizMode userStats={userStats} onQuizResult={handleQuizResult} />}
                    {currentView === 'police_guide' && <PoliceEncounterGuide onGenerateAdvice={handleSend} />}
                    {currentView === 'glossary' && <Glossary onSelectTerm={handleSend} bookmarks={bookmarks} onToggleBookmark={toggleBookmark} />}
                    {currentView === 'civics' && <CivicsGuide onAsk={handleSend} />}
                    {currentView === 'drafting' && <DraftingLab onSelectTemplate={handleSend} />}
                    {currentView === 'scotus' && <ScotusDocket onSelectCase={handleSend} bookmarks={bookmarks} onToggleBookmark={toggleBookmark} />}
                    {currentView === 'state_laws' && <StateLaws onSelectStateTopic={handleSend} />}
                    {currentView === 'founding_docs' && <FoundingDocuments onSelectDoc={handleSend} bookmarks={bookmarks} onToggleBookmark={toggleBookmark} />}
                    {currentView === 'briefcase' && <Briefcase bookmarks={bookmarks} onRemove={(id) => setBookmarks(prev => prev.filter(b => b.id !== id))} onSelect={handleSend} />}
                    {currentView === 'educator' && <EducatorMode onSelectAction={handleSend} />}
                    {currentView === 'tribute' && <Tribute onSelectPrompt={handleSend} />}
                    {currentView === 'jury' && <JurySimulator onSelectAction={handleSend} />}
                    {currentView === 'deployment' && <DeploymentGuide />}
                    {currentView === 'global_map' && <GlobalRightsMap onSelectRegion={handleSend} />}
                    {currentView === 'debate_dojo' && <DebateDojo onSelectAction={handleSend} />}
                    {currentView === 'legal_aid' && <LegalAidFinder onSelectAdvice={handleSend} />}
                    {currentView === 'civil_rights' && <CivilRightsCenter onSelectTopic={handleSend} />}
                </div>
            )}
        </div>

        {isListening && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full shadow-2xl flex items-center gap-3 animate-bounce z-20">
                <span className="w-3 h-3 bg-white rounded-full animate-ping"></span>
                <span className="font-bold text-sm uppercase tracking-widest">Listening...</span>
            </div>
        )}

        {currentView === 'chat' && (
             <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-legal-parchment via-legal-parchment to-transparent pt-20">
                <div className="max-w-3xl mx-auto relative animate-slide-up">
                    <div className="absolute -top-10 left-4 flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase tracking-wide ${tutorMode === 'socratic' ? 'text-indigo-700' : 'text-slate-500'}`}>
                            {tutorMode === 'socratic' ? 'Socratic Mode Active' : 'Standard Mode'}
                        </span>
                        <button onClick={() => { setTutorMode(tutorMode === 'standard' ? 'socratic' : 'standard'); resetChat(); }} className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${tutorMode === 'socratic' ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-sm ${tutorMode === 'socratic' ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    <div className="relative bg-white shadow-2xl rounded-[2rem] flex items-center p-2 border border-slate-200 transition-all focus-within:ring-4 focus-within:ring-amber-500/20 focus-within:border-amber-500/50">
                        <textarea id="main-chat-input" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(inputValue); } }} placeholder="Ask The People's Law expert AI..." className="w-full pl-6 py-3 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 resize-none h-[52px] leading-[28px] max-h-[120px] scrollbar-hide text-lg" />
                        <div className="flex items-center gap-2 pr-2">
                            <button 
                                onClick={handleVoiceInput}
                                className={`p-3 rounded-full transition-all duration-300 ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'}`}
                                title="Use Voice Input"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                            </button>
                            <button onClick={() => handleSend(inputValue)} disabled={!inputValue.trim() || chatState.isLoading} className={`p-3 rounded-full transition-all duration-300 shadow-md flex items-center justify-center ${ !inputValue.trim() || chatState.isLoading ? 'bg-slate-200 text-slate-400' : 'bg-legal-navy text-white hover:bg-amber-600 hover:scale-105 active:scale-95' }`}>
                                {chatState.isLoading ? <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <svg className="w-5 h-5 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                            </button>
                        </div>
                    </div>
                </div>
             </div>
        )}
      </main>
    </div>
  );
};
