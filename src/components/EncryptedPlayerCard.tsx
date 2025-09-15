import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  points: number;
  salary: number;
  isEncrypted: boolean;
}

interface EncryptedPlayerCardProps {
  player: Player;
  onSelect?: (player: Player) => void;
  isSelected?: boolean;
}

const EncryptedPlayerCard = ({ player, onSelect, isSelected }: EncryptedPlayerCardProps) => {
  const [isRevealed, setIsRevealed] = useState(!player.isEncrypted);

  const handleReveal = () => {
    if (player.isEncrypted) {
      setIsRevealed(true);
    }
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(player);
    }
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:scale-105",
        "bg-card/80 backdrop-blur border",
        player.isEncrypted && !isRevealed 
          ? "border-encrypted/50 shadow-[0_0_20px_hsl(var(--encrypted)/0.2)]" 
          : "border-primary/30 hover:border-primary/50",
        isSelected && "ring-2 ring-accent shadow-[0_0_30px_hsl(var(--accent)/0.3)]"
      )}
    >
      <CardContent className="p-4">
        {player.isEncrypted && !isRevealed ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Lock className="h-12 w-12 text-encrypted animate-pulse" />
                <div className="absolute inset-0 bg-encrypted/20 rounded-full blur-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-encrypted/20 rounded animate-pulse" />
              <div className="h-3 bg-encrypted/10 rounded animate-pulse w-2/3 mx-auto" />
            </div>
            <Button 
              onClick={handleReveal}
              variant="outline"
              className="bg-encrypted/10 border-encrypted/30 hover:bg-encrypted/20 text-encrypted-foreground"
            >
              <Unlock className="h-4 w-4 mr-2" />
              Decrypt Pick
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{player.name}</h3>
                <p className="text-sm text-muted-foreground">{player.position} • {player.team}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-accent">
                  <Star className="h-3 w-3" />
                  <span className="text-sm font-medium">{player.points}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-secondary">
                <TrendingUp className="h-3 w-3" />
                <span className="text-sm">${player.salary.toLocaleString()}</span>
              </div>
              <Button 
                onClick={handleSelect}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={cn(
                  isSelected 
                    ? "bg-accent text-accent-foreground hover:bg-accent/90" 
                    : "bg-primary/10 border-primary/30 hover:bg-primary/20"
                )}
              >
                {isSelected ? "Selected" : "Select"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EncryptedPlayerCard;