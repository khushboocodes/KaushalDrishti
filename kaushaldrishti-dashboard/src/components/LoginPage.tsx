import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserSession } from './AuthModal';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
}

/**
 * Three-leaf botanical motif flanked by thin horizontal lines
 * Matching the exact motif in the reference image
 */
const LeafMotif: React.FC = () => (
  <div className="flex items-center justify-center gap-2.5 my-1.5">
    <div className="h-[1px] w-10 sm:w-12 bg-[#E5DCD0]" />
    <svg
      width="22"
      height="13"
      viewBox="0 0 24 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 text-[#175C4B]"
      aria-hidden="true"
    >
      {/* Center upright leaf */}
      <path
        d="M12 13.5C12 13.5 10.4 7 12 1C13.6 7 12 13.5 12 13.5Z"
        fill="currentColor"
      />
      {/* Left leaf */}
      <path
        d="M11.5 12.5C11.5 12.5 5.5 11.5 2.5 7.5C6.5 6 9.8 9 11.5 12.5Z"
        fill="currentColor"
      />
      {/* Right leaf */}
      <path
        d="M12.5 12.5C12.5 12.5 18.5 11.5 21.5 7.5C17.5 6 14.2 9 12.5 12.5Z"
        fill="currentColor"
      />
    </svg>
    <div className="h-[1px] w-10 sm:w-12 bg-[#E5DCD0]" />
  </div>
);

/**
 * Exact Checkered Restricted Access Shield Icon matching reference image
 */
const RestrictedShieldIcon: React.FC = () => (
  <svg
    width="20"
    height="24"
    viewBox="0 0 24 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
    aria-hidden="true"
  >
    {/* Top-Right Quadrant: Green */}
    <path
      d="M12 3V14H20.2C20.2 13.5 20.2 13 20.2 12V7L12 3Z"
      fill="#17604D"
    />
    {/* Bottom-Left Quadrant: Green */}
    <path
      d="M12 14V25C7.5 23.5 3.8 18.5 3.8 13H12V14Z"
      fill="#17604D"
    />
    {/* Top-Left Quadrant: Light Background Fill */}
    <path
      d="M12 3L3.8 7V13H12V3Z"
      fill="#FAF5EB"
    />
    {/* Bottom-Right Quadrant: Light Background Fill */}
    <path
      d="M12 14H20.2C20.2 18.5 16.5 23.5 12 25V14Z"
      fill="#FAF5EB"
    />
    {/* Outer Shield Outline */}
    <path
      d="M12 2.5L3 6.8V13C3 19.5 6.8 24.8 12 26.2C17.2 24.8 21 19.5 21 13V6.8L12 2.5Z"
      stroke="#17604D"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [noticeMessage, setNoticeMessage] = useState<string>('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setNoticeMessage('');

    const cleanUser = username.trim();
    if (!cleanUser) {
      setErrorMessage('Please enter your username.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);

    // Simulate authentic authentication process
    setTimeout(() => {
      setLoading(false);

      let session: UserSession;
      const lower = cleanUser.toLowerCase();

      if (lower.includes('dso') || lower.includes('district') || lower.includes('anjali')) {
        session = {
          name: 'Smt. Anjali Deshmukh',
          role: 'District Skill Officer (DSO)',
          designation: 'District Skill Committee Lead',
          department: 'Pune District, Maharashtra',
          badge: 'DSO-MH-492',
        };
      } else if (lower.includes('ncvet') || lower.includes('sen') || lower.includes('standards')) {
        session = {
          name: 'Shri Vikramaditya Sen',
          role: 'NCVET Accreditation Admin',
          designation: 'Director of Qualifications & Standards',
          department: 'NCVET National HQ, New Delhi',
          badge: 'NCVET-ADM-01',
        };
      } else {
        // Default official authority session
        session = {
          name: 'Dr. Rajesh Varma, IES',
          role: 'State SSDM Director',
          designation: 'Director, State Skill Development Mission',
          department: 'MSDE Government of India',
          badge: 'MSDE-SSDM-DIR',
        };
      }

      if (rememberMe) {
        try {
          localStorage.setItem('kd_user_session', JSON.stringify(session));
        } catch {
          // ignore
        }
      } else {
        try {
          sessionStorage.setItem('kd_user_session', JSON.stringify(session));
        } catch {
          // ignore
        }
      }

      onLoginSuccess(session);
    }, 600);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setNoticeMessage(
      'Password recovery instructions sent to registered security administrator.'
    );
  };

  return (
    <div className="login-page relative w-screen h-screen max-h-screen overflow-hidden flex items-center justify-center lg:justify-end select-none">
      {/* 
        Background Artwork:
        - Provided background image contains: KaushalDrishti logo & subtitle, headline "Skilling for a Stronger India",
          tricolour line, MSDE emblem, connected India map visualizations, and bottom illustrated figures & landscape.
        - None of these are duplicated in HTML.
      */}

      {/* Main Login Card Container - Positioned on right side, scaled to fit screen without scroll */}
      <div className="w-full flex justify-center lg:justify-end px-4 sm:px-6 lg:px-0 lg:mr-[28px] xl:mr-[34px] 2xl:mr-[44px] z-10">
        <div
          className="w-full max-w-[360px] sm:max-w-[380px] rounded-[22px] border border-[#ECE3D6] p-6 sm:p-7 transition-all select-auto"
          style={{
            backgroundColor: '#FFFEFB',
            boxShadow:
              '0 14px 34px -8px rgba(120, 100, 70, 0.14), 0 2px 6px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(236, 227, 214, 0.6)',
          }}
        >
          {/* Card Header */}
          <div className="text-center mb-4">
            <div className="text-[13px] font-normal text-[#5A6863] mb-0.5">
              Welcome to
            </div>
            <h1 className="font-serif-heading text-[26px] sm:text-[27px] font-bold text-[#173F35] tracking-tight leading-tight">
              KaushalDrishti
            </h1>

            {/* Central Leaf Motif flanked by thin horizontal lines */}
            <LeafMotif />

            <div className="text-[11.5px] text-[#5C6B66] font-normal tracking-normal">
              AI-Powered Labour Market Intelligence
            </div>
          </div>

          {/* Validation / Status Banners */}
          {errorMessage && (
            <div className="mb-3 p-2 bg-[#FDF2F0] border border-[#F5D7CC] rounded-lg flex items-center gap-2 text-[11.5px] text-[#D96843]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {noticeMessage && (
            <div className="mb-3 p-2 bg-[#EFF7EE] border border-[#DCE9D9] rounded-lg flex items-center gap-2 text-[11.5px] text-[#17604D]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{noticeMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSignIn} noValidate className="space-y-3">
            {/* Username Field */}
            <div>
              <label
                htmlFor="kd-username"
                className="block text-[12px] font-semibold text-[#173F35] mb-1.5"
              >
                Username
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-[#8C9B96]">
                  <User className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <input
                  id="kd-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter your username"
                  className="w-full h-[40px] pl-10 pr-3 bg-white border border-[#E5DDD1] rounded-[10px] text-[13px] text-[#173F35] placeholder:text-[#A8B3AF] focus:outline-none focus:border-[#17604D] focus:ring-1 focus:ring-[#17604D] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="kd-password"
                className="block text-[12px] font-semibold text-[#173F35] mb-1.5"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-[#8C9B96]">
                  <Lock className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <input
                  id="kd-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter your password"
                  className="w-full h-[40px] pl-10 pr-10 bg-white border border-[#E5DDD1] rounded-[10px] text-[13px] text-[#173F35] placeholder:text-[#A8B3AF] focus:outline-none focus:border-[#17604D] focus:ring-1 focus:ring-[#17604D] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 text-[#8C9B96] hover:text-[#173F35] transition-colors cursor-pointer focus:outline-none p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4" strokeWidth={1.8} />
                  ) : (
                    <EyeOff className="w-4 h-4" strokeWidth={1.8} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between pt-0.5 pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-[4px] border-[#9AA6A2] text-[#17604D] focus:ring-[#17604D] accent-[#17604D] cursor-pointer"
                />
                <span className="text-[12px] text-[#173F35] font-medium">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[12px] text-[#17604D] font-medium hover:underline cursor-pointer focus:outline-none"
              >
                Forgot password?
              </button>
            </div>

            {/* Primary Sign In Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[42px] bg-[#175C4B] hover:bg-[#124B3C] active:bg-[#0E3D31] text-white font-medium text-[14px] rounded-[11px] flex items-center justify-center gap-2 transition-all duration-150 shadow-sm hover:shadow cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#17604D] focus:ring-offset-1"
              >
                {loading ? (
                  <span className="flex items-center gap-2 text-xs">
                    <svg
                      className="animate-spin h-3.5 w-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Authenticating...</span>
                  </span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="text-base leading-none">→</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3.5">
            <div className="w-full border-t border-[#E8DFC0]" />
            <span className="absolute bg-[#FFFEFB] px-3 text-[11px] text-[#7E8D88] font-normal">
              or
            </span>
          </div>

          {/* Restricted Access Panel */}
          <div className="bg-[#FAF5EB] border border-[#EBDCC7] rounded-[11px] p-2.5 sm:p-3 flex items-center gap-3">
            <RestrictedShieldIcon />
            <div>
              <div className="text-[12px] font-bold text-[#173F35] leading-tight">
                Restricted Access
              </div>
              <div className="text-[10.5px] text-[#5C6B66] leading-tight mt-0.5">
                Authorized users only. RBAC enforced.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
