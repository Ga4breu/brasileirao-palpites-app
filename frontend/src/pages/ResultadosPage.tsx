
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { Trophy, Target, CheckCircle, XCircle, Minus } from 'lucide-react';
import { getMatches, getPredictions, getRanking } from '@/lib/api';

interface GameResult {
  id: string;
  homeTeam: string;
  awayTeam: string;
  round: number;
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
}

const ResultadosPage = () => {
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [ranking, setRanking] = useState<RankingPlayer[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const matches = await getMatches();
        const preds = await getPredictions().catch(() => []);
        const lastRound = matches.reduce((acc: number, m: any) => Math.max(acc, m.round), 0);
        const roundMatches = matches.filter((m: any) => m.round === lastRound && m.home_score !== null);

        const results: GameResult[] = roundMatches.map((m: any) => {
          const date = new Date(m.match_date);
          const pred = preds.find((p: any) => p.match_id === m.id);
          const resultType = (() => {
            if (!pred) return 'miss';
            if (pred.home_score === m.home_score && pred.away_score === m.away_score) return 'exact';
            const matchOutcome = Math.sign(m.home_score - m.away_score);
            const predOutcome = Math.sign(pred.home_score - pred.away_score);
            return matchOutcome === predOutcome ? 'winner' : 'miss';
          })();
          return {
            id: String(m.id),
            homeTeam: m.home_team,
            awayTeam: m.away_team,
            round: m.round,
            homeScore: m.home_score,
            awayScore: m.away_score,
            prediction: pred ? { homeScore: pred.home_score, awayScore: pred.away_score } : undefined,
            result: resultType as 'exact' | 'winner' | 'miss',
          };
        });
        setGameResults(results);

        const rankData = await getRanking();
        setRanking(rankData);
      } catch {
        // ignore errors
      }
    }
    load();
  }, []);

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

  const summary = gameResults.reduce(
    (acc, g) => {
      if (g.result === 'exact') {
        acc.exact += 1;
        acc.points += 3;
      } else if (g.result === 'winner') {
        acc.winner += 1;
        acc.points += 1;
      }
      return acc;
    },
    { exact: 0, winner: 0, points: 0 }
  );

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
                  Rodada {gameResults[0]?.round ?? ''} - Seus Resultados
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
                      <p className="text-2xl font-bold">{summary.exact}</p>
                      <p className="text-sm text-white/80">Placar exato</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{summary.winner}</p>
                      <p className="text-sm text-white/80">Vencedor</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{summary.points}</p>
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
