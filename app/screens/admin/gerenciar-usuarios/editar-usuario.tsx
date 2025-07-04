// C:\Users\danie\OneDrive\Área de Trabalho\domus-ufvjm\domus-ufvjm\app\screens\admin\gerenciar-usuarios\editar-usuario.tsx

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View
} from "react-native";
import { getUserById, updateUser, UserAPI } from '../../../services/api';

export default function EditarUsuario() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    bloco: "",
    apartamento: "",
    curso: "",
    matricula: "",
    anoEntrada: "", // String para TextInput
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<UserAPI | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("DEBUG EDIT: useEffect: Iniciando fetchUserData.");
      setLoading(true);
      setError(null);
      
      if (id) {
        const userId = Number(id);
        console.log("DEBUG EDIT: useEffect: ID de utilizador recebido:", id, " (Convertido para número:", userId, ")");
        
        if (isNaN(userId)) {
          setError("ID de utilizador inválido.");
          Alert.alert("Erro", "ID de utilizador inválido para edição.");
          router.back();
          setLoading(false);
          return;
        }

        try {
          const user = await getUserById(userId); // Busca o utilizador da API
          console.log("DEBUG EDIT: useEffect: Dados do utilizador recebidos da API (user object):", user);
          
          setCurrentUser(user);

          setFormData({
            nome: user.nome || "",
            email: user.email || "",
            bloco: user.bloco || "",
            apartamento: user.apartamento || "",
            curso: user.curso || "",
            matricula: user.matricula || "",
            anoEntrada: user.ano_de_entrada ? String(user.ano_de_entrada) : "",
          });

          console.log("DEBUG EDIT: useEffect: formData preenchido (pode não refletir imediatamente no log):", formData); 

        } catch (err: any) {
          console.error("DEBUG EDIT: useEffect: Erro ao buscar utilizador para edição:", err);
          if (err.response && err.response.status === 404) {
            setError("Utilizador não encontrado.");
            Alert.alert("Erro", "Utilizador não encontrado para edição.");
          } else {
            setError("Não foi possível carregar os dados do utilizador.");
            Alert.alert("Erro", "Erro ao carregar dados do utilizador. Verifique a sua ligação ou o ID.");
          }
          router.back();
        } finally {
          setLoading(false);
          console.log("DEBUG EDIT: useEffect: Carregamento finalizado.");
        }
      } else {
        console.log("DEBUG EDIT: useEffect: ID do utilizador não fornecido.");
        setError("ID do utilizador não fornecido.");
        Alert.alert("Erro", "ID do utilizador não fornecido para edição.");
        router.back();
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, router]);

  const handleChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userId = Number(id);
      const dataToUpdate = {
        nome: formData.nome,
        email: formData.email,
        bloco: formData.bloco,
        apartamento: formData.apartamento,
        curso: formData.curso,
        matricula: formData.matricula,
        ano_de_entrada: formData.anoEntrada ? Number(formData.anoEntrada) : undefined,
      };
      console.log("DEBUG EDIT: handleSave: Enviando dados para PUT:", dataToUpdate);
      const updatedUser = await updateUser(userId, dataToUpdate);
      console.log("DEBUG EDIT: handleSave: Utilizador atualizado no backend:", updatedUser);
      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
      
      router.replace('/screens/admin/gerenciar-usuarios'); 

    } catch (err) {
      console.error("DEBUG EDIT: Erro ao guardar alterações:", err);
      Alert.alert("Erro", "Não foi possível guardar as alterações.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3355ce" />
        <Text style={styles.loadingText}>A carregar dados do utilizador...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro: Não foi possível carregar os dados do utilizador para edição.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Utilizador</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput 
        style={styles.input}
        key={currentUser.id + '-name-input'}
        value={formData.nome}
        onChangeText={(text) => handleChange("nome", text)}
        placeholder="Nome"
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput 
        style={styles.input}
        key={currentUser.id + '-email-input'}
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        placeholder="E-mail"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Bloco</Text>
      <TextInput 
        style={styles.input}
        key={currentUser.id + '-bloco-input'}
        value={formData.bloco}
        onChangeText={(text) => handleChange("bloco", text)}
        placeholder="Bloco"
      />
      <Text style={styles.label}>Apartamento</Text>
      <TextInput 
        style={styles.input}
        key={currentUser.id + '-apartamento-input'}
        value={formData.apartamento}
        onChangeText={(text) => handleChange("apartamento", text)}
        placeholder="Apartamento"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Curso</Text>
      <TextInput 
        style={styles.input}
        key={currentUser.id + '-curso-input'}
        value={formData.curso}
        onChangeText={(text) => handleChange("curso", text)}
        placeholder="Curso"
      />
      <Text style={styles.label}>Matrícula</Text>
      <TextInput 
        style={styles.input}
        key={currentUser.id + '-matricula-input'}
        value={formData.matricula}
        onChangeText={(text) => handleChange("matricula", text)}
        placeholder="Matrícula"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Ano de Entrada</Text>
      <TextInput 
        style={styles.input}
        key={currentUser.id + '-anoEntrada-input'}
        value={formData.anoEntrada}
        onChangeText={(text) => handleChange("anoEntrada", text)}
        placeholder="Ano de Entrada"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "A guardar..." : "Guardar Alterações"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Afacad-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Afacad-Regular',
  },
  title: {
    fontSize: 40,
    marginBottom: 24,
    textAlign: "center",
    fontFamily: 'BebasNeue-Regular',
    color: '#3355ce',
    top: 29,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
    marginTop: 12,
    fontFamily: 'Afacad-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
    fontFamily: 'Afacad-Regular',
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
