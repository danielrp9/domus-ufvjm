// app/(tabs)/menu.tsx
import React from 'react';
import MenuAdmin from '../../components/menus/menuAdmin';
import MenuDiscente from '../../components/menus/menuDiscente';
import { useAuth } from '../context/AuthContext'; // <<<<< Importar useAuth
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native'; // Importar View, ActivityIndicator, Text, StyleSheet

export default function Menu() {
  const { user, isLoading, isLoggedIn } = useAuth(); // <<<<< Obter user, isLoading, isLoggedIn do AuthContext

  // Se ainda está a carregar o estado de autenticação, mostra um indicador
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3355ce" />
        <Text style={styles.loadingText}>A carregar menu...</Text>
      </View>
    );
  }

  // Se não está logado ou não há dados de utilizador, pode redirecionar para login
  // (Embora o _layout.tsx já faça isso, é uma verificação de segurança)
  if (!isLoggedIn || !user) {
    // Você pode adicionar um Alert aqui ou apenas retornar null, pois o _layout.tsx
    // já deve ter redirecionado para o login se o utilizador não estiver logado.
    console.warn("MENU: Utilizador não logado ou dados de utilizador ausentes. Redirecionamento esperado.");
    return null; 
  }

  // Agora, renderiza o menu com base no tipo de utilizador
  if (user.tipo === 'admin') {
    console.log("MENU: Renderizando MenuAdmin para o tipo:", user.tipo); // DEBUG
    return <MenuAdmin />;
  }
  
  if (user.tipo === 'morador') { // Assumindo que 'discente' é o mesmo que 'morador' ou um tipo base
    console.log("MENU: Renderizando MenuDiscente para o tipo:", user.tipo); // DEBUG
    return <MenuDiscente />;
  }

  // Fallback caso o tipo de utilizador não seja reconhecido
  console.warn("MENU: Tipo de utilizador não reconhecido:", user.tipo); // DEBUG
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Tipo de utilizador não reconhecido. Contacte o suporte.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Afacad-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Afacad-Regular',
  },
});
