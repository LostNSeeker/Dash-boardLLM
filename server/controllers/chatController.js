const db = require('../config/firebaseConfig');

// Fetch user chat history from Firestore
exports.getUserChats = async (req, res) => {
  const { uid } = req.query;

  try {
    // Query Firestore for the user's chats
    const chatSnapshot = await db.collection('chats').where('userId', '==', uid).get();

    if (chatSnapshot.empty) {
      return res.status(200).json([]);
    }

    // Map the Firestore documents to chat data
    const chats = chatSnapshot.docs.map(doc => doc.data());

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching user chats:', error);
    res.status(500).json({ error: 'Error fetching chats' });
  }
};
