
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BarChart3, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/',
      active: location.pathname === '/'
    },
    {
      icon: BarChart3,
      label: 'Resultados',
      path: '/resultados',
      active: location.pathname === '/resultados'
    },
    {
      icon: User,
      label: 'Perfil',
      path: '/perfil',
      active: location.pathname === '/perfil'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 touch-friendly",
              item.active
                ? "text-brazilian-green bg-brazilian-green/10"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-all duration-200",
              item.active && "scale-110"
            )} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
