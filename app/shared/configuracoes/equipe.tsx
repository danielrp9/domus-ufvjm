import React from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function EquipeScreen() {
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Equipe de Desenvolvimento</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Docente Responsável</Text>
          <View style={styles.memberContainer}>
            <Text style={styles.memberName}>Kattiana Constantino</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipe de Gestão (Disciplina de GPS)</Text>
          <View style={styles.memberContainer}>
            <Text style={styles.memberName}>
              Victor Amorim <Text style={styles.memberRole}>(Líder Técnico)</Text>
            </Text>
          </View>
          <View style={styles.memberContainer}>
            <Text style={styles.memberName}>
              Mariana Morais <Text style={styles.memberRole}>(Product Owner)</Text>
            </Text>
          </View>
          <View style={styles.memberContainer}>
            <Text style={styles.memberName}>
              Jhonathan Santos <Text style={styles.memberRole}>(Gerente Geral)</Text>
            </Text>
          </View>
          <View style={styles.memberContainer}>
            <Text style={styles.memberName}>
              Ian Carlos <Text style={styles.memberRole}>(Analista de Processos)</Text>
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipe Técnica (Engenharia de Software)</Text>
          <View style={styles.memberContainer}>
            <Text style={styles.memberName}>
              Daniel Rodrigues <Text style={styles.memberRole}>(UI/UX, Full-Stack e Engenharia de Requisitos)</Text>
            </Text>
          </View>
          <View style={styles.memberContainer}>
            <Text style={styles.memberName}>
              Iasmin Torres <Text style={styles.memberRole}>(Front-end e UI/UX)</Text>
            </Text>
          </View>
          <View style={styles.memberContainer}>
            <Text style={styles.memberName}>
              Thais Daniela <Text style={styles.memberRole}>(Engenharia de Requisitos)</Text>
            </Text>
          </View>
          <View style={styles.memberContainer}>
            <Text style={styles.memberName}>
              Leonardo Soares <Text style={styles.memberRole}>(Back-end)</Text>
            </Text>
          </View>
          <View style={styles.memberContainer}>
            <Text style={styles.memberName}>
              André Leite <Text style={styles.memberRole}>(Back-end)</Text>
            </Text>
          </View>
          <View style={styles.memberContainer}>
            <Text style={styles.memberName}>
              Lavinia Charrua <Text style={styles.memberRole}>(Back-end)</Text>
            </Text>
          </View>
          <View style={styles.memberContainer}>
            <Text style={styles.memberName}>
              Kaique Vieira <Text style={styles.memberRole}>(DevSecOps)</Text>
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    // Fundo mais suave e consistente com a tela de tecnologias
    backgroundColor: '#F4F7FC', 
  },
  scrollViewContent: {
    flexGrow: 1,
    // Mais padding na parte inferior
    paddingBottom: 30, 
  },
  container: {
    // Fundo consistente
    backgroundColor: '#F4F7FC',
    // Padding horizontal para as laterais
    paddingHorizontal: 25, 
    flex: 1,
    justifyContent: 'flex-start',
    // Ajuste para iOS e Android, consistente com a outra tela
   paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 60, 
  },
  pageTitle: {
    // Um pouco menor para melhor proporção, consistente
    fontSize: 34, 
    // Cor mais escura e sóbria para o título, consistente
    color: '#2C3E50', 
    fontFamily: 'BebasNeue-Regular',
    // Centralizar o título, consistente
    textAlign: 'center', 
    marginBottom: 40,
    // Adicionar um pouco de espaçamento entre letras, consistente
    letterSpacing: 1, 
  },
  section: {
    // Fundo branco para cada seção, consistente
    backgroundColor: '#FFFFFF', 
    // Bordas arredondadas, consistente
    borderRadius: 10, 
    padding: 20,
    // Mais espaço entre as seções, consistente
    marginBottom: 25, 
    // Sombra suave para elevação, consistente
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Sombra para Android, consistente
    elevation: 3, 
  },
  sectionTitle: {
    fontSize: 20,
    // Cor mais escura para títulos de seção, consistente
    color: '#34495E', 
    fontFamily: 'Afacad-Regular',
    // Mais espaço após o título da seção, consistente
    marginBottom: 15, 
    // Deixar mais negrito, consistente
    fontWeight: '700', 
    // Linha abaixo do título da seção, consistente
    borderBottomWidth: 1, 
    // Cor da linha, consistente
    borderBottomColor: '#ECEFF1', 
    paddingBottom: 10,
  },
  memberContainer: {
    // Espaçamento entre cada membro, consistente
    marginBottom: 8, 
  },
  memberName: {
    fontSize: 16,
    // Cor de texto geral, consistente
    color: '#495057', 
    fontFamily: 'Afacad-Regular',
    // Melhorar legibilidade, consistente
    lineHeight: 24, 
  },
  memberRole: {
    // Tom de azul ligeiramente diferente e mais suave, consistente
    color: '#537DC4', 
    fontFamily: 'Afacad-Regular',
    // Papel mais destacado, consistente
    fontWeight: '600', 
  },
});