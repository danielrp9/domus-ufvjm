// app/services/api.ts

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import React from 'react';

// A URL base da sua API
//const API_BASE_URL = 'https://domus.lat'
const API_BASE_URL = 'http://10.180.9.1:8000'; // Ajuste conforme seu ambiente (IP para celular, localhost para PC)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interfaces para a API ---
export interface UserAPI {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  bloco: string | null;
  apartamento: string | null;
  curso: string | null;
  matricula: string | null;
  ano_de_entrada: number | null;
}

export interface ManutencaoAPI {
  id: number;
  tipo_solicitacao: string;
  descricao: string;
  status: string;
  user_id: number;
}

export interface ConsultaResponse {
  id: number;
  user_id: number;
  horario: string;
  status: string;
}

export interface AvisoAPI {
  id: number;
  titulo: string;
  conteudo: string;
  data_publicacao: string;
}

interface AuthResponse {
  user: UserAPI;
  access_token: string;
  token_type: string;
}

// --- Funções de CRUD para Usuários ---
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
  bloco?: string | null;
  apartamento?: string | null;
  curso?: string | null;
  matricula?: string | null;
  ano_de_entrada?: number | null;
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
  nome?: string | null;
  email?: string | null;
  tipo?: string | null;
  disabled?: boolean;
  bloco?: string | null;
  apartamento?: string | null;
  curso?: string | null;
  matricula?: string | null;
  ano_de_entrada?: number | null;
}): Promise<UserAPI> => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao atualizar utilizador ${userId}:`, error);
    if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.detail || `Erro ao atualizar utilizador: ${error.response.status}`);
    }
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

export const createManutencao = async (solicitacaoData: {
  user_id: number;
  descricao: string;
}): Promise<ManutencaoAPI> => {
  console.log("MANUTENCAO API: Enviando POST para /solicitacoes/manutencao com dados:", solicitacaoData);
  try {
    const response = await api.post('/solicitacoes/manutencao', solicitacaoData); 
    console.log("MANUTENCAO API: Resposta de sucesso:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("MANUTENCAO API: Erro ao criar solicitação de manutenção:", error);
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Erro desconhecido ao solicitar manutenção.');
    }
    throw new Error('Erro de rede ou servidor ao tentar solicitar manutenção.');
  }
};

export const getManutencoes = async (): Promise<ManutencaoAPI[]> => {
  console.log("MANUTENCAO ADMIN API: Buscando todas as solicitações.");
  try {
    const response = await api.get('/solicitacoes/manutencao'); 
    console.log("MANUTENCAO ADMIN API: Resposta de todas as solicitações:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("MANUTENCAO ADMIN API: Erro ao buscar todas as solicitações:", error);
    throw error;
  }
};

export const updateManutencaoStatus = async (manutencaoId: number, newStatus: string): Promise<ManutencaoAPI> => {
  console.log(`MANUTENCAO ADMIN API: Atualizando status para solicitação ${manutencaoId} para ${newStatus}.`);
  try {
    const response = await api.put(`/solicitacoes/manutencao/${manutencaoId}/status`, { status: newStatus }); 
    console.log("MANUTENCAO ADMIN API: Resposta de atualização:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`MANUTENCAO ADMIN API: Erro ao atualizar status da solicitação ${manutencaoId}:`, error);
    if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.detail || `Erro ao atualizar status: ${error.response.status}`);
    }
    throw error;
  }
};

export const getManutencoesByUserId = async (userId: number): Promise<ManutencaoAPI[]> => {
  console.log(`MANUTENCAO DISCENTE API: Buscando solicitações para o utilizador ${userId}.`);
  try {
    const response = await api.get(`/solicitacoes/manutencao`, { params: { user_id: userId } });
    console.log("MANUTENCAO DISCENTE API: Resposta do histórico:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`MANUTENCAO DISCENTE API: Erro ao buscar histórico para utilizador ${userId}:`, error);
    if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.detail || `Erro ao buscar histórico: ${error.response.status}`);
    }
    throw new Error('Erro de rede ou servidor ao tentar buscar histórico.');
  }
};

// --- Funções de Agendamento de Consulta (Psicóloga) ---
export const createConsulta = async (consultaData: {
  user_id: number;
  horario: string;
}): Promise<ConsultaResponse> => {
  console.log("CONSULTA API: Enviando POST para /solicitacoes/consultas com dados:", consultaData);
  try {
    const response = await api.post('/solicitacoes/consultas', consultaData); 
    console.log("CONSULTA API: Resposta de sucesso:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("CONSULTA API: Erro ao criar consulta:", error);
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Erro desconhecido ao agendar consulta.');
    }
    throw new Error('Erro de rede ou servidor ao tentar agendar consulta.');
  }
};

export const getConsultas = async (): Promise<ConsultaResponse[]> => {
  console.log("CONSULTA API: Buscando todas as consultas.");
  try {
    const response = await api.get('/solicitacoes/consultas');
    console.log("CONSULTA API: Resposta de todas as consultas:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("CONSULTA API: Erro ao buscar consultas:", error);
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Erro desconhecido ao buscar consultas.');
    }
    throw new Error('Erro de rede ou servidor ao tentar buscar consultas.');
  }
};

export const getConsultasByUserId = async (userId: number): Promise<ConsultaResponse[]> => { // <<<<< ADICIONADO: Função para buscar consultas por User ID
  console.log(`CONSULTA API: Buscando consultas para o utilizador ${userId}.`);
  try {
    const response = await api.get(`/solicitacoes/consultas/user/${userId}`); // Endpoint específico
    console.log("CONSULTA API: Resposta de consultas por utilizador:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`CONSULTA API: Erro ao buscar consultas para o utilizador ${userId}:`, error);
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Erro desconhecido ao buscar consultas por utilizador.');
    }
    throw new Error('Erro de rede ou servidor ao tentar buscar consultas por utilizador.');
  }
};

// --- Funções de Avisos ---
export const createAviso = async (avisoData: {
  titulo: string;
  conteudo: string;
}): Promise<AvisoAPI> => {
  console.log("AVISOS API: Enviando POST para /admin/avisos/ com dados:", avisoData);
  try {
    const response = await api.post('/admin/avisos/', avisoData); 
    console.log("AVISOS API: Resposta de sucesso:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("AVISOS API: Erro ao criar aviso:", error);
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Erro desconhecido ao criar aviso.');
    }
    throw new Error('Erro de rede ou servidor ao tentar criar aviso.');
  }
};

export const getAvisos = async (): Promise<AvisoAPI[]> => {
  console.log("AVISOS API: Buscando todos os avisos.");
  try {
    const response = await api.get('/admin/avisos/'); 
    console.log("AVISOS API: Resposta de todos os avisos:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("AVISOS API: Erro ao buscar avisos:", error);
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Erro desconhecido ao buscar avisos.');
    }
    throw new Error('Erro de rede ou servidor ao tentar buscar avisos.');
  }
};

// --- Funções de Autenticação ---
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
    
    const loggedInUser: UserAPI = response.data;
    const access_token = 'simulated_jwt_token_for_' + loggedInUser.email;
    const token_type = 'bearer';
    
    await AsyncStorage.setItem('userToken', access_token);
    await AsyncStorage.setItem('userData', JSON.stringify(loggedInUser));
    console.log("Login bem-sucedido. Token e dados do utilizador guardados.");
    
    return { user: loggedInUser, access_token, token_type };
    
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
    await AsyncStorage.removeItem('userData');
    console.log("Token e dados do utilizador removidos.");
  } catch (error) {
    console.error("Erro ao remover token e dados do utilizador:", error);
  }
};

// --- Interceptor do Axios ---
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

export default {};
