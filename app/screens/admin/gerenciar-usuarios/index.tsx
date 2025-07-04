// C:\Users\danie\OneDrive\Área de Trabalho\domus-ufvjm\domus-ufvjm\app\screens\admin\gerenciar-usuarios\index.tsx

import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal, // Adicionado import para Modal
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity, // Adicionado import para TouchableOpacity no modal
  View
} from 'react-native';
import { deleteUser, getUsers, UserAPI } from '../../../services/api'; // Importe as funções da API e a interface UserAPI

SplashScreen.preventAutoHideAsync();

export default function UsuariosScreen() {
  const router = useRouter();
  const [fontsLoaded, fontError] = useFonts({
    'Afacad-Regular': require('@/assets/fonts/Afacad-VariableFont_wght.ttf'),
    'Afacad-Italic': require('@/assets/fonts/Afacad-Italic-VariableFont_wght.ttf'),
    'BebasNeue-Regular': require('@/assets/fonts/BebasNeue-Regular.ttf'),
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Novos estados para o modal de confirmação ---
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);
  // --- Fim dos novos estados ---

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("ERRO: A API não retornou uma lista (array) de usuários como esperado.", data);
        setError("Erro: Formato de dados inesperado da API. Verifique a consola.");
      }
    } catch (err: any) {
      console.error("Erro ao carregar usuários da API:", err);
      if (err.response) {
        console.error("Detalhes do erro da API (resposta):", err.response.data);
        setError(`Erro da API: ${err.response.status} - ${err.response.data?.detail || 'Algo correu mal.'}`);
      } else if (err.request) {
        console.error("Erro de rede:", err.request);
        setError("Erro de rede: Não foi possível ligar ao servidor. Verifique se o backend está a correr e o IP está correto.");
      } else {
        setError(`Erro desconhecido: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3355ce" />
        <Text style={styles.loadingText}>A carregar usuários...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={fetchUsers} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </Pressable>
      </View>
    );
  }

  const handleAddUser = () => {
    router.push('/screens/admin/gerenciar-usuarios/novo-usuario');
  };

  const handleEditUser = (userId: number) => {
    router.push(`/screens/admin/gerenciar-usuarios/editar-usuario?id=${userId}`);
  };

  // --- Função para abrir o modal de confirmação ---
  const confirmDeleteUser = (userId: number) => {
    setUserToDeleteId(userId);
    setDeleteModalVisible(true);
  };

  // --- Função para executar a deleção após a confirmação do modal ---
  const executeDeleteUser = async () => {
    if (userToDeleteId === null) return; // Garante que há um ID para deletar

    setDeleteModalVisible(false); // Fecha o modal
    setLoading(true); // Opcional: mostrar loading enquanto deleta
    try {
      console.log("Executando deleção para userId:", userToDeleteId); // DEBUG
      await deleteUser(userToDeleteId);
      Alert.alert("Sucesso", "Utilizador eliminado com sucesso!");
      fetchUsers(); // Recarrega a lista
    } catch (err) {
      console.error("Erro ao eliminar utilizador no frontend:", err);
      Alert.alert("Erro", "Não foi possível eliminar o utilizador.");
    } finally {
      setLoading(false); // Esconde o loading
      setUserToDeleteId(null); // Limpa o ID
    }
  };

  const filteredUsers = users.filter(user =>
    user.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container} onLayout={onLayoutRootView}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <Text style={styles.pageTitle}>USUÁRIOS</Text>
          <Pressable onPress={handleAddUser} style={styles.addButton}>
            <Ionicons name="person-add" size={24} color="#3355ce" />
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar usuários..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.usersList}>
          {filteredUsers.length === 0 ? (
            <Text style={styles.noUsersText}>Nenhum utilizador encontrado. Adicione um novo ou verifique a sua API.</Text>
          ) : (
            filteredUsers.map((user) => (
              <View key={user.id.toString()} style={styles.userItem}>
                <Text style={styles.userName}>{user.nome}</Text>
                <View style={styles.actionsContainer}>
                  <Pressable
                    onPress={() => handleEditUser(user.id)}
                    style={({ pressed }) => [
                      styles.actionButton,
                      pressed && styles.actionButtonPressed
                    ]}
                  >
                    <Ionicons name="pencil" size={20} color="#3355ce" />
                  </Pressable>
                  <Pressable
                    onPress={() => confirmDeleteUser(user.id)} // Chama a nova função para abrir o modal
                    style={({ pressed }) => [
                      styles.actionButton,
                      pressed && styles.actionButtonPressed
                    ]}
                  >
                    <Ionicons name="trash" size={20} color="#ff3b30" />
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      {/* --- Modal de Confirmação de Deleção Personalizado --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)} // Para Android, fechar no botão voltar
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            <Text style={styles.modalMessage}>Tem certeza que deseja eliminar este utilizador?</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={executeDeleteUser} // Chama a função que executa a deleção
              >
                <Text style={styles.modalButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* --- Fim do Modal --- */}

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
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 50,
     top: -27,
  },
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
    marginBottom: 15,
    fontFamily: 'Afacad-Regular',
  },
  retryButton: {
    backgroundColor: '#3355ce',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Afacad-Regular',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 40,
    color: '#3355ce',
    fontFamily: 'BebasNeue-Regular',
    top: 49,
  },
  addButton: {
    padding: 10,
    top: 49,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginVertical: 20,
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    top: 32
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Afacad-Regular',
    fontSize: 16,
    color: '#374151',
    height: '100%',
  },
  usersList: {
    marginTop: 20,
    gap: 12,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  userName: {
    fontSize: 16,
    color: '#374151',
    fontFamily: 'Afacad-Regular',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  actionButtonPressed: {
    backgroundColor: '#e0e0e0',
  },
  noUsersText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Afacad-Regular',
  },
  // --- Estilos para o Modal de Confirmação ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro transparente
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '80%', // Largura do modal
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'BebasNeue-Regular',
    color: '#3355ce',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Afacad-Regular',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#ccc',
  },
  modalButtonDelete: {
    backgroundColor: '#ff3b30',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Afacad-Regular',
    fontSize: 16,
  },
});
