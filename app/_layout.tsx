// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Redirect, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { View, ActivityIndicator, Text } from 'react-native';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({ 
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Afacad-Regular': require('../assets/fonts/Afacad-VariableFont_wght.ttf'),
    'Afacad-Italic': require('../assets/fonts/Afacad-Italic-VariableFont_wght.ttf'),
    'BebasNeue-Regular': require('../assets/fonts/BebasNeue-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const { isLoggedIn, isLoading } = useAuth();

  console.log("DEBUG LAYOUT: RootLayoutNav - isLoading:", isLoading, "isLoggedIn:", isLoggedIn);

  if (isLoading) {
    console.log("DEBUG LAYOUT: Still loading session, showing loading screen.");
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#3355ce" />
        <Text style={{ marginTop: 10, fontFamily: 'Afacad-Regular' }}>A carregar sessão...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    console.log("DEBUG LAYOUT: User NOT logged in. Rendering Auth Stack.");
    return (
      <Stack>
        <Stack.Screen name="shared/login/index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    );
  } else {
    console.log("DEBUG LAYOUT: User IS logged in. Rendering App Stack.");
    return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Grupos de rotas para 'screens/admin' e 'screens/discente' */}
        <Stack.Screen name="screens/admin" options={{ headerShown: false }} />
        <Stack.Screen name="screens/discente" options={{ headerShown: false }} />
        
        {/* <<<<< MUDANÇA CRÍTICA AQUI: Ocultar o cabeçalho para o grupo 'shared/alertas' >>>>> */}
        <Stack.Screen name="shared/alertas" options={{ headerShown: false }} /> 
        <Stack.Screen name="shared/reservar-pcs" options={{ headerShown: false }} /> 

        <Stack.Screen name="shared/configuracoes" options={{ headerShown: false }} /> 
        
        {/* <<<<< FIM DA MUDANÇA CRÍTICA >>>>> */}

        <Stack.Screen name="shared/login/index" options={{ headerShown: false }} /> 
        <Stack.Screen name="+not-found" />
      </Stack>
    );
  }
}
