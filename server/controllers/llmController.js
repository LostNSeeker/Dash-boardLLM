const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const db = require('../config/firebaseConfig');

exports.postQueryWithImage = async (req, res) => {
  const { query, uid } = req.body;
  const image = req.file;

  let extractedText = '';
  if (image) {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(image.path));
    
    try {
      const visionResponse = await axios.post('https://vision.googleapis.com/v1/images:annotate', formData, {
        headers: {
          Authorization: `Bearer ${process.env.GOOGLE_VISION_API_KEY}`,
        },
      });
      extractedText = visionResponse.data.textAnnotations[0].description || '';
    } catch (error) {
      console.error('Error analyzing image:', error);
      return res.status(500).json({ error: 'Error analyzing image' });
    }
  }

  const fullQuery = query || extractedText;

  const llmResponses = [
    { modelName: 'GPT', response: 'GPT response based on ' + fullQuery },
    { modelName: 'Claude', response: 'Claude response based on ' + fullQuery },
    { modelName: 'OtherLLM', response: 'Other LLM response based on ' + fullQuery },
  ];

  const chatData = {
    userId: uid,
    query: fullQuery,
    responses: llmResponses,
    imageUrl: image ? `/uploads/${image.filename}` : null,
    timestamp: new Date().toISOString(),
  };

  try {
    await db.collection('chats').add(chatData);
    res.json({ message: 'Chat saved successfully', responses: llmResponses });
  } catch (error) {
    console.error('Error saving chat:', error);
    res.status(500).json({ error: 'Error saving chat' });
  }
};
