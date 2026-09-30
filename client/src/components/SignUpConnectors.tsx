import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chrome, Github, Mail } from "lucide-react";

export default function SignUpConnectors() {
  return (
    <Card className="bg-[#141423] border border-[#08080f] p-8 max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-[#ff00c8] mb-6 text-center">
        Join Anom Artsy
      </h3>

      <div className="space-y-3">
        <Button
          asChild
          className="w-full bg-white text-black hover:bg-gray-100 font-bold flex items-center justify-center gap-2"
        >
          <a href="/api/auth/google">
            <Chrome className="w-5 h-5" />
            Sign up with Google
          </a>
        </Button>

        <Button
          asChild
          className="w-full bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] border border-[#3a3a3a] font-bold flex items-center justify-center gap-2"
        >
          <a href="/api/auth/google">
            <Github className="w-5 h-5" />
            Sign up with GitHub
          </a>
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#08080f]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#141423] text-[#cccccc]">or</span>
          </div>
        </div>

        <Button
          asChild
          className="w-full btn-primary font-bold flex items-center justify-center gap-2"
        >
          <a href="/api/auth/google">
            <Mail className="w-5 h-5" />
            Sign up with Email
          </a>
        </Button>
      </div>

      <p className="text-xs text-[#cccccc] text-center mt-6">
        By signing up, you agree to our Terms of Service and Privacy Policy
      </p>
    </Card>
  );
}
