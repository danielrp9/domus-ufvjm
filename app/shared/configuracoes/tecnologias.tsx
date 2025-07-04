import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function TecnologiasScreen() {
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Tecnologias Utilizadas</Text>

        <View style={styles.techBox}>
          <View style={styles.iconRow}>
            <FontAwesome5 name="react" size={24} color="#3355ce" />
            <Text style={styles.techTitle}>React Native</Text>
          </View>
          <Text style={styles.techDescription}>
            Utilizado para o desenvolvimento do aplicativo mobile, permitindo criar aplicações nativas para Android e iOS com uma única base de código.
          </Text>
        </View>

        <View style={styles.techBox}>
          <View style={styles.iconRow}>
            <FontAwesome5 name="python" size={24} color="#3355ce" />
            <Text style={styles.techTitle}>Python</Text>
          </View>
          <Text style={styles.techDescription}>
            Linguagem de programação versátil, utilizada no back-end para construir a lógica de negócios, APIs robustas e processamento de dados.
          </Text>
        </View>

        <View style={styles.techBox}>
          <View style={styles.iconRow}>
            <FontAwesome5 name="github" size={24} color="#3355ce" />
            <Text style={styles.techTitle}>GitHub</Text>
          </View>
          <Text style={styles.techDescription}>
            Plataforma essencial para controle de versão e colaboração. Facilita o trabalho em equipe, o rastreamento de mudanças no código e a gestão do ciclo de desenvolvimento.
          </Text>
        </View>

        <View style={styles.techBox}>
          <View style={styles.iconRow}>
            <FontAwesome5 name="docker" size={24} color="#3355ce" />
            <Text style={styles.techTitle}>Container (Docker)</Text>
          </View>
          <Text style={styles.techDescription}>
            Tecnologia de conteinerização (ex: Docker) para empacotar a aplicação e suas dependências, garantindo ambientes de desenvolvimento, teste e produção consistentes e isolados.
          </Text>
        </View>

        <View style={styles.techBox}>
          <View style={styles.iconRow}>
            <FontAwesome5 name="cloud" size={24} color="#3355ce" />
            <Text style={styles.techTitle}>Cloudflare</Text>
          </View>
          <Text style={styles.techDescription}>
            Utilizado para otimização de performance, segurança de rede (CDN, proteção DDoS) e como proxy reverso, garantindo que a aplicação seja rápida e segura para os usuários.
          </Text>
        </View>

        <View style={styles.techBox}>
          <View style={styles.iconRow}>
            <FontAwesome5 name="js-square" size={24} color="#3355ce" />
            <Text style={styles.techTitle}>TypeScript</Text>
          </View>
          <Text style={styles.techDescription}>
            Superconjunto de JavaScript que adiciona tipagem estática. Melhora a manutenibilidade do código, a detecção de erros em tempo de desenvolvimento e a escalabilidade do projeto.
          </Text>
        </View>

        <View style={styles.techBox}>
          <View style={styles.iconRow}>
            <FontAwesome5 name="terminal" size={24} color="#3355ce" />
            <Text style={styles.techTitle}>Poetry</Text>
          </View>
          <Text style={styles.techDescription}>
            Ferramenta para gerenciamento de dependências e pacotes em projetos Python. Garante um ambiente de desenvolvimento limpo e reprodutível, facilitando a instalação e o empacotamento.
          </Text>
        </View>

        <View style={styles.techBox}>
          <View style={styles.iconRow}>
            <FontAwesome5 name="database" size={24} color="#3355ce" />
            <Text style={styles.techTitle}>PostgreSQL</Text>
          </View>
          <Text style={styles.techDescription}>
            Sistema de gerenciamento de banco de dados relacional robusto e de código aberto. Utilizado para armazenar e gerenciar os dados da aplicação de forma segura e eficiente.
          </Text>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F4F7FC', // Fundo mais suave
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 30, // Mais padding na parte inferior
  },
  container: {
    backgroundColor: '#F4F7FC',
    paddingHorizontal: 25, // Padding horizontal para as laterais
   paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 60,
    flex: 1,
  },
  pageTitle: {
    fontSize: 34, // Um pouco menor para melhor proporção
    color: '#2C3E50', // Cor mais escura e sóbria para o título
    fontFamily: 'BebasNeue-Regular',
    textAlign: 'center', // Centralizar o título
    marginBottom: 40,
    letterSpacing: 1, // Adicionar um pouco de espaçamento entre letras
  },
  techBox: {
    backgroundColor: '#FFFFFF', // Fundo branco para cada seção
    borderRadius: 10, // Bordas arredondadas
    padding: 20,
    marginBottom: 25, // Mais espaço entre as seções
    shadowColor: '#000', // Sombra suave para elevação
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // Sombra para Android
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  techTitle: {
    fontSize: 18,
    fontFamily: 'Afacad-Regular',
    fontWeight: 'bold',
    color: '#3355ce',
  },
  techDescription: {
    fontSize: 16,
    fontFamily: 'Afacad-Regular',
    color: '#495057', // Cor de texto geral, mais suave
    lineHeight: 24, // Melhorar legibilidade
  },
});