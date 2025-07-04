// app/shared/login/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View, Alert, Image } from 'react-native';
import { useAuth } from '../../../app/context/AuthContext';

// Permite que a splash screen seja escondida manualmente
SplashScreen.preventAutoHideAsync();

export default function LoginScreen() {
  const { signIn, isLoading } = useAuth();

  const [fontsLoaded, fontError] = useFonts({
    'Afacad-Regular': require('@/assets/fonts/Afacad-VariableFont_wght.ttf'),
    'Afacad-Italic': require('@/assets/fonts/Afacad-Italic-VariableFont_wght.ttf'),
    'BebasNeue-Regular': require('@/assets/fonts/BebasNeue-Regular.ttf'),
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Esconde a splash screen assim que as fontes forem carregadas
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro no Login", "Por favor, preencha o email e a senha.");
      return;
    }

    try {
      console.log("LOGIN SCREEN: Tentando fazer login para o email:", email);
      await signIn(email, password);
      console.log("LOGIN SCREEN: Login bem-sucedido (se o AuthContext não redirecionou, algo está errado).");
    } catch (e) {
      console.error("LOGIN SCREEN: Erro ao tentar fazer login na tela:", e);
      Alert.alert("Erro no Login", "Email ou senha inválidos. Por favor, tente novamente.");
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={false}
      onLayout={onLayoutRootView}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <View style={styles.formContainer}>
          {/* Logo agora dentro do formContainer e menor */}
          <Image
            source={require('@/assets/images/logo-vetorizada.png')} // Certifique-se de que este caminho está correto
            style={styles.logoInsideForm} // Novo estilo para a logo dentro do formulário
            resizeMode="contain"
          />

          <Text style={styles.title}>Bem-vindo!</Text>
          <Text style={styles.subtitle}>Faça login para continuar</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="seuemail@exemplo.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable style={styles.button} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </Pressable>

          <Pressable style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  // O estilo 'logo' antigo não é mais necessário aqui, pois a logo está dentro do formContainer
  // logo: {
  //   width: 250,
  //   height: 120,
  //   marginBottom: 40,
  // },
  formContainer: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: 'center', // Centraliza o conteúdo dentro do formContainer, incluindo a logo
  },
  logoInsideForm: { // Novo estilo para a logo dentro do formulário
    width: 150, // Diminuído o tamanho
    height: 75, // Diminuído o tamanho
    marginBottom: 25, // Espaço entre a logo e o título
  },
  title: {
    fontSize: 30,
    fontFamily: 'BebasNeue-Regular',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Afacad-Regular',
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Afacad-Regular',
    color: '#444',
    alignSelf: 'flex-start', // Garante que o label esteja alinhado à esquerda dentro do formContainer
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fcfcfc',
    fontFamily: 'Afacad-Regular',
    color: '#333',
    width: '100%', // Garante que o input ocupe a largura total disponível
  },
  button: {
    backgroundColor: '#3355ce',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    flexDirection: 'row',
    shadowColor: '#3355ce',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    width: '100%', // Garante que o botão ocupe a largura total disponível
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Afacad-Regular',
    fontWeight: 'bold',
    fontSize: 18,
  },
  forgotPasswordButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#3355ce',
    fontSize: 15,
    fontFamily: 'Afacad-Regular',
    textDecorationLine: 'underline',
  },
});