const { getAuth } = require('firebase-admin/auth');

exports.verifyUser = async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify the Firebase ID token
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Successfully verified, return user UID
    res.status(200).json({ uid });
  } catch (error) {
    // Handle errors during verification
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Unauthorized. Invalid ID token.' });
  }
};
