// C:\Users\danie\OneDrive\Área de Trabalho\domus-ufvjm\domus-ufvjm\app\screens\admin\gerenciar-consultas\index.tsx

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

// Importa as funções da API para consultas E para usuários
import { getConsultas, getUserById, ConsultaResponse, UserAPI } from '../../../services/api'; 

// Tipos de status para exibição (ajuste conforme os status reais das suas consultas)
const tiposStatusConsulta = ['Agendada', 'Concluída', 'Cancelada']; // Exemplo

const GerenciarConsultasScreen = () => {
  const [consultas, setConsultas] = useState<ConsultaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // NOVO: Estado para armazenar dados dos utilizadores (cache)
  const [usersCache, setUsersCache] = useState<{ [key: number]: UserAPI }>({}); 

  // Função para buscar todas as consultas
  const fetchConsultas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getConsultas(); // API call: GET /solicitacoes/consultas
      setConsultas(data);
      console.log("ADMIN: Consultas carregadas:", data); // DEBUG

      // NOVO: Buscar dados dos utilizadores para cada consulta
      const userIdsToFetch = Array.from(new Set(data.map(c => c.user_id))); // IDs únicos
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
      console.error("ADMIN: Erro ao carregar consultas:", err);
      let errorMessage = "Não foi possível carregar as consultas.";
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
      fetchConsultas();
      return () => {};
    }, [fetchConsultas])
  );

  const atualizarStatusConsulta = async (id: number, novoStatus: string) => {
    setLoading(true);
    try {
      // Você precisará de uma função updateConsultaStatus na sua API para isso
      // Ex: await updateConsultaStatus(id, novoStatus);
      Alert.alert("Sucesso", `Status da consulta ${id} atualizado para ${novoStatus}.`);
      fetchConsultas(); // Recarregar a lista
    } catch (err: any) {
      console.error("ADMIN: Erro ao atualizar status da consulta:", err);
      let errorMessage = "Não foi possível atualizar o status da consulta.";
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

  const getStatusColorConsulta = (status: string) => {
    switch (status) {
      case 'Concluída': return '#28a745';
      case 'Agendada': return '#007bff';
      case 'Cancelada': return '#dc3545';
      default: return '#ccc';
    }
  };

  if (loading && consultas.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3355ce" />
        <Text style={styles.loadingText}>A carregar consultas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchConsultas}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
     

        {consultas.length === 0 ? (
          <Text style={styles.noConsultasText}>Nenhuma consulta encontrada.</Text>
        ) : (
          consultas.map((item) => {
            const userDetails = usersCache[item.user_id]; // Obtém os detalhes do utilizador da cache
            return (
              <View key={item.id} style={styles.card}>
                <Ionicons name="calendar-outline" size={24} color="#3355ce" style={styles.icon} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardText}>
                    <Text style={styles.label}>ID da Consulta:</Text> {item.id}
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
                    <Text style={styles.label}>Horário:</Text> {new Date(item.horario).toLocaleString('pt-BR')}
                  </Text>
                  <Text style={[styles.cardText, { color: getStatusColorConsulta(item.status) }]}>
                    <Text style={styles.label}>Status:</Text> {item.status}
                  </Text>
                  
                  {/* Opções para atualizar status (apenas se o backend tiver o PUT/PATCH) */}
                  <View style={styles.statusContainer}>
                    {tiposStatusConsulta.map((status) => (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.statusButton,
                          { 
                            borderColor: getStatusColorConsulta(status), 
                            backgroundColor: item.status === status ? getStatusColorConsulta(status) : styles.statusButton.backgroundColor 
                          },
                        ]}
                        onPress={() => atualizarStatusConsulta(item.id, status)}
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
  noConsultasText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Afacad-Regular',
  }
});
export default GerenciarConsultasScreen;