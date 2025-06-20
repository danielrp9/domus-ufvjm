// app/shared/login/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { useAuth } from '../../../app/context/AuthContext'; // Importa o hook useAuth

// SplashScreen.preventAutoHideAsync(); // Já é chamado no _layout.tsx principal

export default function LoginScreen() {
  const { signIn, isLoading } = useAuth(); // Acede às funções e estado do contexto de autenticação

  const [fontsLoaded, fontError] = useFonts({
    'Afacad-Regular': require('@/assets/fonts/Afacad-VariableFont_wght.ttf'),
    'Afacad-Italic': require('@/assets/fonts/Afacad-Italic-VariableFont_wght.ttf'),
    'BebasNeue-Regular': require('@/assets/fonts/BebasNeue-Regular.ttf'),
  });

  const [email, setEmail] = useState(''); // Estado para o email (será o 'username' da API)
  const [password, setPassword] = useState(''); // Estado para a password

  // onLayoutRootView e a condição if (!fontsLoaded && !fontError) são removidos.
  // As fontes são gerenciadas pelo _layout.tsx principal.

  const handleLogin = async () => {
    // Validação básica no frontend antes de enviar
    if (!email || !password) {
      Alert.alert("Erro no Login", "Por favor, preencha o email e a password.");
      return;
    }

    try {
      console.log("LOGIN SCREEN: Tentando fazer login para o email:", email); // DEBUG
      await signIn(email, password); // Chama a função de login do contexto
      // A navegação para a tela principal (tabs) já é feita dentro do signIn no AuthContext
      console.log("LOGIN SCREEN: Login bem-sucedido (se o AuthContext não redirecionou, algo está errado)."); // DEBUG
    } catch (e) {
      // O erro já é tratado e exibido no Alert dentro do signIn, mas podemos logar aqui também
      console.error("LOGIN SCREEN: Erro ao tentar fazer login na tela:", e); // DEBUG
    }
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}> {/* Removido onLayoutRootView */}
        <StatusBar barStyle="dark-content" />
        
        <View style={styles.header}>
          <Text style={styles.pageTitle}>DOMUS</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
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

          
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 50,
    alignItems: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 40,
  },
  pageTitle: {
    fontSize: 60,
    color: '#3355ce',
    fontFamily: 'BebasNeue-Regular',
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    fontFamily: 'Afacad-Regular',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontFamily: 'Afacad-Regular',
    color: '#333',
  },
  button: {
    backgroundColor: '#3355ce',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    flexDirection: 'row', // Para o ActivityIndicator
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Afacad-Regular',
    fontWeight: 'bold',
    fontSize: 20,
  },
  registerButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#3355ce',
    fontSize: 16,
    fontFamily: 'Afacad-Regular',
  },
});
