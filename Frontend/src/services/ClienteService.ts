import { response } from "express";
import { clienteData, clienteCadastroData, clienteUpdateData } from "../types/Cliente";

const API_URL = 'http://localhost:32832';

export const clientesApi = {
    getAllClients: async (): Promise<clienteData[] | null> => {
        try {
            const response = await fetch(`${API_URL}/clientes`, {
                credentials: 'include'
            });
            if (!response.ok) {
                console.error(`HTTP Error! Status: ${response.status} - ${response.statusText}`);
                return null;
            }
            const data: clienteData[] = await response.json();
            return data;
        } catch (error) {
            console.error(`Erro ao buscar clientes: ${error}`);
            return null;
        }
    },
    deleteCliente: async (id: number): Promise<boolean> => {
        try {
            const response = await fetch(`${API_URL}/cliente/excluir`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });
            return response.ok;
        } catch (error) {
            console.error(`Erro ao fazer requisição para excluir cliente: ${error}`);
            return false;
        }
    },
    cadastrarCliente: async (clienteData: clienteCadastroData): Promise<boolean> => {
      try{
        const response = await fetch(`${API_URL}/cliente/cadastrar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Credentials': 'true'
          },
          body: JSON.stringify(clienteData)
        })
        if (response.ok) {
          return true
        } else {
          const error = await response.text()
          console.error(`Erro ao cadastrar cliente: ${response.status} - ${response.statusText}`, error)
          return false
        }
      } catch (error) {
        console.error(`Erro na requisição de cadastro: ${error}`)
        return false
      }
    },
    atualizarCliente: async (clienteData: clienteUpdateData): Promise<boolean> => {
      try{
        const response = await fetch(`${API_URL}/cliente/atualizar`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Credentials': 'true'
          },
          body: JSON.stringify(clienteData)
        });
        if (response.ok){
          return true
        } else {
          const error = await response.text()
          console.error(`Erro ao atualizar cliente: ${response.status} - ${response.statusText}`, error)
          return false
        }
      } catch (error) {
        console.error(`Erro na requisição de atualização: ${error}`)
        return false
      }
    }
};