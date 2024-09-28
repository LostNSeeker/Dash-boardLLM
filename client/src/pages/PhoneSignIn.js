import React, { useState } from 'react';
import { getAuth, signInWithPhoneNumber } from 'firebase/auth';
import { setupRecaptcha } from '../services/firebaseConfig';

const PhoneSignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const auth = getAuth();

  const handlePhoneSubmit = async () => {
    const recaptchaVerifier = setupRecaptcha('recaptcha-container');

    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResult(result);
      alert('OTP sent');
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const verifyOTP = async () => {
    try {
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();
      alert('Phone verified');
      // You can now send the idToken to the backend for verification
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div>
      <h2>Phone Sign-In</h2>
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Enter phone number"
      />
      <button onClick={handlePhoneSubmit}>Send OTP</button>
      
      <div id="recaptcha-container"></div>

      {confirmationResult && (
        <div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button onClick={verifyOTP}>Verify OTP</button>
        </div>
      )}
    </div>
  );
};

export default PhoneSignIn;
