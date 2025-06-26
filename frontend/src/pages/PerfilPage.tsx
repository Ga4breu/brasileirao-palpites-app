
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { User, Trophy, Target, Calendar, Edit2, LogOut } from 'lucide-react';

const PerfilPage = () => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleSave = () => {
    updateProfile({
      name: editForm.name,
      email: editForm.email
    });
    setIsEditing(false);
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso."
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso."
    });
  };

  const stats = [
    {
      icon: Trophy,
      label: 'Posição Atual',
      value: `${user?.position}°`,
      description: 'de 150 jogadores',
      color: 'text-brazilian-yellow'
    },
    {
      icon: Target,
      label: 'Pontos Totais',
      value: user?.points || 0,
      description: 'pontos acumulados',
      color: 'text-brazilian-green'
    },
    {
      icon: Calendar,
      label: 'Rodadas Ganhas',
      value: user?.roundsWon || 0,
      description: 'vitórias na rodada',
      color: 'text-brazilian-blue'
    }
  ];

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="pt-6">
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações e estatísticas</p>
        </div>

        {/* Profile Card */}
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-brazilian-green text-white text-xl">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome completo"
                      className="touch-friendly"
                    />
                    <Input
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Email"
                      type="email"
                      className="touch-friendly"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-bold">{user?.name}</h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <Badge className="mt-2 bg-brazilian-green">
                      Jogador Ativo
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    className="flex-1 touch-friendly bg-brazilian-green hover:bg-brazilian-green-dark"
                  >
                    Salvar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        name: user?.name || '',
                        email: user?.email || ''
                      });
                    }}
                    className="flex-1 touch-friendly"
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex-1 touch-friendly"
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Editar Perfil
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Estatísticas</h3>
          {stats.map((stat, index) => (
            <Card key={stat.label} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-secondary">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievement Card */}
        <Card className="gradient-brazilian text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Trophy className="h-5 w-5" />
              Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">{user?.exactPredictions} Placares Exatos</p>
                <p className="text-sm text-white/80">Parabéns pela precisão!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">{user?.roundsWon} Rodadas Vencidas</p>
                <p className="text-sm text-white/80">Continue assim!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Card>
          <CardContent className="p-4">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full touch-friendly"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerfilPage;
