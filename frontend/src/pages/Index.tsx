
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-brazilian-green rounded-full flex items-center justify-center animate-pulse">
            <span className="text-2xl">⚽</span>
          </div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return user ? <Navigate to="/" replace /> : <Navigate to="/auth" replace />;
};

export default Index;
