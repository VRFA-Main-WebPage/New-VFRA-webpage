import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { mapAuthErrorToUserMessage } from "@/lib/errorHandler";
import {
  verifyAdminSecurityPin,
  is2FASessionVerified,
  getSecurityStatus,
} from "@/lib/adminSecurity";
import logo from "@/assets/vfra-logo.webp";
import { motion, AnimatePresence } from "framer-motion";
import { APPLE_EASE } from "@/lib/motion";

type AuthStep = "credentials" | "2fa-pin";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signIn, signOut, user, isLoading: authLoading } = useAuth();

  const [step, setStep] = useState<AuthStep>("credentials");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 2FA PIN state
  const [pinCode, setPinCode] = useState("");
  const [verifyingPin, setVerifyingPin] = useState(false);
  const [securityStatus, setSecurityStatus] = useState({
    isLocked: false,
    remainingAttempts: 5,
    lockoutRemainingMs: 0,
  });

  useEffect(() => {
    // When user session is detected (e.g. from Google OAuth or active session)
    if (user && !authLoading) {
      if (is2FASessionVerified(user.id)) {
        // Both primary auth and 2FA PIN are already verified
        navigate("/admin/dashboard");
      } else {
        // Primary auth succeeded, now enforce 2FA PIN verification
        setStep("2fa-pin");
        setSecurityStatus(getSecurityStatus(user.id));
      }
    }
  }, [user, authLoading]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Access Denied",
        description: mapAuthErrorToUserMessage(error),
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Primary credentials passed! Transition to 2FA PIN step
    setIsLoading(false);
    setStep("2fa-pin");
    toast({
      title: "Primary Verification Passed",
      description: "Please enter your 6-digit Forensic Security PIN to complete sign-in.",
    });
  };

  const handleVerifyPin = async (codeToVerify?: string) => {
    const code = codeToVerify || pinCode;
    if (!code || code.length < 6 || !user) return;

    setVerifyingPin(true);

    try {
      const isValid = verifyAdminSecurityPin(user.id, code);

      if (isValid) {
        toast({
          title: "Two-Factor Verification Successful",
          description: "Forensic security identity confirmed. Opening Admin Console...",
        });
        navigate("/admin/dashboard");
      } else {
        const currentStatus = getSecurityStatus(user.id);
        setSecurityStatus(currentStatus);

        if (currentStatus.isLocked) {
          toast({
            title: "Account Temporarily Locked",
            description: "Too many failed attempts. Security lockout active for 15 minutes.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Invalid Security PIN",
            description: `Incorrect PIN entered. ${currentStatus.remainingAttempts} attempts remaining before temporary lockout.`,
            variant: "destructive",
          });
        }
        setPinCode("");
      }
    } finally {
      setVerifyingPin(false);
    }
  };

  const handleGoogleOAuthLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/admin`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast({
        title: "OAuth Error",
        description: err?.message || "Could not initiate Google OAuth 2.0 login.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleSwitchAccount = async () => {
    await signOut();
    setStep("credentials");
    setPinCode("");
    setEmail("");
    setPassword("");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[#555555]">
        Verifying cryptographic session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md premium-card bg-white p-8 md:p-10 shadow-sm border border-[#E5E5E3]">
        {/* Header Badge */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#E5E5E3]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg border border-[#E5E5E3] bg-[#F7F7F5] p-1.5 flex items-center justify-center">
              <img
                src={logo}
                alt="VFRA Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="font-heading font-bold text-base text-[#111111] block leading-none">
                VFRA Admin
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#555555]">
                FORENSIC OPERATIONS
              </span>
            </div>
          </div>
          <span className="font-mono text-[10px] px-2.5 py-0.5 bg-[#111111] text-white uppercase tracking-wider rounded">
            {step === "credentials" ? "RESTRICTED" : "2FA / LAYER 2"}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {step === "credentials" ? (
            /* STEP 1: CREDENTIALS OR GOOGLE OAUTH */
            <motion.div
              key="step-credentials"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.35, ease: APPLE_EASE }}
            >
              <h1 className="font-heading text-xl font-bold text-[#111111] mb-1">
                Administrator Sign In
              </h1>
              <p className="text-xs text-[#555555] mb-6">
                Sign in with your credentials or Google account to initiate 2FA verification.
              </p>

              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-mono text-[11px] uppercase tracking-wider text-[#555555]">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
                    <Input
                      type="email"
                      placeholder="admin@vigilantforensic.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 bg-[#F7F7F5]/60 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-mono text-[11px] uppercase tracking-wider text-[#555555]">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 bg-[#F7F7F5]/60 text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555555]"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-[#111111] text-white hover:bg-[#2A2A2A] font-mono text-xs uppercase tracking-[0.12em] mt-2 gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying Credentials...
                    </>
                  ) : (
                    "Continue to 2FA PIN →"
                  )}
                </Button>
              </form>

              {/* OAuth 2.0 Separator */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5E5E3]" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white px-3 font-mono text-[#71717A] tracking-wider">
                    Or Sign In With OAuth 2.0
                  </span>
                </div>
              </div>

              {/* Google OAuth 2.0 Button */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleOAuthLogin}
                className="w-full h-11 border-[#E5E5E3] bg-[#F7F7F5]/40 hover:bg-[#F7F7F5] font-sans text-xs font-medium text-[#111111] gap-2.5"
                disabled={isLoading}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google OAuth 2.0
              </Button>
            </motion.div>
          ) : (
            /* STEP 2: 2FA ADMIN SECURITY PIN VERIFICATION */
            <motion.div
              key="step-2fa-pin"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.35, ease: APPLE_EASE }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>

              <h2 className="font-heading text-xl font-bold text-[#111111] mb-1">
                Forensic Security PIN
              </h2>

              <p className="text-xs text-[#555555] mb-2 max-w-xs mx-auto">
                Primary authentication verified for:
              </p>
              <div className="font-mono text-xs font-semibold text-[#111111] bg-[#F7F7F5] border border-[#E5E5E3] px-3 py-1.5 rounded-md inline-block mb-5">
                {user?.email}
              </div>

              <p className="text-xs text-[#555555] mb-4">
                Enter your authorized 6-digit Admin Security PIN to complete two-factor authentication:
              </p>

              {securityStatus.isLocked ? (
                <div className="p-4 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Account locked due to consecutive failed attempts. Please wait 15 minutes.</span>
                </div>
              ) : (
                <div className="flex justify-center mb-6">
                  <InputOTP
                    maxLength={6}
                    value={pinCode}
                    onChange={(val) => {
                      setPinCode(val);
                      if (val.length === 6) {
                        handleVerifyPin(val);
                      }
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              )}

              <Button
                onClick={() => handleVerifyPin()}
                className="w-full h-11 bg-[#111111] text-white hover:bg-[#2A2A2A] font-mono text-xs uppercase tracking-[0.12em] gap-2 mb-3"
                disabled={pinCode.length < 6 || verifyingPin || securityStatus.isLocked}
              >
                {verifyingPin ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Validating Security PIN...
                  </>
                ) : (
                  "Verify & Unlock Dashboard"
                )}
              </Button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleSwitchAccount}
                  className="text-xs font-mono text-[#555555] hover:text-[#111111]"
                >
                  ← Sign in as different user
                </button>
                <span className="text-[10px] font-mono text-[#71717A]">
                  Attempts left: {securityStatus.remainingAttempts}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 pt-5 border-t border-[#E5E5E3] text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-[#555555] hover:text-[#111111]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
