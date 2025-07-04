// app/shared/alertas/index.tsx

import { MaterialIcons, Ionicons } from '@expo/vector-icons'; // Adicionado Ionicons para o botão de voltar
import React, { useState, useEffect, useCallback } from 'react'; // Adicionado useState, useEffect, useCallback
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert, StatusBar, TouchableOpacity } from 'react-native'; // Adicionado ActivityIndicator, Alert, TouchableOpacity
import { getAvisos, AvisoAPI } from '../../services/api'; // Importar a função da API e a interface
import { useRouter } from 'expo-router'; // Importar useRouter


export default function AlertasScreen() {
  const router = useRouter(); // Inicializar useRouter
  
  const [avisos, setAvisos] = useState<AvisoAPI[]>([]); // Estado para guardar os avisos
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Estado de erro

  // Função para buscar os avisos da API
  const fetchAvisos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAvisos(); // Chama a API
      // Ordenar os avisos pela data de publicação (mais recente primeiro)
      const sortedData = data.sort((a, b) => {
        return new Date(b.data_publicacao).getTime() - new Date(a.data_publicacao).getTime();
      });
      setAvisos(sortedData);
      console.log("ALERTAS SCREEN: Avisos carregados:", sortedData); // DEBUG
    } catch (err: any) {
      console.error("ALERTAS SCREEN: Erro ao carregar avisos:", err); // DEBUG
      let errorMessage = "Não foi possível carregar os alertas.";
      if (err.response && err.response.data && err.response.data.detail) {
        errorMessage = `Erro da API: ${err.response.data.detail}`;
      } else if (err.message) {
        errorMessage = `Erro: ${err.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega os avisos na montagem do componente
  useEffect(() => {
    fetchAvisos();
  }, [fetchAvisos]);

  // Função para formatar a data (opcional, se a API retornar como string ISO)
  const formatarData = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR'); // Formato DD/MM/YYYY
  };

  if (loading && avisos.length === 0) { // Mostrar loading inicial
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3355ce" />
        <Text style={styles.loadingText}>A carregar alertas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAvisos}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        

        {avisos.length === 0 ? (
          <Text style={styles.noAlertsText}>Nenhum alerta encontrado.</Text>
        ) : (
          avisos.map((aviso) => ( // Mapeia os avisos da API
            <View key={aviso.id} style={styles.alertBox}>
              <MaterialIcons name="warning" size={24} color="#FFA500" style={styles.icon} />
              <View style={styles.alertTextContainer}>
                <Text style={styles.alertDate}>{formatarData(aviso.data_publicacao)}</Text>
                <Text style={styles.alertTitle}>{aviso.titulo}</Text>
                <Text style={styles.alertMessage}>{aviso.conteudo}</Text> 
              </View>
            </View>
          ))
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  pageTitle: {
    fontSize: 40,
    color: '#3355ce',
    marginBottom: 20,
    fontFamily: 'BebasNeue-Regular',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fef3c7',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
    marginTop: 2,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertDate: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    fontFamily: 'Afacad-Regular',
  },
  alertTitle: { // Novo estilo para o título do aviso
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Afacad-Regular',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Afacad-Regular',
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
  noAlertsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Afacad-Regular',
  }
});
