// C:\Users\danie\OneDrive\Área de Trabalho\domus-ufvjm\domus-ufvjm\app\screens\discente\_layout.tsx

import { Stack } from 'expo-router';

export default function DiscenteLayout() {
  return (
    <Stack>
      {/* Suas outras telas de discente */}
      <Stack.Screen name="horarios-onibus" options={{ headerShown: false }} />
      <Stack.Screen name="solicitar-documentos" options={{ headerShown: false }} />
      {/* <Stack.Screen name="solicitar-psicologo" options={{ headerShown: false }} /> // Se esta linha já existia, pode ser redundante */}
      
      {/* Rotas para o menu de manutenção e os formulários específicos */}
      <Stack.Screen name="solicitar-manutencao/index" options={{ title: 'Solicitar Manutenção' }} />
      <Stack.Screen name="solicitar-manutencao/formsManutencaoEletrica" options={{ title: 'Manutenção Elétrica' }} />
      <Stack.Screen name="solicitar-manutencao/formsManutencaoEstrutural" options={{ title: 'Manutenção Estrutural' }} />
      <Stack.Screen name="solicitar-manutencao/formsManutencaoHidraulica" options={{ title: 'Manutenção Hidráulica' }} />
      <Stack.Screen name="solicitar-manutencao/formsManutencaoInternet" options={{ title: 'Manutenção de Internet' }} />
      <Stack.Screen name="solicitar-manutencao/formsManutencaoPC" options={{ title: 'Manutenção em PCs' }} />
      <Stack.Screen name="solicitar-manutencao/historico-manutencao" options={{ title: 'Histórico Manutenção' }} />
      <Stack.Screen name="solicitar-psicologo/historico-consultas" options={{ title: 'Meus Agendamentos' }} />
      <Stack.Screen name="solicitar-psicologo/index" options={{ title: 'Agendar Consulta' }} />
      <Stack.Screen name="horarios-onibus/index" options={{ title: 'Horários do Ônibus' }} />
      <Stack.Screen name="solicitar-documentos/index" options={{ title: 'Solicitar Documentos' }} />
      <Stack.Screen name="solicitar-documentos/historico-documentos" options={{ title: 'Solicitar Documentos' }} />
      
    

     


    </Stack>
  );
}
