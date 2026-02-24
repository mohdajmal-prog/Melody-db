"use client";

import { useState, useEffect } from "react";
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export default function TestFirebase() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    addLog("Firebase initialized");
    addLog(`Project ID: ${firebaseConfig.projectId}`);
    addLog(`App ID: ${firebaseConfig.appId}`);
    addLog(`Auth Domain: ${firebaseConfig.authDomain}`);
    
    // Check if auth is properly initialized
    addLog(`Auth instance: ${auth ? 'OK' : 'FAILED'}`);
    addLog(`Auth app name: ${auth.app.name}`);
    
    // Initialize reCAPTCHA once on mount - CORRECT ORDER
    if (typeof window !== 'undefined' && !(window as any).recaptchaVerifier) {
      try {
        addLog("Creating reCAPTCHA verifier...");
        // Correct: RecaptchaVerifier(auth, elementId, options)
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => addLog('reCAPTCHA solved'),
          'expired-callback': () => addLog('reCAPTCHA expired'),
        });
        addLog("✅ reCAPTCHA verifier created");
      } catch (error: any) {
        addLog(`❌ reCAPTCHA error: ${error.message}`);
      }
    }
  }, []);

  const handleSendOTP = async () => {
    try {
      addLog("Starting OTP send...");
      const phoneNumber = `+91${phone}`;
      addLog(`Phone: ${phoneNumber}`);
      
      // Use existing verifier
      if (!(window as any).recaptchaVerifier) {
        addLog("❌ reCAPTCHA verifier not found!");
        alert("Please refresh the page and try again");
        return;
      }

      const appVerifier = (window as any).recaptchaVerifier;
      addLog("Using reCAPTCHA verifier...");
      
      addLog("Calling signInWithPhoneNumber...");
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      
      setConfirmationResult(result);
      setStep("otp");
      addLog("✅ OTP sent successfully!");
      alert("OTP sent!");
    } catch (error: any) {
      addLog(`❌ Error: ${error.code} - ${error.message}`);
      console.error("Full error:", error);
      alert(`Error: ${error.code}\n${error.message}`);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      addLog("Verifying OTP...");
      await confirmationResult.confirm(otp);
      addLog("✅ Verified!");
      alert("Success!");
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Firebase Phone Auth Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Config</h2>
          <p className="text-sm">Project: {firebaseConfig.projectId}</p>
        </div>

        {step === "phone" && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Send OTP</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <span className="px-4 py-2 bg-gray-100 rounded">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 px-4 py-2 border rounded"
                  placeholder="9876543210"
                />
              </div>
              <div id="recaptcha-container" className="flex justify-center"></div>
              <button
                onClick={handleSendOTP}
                disabled={phone.length !== 10}
                className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
              >
                Send OTP
              </button>
            </div>
          </div>
        )}

        {step === "otp" && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>
            <div className="space-y-4">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-2 border rounded text-center text-2xl"
                placeholder="000000"
              />
              <button
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6}
                className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
              >
                Verify
              </button>
              <button
                onClick={() => setStep("phone")}
                className="w-full bg-gray-300 py-2 rounded"
              >
                Back
              </button>
            </div>
          </div>
        )}

        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs">
          <h3 className="text-white font-bold mb-2">Logs:</h3>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
