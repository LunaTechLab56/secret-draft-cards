import { Shield, Lock, Trophy } from "lucide-react";
import WalletConnect from "./WalletConnect";

const HeroSection = () => {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-80" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 text-center space-y-8 px-4 max-w-4xl mx-auto">
        {/* Main heading */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <Lock className="h-6 w-6 text-encrypted" />
            <Trophy className="h-8 w-8 text-accent" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight">
            Fantasy Draft
          </h1>
          
          <p className="text-2xl md:text-3xl font-semibold text-foreground/90 mb-2">
            Secured by FHE
          </p>
          
          <div className="h-1 w-32 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        {/* Description */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <p className="text-xl text-muted-foreground leading-relaxed">
            Make encrypted roster selections that remain hidden until game day. 
            Your strategy stays secret with fully homomorphic encryption.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-encrypted" />
              <span>Encrypted Picks</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Secure Blockchain</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-accent" />
              <span>Fair Competition</span>
            </div>
          </div>
        </div>

        {/* Wallet Connect */}
        <div className="flex justify-center pt-4">
          <WalletConnect />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;