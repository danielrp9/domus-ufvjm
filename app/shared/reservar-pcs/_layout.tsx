// C:\Users\danie\OneDrive\Área de Trabalho\domus-ufvjm\domus-ufvjm\app\shared\reservar-pcs\_layout.tsx

import { Stack } from 'expo-router';

export default function ReservarPcsLayout() {
  return (
    <Stack>
      {/* A tela principal do grupo, ex: lista de PCs disponíveis ou menu de reserva */}
      <Stack.Screen name="index" options={{ title: 'Reservar PCs' }} />
      
      {/* As telas específicas para cada PC */}
      <Stack.Screen name="pc-a1" options={{ title: 'PC A1', headerShown: false }} />
      <Stack.Screen name="pc-a2" options={{ title: 'PC A2', headerShown: false }} />
      <Stack.Screen name="pc-a3" options={{ title: 'PC A3', headerShown: false }} />
      <Stack.Screen name="pc-a4" options={{ title: 'PC A4', headerShown: false }} />
      <Stack.Screen name="pc-a5" options={{ title: 'PC A5', headerShown: false }} />

      {/* Adicione outras telas relacionadas à reserva de PCs aqui, se houver */}
    </Stack>
  );
}
