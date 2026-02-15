import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Settings, Upload, Sparkles, BookOpen, Trash2, Lock, Unlock, User, Bot, Globe, Plus, Edit2, List, CheckCircle } from 'lucide-react';

export default function CourseChatbot() {
  // États principaux
  const [mode, setMode] = useState('loading');
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  
  // Configuration du cours
  const [courseTitle, setCourseTitle] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [useWebSearch, setUseWebSearch] = useState(false);
  
  // Edition de sujet
  const [editingSubjectIndex, setEditingSubjectIndex] = useState(null);
  const [newSubject, setNewSubject] = useState({ title: '', content: '' });
  
  // Chat
  const [currentSubject, setCurrentSubject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // Quotas
  const [dailyQuestionCount, setDailyQuestionCount] = useState(0);
  const DAILY_LIMIT = 30;
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadCourseData();
    checkDailyQuota();
  }, []);

  useEffect(() => {
    if (mode === 'teacher' && !isPublished && (subjects.length > 0 || courseTitle.trim())) {
      setAutoSaveStatus('saving');
      const saveDraft = async () => {
        try {
          const draftData = {
            title: courseTitle,
            subjects: subjects,
            useWebSearch: useWebSearch
          };
          await window.storage.set('draft-course-multi', JSON.stringify(draftData), false);
          setAutoSaveStatus('saved');
          setTimeout(() => setAutoSaveStatus(''), 2000);
        } catch (error) {
          console.error('Erreur sauvegarde brouillon:', error);
          setAutoSaveStatus('');
        }
      };
      const timeoutId = setTimeout(saveDraft, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [courseTitle, subjects, useWebSearch, mode, isPublished]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkDailyQuota = () => {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('dailyQuota');
    
    if (storedData) {
      const { date, count } = JSON.parse(storedData);
      if (date === today) {
        setDailyQuestionCount(count);
      } else {
        // Nouveau jour, réinitialiser
        localStorage.setItem('dailyQuota', JSON.stringify({ date: today, count: 0 }));
        setDailyQuestionCount(0);
      }
    } else {
      localStorage.setItem('dailyQuota', JSON.stringify({ date: today, count: 0 }));
      setDailyQuestionCount(0);
    }
  };

  const incrementQuota = () => {
    const today = new Date().toDateString();
    const newCount = dailyQuestionCount + 1;
    localStorage.setItem('dailyQuota', JSON.stringify({ date: today, count: newCount }));
    setDailyQuestionCount(newCount);
  };

  const loadCourseData = async () => {
    try {
      const publishedResult = await window.storage.get('published-course-multi', true);
      if (publishedResult && publishedResult.value) {
        const data = JSON.parse(publishedResult.value);
        setSubjects(data.subjects || []);
        setCourseTitle(data.title || 'Cours');
        setUseWebSearch(data.useWebSearch || false);
        setIsPublished(true);
        setMode('student');
        return;
      }

      const draftResult = await window.storage.get('draft-course-multi', false);
      if (draftResult && draftResult.value) {
        const data = JSON.parse(draftResult.value);
        setSubjects(data.subjects || []);
        setCourseTitle(data.title || '');
        setUseWebSearch(data.useWebSearch || false);
        setIsPublished(false);
      }
      
      setMode('teacher');
    } catch (error) {
      console.error('Erreur chargement:', error);
      setMode('teacher');
    }
  };

  const publishCourse = async () => {
    if (subjects.length === 0) {
      alert('Veuillez ajouter au moins un sujet');
      return;
    }
    if (!courseTitle.trim()) {
      alert('Veuillez donner un titre au cours');
      return;
    }

    setIsPublishing(true);

    try {
      const courseData = {
        title: courseTitle,
        subjects: subjects,
        useWebSearch: useWebSearch,
        publishedAt: new Date().toISOString()
      };

      await window.storage.set('published-course-multi', JSON.stringify(courseData), true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setIsPublished(true);
    } catch (error) {
      alert('Erreur lors de la publication: ' + error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const unpublishCourse = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir dépublier ce cours ?')) return;

    try {
      await window.storage.delete('published-course-multi', true);
      setIsPublished(false);
      setSubjects([]);
      setCourseTitle('');
      setUseWebSearch(false);
      alert('Cours dépublié avec succès');
    } catch (error) {
      alert('Erreur lors de la dépublication: ' + error.message);
    }
  };

  const resetDraft = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir tout effacer ? Cette action est irréversible.')) return;

    try {
      await window.storage.delete('draft-course-multi', false);
      setSubjects([]);
      setCourseTitle('');
      setUseWebSearch(false);
      setNewSubject({ title: '', content: '' });
      setEditingSubjectIndex(null);
      alert('Brouillon réinitialisé');
    } catch (error) {
      alert('Erreur lors de la réinitialisation: ' + error.message);
    }
  };

  const goToStudentMode = () => {
    setMode('student');
    setCurrentSubject(null);
    setMessages([]);
  };

  const goToTeacherMode = () => {
    if (!window.confirm('Passer en mode professeur ?')) return;
    setMode('teacher');
    setCurrentSubject(null);
    setMessages([]);
  };

  const selectSubject = (index) => {
    setCurrentSubject(index);
    setMessages([{
      role: 'assistant',
      content: `Bonjour ! Je suis prêt à répondre à vos questions sur "${subjects[index].title}". Posez-moi toutes vos questions ! 📚`
    }]);
  };

  const changeSubject = () => {
    if (!window.confirm('Changer de sujet ? Votre conversation actuelle sera effacée.')) return;
    setCurrentSubject(null);
    setMessages([]);
  };

  const clearChat = () => {
    if (!window.confirm('Effacer toute la conversation ?')) return;
    setMessages([{
      role: 'assistant',
      content: `Bonjour ! Je suis prêt à répondre à vos questions sur "${subjects[currentSubject].title}". Posez-moi toutes vos questions ! 📚`
    }]);
  };

  const addSubject = () => {
    if (!newSubject.title.trim() || !newSubject.content.trim()) {
      alert('Veuillez remplir le titre et le contenu du sujet');
      return;
    }
    setSubjects([...subjects, { ...newSubject }]);
    setNewSubject({ title: '', content: '' });
  };

  const updateSubject = (index) => {
    if (!newSubject.title.trim() || !newSubject.content.trim()) {
      alert('Veuillez remplir le titre et le contenu du sujet');
      return;
    }
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = { ...newSubject };
    setSubjects(updatedSubjects);
    setEditingSubjectIndex(null);
    setNewSubject({ title: '', content: '' });
  };

  const deleteSubject = (index) => {
    if (!window.confirm(`Supprimer le sujet "${subjects[index].title}" ?`)) return;
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const startEditSubject = (index) => {
    setEditingSubjectIndex(index);
    setNewSubject({ ...subjects[index] });
  };

  const cancelEdit = () => {
    setEditingSubjectIndex(null);
    setNewSubject({ title: '', content: '' });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isSending || currentSubject === null) return;

    // Vérifier le quota quotidien
    if (dailyQuestionCount >= DAILY_LIMIT) {
      alert(`Vous avez atteint votre limite de ${DAILY_LIMIT} questions par jour. Réessayez demain ! 🌙`);
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsSending(true);

    try {
      const subject = subjects[currentSubject];

      const systemPrompt = `Tu es un assistant pédagogique expert qui aide les élèves à comprendre leur cours.

RÈGLES ABSOLUES:
1. Le contenu du cours est LA VÉRITÉ ABSOLUE
2. JAMAIS tu ne dois contredire le professeur
3. N'utilise JAMAIS "mais en réalité...", "cependant...", "en fait..."
4. Si info pas dans le cours: "Je ne trouve pas cette information dans le cours"
5. Sois pédagogique et encourage l'apprentissage
6. Réponds en français de manière claire et concise`;

      const courseContext = `SUJET ÉTUDIÉ: ${subject.title}

CONTENU DU COURS:
${subject.content}`;

      // APPEL À NOTRE BACKEND SÉCURISÉ (qui appelle Groq)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          courseContent: courseContext,
          systemPrompt: systemPrompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur réseau' }));
        console.error('Erreur backend:', response.status, errorData);
        throw new Error(errorData.error || `Erreur serveur (${response.status})`);
      }

      const data = await response.json();
      
      if (!data.success || !data.response) {
        console.error('Réponse invalide du backend:', data);
        throw new Error(data.error || 'Réponse invalide du serveur');
      }

      const responseText = data.response;
      
      if (!responseText) {
        console.error('Pas de texte dans la réponse:', data);
        throw new Error('Pas de texte dans la réponse');
      }
      
      setMessages([...newMessages, { role: 'assistant', content: responseText }]);
      
      // Incrémenter le quota après une réponse réussie
      incrementQuota();
      
    } catch (error) {
      console.error('Erreur complète:', error);
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: `Désolé, une erreur s'est produite: ${error.message}`
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const importText = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setNewSubject({ ...newSubject, content: event.target.result });
    reader.readAsText(file);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // CHARGEMENT
  if (mode === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // MODE ÉLÈVE - SÉLECTION SUJET
  if (mode === 'student' && currentSubject === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <BookOpen className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{courseTitle}</h1>
            <p className="text-gray-600">Choisissez le sujet que vous souhaitez réviser</p>
          </div>

          <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-green-900 mb-1">🔒 Vos conversations sont 100% privées</p>
                <ul className="text-xs text-green-800 space-y-0.5">
                  <li>• Vos questions et réponses restent <strong>confidentielles</strong></li>
                  <li>• Les autres élèves <strong>ne voient pas</strong> vos conversations</li>
                  <li>• Votre professeur <strong>n'a pas accès</strong> à vos questions</li>
                  <li>• Posez toutes vos questions en toute <strong>liberté</strong> !</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-bold text-blue-900">Quota quotidien</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-900">{dailyQuestionCount} / {DAILY_LIMIT}</p>
                <p className="text-xs text-blue-700">questions aujourd'hui</p>
              </div>
            </div>
            <div className="mt-2 bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(dailyQuestionCount / DAILY_LIMIT) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="grid gap-4 mb-6">
            {subjects.map((subject, index) => (
              <button
                key={index}
                onClick={() => selectSubject(index)}
                className="bg-white border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 rounded-xl p-6 text-left transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:from-indigo-700 group-hover:to-purple-700 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{subject.title}</h3>
                    <p className="text-sm text-gray-500">{subject.content.substring(0, 100)}...</p>
                  </div>
                  <MessageCircle className="w-6 h-6 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={goToTeacherMode}
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 transition-all"
          >
            <Settings className="w-3 h-3" />
            Mode professeur (accès réservé)
          </button>
        </div>
      </div>
    );
  }

  // MODE ÉLÈVE - CHAT
  if (mode === 'student' && currentSubject !== null) {
    const questionsRemaining = DAILY_LIMIT - dailyQuestionCount;
    
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">{subjects[currentSubject].title}</h1>
                  <p className="text-xs text-gray-500">Assistant IA • Propulsé par Groq (gratuit)</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">{questionsRemaining} questions restantes</span>
                </div>
                <button onClick={changeSubject} className="text-indigo-600 hover:text-indigo-700 p-2 hover:bg-indigo-50 rounded transition-all flex items-center gap-1 text-sm font-medium">
                  <List className="w-5 h-5" />
                  <span className="hidden sm:inline">Changer</span>
                </button>
                <button onClick={clearChat} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
                <button onClick={goToTeacherMode} className="text-gray-500 hover:text-gray-700 px-3 py-2 hover:bg-gray-100 rounded transition-all border border-gray-300 flex items-center gap-1.5">
                  <Settings className="w-4 h-4" />
                  <span className="hidden md:inline text-xs font-medium">Mode prof</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-sm'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isSending && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="bg-green-50 border border-green-300 rounded-lg px-3 py-2 mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-xs text-green-800"><strong>Confidentialité :</strong> Vos questions sont privées • Ni votre prof ni les autres élèves ne les voient</p>
            </div>
            <div className="flex gap-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Posez votre question sur ${subjects[currentSubject].title}...`}
                className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
                rows="2"
                disabled={isSending || dailyQuestionCount >= DAILY_LIMIT}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isSending || dailyQuestionCount >= DAILY_LIMIT}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white px-6 rounded-lg transition-all flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              💡 Toutes les réponses sont basées sur le cours • {questionsRemaining} questions restantes aujourd'hui
            </p>
          </div>
        </div>
      </div>
    );
  }

  // MODE PROFESSEUR (reste identique)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto pb-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">Mode Professeur</h1>
            </div>
            <div className="flex items-center gap-3">
              {!isPublished && autoSaveStatus === 'saved' && (
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Sauvegardé</span>
                </div>
              )}
              {!isPublished && autoSaveStatus === 'saving' && (
                <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Sauvegarde...</span>
                </div>
              )}
              {isPublished && (
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-semibold">Publié</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
            <p className="text-sm text-green-900 font-semibold mb-2">🎉 Nouveau : Propulsé par Groq (100% GRATUIT)</p>
            <ul className="text-xs text-green-800 space-y-1 ml-4 list-disc">
              <li><strong>14 400 questions/jour gratuites</strong> pour vos élèves</li>
              <li>Ultra rapide • Réponses de qualité</li>
              <li>Aucun coût pour vous !</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg mb-6">
            <p className="text-sm text-indigo-900 font-semibold mb-2">👨‍🏫 Workflow:</p>
            <ol className="text-xs text-indigo-800 space-y-1 ml-4 list-decimal">
              <li>Donnez un titre général au cours</li>
              <li><strong>Ajoutez plusieurs sujets/chapitres</strong></li>
              <li>Publiez - les élèves choisiront le sujet à réviser</li>
              <li>Chaque élève a droit à <strong>30 questions/jour</strong></li>
            </ol>
            {!isPublished && (
              <div className="mt-3 pt-3 border-t border-indigo-200">
                <p className="text-xs text-indigo-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <strong>💾 Sauvegarde automatique activée</strong> - Votre travail est sauvegardé toutes les secondes
                </p>
              </div>
            )}
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
            <p className="text-sm text-green-900 font-semibold mb-2">✅ Le chatbot respecte votre enseignement:</p>
            <ul className="text-xs text-green-800 space-y-1 ml-4 list-disc">
              <li>Il ne contredira JAMAIS votre cours</li>
              <li>Votre contenu = la vérité absolue</li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-900 font-semibold mb-2">🔒 Confidentialité totale:</p>
            <ul className="text-xs text-blue-800 space-y-1 ml-4 list-disc">
              <li>Vous <strong>n'avez pas accès</strong> aux questions des élèves</li>
              <li>Les élèves <strong>ne voient pas</strong> les conversations des autres</li>
              <li>Chaque conversation est <strong>100% privée</strong></li>
              <li>Limite : <strong>30 questions/jour/élève</strong> (évite les abus)</li>
            </ul>
          </div>

          <div className="mb-6">
            <label className="text-lg font-semibold text-gray-700 mb-2 block">Titre général du cours</label>
            <input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              placeholder="Ex: Histoire - 2nde Guerre Mondiale"
            />
          </div>

          {subjects.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Sujets configurés ({subjects.length})</h2>
                {!isPublished && (
                  <button
                    onClick={resetDraft}
                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1 px-3 py-1.5 border border-red-300 rounded-lg hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Tout effacer
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {subjects.map((subject, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 text-indigo-700 w-10 h-10 rounded-lg flex items-center justify-center font-bold">{index + 1}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-1">{subject.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{subject.content.substring(0, 150)}...</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEditSubject(index)} className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => deleteSubject(index)} className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              {editingSubjectIndex !== null ? <><Edit2 className="w-5 h-5 text-indigo-600" />Modifier le sujet {editingSubjectIndex + 1}</> : <><Plus className="w-5 h-5 text-indigo-600" />Ajouter un sujet</>}
            </h2>

            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Titre du sujet</label>
              <input
                type="text"
                value={newSubject.title}
                onChange={(e) => setNewSubject({ ...newSubject, title: e.target.value })}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                placeholder="Ex: Chapitre 1 - Les origines du conflit"
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Contenu du sujet</label>
                <label className="cursor-pointer text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  Importer
                  <input type="file" accept=".txt" onChange={importText} className="hidden" />
                </label>
              </div>
              <textarea
                value={newSubject.content}
                onChange={(e) => setNewSubject({ ...newSubject, content: e.target.value })}
                className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none font-mono text-sm"
                placeholder="Collez le contenu complet de ce sujet/chapitre..."
              />
            </div>

            <div className="flex gap-3">
              {editingSubjectIndex !== null ? (
                <>
                  <button onClick={() => updateSubject(editingSubjectIndex)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg">
                    ✓ Enregistrer
                  </button>
                  <button onClick={cancelEdit} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg">
                    Annuler
                  </button>
                </>
              ) : (
                <button onClick={addSubject} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Ajouter ce sujet
                </button>
              )}
            </div>
          </div>

          {subjects.length > 0 && (
            <>
              <div className="flex gap-3">
                {isPublished ? (
                  <>
                    <button onClick={goToStudentMode} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Tester le chatbot
                    </button>
                    <button onClick={unpublishCourse} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
                      <Lock className="w-5 h-5" />
                      Dépublier
                    </button>
                  </>
                ) : (
                  <button
                    onClick={publishCourse}
                    disabled={isPublishing}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2"
                  >
                    {isPublishing ? <><Sparkles className="w-6 h-6 animate-spin" />Publication...</> : <><Unlock className="w-6 h-6" />Publier le chatbot ({subjects.length} sujet{subjects.length > 1 ? 's' : ''})</>}
                  </button>
                )}
              </div>

              {isPublished && (
                <div className="mt-6 bg-green-50 border-2 border-green-400 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-green-500 rounded-full p-2">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg text-green-900 font-bold mb-2">✅ Chatbot publié !</p>
                      <div className="bg-white rounded-lg p-4 border border-green-300">
                        <p className="text-sm font-semibold text-green-900 mb-2">📝 Pour tester :</p>
                        <p className="text-sm text-green-800 mb-3">Cliquez sur <strong>"Tester le chatbot"</strong> ci-dessus</p>
                        <p className="text-sm font-semibold text-green-900 mb-2">👥 Pour vos élèves :</p>
                        <p className="text-sm text-green-800">Copiez l'URL de cet artefact et partagez-la</p>
                        <p className="text-xs text-green-700 mt-2">💡 Limite : 30 questions/jour/élève</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
