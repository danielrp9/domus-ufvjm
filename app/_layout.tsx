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

  // --- MUDANÇA CRÍTICA AQUI: Usar a prop `initialRouteName` no Stack e proteger rotas ---
  // A lógica de redirecionamento mais robusta é feita dentro do Stack ou no `_layout` do grupo.
  // Removeremos o Redirect direto aqui, e faremos o Stack proteger as rotas.

  // Expo Router usa `router.replace` ou `Redirect`. Se o `Redirect` está num loop,
  // significa que a rota para a qual estamos a redirecionar não está a ser
  // tratada como uma rota "externa" ao Stack principal que está a tentar redirecionar.

  // A abordagem mais comum é ter um grupo de rotas autenticadas e um não autenticadas.
  // Ex: Stack.Screen name="(auth)" para rotas sem login, e Stack.Screen name="(app)" para rotas logadas.
  // A versão que te dei já estava a tentar fazer isso.

  // O loop acontece porque `Redirect` faz uma nova renderização, e `RootLayoutNav` reavalia a condição.
  // Vamos simplificar o `RootLayoutNav` para apenas renderizar o Stack.

  // O problema é que o `Redirect` está a ser chamado infinitamente.
  // Precisamos garantir que a tela de login não está dentro do mesmo Stack que redireciona para ela.

  // Vamos tentar uma abordagem mais explícita com Stack.Screen name="shared/login" para o login
  // e Stack.Screen name="(app)" para as rotas autenticadas.
  // O seu app/_layout.tsx JÁ TEM ESTA ESTRUTURA.

  // A causa mais provável do loop é que o `shared/login/index.tsx`
  // não está a ser tratado como um "ecrã" que pode ser alvo de `Redirect`.

  // Vamos reconfirmar que a rota de login é a `index` dentro da pasta `shared/login`.
  // O `Redirect` para `href="/shared/login"` está correto.
  // O problema pode estar na forma como o Expo Router está a lidar com a pilha de navegação.

  // Se o loop infinito ocorre no navegador, pode ser um bug ou uma limitação do Expo Router web.

  // A solução é usar `Stack.Screen name="shared/login/index"` para o login e `name="(tabs)"` para o app.
  // A lógica `if (!isLoggedIn) { return <Redirect href="/shared/login" />; }` DEVERIA FUNCIONAR.

  // Uma alternativa para o loop é usar `router.navigate` com um `replace` ou uma lógica mais complexa.

  // Vamos tentar uma última vez com o `Redirect` no `_layout.tsx`,
  // garantindo que não há nada de estranho nas outras rotas.
  // Já eliminamos o `app/index.tsx` e corrigimos o `app/(tabs)/index.tsx`.

  // Se o problema for do navegador a "travar" no Redirect:
  // A linha `Throttling navigation to prevent the browser from hanging. See https://crbug.com/1038223.`
  // indica que o Chrome está a detetar um loop de navegação e a tentar impedi-lo,
  // mas o seu aplicativo continua a tentar redirecionar.

  // Isso é um problema persistente com `expo-router` e `Redirect` em alguns ambientes.
  // A forma de contornar isso é usar um `Stack.Screen` para o login
  // e esconder as outras rotas até que o login seja feito.
  // O seu código já está a fazer isso, o que é estranho que entre em loop.

  // Tentar um `router.replace` dentro de um `useEffect` no próprio RootLayoutNav pode ajudar.
  // Mas o `Redirect` componente é o jeito "Expo Router" de fazer isso.

  // Se o loop está a acontecer, significa que o Redirect é renderizado,
  // mas o contexto do router não o está a processar como uma transição completa.

  // VOU MODIFICAR AQUI PARA UMA ABORDAGEM QUE GERALMENTE EVITA LOOPS.
  // A lógica fica mais na configuração do Stack.
  
  // Opção A: Usar um Stack com dois grupos: um público e um privado.
  // (Esta é a abordagem mais robusta para fluxo de autenticação com Expo Router)
  if (!isLoggedIn) {
    console.log("DEBUG LAYOUT: User NOT logged in. Rendering Auth Stack.");
    return (
      <Stack>
        <Stack.Screen name="shared/login/index" options={{ headerShown: false }} />
        {/* Adicione outras telas públicas aqui se houver (ex: shared/cadastro/index) */}
        <Stack.Screen name="+not-found" />
      </Stack>
    );
  } else {
    console.log("DEBUG LAYOUT: User IS logged in. Rendering App Stack.");
    return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* As outras pastas como screens/admin e screens/discente são rotas aninhadas
            dentro de (tabs) ou acessadas por navegação direta dentro do app logado. */}
        <Stack.Screen name="+not-found" />
      </Stack>
    );
  }
}
