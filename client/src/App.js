import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import ChatHistory from './pages/ChatHistory';
import PhoneSignIn from './pages/PhoneSignIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PhoneSignIn />} />  {/* Default route for sign-in */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/history" element={<ChatHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
