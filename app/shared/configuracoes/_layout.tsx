// C:\Users\danie\OneDrive\Área de Trabalho\domus-ufvjm\domus-ufvjm\app\shared\configuracoes\_layout.tsx

import { Stack } from 'expo-router';
// Não é necessário importar Text ou StyleSheet para títulos padrão aqui

export default function ConfiguracoesLayout() {
  return (
    <Stack>
      {/* Tela principal do grupo de configurações */}
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Configurações', 
          headerShown: true // Mostrar cabeçalho
          // Não há headerTitleStyle ou headerTitle aqui para manter o padrão
        }} 
      />
      
      {/* Telas específicas de configuração */}
      <Stack.Screen 
        name="termos-uso" 
        options={{ 
          title: 'Termos de Uso', 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="tecnologias" 
        options={{ 
          title: 'Tecnologias', 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="politica" 
        options={{ 
          title: 'Política de Privacidade', 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="licencas" 
        options={{ 
          title: 'Licenças', 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="fale-conosco" 
        options={{ 
          title: 'Fale Conosco', 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="equipe" 
        options={{ 
          title: 'Nossa Equipe', 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="central-ajuda" 
        options={{ 
          title: 'Central de Ajuda', 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="apoiadores" 
        options={{ 
          title: 'Apoiadores', 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="alterar-senha" 
        options={{ 
          title: 'Alterar Senha', 
          headerShown: false 
        }} 
      />
    
    </Stack>
  );
}
