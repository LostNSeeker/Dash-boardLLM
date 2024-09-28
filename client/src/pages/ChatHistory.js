import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { fetchUserChats } from '../services/chatService';

const ChatHistory = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const user = getAuth().currentUser;
    if (user) {
      fetchUserChats(user.uid).then(setChats);
    }
  }, []);

  return (
    <div>
      <h2>Chat History</h2>
      {chats.map((chat, index) => (
        <div key={index}>
          <h4>Query: {chat.query}</h4>
          <p>Responses:</p>
          {chat.responses.map((resp, i) => (
            <p key={i}>{resp.modelName}: {resp.response}</p>
          ))}
          {chat.imageUrl && <img src={chat.imageUrl} alt="User uploaded" width="100" />}
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
