import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  Smartphone,
  QrCode,
  KeyRound,
  Loader2,
  CheckCircle2,
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
import logo from "@/assets/vfra-logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { APPLE_EASE } from "@/lib/motion";

type AuthStep = "credentials" | "2fa-verify" | "2fa-enroll";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user, isLoading: authLoading } = useAuth();

  const [step, setStep] = useState<AuthStep>("credentials");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 2FA state
  const [otpCode, setOtpCode] = useState("");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [enrollData, setEnrollData] = useState<{
    qrCodeUrl: string;
    secret: string;
    factorId: string;
  } | null>(null);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  useEffect(() => {
    // Only auto-redirect if already on dashboard or already verified
    if (user && !authLoading && step === "credentials") {
      checkExistingMfaStatus();
    }
  }, [user, authLoading]);

  const checkExistingMfaStatus = async () => {
    try {
      const { data: aalData } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalData && aalData.nextLevel === "aal2" && aalData.currentLevel !== "aal2") {
        // 2FA is enrolled and required
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const totp = factors?.totp?.find((f) => f.status === "verified");
        if (totp) {
          setFactorId(totp.id);
          setStep("2fa-verify");
          return;
        }
      }
      // If already at AAL2 or no 2FA enforced, navigate
      navigate("/admin/dashboard");
    } catch {
      navigate("/admin/dashboard");
    }
  };

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

    // Credentials passed! Now check 2FA status
    try {
      const { data: aalData } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const verifiedTotp = factors?.totp?.find((f) => f.status === "verified");

      if (verifiedTotp) {
        // Case A: User already has 2FA set up -> ask for 6-digit code
        setFactorId(verifiedTotp.id);
        setStep("2fa-verify");
        toast({
          title: "Two-Factor Verification Required",
          description: "Enter the 6-digit code from your Authenticator app.",
        });
      } else {
        // Case B: Prompt to enroll in 2FA (TOTP)
        const { data: enroll, error: enrollErr } =
          await supabase.auth.mfa.enroll({
            factorType: "totp",
            issuer: "VFRA Forensic Admin",
          });

        if (enroll && !enrollErr) {
          setEnrollData({
            qrCodeUrl: enroll.totp.qr_code,
            secret: enroll.totp.secret,
            factorId: enroll.id,
          });
          setFactorId(enroll.id);
          setStep("2fa-enroll");
          toast({
            title: "2FA Setup Required",
            description: "Scan the QR code with Google Authenticator or Microsoft Authenticator.",
          });
        } else {
          // Fallback if MFA cannot be enrolled: proceed to dashboard
          navigate("/admin/dashboard");
        }
      }
    } catch (err) {
      console.warn("2FA check fallback:", err);
      navigate("/admin/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpCode;
    if (!code || code.length < 6 || !factorId) return;

    setVerifyingOtp(true);
    try {
      const challenge = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challenge.error) throw challenge.error;

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code,
      });

      if (verify.error) throw verify.error;

      toast({
        title: "Authentication Verified",
        description: "Two-factor verification successful. Opening Admin Console...",
      });
      navigate("/admin/dashboard");
    } catch (err: any) {
      toast({
        title: "Invalid Verification Code",
        description: err?.message || "Please check the 6-digit code in your app and try again.",
        variant: "destructive",
      });
    } finally {
      setVerifyingOtp(false);
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
                NAGPUR LABORATORY
              </span>
            </div>
          </div>
          <span className="font-mono text-[10px] px-2.5 py-0.5 bg-[#111111] text-white uppercase tracking-wider rounded">
            {step === "credentials" ? "RESTRICTED" : "2FA / LAYER 2"}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {step === "credentials" ? (
            /* STEP 1: CREDENTIALS */
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
                Enter your credentials to initiate dual-factor verification.
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
                      placeholder="admin@vigilantforensics.com"
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
                    "Continue to 2FA Verification →"
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
          ) : step === "2fa-verify" ? (
            /* STEP 2A: 2FA CODE VERIFICATION (EXISTING TOTP) */
            <motion.div
              key="step-2fa-verify"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.35, ease: APPLE_EASE }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <h2 className="font-heading text-xl font-bold text-[#111111] mb-1">
                Two-Factor Authentication
              </h2>
              <p className="text-xs text-[#555555] mb-6 max-w-xs mx-auto">
                Open <span className="font-medium text-[#111111]">Google Authenticator</span> or your TOTP app and enter the 6-digit code for VFRA.
              </p>

              <div className="flex justify-center mb-6">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={(val) => {
                    setOtpCode(val);
                    if (val.length === 6) {
                      handleVerifyOtp(val);
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

              <Button
                onClick={() => handleVerifyOtp()}
                className="w-full h-11 bg-[#111111] text-white hover:bg-[#2A2A2A] font-mono text-xs uppercase tracking-[0.12em] gap-2 mb-3"
                disabled={otpCode.length < 6 || verifyingOtp}
              >
                {verifyingOtp ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Validating TOTP Token...
                  </>
                ) : (
                  "Verify & Access Dashboard"
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep("credentials");
                  setOtpCode("");
                }}
                className="text-xs font-mono text-[#555555] hover:text-[#111111] underline"
              >
                ← Back to credentials
              </button>
            </motion.div>
          ) : (
            /* STEP 2B: 2FA SETUP / ENROLLMENT (SCAN QR CODE) */
            <motion.div
              key="step-2fa-enroll"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.35, ease: APPLE_EASE }}
              className="text-center"
            >
              <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center mx-auto mb-3">
                <Smartphone className="h-5 w-5" />
              </div>

              <h2 className="font-heading text-lg font-bold text-[#111111] mb-1">
                Set Up Two-Factor Authentication
              </h2>
              <p className="text-xs text-[#555555] mb-4">
                Scan this QR code using Google Authenticator or Microsoft Authenticator:
              </p>

              {enrollData?.qrCodeUrl && (
                <div className="p-3 bg-white border border-[#E5E5E3] rounded-lg inline-block mb-3 shadow-sm">
                  <img
                    src={enrollData.qrCodeUrl}
                    alt="2FA QR Code"
                    className="w-40 h-40 object-contain mx-auto"
                  />
                </div>
              )}

              {enrollData?.secret && (
                <div className="mb-4 text-left p-2.5 rounded bg-[#F7F7F5] border border-[#E5E5E3]">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#71717A] block mb-0.5">
                    Manual Entry Key:
                  </span>
                  <code className="font-mono text-xs text-[#111111] select-all break-all">
                    {enrollData.secret}
                  </code>
                </div>
              )}

              <p className="text-xs text-[#555555] mb-2 font-mono">
                Enter the 6-digit code generated by your app:
              </p>

              <div className="flex justify-center mb-5">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={(val) => {
                    setOtpCode(val);
                    if (val.length === 6) {
                      handleVerifyOtp(val);
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

              <Button
                onClick={() => handleVerifyOtp()}
                className="w-full h-11 bg-[#111111] text-white hover:bg-[#2A2A2A] font-mono text-xs uppercase tracking-[0.12em] gap-2 mb-2"
                disabled={otpCode.length < 6 || verifyingOtp}
              >
                {verifyingOtp ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Confirming 2FA...
                  </>
                ) : (
                  "Confirm & Complete Sign In"
                )}
              </Button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep("credentials");
                    setOtpCode("");
                  }}
                  className="text-xs font-mono text-[#555555] hover:text-[#111111]"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/dashboard")}
                  className="text-xs font-mono text-[#71717A] hover:text-[#111111] underline"
                >
                  Skip for now
                </button>
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