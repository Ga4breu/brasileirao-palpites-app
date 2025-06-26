
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Target, CheckCircle, XCircle, Minus } from 'lucide-react';

interface GameResult {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  prediction?: {
    homeScore: number;
    awayScore: number;
  };
  result: 'exact' | 'winner' | 'miss';
}

interface RankingPlayer {
  id: string;
  name: string;
  position: number;
  points: number;
  exactPredictions: number;
  avatar?: string;
}

const ResultadosPage = () => {
  // Mock data for game results
  const gameResults: GameResult[] = [
    {
      id: '1',
      homeTeam: 'Flamengo',
      awayTeam: 'Palmeiras',
      homeScore: 2,
      awayScore: 1,
      prediction: { homeScore: 2, awayScore: 1 },
      result: 'exact'
    },
    {
      id: '2',
      homeTeam: 'São Paulo',
      awayTeam: 'Corinthians',
      homeScore: 1,
      awayScore: 0,
      prediction: { homeScore: 2, awayScore: 0 },
      result: 'winner'
    },
    {
      id: '3',
      homeTeam: 'Atlético-MG',
      awayTeam: 'Cruzeiro',
      homeScore: 0,
      awayScore: 0,
      prediction: { homeScore: 1, awayScore: 2 },
      result: 'miss'
    }
  ];

  // Mock data for ranking
  const ranking: RankingPlayer[] = [
    { id: '1', name: 'Maria Silva', position: 1, points: 280, exactPredictions: 15 },
    { id: '2', name: 'João Santos', position: 2, points: 265, exactPredictions: 14 },
    { id: '3', name: 'Pedro Costa', position: 3, points: 245, exactPredictions: 12 },
    { id: '4', name: 'Ana Lima', position: 4, points: 240, exactPredictions: 11 },
    { id: '5', name: 'Carlos Oliveira', position: 5, points: 235, exactPredictions: 10 },
    { id: '6', name: 'Lucia Ferreira', position: 6, points: 230, exactPredictions: 9 },
    { id: '7', name: 'Roberto Alves', position: 7, points: 225, exactPredictions: 8 },
    { id: '8', name: 'Mariana Souza', position: 8, points: 220, exactPredictions: 7 },
    { id: '9', name: 'Fernando Lima', position: 9, points: 215, exactPredictions: 6 },
    { id: '10', name: 'Carla Santos', position: 10, points: 210, exactPredictions: 5 }
  ];

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'exact':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'winner':
        return <Minus className="h-5 w-5 text-yellow-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'exact':
        return <Badge className="bg-green-500">Placar Exato</Badge>;
      case 'winner':
        return <Badge className="bg-yellow-500">Vencedor</Badge>;
      default:
        return <Badge variant="destructive">Errou</Badge>;
    }
  };

  const getPositionColor = (position: number) => {
    if (position === 1) return 'text-yellow-500';
    if (position === 2) return 'text-gray-400';
    if (position === 3) return 'text-amber-600';
    return 'text-foreground';
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="pt-6">
          <h1 className="text-2xl font-bold">Resultados & Ranking</h1>
          <p className="text-muted-foreground">Veja como você se saiu na rodada</p>
        </div>

        <Tabs defaultValue="resultados" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resultados">Resultados</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
          </TabsList>

          <TabsContent value="resultados" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Rodada 24 - Seus Resultados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {gameResults.map((game, index) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-4 rounded-lg border animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          {game.homeTeam} x {game.awayTeam}
                        </span>
                        {getResultIcon(game.result)}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-muted-foreground">Resultado</p>
                          <p className="font-bold text-lg">
                            {game.homeScore} x {game.awayScore}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Seu palpite</p>
                          <p className="font-bold text-lg">
                            {game.prediction?.homeScore} x {game.prediction?.awayScore}
                          </p>
                        </div>
                        <div className="text-center">
                          {getResultBadge(game.result)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Round Summary */}
            <Card className="gradient-brazilian text-white">
              <CardContent className="p-6">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold">Resumo da Rodada</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">1</p>
                      <p className="text-sm text-white/80">Placar exato</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">1</p>
                      <p className="text-sm text-white/80">Vencedor</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">25</p>
                      <p className="text-sm text-white/80">Pontos ganhos</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ranking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Top 10 - Classificação Geral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ranking.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 p-3 rounded-lg border animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={`text-2xl font-bold ${getPositionColor(player.position)} min-w-[2rem]`}>
                      {player.position}°
                    </div>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-brazilian-green text-white">
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <p className="font-medium">{player.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {player.exactPredictions} placares exatos
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-lg">{player.points}</p>
                      <p className="text-sm text-muted-foreground">pontos</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResultadosPage;
