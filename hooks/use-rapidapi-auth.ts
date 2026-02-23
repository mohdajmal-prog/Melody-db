import { useState } from 'react';

export const useRapidApiAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendOTP = async (phoneNumber: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return { success: true, message: 'OTP sent successfully' };
      } else {
        return { success: false, error: data.error || 'Failed to send OTP' };
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (phoneNumber: string, otp: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber, otp }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return { 
          success: true, 
          user: data.user,
          phoneNumber: data.phoneNumber 
        };
      } else {
        return { success: false, error: data.error || 'Invalid OTP' };
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      return { success: false, error: 'Invalid OTP' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendOTP,
    verifyOTP,
    isLoading
  };
};
