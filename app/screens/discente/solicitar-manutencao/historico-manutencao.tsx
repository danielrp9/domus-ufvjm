// C:\Users\danie\OneDrive\Área de Trabalho\domus-ufvjm\domus-ufvjm\app\screens\discente\solicitar-manutencao\historico-manutencao.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert, StatusBar, TouchableOpacity, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Importa as funções da API para manutenções E para usuários
import { getManutencoesByUserId, getUserById, ManutencaoAPI, UserAPI } from '../../../services/api'; 
import { useAuth } from '../../../../app/context/AuthContext';

export default function HistoricoManutencaoScreen() {
  const { user, isLoggedIn } = useAuth();
  
  const [solicitacoes, setSolicitacoes] = useState<ManutencaoAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // NOVO: Estado para armazenar dados dos utilizadores (cache)
  const [usersCache, setUsersCache] = useState<{ [key: number]: UserAPI }>({}); 

  // Função para buscar as solicitações do utilizador logado
  const fetchUserSolicitacoes = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isLoggedIn || !user || !user.id) {
      setError("Você precisa estar logado para ver o histórico.");
      setLoading(false);
      return;
    }

    try {
      const data = await getManutencoesByUserId(user.id); // API call com user.id
      setSolicitacoes(data);
      console.log("DISCENTE: Histórico de manutenções carregado:", data); // DEBUG
      
      const newUsersCache: { [key: number]: UserAPI } = { ...usersCache };
      if (user && user.id && !newUsersCache[user.id]) {
        newUsersCache[user.id] = user; // Adiciona o próprio utilizador à cache
      }
      setUsersCache(newUsersCache);
      console.log("DISCENTE: Cache de utilizadores atualizada:", newUsersCache); // DEBUG

    } catch (err: any) {
      console.error("DISCENTE: Erro ao carregar histórico:", err);
      let errorMessage = "Não foi possível carregar o histórico de manutenções.";
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
  }, [user, isLoggedIn, usersCache]); // usersCache como dependência

  // Carrega as solicitações na montagem do componente E quando a tela for focada
  useFocusEffect(
    useCallback(() => {
      fetchUserSolicitacoes();
      return () => {}; // Cleanup function
    }, [fetchUserSolicitacoes])
  );

  // Função auxiliar para retornar cor do status
  const getStatusStyle = (status: string) => {
    let color = '#333';
    switch (status) {
      case 'Concluído': color = '#28a745'; break;
      case 'Em andamento': color = '#ffc107'; break;
      case 'Pendente': color = '#007bff'; break;
      case 'Cancelado': color = '#dc3545'; break;
    }
    return { color };
  };

  if (loading && solicitacoes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3355ce" />
        <Text style={styles.loadingText}>A carregar histórico...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserSolicitacoes}>
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
          <Text style={styles.noSolicitacoesText}>Nenhuma solicitação de manutenção encontrada para este utilizador.</Text>
        ) : (
          solicitacoes.map((item) => {
            const userDetails = usersCache[item.user_id]; // Obtém os detalhes do utilizador da cache
            return (
              <View key={item.id} style={styles.card}>
                <Ionicons name="construct" size={24} color="#3355ce" style={styles.icon} />
                <View style={styles.cardContent}>
                  <Text style={styles.tipo}>{item.tipo_solicitacao}</Text>
                  <Text style={styles.detalhes}>Descrição: {item.descricao}</Text>
                  <Text style={styles.detalhes}>ID da Solicitação: {item.id}</Text>
                  {userDetails ? ( // Exibe nome e email se disponível
                    <>
                      <Text style={styles.detalhes}>
                        <Text style={styles.label}>Solicitante:</Text> {userDetails.nome}
                      </Text>
                      <Text style={styles.detalhes}>
                        <Text style={styles.label}>Email:</Text> {userDetails.email}
                      </Text>
                    </>
                  ) : ( // Caso contrário, exibe apenas o User ID
                    <Text style={styles.detalhes}>
                      <Text style={styles.label}>User ID:</Text> {item.user_id}
                    </Text>
                  )}
                  <Text style={[styles.detalhes, getStatusStyle(item.status)]}>
                    Status: {item.status}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

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
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  tipo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
    fontFamily: 'Afacad-Regular',
  },
  detalhes: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Afacad-Regular',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  noSolicitacoesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Afacad-Regular',
  }
});
