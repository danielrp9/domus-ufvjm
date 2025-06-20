// C:\Users\danie\OneDrive\Área de Trabalho\domus-ufvjm\domus-ufvjm\app\screens\admin\_layout.tsx

import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack>
      {/* Suas outras telas de admin */}
      <Stack.Screen name="enviar-comprovante" options={{ headerShown: false }} />
      <Stack.Screen name="gerenciar-manutencao" options={{ headerShown: false }} />
      <Stack.Screen name="gerenciar-onibus" options={{ headerShown: false }} />
      <Stack.Screen name="gerenciar-pcs" options={{ headerShown: false }} />
      <Stack.Screen name="publicar-alertas" options={{ headerShown: false }} />
      <Stack.Screen name="publicar-documentos" options={{ headerShown: false }} />

      {/* Adicione estas linhas para suas telas de gerenciamento de usuários */}
      {/* O nome da tela é o caminho relativo dentro da pasta atual do layout */}
      <Stack.Screen name="gerenciar-usuarios/index" options={{ title: 'Gerenciar Usuários' }} />
      <Stack.Screen name="gerenciar-usuarios/editar-usuario" options={{ title: 'Editar Usuário' }} />
      <Stack.Screen name="gerenciar-usuarios/novo-usuario" options={{ title: 'Adicionar Usuário' }} />
    </Stack>
  );
}