import { useState } from 'react';

export const useFirebaseAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const sendOTP = async (phoneNumber: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockConfirmation = {
        confirm: async (otp: string) => {
          return {
            user: {
              uid: `demo_user_${phoneNumber}`,
              phoneNumber: `+91${phoneNumber}`,
              getIdToken: async () => `demo_token_${Date.now()}`
            }
          };
        }
      };
      
      setConfirmationResult(mockConfirmation);
      return { success: true, message: 'Demo OTP sent (Use any 6-digit code)' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to send OTP' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (otp.length === 6) {
        const mockUser = {
          uid: `demo_user_${Date.now()}`,
          phoneNumber: '+91',
          getIdToken: async () => `demo_token_${Date.now()}`
        };
        
        return { 
          success: true, 
          user: mockUser, 
          idToken: `demo_token_${Date.now()}`,
          phoneNumber: '+91',
          verified: true
        };
      } else {
        return { success: false, error: 'Please enter a valid 6-digit OTP' };
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      return { success: false, error: 'Invalid OTP. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  return { sendOTP, verifyOTP, isLoading, confirmationResult };
};
