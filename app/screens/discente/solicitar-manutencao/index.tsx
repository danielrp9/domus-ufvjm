import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createManutencao } from '../../../services/api';
import { useAuth } from '../../../../app/context/AuthContext';

export default function FormsManutencaoGenerica() {
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const { user, isLoggedIn } = useAuth();
  
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!descricao.trim()) {
      Alert.alert('Erro', 'Por favor, descreva o problema.');
      return;
    }

    if (!isLoggedIn || !user || !user.id) {
      Alert.alert('Erro de Autenticação', 'Você precisa estar logado para solicitar manutenção.');
      router.replace('/shared/login');
      return;
    }

    setLoading(true);
    try {
      const solicitacaoData = {
        user_id: user.id,
        descricao: `${type ? type + ': ' : ''}${descricao.trim()}`,
      };
      
      console.log('MANUTENCAO_GENERICA: Enviando solicitação para API:', solicitacaoData);
      const response = await createManutencao(solicitacaoData);
      console.log('MANUTENCAO_GENERICA: Resposta da API:', response);

      Alert.alert('Solicitação Enviada', `Sua solicitação de manutenção (ID: ${response.id}) foi registrada com status: ${response.status}.`);

      setDescricao('');
      router.back();
    } catch (error: any) {
      console.error("MANUTENCAO_GENERICA: Erro ao enviar solicitação:", error);
      let errorMessage = 'Não foi possível enviar a solicitação de manutenção.';
      if (error && error.detail) {
        if (Array.isArray(error.detail)) {
          errorMessage = 'Erros de Validação:\n' + error.detail.map((err: any) => `${err.loc.length > 1 ? err.loc[err.loc.length - 1] : 'campo'}: ${err.msg}`).join('\n');
        } else {
          errorMessage = `Erro da API: ${error.detail}`;
        }
      } else if (error.message) {
        errorMessage = `Erro: ${error.message}`;
      }
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoricoPress = () => {
    router.push('/screens/discente/solicitar-manutencao/historico-manutencao');
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      
      <View style={styles.subtitleContainer}>
        <Ionicons name="build" size={24} color="#504A4A" style={styles.subtitleIcon} />
        <Text style={styles.subtitle}>{type || 'Manutenção Geral'}</Text>
      </View>

      <Text style={styles.label}>Descreva o problema:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Digite aqui..."
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <View style={styles.buttonContainer}>
        <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitText}>Enviar Solicitação</Text>
          )}
        </Pressable>
      </View>

      <Pressable onPress={handleHistoricoPress} style={styles.historyLink}>
        <Ionicons name="time-outline" size={20} color="#3355ce" />
        <Text style={styles.historyText}>Histórico de Solicitação</Text>
      </Pressable>

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
    backgroundColor: '#fff',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    alignSelf: 'center', 
  },
  subtitleIcon: {
    marginRight: 10,
    top: -15,
  },
  subtitle: {
    fontSize: 20,
    color: '#504A4A',
    top: -15,
    fontFamily: 'Afacad-Regular',
  },
  label: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'Afacad-Regular',
    alignSelf: 'center', 
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'Afacad-Regular',
    color: '#504A4A',
  },
  textArea: {
    height: 250,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#3355ce',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 30,
    width: '70%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Afacad-Regular',
  },
  historyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  historyText: {
    fontSize: 16,
    color: '#3355ce',
    fontFamily: 'Afacad-Regular',
    marginLeft: 8,
  },
});