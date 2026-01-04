import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Sparkles, X, User, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

export const AIAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '¡Hola! Soy tu asesor de belleza personal. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre estilos, cortes o enviarme una foto para analizar tu look.',
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix for Gemini API
        const base64Data = base64String.split(',')[1];
        setSelectedImage(base64Data);
        // Show preview (optional logic needed if we want to show preview before sending, 
        // here we just store it to send with next message)
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      image: selectedImage || undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    const imageToSend = selectedImage;
    setSelectedImage(null); // Clear pending image
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(messages, userMsg.text, imageToSend || undefined);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Asesor Virtual</h2>
            <p className="text-xs text-gray-500">Impulsado por Gemini AI</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
            }`}>
              {msg.image && (
                <div className="mb-2 rounded-lg overflow-hidden">
                   <img 
                    src={`data:image/jpeg;base64,${msg.image}`} 
                    alt="Uploaded context" 
                    className="w-full h-auto object-cover max-h-48"
                  />
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <span className={`text-[10px] mt-2 block ${msg.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-none p-4 shadow-sm border border-gray-100">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-3 border-t border-gray-100 mb-16">
        {selectedImage && (
          <div className="flex items-center mb-2 bg-indigo-50 p-2 rounded-lg inline-flex">
            <span className="text-xs text-indigo-700 mr-2">Imagen seleccionada</span>
            <button onClick={() => setSelectedImage(null)} className="text-indigo-700">
              <X size={14} />
            </button>
          </div>
        )}
        <div className="flex items-end space-x-2">
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ImageIcon size={20} />
          </button>
          <div className="flex-1 bg-gray-100 rounded-2xl flex items-center px-4 py-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu consulta..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none max-h-24 py-1"
              rows={1}
              onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <button 
            onClick={handleSendMessage}
            disabled={!inputText.trim() && !selectedImage}
            className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};