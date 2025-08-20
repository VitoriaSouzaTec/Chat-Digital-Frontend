import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  console.info("messages: ", messages);
  useEffect(() => {
    socket.on('newMessage', ({ username: sender, message }) => {
      setMessages(prev => [...prev, {
        username: sender,
        message,
        type: 'user',
        isMe: sender === username,
        timestamp: new Date()
      }]);
    });

    socket.on('systemMessage', (message) => {
      setMessages(prev => [...prev, {
        message,
        type: 'system',
        timestamp: new Date()
      }]);
    });

    socket.on('userConnected', (username) => {
      setMessages(prev => [...prev, {
        message: `${username} entrou no chat`,
        type: 'notification',
        timestamp: new Date()
      }]);
    });

    socket.on('userDisconnected', (username) => {
      setMessages(prev => [...prev, {
        message: `${username} saiu do chat`,
        type: 'notification',
        timestamp: new Date()
      }]);
    });

    return () => {
      socket.off('newMessage');
      socket.off('systemMessage');
      socket.off('userConnected');
      socket.off('userDisconnected');
    };
  }, [username]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('registerUser', username);
      setIsRegistered(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('sendMessage', { username, message });
      setMessage('');
    }
  };

  if (!isRegistered) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f0f2f5]">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <div className="flex justify-center mb-6">
            <div className="bg-[#00a884] rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29-13.96c-5.297 0-9.588 4.29-9.588 9.587 0 1.835.53 3.574 1.512 5.078L1.22 20.72l4.942-1.544a9.68 9.68 0 0 0 4.6 1.166c5.296 0 9.587-4.289 9.587-9.587 0-5.298-4.291-9.588-9.587-9.588" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">Digital Chat</h1>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00a884]"
              placeholder="Digite seu nome"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#00a884] text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition"
            >
              Entrar no chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#eae6df]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-[#f0f2f5] border-b border-gray-300">
        <div className="flex items-center">
          <div className="bg-[#00a884] rounded-full p-2 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29-13.96c-5.297 0-9.588 4.29-9.588 9.587 0 1.835.53 3.574 1.512 5.078L1.22 20.72l4.942-1.544a9.68 9.68 0 0 0 4.6 1.166c5.296 0 9.587-4.289 9.587-9.587 0-5.298-4.291-9.588-9.587-9.588" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-gray-800">Digital Chat</h1>
        </div>
        <div className="text-sm text-gray-500">Olá, {username}</div>
      </div>

      {/* Chat Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 bg-[#eae6df] bg-opacity-50 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-light_686b98c9fdffef3f.png')]"
        style={{ backgroundSize: '412.5px 749.25px' }}
      >
        {messages.map((msg, index) => (
          <div key={index} className={`mb-3 ${msg.type === 'notification' ? 'flex justify-center' : ''}`}>
            {msg.type === 'user' ? (
              <div className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.isMe ? 'bg-[#d9fdd3] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                  {!msg.isMe && (
                    <div className="text-xs text-[#667781] font-medium mb-1">
                      {msg.username}
                    </div>
                  )}
                  <div className="text-gray-800">{msg.message}</div>
                  <div className="text-xs text-[#667781] text-right mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ) : msg.type === 'system' ? (
              <div className="text-sm px-4 py-2 rounded-lg text-center bg-[#e9edef] text-[#667781]">
                {msg.message}
              </div>
            ) : (
              <div className="text-xs px-4 py-1 rounded-full bg-[#e9edef] text-[#667781] inline-block">
                {msg.message}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-[#f0f2f5] border-t border-gray-300">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 py-2 px-4 rounded-full bg-white text-gray-800 focus:outline-none"
            placeholder="Digite uma mensagem..."
          />
          <button
            type="submit"
            className="ml-2 p-2 rounded-full text-[#54656f] hover:bg-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;