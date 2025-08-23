import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';

const AuthPage = () => {
  const [view, setView] = useState('login');

  return (
    <div className="auth-page">
      {view === 'login' && (
        <>
          <LoginForm onForgotPassword={() => setView('forgot')} />
          <p>
            Don't have an account?{' '}
            <button className="link-btn" onClick={() => setView('signup')}>
              Sign Up
            </button>
          </p>
        </>
      )}
      {view === 'signup' && (
        <>
          <SignupForm onSignupSuccess={() => setView('login')} />
          <p>
            Already have an account?{' '}
            <button className="link-btn" onClick={() => setView('login')}>
              Login
            </button>
          </p>
        </>
      )}
      {view === 'forgot' && (
        <>
          <ForgotPasswordForm onEmailSent={() => setView('login')} />
          <p>
            Remembered your password?{' '}
            <button className="link-btn" onClick={() => setView('login')}>
              Login
            </button>
          </p>
        </>
      )}
    </div>
  );
};

export default AuthPage;
