import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { mapAuthErrorToUserMessage } from "@/lib/errorHandler";
import logo from "@/assets/vfra-logo.png";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user, isLoading: authLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user && !authLoading) {
      navigate("/admin/dashboard");
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Access Denied",
        description: mapAuthErrorToUserMessage(error),
        variant: "destructive",
      });
    } else {
      navigate("/admin/dashboard");
    }

    setIsLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[#555555]">
        Verifying session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md premium-card bg-white p-8 md:p-10">
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#E5E5E3]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded border border-[#E5E5E3] bg-[#F7F7F5] p-1 flex items-center justify-center">
              <img src={logo} alt="VFRA Logo" className="h-full w-full object-contain" />
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
          <span className="font-mono text-[10px] px-2 py-0.5 bg-[#111111] text-white uppercase">
            RESTRICTED
          </span>
        </div>

        <h1 className="font-heading text-xl font-bold text-[#111111] mb-1">
          Administrator Authentication
        </h1>
        <p className="text-xs text-[#555555] mb-6">
          Authorized personnel only. Session activity is logged.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-wider">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
              <Input
                type="email"
                placeholder="admin@vigilantforensics.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11 bg-[#F7F7F5]/60"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-wider">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-11 bg-[#F7F7F5]/60"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555555]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-[#111111] text-white hover:bg-[#2A2A2A] font-mono text-xs uppercase tracking-[0.12em]"
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Sign In to Console"}
          </Button>
        </form>

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