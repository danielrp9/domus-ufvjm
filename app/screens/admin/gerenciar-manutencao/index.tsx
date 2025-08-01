// C:\Users\danie\OneDrive\Área de Trabalho\domus-ufvjm\domus-ufvjm\app\screens\admin\gerenciar-manutencao\index.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  StatusBar
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Importa as funções da API para manutenções E para usuários
import { getManutencoes, updateManutencaoStatus, getUserById, ManutencaoAPI, UserAPI } from '../../../services/api'; 

// Tipos de status para exibição
const tiposStatus = ['Pendente', 'Em andamento', 'Concluído', 'Cancelado'];

const GerenciarManutencoesScreen = () => {
  const [solicitacoes, setSolicitacoes] = useState<ManutencaoAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // NOVO: Estado para armazenar dados dos utilizadores (cache)
  const [usersCache, setUsersCache] = useState<{ [key: number]: UserAPI }>({}); 

  // Função para buscar todas as solicitações de manutenção
  const fetchSolicitacoes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getManutencoes(); // API call
      setSolicitacoes(data);
      console.log("ADMIN: Manutenções carregadas:", data); // DEBUG

      // NOVO: Buscar dados dos utilizadores para cada solicitação
      const userIdsToFetch = Array.from(new Set(data.map(s => s.user_id))); // IDs únicos
      const newUsersCache: { [key: number]: UserAPI } = { ...usersCache };
      
      for (const userId of userIdsToFetch) {
        if (!newUsersCache[userId]) { // Se o utilizador não estiver na cache
          try {
            const user = await getUserById(userId); // Busca dados do utilizador
            newUsersCache[userId] = user;
          } catch (userError) {
            console.error(`ADMIN: Erro ao buscar utilizador ${userId}:`, userError);
            // Pode definir um utilizador placeholder ou ignorar
            newUsersCache[userId] = { id: userId, nome: 'Desconhecido', email: 'desconhecido@example.com', tipo: 'morador', bloco: null, apartamento: null, curso: null, matricula: null, ano_de_entrada: null };
          }
        }
      }
      setUsersCache(newUsersCache);
      console.log("ADMIN: Cache de utilizadores atualizada:", newUsersCache); // DEBUG

    } catch (err: any) {
      console.error("ADMIN: Erro ao carregar manutenções:", err);
      let errorMessage = "Não foi possível carregar as solicitações de manutenção.";
      if (err.response) {
        if (err.response.data && err.response.data.detail) {
          errorMessage = `Erro da API: ${err.response.data.detail}`;
        } else {
          errorMessage = `Erro da API: ${err.response.status}`;
        }
      } else if (err.request) {
        errorMessage = `Erro de rede: ${err.message}`;
      } else {
        errorMessage = `Erro desconhecido: ${err.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [usersCache]); // usersCache como dependência para re-executar se a cache mudar

  useFocusEffect(
    useCallback(() => {
      fetchSolicitacoes();
      return () => {};
    }, [fetchSolicitacoes])
  );

  const atualizarStatus = async (id: number, novoStatus: string) => {
    setLoading(true);
    try {
      const updated = await updateManutencaoStatus(id, novoStatus);
      Alert.alert("Sucesso", `Status da solicitação ${id} atualizado para ${novoStatus}.`);
      console.log("ADMIN: Solicitação atualizada:", updated);
      fetchSolicitacoes(); // Recarregar a lista para mostrar a alteração
    } catch (err: any) {
      console.error("ADMIN: Erro ao atualizar status:", err);
      let errorMessage = "Não foi possível atualizar o status da solicitação.";
      if (err.response) {
        if (err.response.data && err.response.data.detail) {
          errorMessage = `Erro da API: ${err.response.data.detail}`;
        } else {
          errorMessage = `Erro da API: ${err.response.status}`;
        }
      } else if (err.request) {
        errorMessage = `Erro de rede: ${err.message}`;
      } else {
        errorMessage = `Erro desconhecido: ${err.message}`;
      }
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído': return '#28a745';
      case 'Em andamento': return '#ffc107';
      case 'Pendente': return '#007bff';
      case 'Cancelado': return '#dc3545';
      default: return '#ccc';
    }
  };

  if (loading && solicitacoes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3355ce" />
        <Text style={styles.loadingText}>A carregar solicitações...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchSolicitacoes}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
     

        {solicitacoes.length === 0 ? (
          <Text style={styles.noSolicitacoesText}>Nenhuma solicitação de manutenção encontrada.</Text>
        ) : (
          solicitacoes.map((item) => {
            const userDetails = usersCache[item.user_id]; // Obtém os detalhes do utilizador da cache
            return (
              <View key={item.id} style={styles.card}>
                <Ionicons name="construct" size={24} color="#3355ce" style={styles.icon} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardText}>
                    <Text style={styles.label}>ID da Solicitação:</Text> {item.id}
                  </Text>
                  {userDetails ? ( // Exibe nome e email se disponível
                    <>
                      <Text style={styles.cardText}>
                        <Text style={styles.label}>Solicitante:</Text> {userDetails.nome}
                      </Text>
                      <Text style={styles.cardText}>
                        <Text style={styles.label}>Email:</Text> {userDetails.email}
                      </Text>
                    </>
                  ) : ( // Caso contrário, exibe apenas o User ID
                    <Text style={styles.cardText}>
                      <Text style={styles.label}>User ID:</Text> {item.user_id}
                    </Text>
                  )}
                  <Text style={styles.cardText}>
                    <Text style={styles.label}>Descrição:</Text> {item.descricao}
                  </Text>
                  <Text style={styles.cardText}>
                    <Text style={styles.label}>Tipo:</Text> {item.tipo_solicitacao}
                  </Text>

                  <Text style={styles.label}>Status:</Text>
                  <View style={styles.statusContainer}>
                    {tiposStatus.map((status) => (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.statusButton,
                          item.status === status && { backgroundColor: getStatusColor(status) },
                          { borderColor: getStatusColor(status) },
                        ]}
                        onPress={() => atualizarStatus(item.id, status)}
                      >
                        <Text
                          style={[
                            styles.statusButtonText,
                            item.status === status && { color: '#fff' },
                          ]}
                        >
                          {status}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Concluído': return '#28a745';
    case 'Em andamento': return '#ffc107';
    case 'Pendente': return '#007bff';
    case 'Cancelado': return '#dc3545';
    default: return '#ccc';
  }
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  pageTitle: {
    fontSize: 40,
    color: '#3355ce',
    marginBottom: 20,
    fontFamily: 'BebasNeue-Regular',
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
  card: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardText: {
    fontSize: 16,
    color: '#504A4A',
    fontFamily: 'Afacad-Regular',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  statusButtonActive: {
    // Este estilo não é mais necessário, pois a cor de fundo é aplicada inline
  },
  statusButtonText: {
    fontSize: 14,
    color: '#3355ce',
    fontFamily: 'Afacad-Regular',
  },
  noSolicitacoesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Afacad-Regular',
  }
});


export default GerenciarManutencoesScreen;
