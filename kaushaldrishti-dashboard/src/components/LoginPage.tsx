import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { UserSession } from './AuthModal';
import loginBg from '../assets/login-bg.jpg';
import kaushalLogo from '../assets/kaushaldrishti-logo.png';
import msdeLogo from '../assets/msde-logo.png';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
}

/**
 * Three-leaf botanical motif flanked by thin horizontal lines
 * Matching the exact motif in the reference image
 */
const LeafMotif: React.FC = () => (
  <div className="flex items-center justify-center gap-2.5 my-2">
    <div className="h-[1px] w-12 sm:w-16 bg-[#E5DCD0]" />
    <svg
      width="24"
      height="14"
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
    <div className="h-[1px] w-12 sm:w-16 bg-[#E5DCD0]" />
  </div>
);

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
          roleType: 'DSO',
          designation: 'District Skill Committee Lead',
          department: 'Pune District, Maharashtra',
          badge: 'DSO-MH-492',
          jurisdiction: 'Pune District, Maharashtra (Locked)',
          clearanceLevel: 'Operational District Command (DSC Lead)',
        };
      } else if (lower.includes('ncvet') || lower.includes('sen') || lower.includes('standards')) {
        session = {
          name: 'Shri Vikramaditya Sen',
          role: 'NCVET Accreditation Admin',
          roleType: 'NCVET',
          designation: 'Director of Qualifications & Standards',
          department: 'NCVET National HQ, New Delhi',
          badge: 'NCVET-ADM-01',
          jurisdiction: 'National Qualifications & NSQF Standards',
          clearanceLevel: 'Regulatory Qualifications & Standards',
        };
      } else {
        // Default official authority session
        session = {
          name: 'Dr. Rajesh Varma, IES',
          role: 'State SSDM Director',
          roleType: 'ADMIN',
          designation: 'Director, State Skill Development Mission',
          department: 'MSDE Government of India',
          badge: 'MSDE-SSDM-DIR',
          jurisdiction: 'All States & Apex Sanctions',
          clearanceLevel: 'Apex State Directorate (Full Clearance)',
        };
      }

      try {
        sessionStorage.setItem('kd_user_session', JSON.stringify(session));
        localStorage.setItem('kd_user_session', JSON.stringify(session));
      } catch {
        // ignore
      }

      onLoginSuccess(session);
    }, 600);
  };

  return (
    <div
      className="login-page relative w-screen h-screen max-h-screen overflow-hidden flex items-center justify-center lg:justify-end select-none"
      style={{
        backgroundImage: `url(${loginBg})`,
      }}
    >
      {/* 
        Background Artwork:
        - Provided background image contains: KaushalDrishti logo & subtitle, headline "Skilling for a Stronger India",
          tricolour line, MSDE emblem, connected India map visualizations, and bottom illustrated figures & landscape.
        - None of these are duplicated in HTML.
      */}

      {/* Official KaushalDrishti Logo on Top-Left matching Reference Image */}
      <div className="absolute top-3.5 left-5 sm:top-4 sm:left-8 md:top-5 md:left-12 lg:top-5 xl:top-5.5 z-20 pointer-events-none">
        <img
          src={kaushalLogo}
          alt="KaushalDrishti — AI-Powered Labour Market Intelligence"
          className="h-[38px] sm:h-[45px] md:h-[50px] lg:h-[56px] xl:h-[59px] w-auto max-w-[250px] sm:max-w-[310px] md:max-w-[360px] object-contain drop-shadow-sm"
        />
      </div>

      {/* Official MSDE / Government of India Emblem on Top-Right matching Reference Image */}
      <div className="absolute top-3.5 right-5 sm:top-4 sm:right-8 md:top-5 md:right-10 lg:top-5 lg:right-[3.2vw] xl:right-[3.5vw] 2xl:right-[5vw] z-20 pointer-events-none">
        <img
          src={msdeLogo}
          alt="Ministry of Skill Development and Entrepreneurship, Government of India"
          className="h-[38px] sm:h-[46px] md:h-[52px] lg:h-[58px] xl:h-[62px] w-auto max-w-[180px] sm:max-w-[220px] md:max-w-[260px] object-contain drop-shadow-sm"
        />
      </div>

      {/* Official Slogan: 'Skilling for a Stronger India' directly above the tricolor line with breathing room */}
      <div
        className="hidden md:block absolute left-[6.45vw] bottom-[57.8%] z-10 pointer-events-none select-none font-serif-heading font-bold tracking-tight text-left leading-[1.08]"
        aria-hidden="true"
      >
        <div className="text-[#173F35] text-[34px] md:text-[38px] lg:text-[42px] xl:text-[46px] 2xl:text-[50px]">
          Skilling
        </div>
        <div className="text-[#173F35] text-[34px] md:text-[38px] lg:text-[42px] xl:text-[46px] 2xl:text-[50px]">
          for a
        </div>
        <div className="text-[#C86142] text-[34px] md:text-[38px] lg:text-[42px] xl:text-[46px] 2xl:text-[50px]">
          Stronger India
        </div>
      </div>

      {/* Main Login Card Container - Elongated upwards from top, bottom strictly anchored */}
      <div className="w-full flex justify-center lg:justify-end px-4 sm:px-6 lg:px-0 lg:mr-[7vw] xl:mr-[7.5vw] 2xl:mr-[9vw] z-10 translate-y-2 sm:translate-y-4 lg:translate-y-6 xl:translate-y-7">
        <div
          className="w-full max-w-[370px] sm:max-w-[395px] lg:w-[31.5vw] lg:max-w-[425px] xl:max-w-[440px] rounded-[24px] border border-[#ECE3D6] px-6 py-10 sm:px-7 sm:py-11.5 xl:px-7.5 xl:py-12.5 transition-all select-auto flex flex-col justify-between"
          style={{
            backgroundColor: '#FFFEFB',
            boxShadow:
              '0 14px 34px -8px rgba(120, 100, 70, 0.14), 0 2px 6px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(236, 227, 214, 0.6)',
          }}
        >
          {/* Card Header */}
          <div className="text-center mb-5 sm:mb-6">
            <div className="text-[13px] sm:text-[13.5px] font-normal text-[#5A6863] mb-0.5">
              Welcome to
            </div>
            <h1 className="font-serif-heading text-[27px] sm:text-[29px] xl:text-[30px] font-bold text-[#173F35] tracking-tight leading-tight">
              KaushalDrishti
            </h1>

            {/* Central Leaf Motif flanked by thin horizontal lines */}
            <LeafMotif />

            <div className="text-[12px] sm:text-[12.5px] text-[#5C6B66] font-normal tracking-normal">
              AI-Powered Labour Market Intelligence
            </div>
          </div>

          {/* Validation / Status Banners */}
          {errorMessage && (
            <div className="mb-3.5 p-2.5 bg-[#FDF2F0] border border-[#F5D7CC] rounded-lg flex items-center gap-2 text-[12px] text-[#D96843]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {noticeMessage && (
            <div className="mb-3.5 p-2.5 bg-[#EFF7EE] border border-[#DCE9D9] rounded-lg flex items-center gap-2 text-[12px] text-[#17604D]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{noticeMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSignIn} noValidate className="space-y-4 sm:space-y-4.5">
            {/* Username Field */}
            <div>
              <label
                htmlFor="kd-username"
                className="block text-[12.5px] sm:text-[13px] font-semibold text-[#173F35] mb-1.5"
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
                  className="w-full h-[43px] sm:h-[45px] pl-10 pr-3 bg-white border border-[#E5DDD1] rounded-[11px] text-[13.5px] text-[#173F35] placeholder:text-[#A8B3AF] focus:outline-none focus:border-[#17604D] focus:ring-1 focus:ring-[#17604D] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="kd-password"
                className="block text-[12.5px] sm:text-[13px] font-semibold text-[#173F35] mb-1.5"
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
                  className="w-full h-[43px] sm:h-[45px] pl-10 pr-10 bg-white border border-[#E5DDD1] rounded-[11px] text-[13.5px] text-[#173F35] placeholder:text-[#A8B3AF] focus:outline-none focus:border-[#17604D] focus:ring-1 focus:ring-[#17604D] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#8C9B96] hover:text-[#173F35] transition-colors cursor-pointer focus:outline-none p-1"
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

            {/* Primary Sign In Button */}
            <div className="pt-1 sm:pt-1.5">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[45px] sm:h-[47px] bg-[#175C4B] hover:bg-[#124B3C] active:bg-[#0E3D31] text-white font-medium text-[15px] rounded-[12px] flex items-center justify-center gap-2 transition-all duration-150 shadow-sm hover:shadow cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#17604D] focus:ring-offset-1"
              >
                {loading ? (
                  <span className="flex items-center gap-2 text-xs">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
          <div className="relative flex items-center justify-center my-3 sm:my-3.5">
            <div className="w-full border-t border-[#E8DFC0]" />
            <span className="absolute bg-[#FFFEFB] px-2.5 text-[11px] text-[#7E8D88] font-normal">
              or
            </span>
          </div>

          {/* Demo Login Credentials Panel */}
          <div className="bg-[#FAF5EB] border border-[#EBDCC7] rounded-[12px] p-2.5 sm:p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#17604D]" />
                <span className="text-[11.5px] sm:text-[12px] font-bold text-[#173F35]">
                  Demo Credentials
                </span>
              </div>
              <span className="text-[10px] sm:text-[10.5px] text-[#5C6B66]">
                Pass: <code className="font-mono text-[#173F35] font-semibold bg-[#EDE3D2] px-1.5 py-0.5 rounded text-[10px]">admin123</code>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setUsername('admin');
                  setPassword('admin123');
                  setErrorMessage('');
                }}
                className={`py-1.5 px-1 rounded-md text-[10.5px] font-semibold transition-all text-center cursor-pointer shadow-xs border ${
                  username.trim().toLowerCase() === 'admin'
                    ? 'bg-[#17604D] text-white border-[#17604D]'
                    : 'bg-white hover:bg-[#17604D] text-[#173F35] hover:text-white border-[#DCD0BE] hover:border-[#17604D]'
                }`}
                title="State SSDM Director (Dr. Rajesh Varma)"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername('dso');
                  setPassword('admin123');
                  setErrorMessage('');
                }}
                className={`py-1.5 px-1 rounded-md text-[10.5px] font-semibold transition-all text-center cursor-pointer shadow-xs border ${
                  username.trim().toLowerCase() === 'dso' || username.trim().toLowerCase().includes('anjali')
                    ? 'bg-[#17604D] text-white border-[#17604D]'
                    : 'bg-white hover:bg-[#17604D] text-[#173F35] hover:text-white border-[#DCD0BE] hover:border-[#17604D]'
                }`}
                title="District Skill Officer (Smt. Anjali Deshmukh)"
              >
                DSO
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername('ncvet');
                  setPassword('admin123');
                  setErrorMessage('');
                }}
                className={`py-1.5 px-1 rounded-md text-[10.5px] font-semibold transition-all text-center cursor-pointer shadow-xs border ${
                  username.trim().toLowerCase() === 'ncvet' || username.trim().toLowerCase().includes('sen')
                    ? 'bg-[#17604D] text-white border-[#17604D]'
                    : 'bg-white hover:bg-[#17604D] text-[#173F35] hover:text-white border-[#DCD0BE] hover:border-[#17604D]'
                }`}
                title="NCVET Accreditation Admin (Shri Vikramaditya Sen)"
              >
                NCVET
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
