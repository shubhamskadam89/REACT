import { useState } from 'react';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Request
  const handleRequest = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/auth/forgot-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        // Optionally, backend can return the security question type
        const data = await res.json();
        setSecurityQuestion(data.securityQuestion || '');
        setStep(2);
      } else {
        const data = await res.json();
        setMessage(data.message || 'Email not found.');
      }
    } catch (err) {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify
  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/auth/forgot-password/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, securityAnswer, newPassword }),
      });
      if (res.ok) {
        setMessage('Password reset successful! You can now log in.');
        setStep(3);
      } else {
        const data = await res.json();
        setMessage(data.message || 'Verification failed.');
      }
    } catch (err) {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  // Security question text mapping
  const questionText = {
    PET_NAME: "What is your pet’s name?",
    BIRTH_CITY: "In which city were you born?",
    FAVORITE_TEACHER: "Who was your favorite teacher?",
    MOTHER_MAIDEN_NAME: "What is your mother's maiden name?",
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>
        {step === 1 && (
          <form onSubmit={handleRequest} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Email<br />
                <input name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" disabled={loading}>{loading ? 'Sending...' : 'Next'}</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Security Question<br />
                <input value={questionText[securityQuestion] || 'Security Question'} disabled className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100" />
              </label>
            </div>
            <div>
              <label className="block mb-1 font-medium">Security Answer<br />
                <input name="securityAnswer" value={securityAnswer} onChange={e => setSecurityAnswer(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
            </div>
            <div>
              <label className="block mb-1 font-medium">New Password<br />
                <input name="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" disabled={loading}>{loading ? 'Verifying...' : 'Reset Password'}</button>
          </form>
        )}
        {step === 3 && (
          <div className="text-center text-green-600 font-medium">{message}</div>
        )}
        {message && step !== 3 && <p className={`mt-4 text-center text-red-500`}>{message}</p>}
        <div className="mt-4 text-center">
          <a href="/" className="text-blue-600 hover:underline">Back to Login</a>
        </div>
      </div>
    </div>
  );
} 