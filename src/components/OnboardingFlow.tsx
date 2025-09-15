import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Shield, 
  Gamepad2, 
  Trophy, 
  Users, 
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  action?: () => void;
}

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'welcome',
      title: 'Welcome to Secret Draft Cards',
      description: 'Experience the future of gaming with fully homomorphic encrypted trading cards. Your strategies remain hidden until the perfect moment.',
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      completed: false
    },
    {
      id: 'wallet',
      title: 'Connect Your Wallet',
      description: 'Connect your Web3 wallet to start playing. Your cards and achievements are stored securely on the blockchain.',
      icon: <Wallet className="h-8 w-8 text-blue-500" />,
      completed: false,
      action: () => {
        // Trigger wallet connection
        console.log('Connecting wallet...');
      }
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'All your card statistics are encrypted using FHE technology. Even we can\'t see your cards\' true power!',
      icon: <Shield className="h-8 w-8 text-green-500" />,
      completed: false
    },
    {
      id: 'gameplay',
      title: 'Learn the Basics',
      description: 'Master the art of strategic gameplay. Create cards, battle opponents, and trade in the marketplace.',
      icon: <Gamepad2 className="h-8 w-8 text-purple-500" />,
      completed: false
    },
    {
      id: 'community',
      title: 'Join the Community',
      description: 'Connect with other players, participate in tournaments, and climb the leaderboards.',
      icon: <Users className="h-8 w-8 text-orange-500" />,
      completed: false
    },
    {
      id: 'rewards',
      title: 'Earn Rewards',
      description: 'Win games, complete challenges, and earn reputation points. The more you play, the more you earn!',
      icon: <Trophy className="h-8 w-8 text-red-500" />,
      completed: false
    }
  ]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepAction = (step: OnboardingStep) => {
    if (step.action) {
      step.action();
    }
    // Mark step as completed
    setSteps(prev => prev.map(s => 
      s.id === step.id ? { ...s, completed: true } : s
    ));
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-purple-900/90 to-blue-900/90 border-purple-500/20 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            {currentStepData.icon}
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {currentStepData.title}
          </CardTitle>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-300 mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-gray-200 text-center text-lg leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Step-specific content */}
          {currentStepData.id === 'welcome' && (
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4 border border-purple-500/30">
              <h3 className="font-semibold text-white mb-2">What makes us different?</h3>
              <ul className="space-y-2 text-sm text-gray-200">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  FHE-encrypted card statistics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  True ownership on blockchain
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Strategic depth through privacy
                </li>
              </ul>
            </div>
          )}

          {currentStepData.id === 'wallet' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                  <h4 className="font-semibold text-white text-sm">MetaMask</h4>
                  <p className="text-xs text-gray-300">Most popular wallet</p>
                </div>
                <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                  <h4 className="font-semibold text-white text-sm">Rainbow</h4>
                  <p className="text-xs text-gray-300">Beautiful & secure</p>
                </div>
              </div>
              <Button 
                onClick={() => handleStepAction(currentStepData)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Connect Wallet
              </Button>
            </div>
          )}

          {currentStepData.id === 'privacy' && (
            <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="font-semibold text-white">FHE Technology</span>
              </div>
              <p className="text-sm text-gray-200">
                Fully Homomorphic Encryption allows computations on encrypted data without revealing the underlying values. 
                Your card stats remain private even during gameplay!
              </p>
            </div>
          )}

          {currentStepData.id === 'gameplay' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30 text-center">
                  <Gamepad2 className="h-6 w-6 text-purple-400 mx-auto mb-1" />
                  <p className="text-xs text-white font-semibold">Create Cards</p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30 text-center">
                  <Users className="h-6 w-6 text-purple-400 mx-auto mb-1" />
                  <p className="text-xs text-white font-semibold">Battle Players</p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30 text-center">
                  <Trophy className="h-6 w-6 text-purple-400 mx-auto mb-1" />
                  <p className="text-xs text-white font-semibold">Win Rewards</p>
                </div>
              </div>
            </div>
          )}

          {currentStepData.id === 'community' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-orange-500/20 rounded-lg p-3 border border-orange-500/30">
                <div>
                  <h4 className="font-semibold text-white">Tournaments</h4>
                  <p className="text-xs text-gray-300">Compete for prizes</p>
                </div>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <div className="flex items-center justify-between bg-orange-500/20 rounded-lg p-3 border border-orange-500/30">
                <div>
                  <h4 className="font-semibold text-white">Leaderboards</h4>
                  <p className="text-xs text-gray-300">Climb the ranks</p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
          )}

          {currentStepData.id === 'rewards' && (
            <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-red-400" />
                <span className="font-semibold text-white">Earning System</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Win Game:</span>
                  <span className="text-white font-semibold">+10 Rep</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Create Card:</span>
                  <span className="text-white font-semibold">+5 Rep</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Trade Card:</span>
                  <span className="text-white font-semibold">+3 Rep</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Daily Login:</span>
                  <span className="text-white font-semibold">+1 Rep</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={onSkip}
                className="text-gray-400 hover:text-white"
              >
                Skip Tutorial
              </Button>
              
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
