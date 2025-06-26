
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  homeScore?: number;
  awayScore?: number;
}

const PalpitesPage = () => {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<Record<string, { home: string; away: string }>>({});
  const [saving, setSaving] = useState(false);

  // Mock data for current round games
  const games: Game[] = [
    { id: '1', homeTeam: 'Flamengo', awayTeam: 'Palmeiras', date: '01/07', time: '16:00' },
    { id: '2', homeTeam: 'São Paulo', awayTeam: 'Corinthians', date: '01/07', time: '18:30' },
    { id: '3', homeTeam: 'Atlético-MG', awayTeam: 'Cruzeiro', date: '02/07', time: '20:00' },
    { id: '4', homeTeam: 'Internacional', awayTeam: 'Grêmio', date: '02/07', time: '21:30' },
    { id: '5', homeTeam: 'Santos', awayTeam: 'Botafogo', date: '03/07', time: '19:00' },
    { id: '6', homeTeam: 'Vasco', awayTeam: 'Fluminense', date: '03/07', time: '21:00' }
  ];

  const updatePrediction = (gameId: string, team: 'home' | 'away', value: string) => {
    setPredictions(prev => ({
      ...prev,
      [gameId]: {
        ...prev[gameId],
        [team]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Palpites salvos!",
      description: "Seus palpites foram salvos com sucesso."
    });
    
    setSaving(false);
    navigate('/');
  };

  const isFormComplete = games.every(game => 
    predictions[game.id]?.home && predictions[game.id]?.away
  );

  const timeRemaining = "2h 30min";

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pt-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="touch-friendly"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Palpites da Rodada 25</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Fecha em {timeRemaining}</span>
            </div>
          </div>
        </div>

        {/* Deadline Warning */}
        <Card className="border-l-4 border-l-brazilian-yellow bg-brazilian-yellow/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brazilian-yellow" />
              <p className="text-sm">
                <span className="font-semibold">Atenção!</span> Os palpites fecham 10 minutos antes do primeiro jogo.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Games List */}
        <div className="space-y-4">
          {games.map((game, index) => (
            <Card key={game.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{game.homeTeam} x {game.awayTeam}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {game.date} {game.time}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Team Names */}
                <div className="grid grid-cols-3 gap-2 items-center text-sm">
                  <div className="text-center font-medium">{game.homeTeam}</div>
                  <div className="text-center text-muted-foreground">vs</div>
                  <div className="text-center font-medium">{game.awayTeam}</div>
                </div>

                {/* Score Inputs */}
                <div className="grid grid-cols-3 gap-2 items-center">
                  <Input
                    type="number"
                    min="0"
                    max="20"
                    placeholder="0"
                    value={predictions[game.id]?.home || ''}
                    onChange={(e) => updatePrediction(game.id, 'home', e.target.value)}
                    className="text-center text-lg font-bold touch-friendly"
                  />
                  <div className="text-center text-2xl font-bold text-muted-foreground">x</div>
                  <Input
                    type="number"
                    min="0"
                    max="20"
                    placeholder="0"
                    value={predictions[game.id]?.away || ''}
                    onChange={(e) => updatePrediction(game.id, 'away', e.target.value)}
                    className="text-center text-lg font-bold touch-friendly"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Fixed Save Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
        <Button
          onClick={handleSave}
          disabled={!isFormComplete || saving}
          className="w-full touch-friendly bg-brazilian-green hover:bg-brazilian-green-dark"
        >
          {saving ? (
            <>
              <Save className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Palpites
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PalpitesPage;
