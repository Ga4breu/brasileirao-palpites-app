
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, Target, Calendar } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for current round
  const currentRound = {
    number: 25,
    nextGame: {
      date: '2024-07-01',
      time: '16:00',
      homeTeam: 'Flamengo',
      awayTeam: 'Palmeiras'
    },
    deadline: '2h 30min',
    isPredictionOpen: true
  };

  const stats = [
    { icon: Trophy, label: 'Posição Geral', value: `${user?.position}°`, color: 'text-brazilian-yellow' },
    { icon: Target, label: 'Pontos Totais', value: user?.points || 0, color: 'text-brazilian-green' },
    { icon: Calendar, label: 'Rodadas Ganhas', value: user?.roundsWon || 0, color: 'text-brazilian-blue' }
  ];

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="pt-6 space-y-2">
          <h1 className="text-2xl font-bold gradient-brazilian bg-clip-text text-transparent">
            Bolão Brasileirão
          </h1>
          <p className="text-muted-foreground">
            Olá, {user?.name?.split(' ')[0] || 'Jogador'}! 👋
          </p>
        </div>

        {/* Current Position Card */}
        <Card className="gradient-brazilian text-white animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Sua posição atual</p>
                <p className="text-3xl font-bold">{user?.position}°</p>
                <p className="text-white/80 text-sm">{user?.points} pontos</p>
              </div>
              <Trophy className="h-12 w-12 text-white/80" />
            </div>
          </CardContent>
        </Card>

        {/* Current Round Card */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Rodada {currentRound.number}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Próximo jogo</p>
                <p className="font-semibold">
                  {currentRound.nextGame.homeTeam} x {currentRound.nextGame.awayTeam}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentRound.nextGame.date} às {currentRound.nextGame.time}
                </p>
              </div>
              <div className="text-right">
                <Badge variant={currentRound.isPredictionOpen ? "default" : "secondary"}>
                  <Clock className="h-3 w-3 mr-1" />
                  {currentRound.isPredictionOpen ? `Fecha em ${currentRound.deadline}` : 'Fechado'}
                </Badge>
              </div>
            </div>

            <Button
              className="w-full touch-friendly bg-brazilian-green hover:bg-brazilian-green-dark"
              onClick={() => navigate('/palpites')}
              disabled={!currentRound.isPredictionOpen}
            >
              {currentRound.isPredictionOpen ? 'Fazer Palpites' : 'Palpites Fechados'}
            </Button>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-secondary`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="touch-friendly"
              onClick={() => navigate('/resultados')}
            >
              Ver Resultados
            </Button>
            <Button
              variant="outline"
              className="touch-friendly"
              onClick={() => navigate('/resultados')}
            >
              Ranking
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
