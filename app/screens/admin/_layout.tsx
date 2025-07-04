// C:\Users\danie\OneDrive\Área de Trabalho\domus-ufvjm\domus-ufvjm\app\screens\admin\_layout.tsx

import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack>
      {/* Suas outras telas de admin */}
      <Stack.Screen name="enviar-comprovante/index" options={{ headerShown: false }} />
      <Stack.Screen name="gerenciar-manutencao/index" options={{ title: 'Gerenciar Manutenções' }} />
      <Stack.Screen name="gerenciar-onibus/index" options={{ title: 'Gerenciar horários do Ônibus' }} />
      <Stack.Screen name="gerenciar-onibus/editar" options={{ title: 'Editar Horários do Ônibus' }} />
      <Stack.Screen name="gerenciar-pcs/index" options={{ title: 'Gerenciar Computadores'}} />
       <Stack.Screen name="gerenciar-pcs/editar" options={{ title: 'Editar Computadores'}} />
      <Stack.Screen name="publicar-alertas/index" options={{ headerShown: false }} />
      <Stack.Screen name="publicar-documentos/index" options={{ headerShown: false }} />

      {/* Rotas de gerenciamento de usuários */}
      <Stack.Screen name="gerenciar-usuarios/index" options={{ headerShown: false }} />
      <Stack.Screen name="gerenciar-usuarios/editar-usuario" options={{ headerShown: false}} />
      <Stack.Screen name="gerenciar-usuarios/novo-usuario" options={{ headerShown: false }} />

      {/* <<<<< NOVO: Adicionar a tela de Gerenciar Consultas >>>>> */}
      <Stack.Screen name="gerenciar-consultas/index" options={{ title: 'Gerenciar Consultas' }} />
    </Stack>
  );
}
