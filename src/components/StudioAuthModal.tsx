import { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';
import {
  verifyMasterKey,
  getLockoutRemainingSeconds,
  isSecurityInitialized,
  initializeMasterKey,
  changeMasterKey,
  DEFAULT_MASTER_KEY,
} from '../utils/security';

interface StudioAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export function StudioAuthModal({ isOpen, onClose, onAuthenticated }: StudioAuthModalProps) {
  const [passphrase, setPassphrase] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutSec, setLockoutSec] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);

  // Key rotation mode state
  const [mode, setMode] = useState<'unlock' | 'changeKey'>('unlock');
  const [currentKeyInput, setCurrentKeyInput] = useState('');
  const [newKeyInput, setNewKeyInput] = useState('');
  const [confirmNewKeyInput, setConfirmNewKeyInput] = useState('');
  const [rotationSuccess, setRotationSuccess] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Check lockout on open and tick timer
  useEffect(() => {
    if (!isOpen) return;

    setErrorMessage('');
    setPassphrase('');
    setRotationSuccess(false);

    const initialLockout = getLockoutRemainingSeconds();
    setLockoutSec(initialLockout);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    const interval = setInterval(() => {
      const remaining = getLockoutRemainingSeconds();
      setLockoutSec(remaining);
      if (remaining === 0 && lockoutSec > 0) {
        setErrorMessage('');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, lockoutSec]);

  if (!isOpen) return null;

  const handleSubmitUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSec > 0 || isSubmitting) return;

    if (!passphrase.trim()) {
      setErrorMessage('Please enter the master access key.');
      sound.playBlip();
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await verifyMasterKey(passphrase.trim(), rememberMe);
      if (result.success) {
        sound.playClick();
        onAuthenticated();
      } else {
        sound.playBlip();
        setErrorMessage(result.error || 'Authentication rejected.');
        if (result.lockedUntil) {
          setLockoutSec(Math.ceil((result.lockedUntil - Date.now()) / 1000));
        }
        if (typeof result.attemptsRemaining === 'number') {
          setAttemptsRemaining(result.attemptsRemaining);
        }
      }
    } catch {
      setErrorMessage('An unexpected error occurred during cryptographic verification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseDefault = () => {
    sound.playClick();
    setPassphrase(DEFAULT_MASTER_KEY);
    setErrorMessage('');
  };

  const handleChangeKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyInput.length < 6) {
      setErrorMessage('New passphrase must be at least 6 characters.');
      sound.playBlip();
      return;
    }
    if (newKeyInput !== confirmNewKeyInput) {
      setErrorMessage('New passphrases do not match.');
      sound.playBlip();
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const res = await changeMasterKey(currentKeyInput, newKeyInput);
    setIsSubmitting(false);

    if (res.success) {
      sound.playClick();
      setRotationSuccess(true);
      setTimeout(() => {
        setMode('unlock');
        setPassphrase(newKeyInput);
      }, 1500);
    } else {
      sound.playBlip();
      setErrorMessage(res.error || 'Failed to update master key.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-mono font-semibold text-white tracking-tight">
                Studio Gate · Access Control
              </h3>
              <p className="text-[11px] font-mono text-zinc-500">
                Authorized Owner Access Only
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            title="Cancel (ESC)"
          >
            ✕
          </button>
        </div>

        {/* Lockout Warning Banner */}
        {lockoutSec > 0 && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs font-mono text-red-300 flex items-center gap-2.5">
            <svg className="w-4 h-4 shrink-0 text-red-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="font-semibold block">Security Cooldown Active</span>
              <span className="text-[11px] text-red-400">
                Rate-limit lock engaged. Retry in {lockoutSec} seconds.
              </span>
            </div>
          </div>
        )}

        {/* Unlock Mode */}
        {mode === 'unlock' ? (
          <form onSubmit={handleSubmitUnlock} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-zinc-300 font-medium">
                  Master Access Key
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="relative">
                <input
                  ref={inputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={passphrase}
                  onChange={(e) => {
                    setPassphrase(e.target.value);
                    setErrorMessage('');
                  }}
                  disabled={lockoutSec > 0 || isSubmitting}
                  placeholder="Enter secret passphrase..."
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-900/50 text-xs font-mono text-red-400 animate-in fade-in duration-100">
                {errorMessage}
              </div>
            )}

            {/* Session Persistence Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-mono text-zinc-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-zinc-800 bg-zinc-900 text-emerald-500 focus:ring-0 focus:ring-offset-0"
              />
              <span>Remember this browser for 7 days</span>
            </label>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleUseDefault}
                className="text-[11px] font-mono text-zinc-500 hover:text-emerald-400 transition-colors underline underline-offset-4"
                title="Autofill default master key for quick access"
              >
                Insert Default Key
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={lockoutSec > 0 || isSubmitting}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 text-xs font-mono font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <span>Authenticate</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footnote / Key rotation link */}
            <div className="mt-5 pt-4 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>AB Peace Publishing Terminal</span>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMode('changeKey');
                  setErrorMessage('');
                }}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Change Key ⚙
              </button>
            </div>
          </form>
        ) : (
          /* Change Key Mode */
          <form onSubmit={handleChangeKey} className="space-y-4">
            {rotationSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="text-emerald-400 text-2xl font-mono">✓</div>
                <h4 className="text-sm font-mono font-semibold text-white">
                  Master Passphrase Updated
                </h4>
                <p className="text-xs font-mono text-zinc-400">
                  Switching to unlock mode...
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">
                    Current Passphrase
                  </label>
                  <input
                    type="password"
                    value={currentKeyInput}
                    onChange={(e) => setCurrentKeyInput(e.target.value)}
                    placeholder="Enter current master key..."
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">
                    New Passphrase (min 6 characters)
                  </label>
                  <input
                    type="password"
                    value={newKeyInput}
                    onChange={(e) => setNewKeyInput(e.target.value)}
                    placeholder="Enter strong new passphrase..."
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">
                    Confirm New Passphrase
                  </label>
                  <input
                    type="password"
                    value={confirmNewKeyInput}
                    onChange={(e) => setConfirmNewKeyInput(e.target.value)}
                    placeholder="Repeat new passphrase..."
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                  />
                </div>

                {errorMessage && (
                  <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-900/50 text-xs font-mono text-red-400">
                    {errorMessage}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setMode('unlock');
                      setErrorMessage('');
                    }}
                    className="text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                  >
                    ← Back to Unlock
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-mono font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    {isSubmitting ? 'Updating...' : 'Save New Key'}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
