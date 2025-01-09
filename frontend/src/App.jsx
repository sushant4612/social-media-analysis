import './App.css';
import Navbar from './components/Navbar';
import Analytics from './components/Analytics';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <div className="bg-black h-screen w-screen fixed">
      {/* Navbar Section */}
      <div className="h-1/6 border-b border-gray-700">
        <Navbar />
      </div>
      
      {/* Main Content */}
      <div className="h-5/6 flex justify-between px-4 py-6 space-x-4">
        {/* Analytics Component */}
        <div className="flex-1 border border-gray-700 rounded-lg shadow-lg">
          <Analytics />
        </div>
        
        {/* Chatbot Component */}
        <div className="flex-1 border border-gray-700 rounded-lg shadow-lg">
          <Chatbot />
        </div>
      </div>
    </div>
  );
}

export default App;