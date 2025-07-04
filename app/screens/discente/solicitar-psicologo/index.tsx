import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, StatusBar, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../../app/context/AuthContext';
import { createConsulta } from '../../../services/api';
import { Ionicons } from '@expo/vector-icons';

// Mock de dados para dias e horários disponíveis (se o backend não tiver um endpoint GET para isso)
const diasDisponiveis = [
  { id: 1, dia: '07/06/2025', horarios: ['09:00', '10:30', '12:30', '13:30', '14:30'] },
  { id: 2, dia: '08/06/2025', horarios: ['08:00', '13:00', '15:30'] },
  { id: 3, dia: '09/06/2025', horarios: ['10:00', '11:30', '16:00'] },
  { id: 4, dia: '10/06/2025', horarios: ['10:00', '11:30', '16:00'] },
  { id: 5, dia: '11/06/2025', horarios: ['10:00', '11:30', '16:00'] },
];

export default function AgendamentoPsicologoScreen() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  
  const [diaSelecionadoId, setDiaSelecionadoId] = useState<number | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelecionarDia = (id: number) => {
    setDiaSelecionadoId(id);
    setHorarioSelecionado(null);
  };

  const handleSelecionarHorario = (horario: string) => {
    setHorarioSelecionado(horario);
  };

  const handleAgendar = async () => {
    if (!diaSelecionadoId || !horarioSelecionado) {
      Alert.alert('Erro', 'Por favor, selecione um dia e um horário.');
      return;
    }

    if (!isLoggedIn || !user || !user.id) {
      Alert.alert('Erro de Autenticação', 'Você precisa estar logado para agendar uma consulta.');
      router.replace('/shared/login');
      return;
    }

    setLoading(true);
    try {
      const diaObj = diasDisponiveis.find(d => d.id === diaSelecionadoId);
      if (!diaObj) {
        Alert.alert('Erro', 'Dia selecionado inválido.');
        setLoading(false);
        return;
      }

      const [dia, mes, ano] = diaObj.dia.split('/');
      const [hora, minuto] = horarioSelecionado.split(':');
      const horarioAPI = new Date(
        Number(ano),
        Number(mes) - 1,
        Number(dia),
        Number(hora),
        Number(minuto),
        0
      ).toISOString();

      const consultaData = {
        user_id: user.id,
        horario: horarioAPI,
      };

      console.log("AGENDAMENTO: Enviando dados para API:", consultaData);
      const response = await createConsulta(consultaData);
      console.log("AGENDAMENTO: Resposta da API:", response);

      Alert.alert('Sucesso', `Consulta agendada para o dia ${diaObj.dia} às ${horarioSelecionado}. Status: ${response.status}.`);
      
      setDiaSelecionadoId(null);
      setHorarioSelecionado(null);
      router.back();
    } catch (error: any) {
      console.error("AGENDAMENTO: Erro ao agendar consulta:", error);
      let errorMessage = 'Não foi possível agendar a consulta.';
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
    router.push('/screens/discente/solicitar-psicologo/historico-consultas');
  };

  const diaSelecionadoObj = diasDisponiveis.find(d => d.id === diaSelecionadoId);

  return (
    <ScrollView style={styles.scrollView}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* O header agora está completamente vazio, se não for mais usado */}
        <View style={styles.header}></View>

        <Text style={styles.sectionTitle}>Selecione o dia:</Text>
        {diasDisponiveis.map((dia) => (
          <TouchableOpacity
            key={dia.id}
            style={[
              styles.diaButton,
              diaSelecionadoId === dia.id && styles.diaButtonSelecionado,
            ]}
            onPress={() => handleSelecionarDia(dia.id)}
          >
            <Text style={styles.diaText}>{dia.dia}</Text>
          </TouchableOpacity>
        ))}

        {diaSelecionadoId && diaSelecionadoObj && (
          <>
            <Text style={styles.sectionTitle}>Horários disponíveis:</Text>
            <View style={styles.horariosContainer}>
              {diaSelecionadoObj.horarios.map((horario) => (
                <TouchableOpacity
                  key={horario}
                  style={[
                    styles.horarioButton,
                    horarioSelecionado === horario && styles.horarioSelecionado,
                  ]}
                  onPress={() => handleSelecionarHorario(horario)}
                >
                  <Text
                    style={[
                      styles.horarioText,
                      horarioSelecionado === horario && { color: '#fff' },
                    ]}
                  >
                    {horario}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* --- NOVA SEÇÃO PARA O ÍCONE DE HISTÓRICO E TEXTO --- */}
        <Pressable onPress={handleHistoricoPress} style={styles.historyLink}>
          <Ionicons name="time-outline" size={20} color="#3355ce" />
          <Text style={styles.historyText}>Meus Agendamentos</Text>
        </Pressable>

        {diaSelecionadoId && horarioSelecionado && (
          <TouchableOpacity style={styles.button} onPress={handleAgendar} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Agendar</Text>
            )}
          </TouchableOpacity>
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
    top: -33,
  },
  header: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
    fontFamily: 'Afacad-Regular',
    top: -21,
  },
  diaButton: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 10,
  },
  diaButtonSelecionado: {
    backgroundColor: '#cfd9ff',
  },
  diaText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Afacad-Regular',
  },
  horariosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  horarioButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  horarioSelecionado: {
    backgroundColor: '#3355ce',
  },
  horarioText: {
    color: '#333',
    fontFamily: 'Afacad-Regular',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#3355ce',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Afacad-Regular',
  },
  // --- NOVOS ESTILOS PARA O LINK DE HISTÓRICO ---
  historyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centraliza horizontalmente
    marginTop: 20, // Espaço acima dos horários
    paddingVertical: 10, // Um pouco de padding para a área clicável
  },
  historyText: {
    fontSize: 16,
    color: '#3355ce', // Cor para o texto "Livre"
    fontFamily: 'Afacad-Regular',
    marginLeft: 8, // Espaçamento entre o ícone e o texto
  },
});