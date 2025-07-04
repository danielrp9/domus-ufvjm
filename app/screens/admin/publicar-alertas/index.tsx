// C:\Users\danie\OneDrive\Área de Trabalho\domus-ufvjm\domus-ufvjm\app\screens\admin\publicar-alertas\index.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react'; // Removido useFonts, SplashScreen, useCallback, useEffect
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View, ActivityIndicator, Alert } from 'react-native'; // Adicionado Alert, ActivityIndicator
import { createAviso } from '../../../services/api'; // Importar a função da API

// REMOVIDO: SplashScreen.preventAutoHideAsync(); // Gerenciado no _layout.tsx principal

export default function AlertasScreen() {
  const router = useRouter();
  // REMOVIDO: const [fontsLoaded, fontError] = useFonts({ ... });
  // REMOVIDO: onLayoutRootView, if (!fontsLoaded && !fontError) { return null; }
  // As fontes e o splash screen são gerenciados pelo _layout.tsx principal.

  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carregamento

  const handleEnviar = async () => { // Função agora é assíncrona
    // Validação básica do frontend
    if (!titulo.trim() || !mensagem.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o título e a mensagem do alerta.');
      return;
    }

    setLoading(true);
    try {
      const avisoData = {
        titulo: titulo.trim(),
        conteudo: mensagem.trim(), // A API espera 'conteudo'
      };
      
      console.log('ALERTAS: Enviando aviso para API:', avisoData); // DEBUG
      const response = await createAviso(avisoData); // Chama a API
      console.log('ALERTAS: Resposta da API:', response); // DEBUG

      Alert.alert('Sucesso', `Alerta "${response.titulo}" enviado com sucesso! ID: ${response.id}`);
      setTitulo('');
      setMensagem('');
      // router.back(); // Opcional: voltar para a tela anterior
    } catch (error: any) {
      console.error("ALERTAS: Erro ao enviar alerta:", error); // DEBUG
      let errorMessage = 'Não foi possível enviar o alerta.';
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

  const handleHistorico = () => {
    console.log('Abrir histórico de alertas');
    // Navega para a tela de histórico de alertas.
    // Assumimos que 'app/shared/alertas/index.tsx' será a tela de histórico.
    router.push('/shared/alertas'); 
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.pageTitle}>ALERTAS</Text>
            <Pressable onPress={handleHistorico} style={styles.iconButton}>
              <Ionicons name="time-outline" size={28} color="#3355ce" />
            </Pressable>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Título do Alerta</Text><TextInput // Removido espaço
            style={styles.input}
            placeholder="Digite o título do alerta"
            value={titulo}
            onChangeText={setTitulo}
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Mensagem</Text><TextInput // Removido espaço
            style={[styles.input, styles.multilineInput]}
            placeholder="Digite a mensagem do alerta"
            value={mensagem}
            onChangeText={setMensagem}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#888"
          />

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]}
            onPress={handleEnviar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Enviar Alerta</Text>
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
    paddingBottom: 50,
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
  },
  header: {
    marginBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: 32,
  },
  pageTitle: {
    fontSize: 40,
    color: '#3355ce',
    fontFamily: 'BebasNeue-Regular',
  },
  iconButton: {
    padding: 8,
  },
  formContainer: {
    top: 32,
    gap: 20,
  },
  label: {
    fontSize: 16,
    color: '#374151',
    fontFamily: 'Afacad-Regular',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontFamily: 'Afacad-Regular',
    fontSize: 16,
    color: '#374151',
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#3355ce',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonPressed: {
    backgroundColor: '#2a4ac5',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Afacad-Regular',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
