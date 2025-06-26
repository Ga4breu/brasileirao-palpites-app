
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import PalpitesPage from "./pages/PalpitesPage";
import ResultadosPage from "./pages/ResultadosPage";
import PerfilPage from "./pages/PerfilPage";
import BottomNav from "./components/BottomNav";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/palpites" element={
          <ProtectedRoute>
            <PalpitesPage />
          </ProtectedRoute>
        } />
        <Route path="/resultados" element={
          <ProtectedRoute>
            <ResultadosPage />
          </ProtectedRoute>
        } />
        <Route path="/perfil" element={
          <ProtectedRoute>
            <PerfilPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {user && <BottomNav />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
