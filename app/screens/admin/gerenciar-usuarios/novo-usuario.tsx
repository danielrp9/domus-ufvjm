// C:\Users\danie\OneDrive\Área de Trabalho\domus-ufvjm\domus-ufvjm\app\screens\admin\gerenciar-usuarios\novo-usuario.tsx

import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { createUser } from '../../../services/api';

export default function AdicionarUsuario() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    tipo: "morador",
    bloco: "",
    apartamento: "",
    curso: "",
    matricula: "",
    anoEntrada: "",
  });

  const [loading, setLoading] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    'Afacad-Regular': require('@/assets/fonts/Afacad-VariableFont_wght.ttf'),
    'Afacad-Italic': require('@/assets/fonts/Afacad-Italic-VariableFont_wght.ttf'),
    'BebasNeue-Regular': require('@/assets/fonts/BebasNeue-Regular.ttf'),
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCadastrar = async () => {
    // Validação básica no frontend antes de enviar
    if (!formData.nome || !formData.email || !formData.password) {
      Alert.alert("Erro de Validação", "Nome, email e senha são obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const userDataToSend = {
        nome: formData.nome,
        email: formData.email,
        password: formData.password,
        tipo: formData.tipo,
      };
      
      const newUser = await createUser(userDataToSend);
      Alert.alert("Sucesso", `Usuário ${newUser.nome} cadastrado com ID: ${newUser.id}`);
      setFormData({
        nome: "",
        email: "",
        password: "",
        tipo: "morador",
        bloco: "",
        apartamento: "",
        curso: "",
        matricula: "",
        anoEntrada: "",
      });
      router.back();
    } catch (error: any) { // Captura o erro re-lançado
      console.error("Erro ao cadastrar usuário (handleCadastrar):", error);
      let errorMessage = "Não foi possível cadastrar o usuário. Verifique os dados.";

      // --- MUDANÇA CRÍTICA AQUI ---
      if (error && Array.isArray(error.detail)) {
        // Se o erro for uma lista de detalhes de validação (do Pydantic do FastAPI)
        const validationErrors = error.detail.map((err: any) => {
          // err.loc é um array como ["body", "email"] ou ["body", "password"]
          // Pega o nome do campo se disponível (último elemento de err.loc)
          const fieldName = err.loc.length > 1 ? err.loc[err.loc.length - 1] : 'desconhecido';
          return `Campo '${fieldName}': ${err.msg}`;
        }).join("\n");
        errorMessage = `Erros de Validação:\n${validationErrors}`;
      } else if (error && error.detail) {
        // Se for um erro com um campo 'detail' geral (não uma lista de validação)
        errorMessage = `Erro: ${error.detail}`;
      } else if (error.message) {
        // Para outros tipos de erros (ex: Network Error se ainda ocorrer)
        errorMessage = `Erro: ${error.message}`;
      }
      // --- FIM DA MUDANÇA CRÍTICA ---

      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Cadastrar Novo Usuário</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange("nome", text)}
          value={formData.nome}
          placeholder="Digite o nome"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange("email", text)}
          value={formData.email}
          placeholder="Digite o email"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange("password", text)}
          value={formData.password}
          placeholder="Digite a senha"
          secureTextEntry
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tipo de Usuário</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange("tipo", text)}
          value={formData.tipo}
          placeholder="Digite o tipo (ex: morador, admin)"
        />
      </View>

      <Text style={styles.label}>Bloco (Local - Não enviado à API)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange("bloco", text)}
        value={formData.bloco}
        placeholder="Digite o bloco"
      />

      <Text style={styles.label}>Apartamento (Local - Não enviado à API)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange("apartamento", text)}
        value={formData.apartamento}
        placeholder="Digite o apartamento"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Curso (Local - Não enviado à API)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange("curso", text)}
        value={formData.curso}
        placeholder="Digite o curso"
      />

      <Text style={styles.label}>Matrícula (Local - Não enviado à API)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange("matricula", text)}
        value={formData.matricula}
        placeholder="Digite a matrícula"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Ano de Entrada (Local - Não enviado à API)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange("anoEntrada", text)}
        value={formData.anoEntrada}
        placeholder="Digite o ano de entrada"
        keyboardType="numeric"
      />

      <Pressable style={styles.button} onPress={handleCadastrar} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Ionicons name="person-add-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Cadastrar</Text>
          </>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 40,
    color: "#3355ce",
    marginBottom: 30,
    textAlign: "center",
    fontFamily: 'BebasNeue-Regular'
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontFamily: 'Afacad-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f9f9f9",
    fontFamily: 'Afacad-Regular',
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3355ce",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: 'Afacad-Regular',
    fontSize: 20
  },
});
