// C:\Users\danie\OneDrive\Área de Trabalho\domus-ufvjm\domus-ufvjm\app\screens\discente\solicitar-psicologo\historico-consultas.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert, StatusBar, TouchableOpacity, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Importa as funções da API para consultas E para usuários
import { getConsultasByUserId, getUserById, ConsultaResponse, UserAPI } from '../../../services/api'; 
import { useAuth } from '../../../../app/context/AuthContext';

export default function HistoricoConsultasScreen() {
  const { user, isLoggedIn } = useAuth();
  
  const [consultas, setConsultas] = useState<ConsultaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // NOVO: Estado para armazenar dados dos utilizadores (cache)
  const [usersCache, setUsersCache] = useState<{ [key: number]: UserAPI }>({}); 

  // Função para buscar as consultas do utilizador logado
  const fetchUserConsultas = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isLoggedIn || !user || !user.id) {
      setError("Você precisa estar logado para ver o histórico de consultas.");
      setLoading(false);
      return;
    }

    try {
      const data = await getConsultasByUserId(user.id); // API call com user.id
      // Ordenar as consultas por horário (mais recente primeiro)
      const sortedData = data.sort((a: ConsultaResponse, b: ConsultaResponse) => {
        return new Date(b.horario).getTime() - new Date(a.horario).getTime();
      });
      setConsultas(sortedData);
      console.log("DISCENTE: Histórico de consultas carregado:", sortedData); // DEBUG

      // NOVO: Buscar dados do utilizador logado (já temos no AuthContext, mas para outros usuários se necessário)
      // Para esta tela, o user logado já está em `user` do `useAuth()`.
      // Mas se quisermos exibir de outros usuários (caso a API retornasse user_id de outros),
      // a lógica de usersCache seria útil. Para o histórico do próprio usuário, é mais simples.
      
      // Se a API getConsultasByUserId não retorna nome/email, e queremos exibir o do próprio usuário:
      const newUsersCache: { [key: number]: UserAPI } = { ...usersCache };
      if (user && user.id && !newUsersCache[user.id]) {
        newUsersCache[user.id] = user; // Adiciona o próprio utilizador à cache
      }
      setUsersCache(newUsersCache);
      console.log("DISCENTE: Cache de utilizadores atualizada:", newUsersCache); // DEBUG

    } catch (err: any) {
      console.error("DISCENTE: Erro ao carregar histórico de consultas:", err);
      let errorMessage = "Não foi possível carregar o histórico de consultas.";
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

  useFocusEffect(
    useCallback(() => {
      fetchUserConsultas();
      return () => {};
    }, [fetchUserConsultas])
  );

  const getStatusColorConsulta = (status: string) => {
    switch (status) {
      case 'Concluída': return '#28a745';
      case 'Agendada': return '#007bff';
      case 'Cancelada': return '#dc3545';
      default: return '#ccc';
    }
  };

  const formatarDataHora = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR');
  };

  if (loading && consultas.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3355ce" />
        <Text style={styles.loadingText}>A carregar histórico de consultas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserConsultas}>
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
          <Text style={styles.noConsultasText}>Nenhuma consulta agendada encontrada.</Text>
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
                        <Text style={styles.label}>Nome:</Text> {userDetails.nome}
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
                    <Text style={styles.label}>Horário:</Text> {formatarDataHora(item.horario)}
                  </Text>
                  <Text style={[styles.cardText, { color: getStatusColorConsulta(item.status) }]}>
                    <Text style={styles.label}>Status:</Text> {item.status}
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
  noConsultasText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Afacad-Regular',
  }
});
