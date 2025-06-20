// app/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, logoutUser, UserAPI } from '../services/api';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

interface AuthContextType {
  user: UserAPI | null;
  token: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserAPI | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadToken = async () => {
      console.log("DEBUG AUTH: AuthContext - Iniciando loadToken."); // DEBUG: A
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setToken(storedToken);
          console.log("DEBUG AUTH: AuthContext - Token encontrado:", storedToken); // DEBUG: B
        } else {
          console.log("DEBUG AUTH: AuthContext - Nenhum token encontrado."); // DEBUG: C
        }
      } catch (e) {
        console.error("DEBUG AUTH: AuthContext - Erro ao carregar token do AsyncStorage:", e); // DEBUG: D
      } finally {
        setIsLoading(false);
        console.log("DEBUG AUTH: AuthContext - Carregamento finalizado. isLoading = false."); // DEBUG: E
      }
    };

    loadToken();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authResponse = await loginUser(email, password);
      setToken(authResponse.access_token);
      Alert.alert("Login", "Login bem-sucedido!");
      router.replace('/(tabs)');
    } catch (e: any) {
      console.error("AuthContext: Erro ao fazer login:", e);
      Alert.alert("Erro no Login", e.message || "Credenciais inválidas ou erro de rede.");
      setToken(null);
      setUser(null);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setToken(null);
      setUser(null);
      Alert.alert("Logout", "Sessão encerrada.");
      router.replace('/shared/login');
    } catch (e) {
      console.error("AuthContext: Erro ao fazer logout:", e);
      Alert.alert("Erro no Logout", "Não foi possível encerrar a sessão.");
    } finally {
      setIsLoading(false);
    }
  };

  const authContextValue: AuthContextType = {
    user,
    token,
    isLoading,
    isLoggedIn: !!token,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
