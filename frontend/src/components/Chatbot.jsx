import { useState } from 'react';
import ReactMarkdown from 'react-markdown'; // Import react-markdown

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'user', text: input },
    ]);

    // Clear input field
    setInput('');

    // Set loading state
    setLoading(true);

    // Fetch bot response from the API
    try {
      console.log('Sending request to:', import.meta.env.VITE_BACKEND_URL);
      const response = await fetch(import.meta.env.VITE_BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputValue: input }),
      });
      const data = await response.json();

      // Assuming the response contains markdown in the message
      const botMessage = data.data.outputs[0].outputs[0].messages[0].message;

      // Add bot response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', text: botMessage || 'Sorry, I did not understand that.' },
      ]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', text: 'Error fetching response. Please try again later.' },
      ]);
    }

    // Reset loading state
    setLoading(false);
  };

  return (
    <div className="h-full w-full flex flex-col justify-end bg-black text-white p-4">
      <h2 className="text-2xl text-center mb-4 font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 drop-shadow-lg tracking-wide">
        CHAT BOT
      </h2>
      <div className="flex-1 overflow-y-auto p-4 bg-black rounded-lg shadow-md border border-gray-700">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
                }`}
              >
                {msg.type === 'bot' ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown> // Render markdown
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-center">
              <div className="loader border-t-4 border-blue-500 rounded-full w-6 h-6 animate-spin"></div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          disabled={loading}
          className={`ml-2 p-3 rounded-lg ${
            loading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;