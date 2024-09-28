import React, { useState } from 'react';
import { sendQueryToLLMWithImage } from '../services/chatService';
import { getAuth } from 'firebase/auth';

function Chat() {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file)); // Display image preview
  };

  const handleSendMessage = async () => {
    const user = getAuth().currentUser;
    if (!user) {
      alert("Please log in to send messages.");
      return;
    }

    const result = await sendQueryToLLMWithImage(message, image, user.uid);
    setResponses(result);
  };

  return (
    <div>
      <h2>Chat</h2>
      <input
        type="text"
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      
      <input type="file" accept="image/*" onChange={handleImageChange} />
      
      {imagePreview && (
        <div>
          <h4>Image Preview</h4>
          <img src={imagePreview} alt="Preview" width="200" />
        </div>
      )}
      
      <button onClick={handleSendMessage}>Send</button>

      <div>
        {responses.map((response, index) => (
          <p key={index}>{response.modelName}: {response.response}</p>
        ))}
      </div>
    </div>
  );
}

export default Chat;
