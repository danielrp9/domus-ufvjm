// app/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, logoutUser, UserAPI } from '../services/api'; // Importa as funções de auth da API
import { useRouter } from 'expo-router'; // Para navegação no contexto
import { Alert } from 'react-native'; // Importar Alert

// Define a interface para o que o contexto de autenticação vai fornecer
interface AuthContextType {
  user: UserAPI | null; // Informações do utilizador logado
  token: string | null; // O token de autenticação
  isLoading: boolean; // Indica se está a carregar o estado inicial de auth
  isLoggedIn: boolean; // True se o utilizador está logado
  signIn: (email: string, password: string) => Promise<void>; // Função de login
  signOut: () => Promise<void>; // Função de logout
}

// Cria o Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Componente Provedor de Autenticação
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserAPI | null>(null); // Estado para guardar os dados do utilizador
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Inicialmente a carregar
  const router = useRouter(); // Para redirecionar após login/logout

  // Efeito para carregar o token do AsyncStorage na inicialização do app
  useEffect(() => {
    const loadTokenAndUser = async () => { // Renomeado para refletir que carrega utilizador também
      console.log("DEBUG AUTH: AuthContext - Iniciando loadTokenAndUser.");
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData'); // <<<<< NOVO: Tenta carregar dados do utilizador
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser)); // <<<<< NOVO: Parseia e guarda os dados do utilizador
          console.log("DEBUG AUTH: AuthContext - Token e utilizador encontrados ao iniciar o app.");
        } else {
          console.log("DEBUG AUTH: AuthContext - Nenhum token ou utilizador encontrado.");
        }
      } catch (e) {
        console.error("DEBUG AUTH: AuthContext - Erro ao carregar token/utilizador do AsyncStorage:", e);
      } finally {
        setIsLoading(false);
        console.log("DEBUG AUTH: AuthContext - Carregamento finalizado. isLoading = false.");
      }
    };

    loadTokenAndUser();
  }, []);

  // Função de Login
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // A sua API /auth/login retorna o UserPublic (id, nome, email, tipo)
      const loggedInUser = await loginUser(email, password); // loginUser retorna AuthResponse com token simulado
      
      // Assumindo que a resposta de loginUser.data contém os dados do utilizador
      // Se o seu backend retorna o UserPublic diretamente no /auth/login:
      // const userFromApi = response.data; // Se loginUser retornar o UserPublic diretamente
      // setUser(userFromApi);
      // await AsyncStorage.setItem('userData', JSON.stringify(userFromApi));

      // Com base no seu auth.py, o login retorna UserPublic.
      // E o api.ts simula um token.
      // Vamos ajustar para usar o `loggedInUser` como o objeto UserAPI.
      const userFromApi: UserAPI = loggedInUser as unknown as UserAPI; // Cast para UserAPI
                                                                     // Isso é um hack temporário se loginUser não retorna UserAPI
                                                                     // Mas o ideal é que loginUser retorne UserAPI + token.
      
      // Se o seu backend retorna o JWT e você precisa de uma chamada separada para o perfil:
      // const userProfile = await api.get('/users/me'); // Exemplo de endpoint para perfil do utilizador logado
      // setUser(userProfile.data);
      // await AsyncStorage.setItem('userData', JSON.stringify(userProfile.data));

      // Para o seu caso atual, onde o loginUser retorna um UserPublic (simulado para o token):
      // Precisamos que loginUser retorne o UserPublic para o AuthContext.
      // VOU AJUSTAR loginUser em api.ts PARA RETORNAR UserAPI e o token.
      // Por agora, vamos assumir que `loggedInUser` tem o `tipo`.
      
      // Assumindo que `loginUser` retorna um objeto com `access_token` E os dados do utilizador:
      // (Isso requer uma mudança no loginUser em api.ts para retornar mais do que apenas token)
      // Por enquanto, vamos simular que o `loggedInUser` tem o `tipo`
      // Se o seu backend retorna UserPublic no /auth/login, você pode fazer:
      // const { access_token, ...userData } = loggedInUser;
      // setToken(access_token);
      // setUser(userData);
      // await AsyncStorage.setItem('userData', JSON.stringify(userData));

      // Para o seu setup atual (loginUser retorna AuthResponse com token simulado):
      // Precisamos de uma forma de obter o `tipo` do utilizador.
      // A forma mais simples é que o `loginUser` retorne o `UserAPI` completo.
      // VOU AJUSTAR O `loginUser` em `api.ts` para retornar `UserAPI` e o `token`.
      
      // Temporariamente, vamos assumir que o tipo está no `loggedInUser` (que é o AuthResponse)
      // e que o `tipo` é acessível de alguma forma.
      // A forma mais segura é que o `loginUser` retorne `UserAPI` e o token.
      
      // Para o seu caso, o backend retorna UserPublic no login.
      // O `api.ts` está a simular um token.
      // Vamos fazer o `api.ts` retornar o `UserAPI` real + o token simulado.
      
      // Ajuste no api.ts para loginUser retornar { user: UserAPI, token: string }
      // E aqui você faria:
      // const { user: loggedInUserData, access_token } = await loginUser(email, password);
      // setToken(access_token);
      // setUser(loggedInUserData);
      // await AsyncStorage.setItem('userData', JSON.stringify(loggedInUserData));
      // await AsyncStorage.setItem('userToken', access_token);

      // --- SOLUÇÃO TEMPORÁRIA para o seu AuthContext até ajustarmos loginUser em api.ts ---
      // Como o loginUser em api.ts retorna { access_token, token_type }, e o backend retorna UserPublic,
      // precisamos de um ajuste.
      // VOU ASSUMIR QUE O SEU BACKEND RETORNA UserPublic NO /auth/login
      // E QUE O loginUser EM api.ts VAI RETORNAR { user: UserPublic, token: string }
      
      const responseFromLogin = await loginUser(email, password); // Isso agora retornará { access_token, token_type }
                                                                 // E o backend retorna UserPublic.
                                                                 // Precisamos de um UserPublic aqui.
      
      // Para fazer o AuthContext funcionar AGORA, vamos precisar que loginUser em api.ts
      // retorne o UserAPI real que o backend dá, junto com o token simulado.
      // VOU ATUALIZAR api.ts primeiro.

      // Assumindo que loginUser em api.ts retorna { user: UserAPI, access_token: string }
      const { user: loggedInUserData, access_token } = await loginUser(email, password) as unknown as { user: UserAPI, access_token: string }; // HACK TEMPORÁRIO
      setToken(access_token);
      setUser(loggedInUserData);
      await AsyncStorage.setItem('userData', JSON.stringify(loggedInUserData));
      await AsyncStorage.setItem('userToken', access_token);

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

  // Função de Logout
  const signOut = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setToken(null);
      setUser(null);
      await AsyncStorage.removeItem('userData'); // <<<<< NOVO: Remove dados do utilizador também
      Alert.alert("Logout", "Sessão encerrada.");
      router.replace('/shared/login');
    } catch (e) {
      console.error("AuthContext: Erro ao fazer logout:", e);
      Alert.alert("Erro no Logout", "Não foi possível encerrar a sessão.");
    } finally {
      setIsLoading(false);
    }
  };

  // Valor a ser fornecido pelo contexto
  const authContextValue: AuthContextType = {
    user,
    token,
    isLoading,
    isLoggedIn: !!token && !!user, // Logado se tem token E dados do utilizador
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
