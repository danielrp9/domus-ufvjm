// app/services/api.ts

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import React from 'react';

// A URL base da sua API
// <<<<<<< ESTE É O IP CORRETO PARA TESTAR NO CELULAR FÍSICO COM EXPO GO >>>>>>>
const API_BASE_URL = 'http://10.180.9.1:8000'; // SEU IP DE REDE LOCAL

// Se for voltar a testar no NAVEGADOR DO PC ou EMULADOR, terá que mudar de volta para:
// const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});   

// --- O resto do código permanece EXATAMENTE o mesmo ---
export interface UserAPI {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

export const getUsers = async (): Promise<UserAPI[]> => {
  try {
    const response = await api.get('/users/');
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar utilizadores:", error);
    throw error;
  }
};

export const getUserById = async (userId: number): Promise<UserAPI> => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  }
  catch (error: any) {
    console.error(`Erro ao buscar utilizador ${userId}:`, error);
    throw error;
  }
};

export const createUser = async (userData: {
  nome: string;
  email: string;
  password?: string;
  tipo?: string;
}): Promise<UserAPI> => {
  try {
    const response = await api.post('/users/', userData);
    return response.data;
  } catch (error: any) {
    console.error("Erro na função createUser (api.ts):", error);
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

export const updateUser = async (userId: number, userData: {
  nome?: string;
  email?: string;
  tipo?: string;
  disabled?: boolean;
}): Promise<UserAPI> => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao atualizar utilizador ${userId}:`, error);
    throw error;
  }
};

export const deleteUser = async (userId: number): Promise<void> => {
  try {
    await api.delete(`/users/${userId}`);
  } catch (error: any) {
    console.error(`Erro na função deleteUser (api.ts) para userId ${userId}:`, error);
    throw error;
  }
};

interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  console.log("Chamando loginUser com email:", email);
  try {
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);

    const response = await api.post('/auth/login', form.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const access_token = 'simulated_jwt_token_for_' + email; // Simula um token
    const token_type = 'bearer';
    
    await AsyncStorage.setItem('userToken', access_token);
    console.log("Login bem-sucedido. Token guardado.");
    return { access_token, token_type };
    
  } catch (error: any) {
    console.error("Erro no loginUser (api.ts):", error);
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Credenciais inválidas.');
    }
    throw new Error('Erro de rede ou servidor ao tentar fazer login.');
  }
};

export const logoutUser = async () => {
  console.log("Chamando logoutUser.");
  try {
    await AsyncStorage.removeItem('userToken');
    console.log("Token de utilizador removido.");
  } catch (error) {
    console.error("Erro ao remover token de utilizador:", error);
  }
};

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
      console.warn("Requisição 401 Não Autorizado. Token pode estar inválido/expirado.");
      await logoutUser();
      Alert.alert("Sessão Expirada", "A sua sessão expirou. Por favor, faça login novamente.");
    }
    return Promise.reject(error);
  }
);
