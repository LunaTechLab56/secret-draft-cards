import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EncryptedPlayerCard from "./EncryptedPlayerCard";
import { Users, DollarSign, Lock, Send } from "lucide-react";

// Mock player data
const mockPlayers = [
  { id: "1", name: "Josh Allen", position: "QB", team: "BUF", points: 24.8, salary: 8500, isEncrypted: false },
  { id: "2", name: "Austin Ekeler", position: "RB", team: "LAC", points: 18.2, salary: 7200, isEncrypted: true },
  { id: "3", name: "Cooper Kupp", position: "WR", team: "LAR", points: 21.4, salary: 8000, isEncrypted: true },
  { id: "4", name: "Travis Kelce", position: "TE", team: "KC", points: 16.8, salary: 6800, isEncrypted: false },
  { id: "5", name: "Christian McCaffrey", position: "RB", team: "SF", points: 22.1, salary: 8800, isEncrypted: true },
  { id: "6", name: "Davante Adams", position: "WR", team: "LV", points: 19.6, salary: 7500, isEncrypted: false },
];

interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  points: number;
  salary: number;
  isEncrypted: boolean;
}

const DraftInterface = () => {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayers(prev => {
      const isSelected = prev.find(p => p.id === player.id);
      if (isSelected) {
        return prev.filter(p => p.id !== player.id);
      }
      if (prev.length < 6) {
        return [...prev, player];
      }
      return prev;
    });
  };

  const totalSalary = selectedPlayers.reduce((sum, player) => sum + player.salary, 0);
  const salaryRemaining = 50000 - totalSalary;

  const filteredPlayers = activeTab === "all" 
    ? mockPlayers 
    : mockPlayers.filter(player => player.position === activeTab.toUpperCase());

  const submitRoster = () => {
    // Simulate roster submission
    console.log("Submitting encrypted roster:", selectedPlayers);
  };

  return (
    <div className="space-y-6">
      {/* Roster Summary */}
      <Card className="bg-card/50 backdrop-blur border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Your Roster ({selectedPlayers.length}/6)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{selectedPlayers.length}</p>
              <p className="text-sm text-muted-foreground">Players</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">${totalSalary.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Used</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${salaryRemaining >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                ${salaryRemaining.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Remaining</p>
            </div>
            <div className="text-center">
              <Button 
                onClick={submitRoster}
                disabled={selectedPlayers.length < 6}
                className="bg-encrypted text-encrypted-foreground hover:bg-encrypted/90"
              >
                <Lock className="h-4 w-4 mr-2" />
                Submit
              </Button>
            </div>
          </div>
          
          {selectedPlayers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedPlayers.map(player => (
                <Badge key={player.id} variant="secondary" className="bg-primary/10 text-primary">
                  {player.name} ({player.position})
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Player Selection */}
      <Card className="bg-card/50 backdrop-blur border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-accent" />
            Available Players
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 bg-muted/50">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="qb">QB</TabsTrigger>
              <TabsTrigger value="rb">RB</TabsTrigger>
              <TabsTrigger value="wr">WR</TabsTrigger>
              <TabsTrigger value="te">TE</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlayers.map(player => (
                  <EncryptedPlayerCard
                    key={player.id}
                    player={player}
                    onSelect={handlePlayerSelect}
                    isSelected={selectedPlayers.some(p => p.id === player.id)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DraftInterface;