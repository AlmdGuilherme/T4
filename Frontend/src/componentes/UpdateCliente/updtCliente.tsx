import { useEffect, useState } from "react";
import 'materialize-css/dist/css/materialize.min.css'
import { clientesApi } from "../../services/ClienteService";
import { Endereco, Telefone } from "../../types/Cliente";

interface telefoneInput {
  ddd: string;
  numero: string;
  links?: any[]
}

interface enderecoInput {
  id: number | null;
  links?: any[];
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  codigoPostal: string;
  informacoesAdicionais: string;
}

export interface clienteCadastro {
  nome: string;
  sobreNome: string;
  email?: string | null;
  endereco: enderecoInput;
  telefones: telefoneInput[];
}

interface clienteData {
  id: number;
  nome: string;
  sobreNome: string;
  email: string | null;
  endereco: Endereco;
  telefone: Telefone[];
  links: any[];
}

const UpdateCliente = () => {
  const [clientes, setClientes] = useState<clienteData[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<clienteData | null>(null);
  const [formData, setFormData] = useState<clienteCadastro | null>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      const fetchedClients = await clientesApi.getAllClients();
      if (fetchedClients) {
        setClientes(fetchedClients);
      } else {
        console.log('Não foi possível carregar os clientes');
      }
    };
    fetchClientes();
  }, []);

  useEffect(() => {
    if (clienteSelecionado) {
      setFormData({
        nome: clienteSelecionado.nome,
        sobreNome: clienteSelecionado.sobreNome,
        email: clienteSelecionado.email,
        endereco: { 
          ...clienteSelecionado.endereco, 
          id: clienteSelecionado.endereco.id !== undefined && clienteSelecionado.endereco.id !== null 
            ? clienteSelecionado.endereco.id 
            : clienteSelecionado.endereco.id 
        },
        telefones: []
      });
    }
  }, [clienteSelecionado]);

  const openModal = (cliente: clienteData) => {
    setClienteSelecionado(cliente);
    const modal = document.getElementById('clienteModal') as HTMLElement;
    if (modal) {
      modal.style.display = 'block';
    }
  };

  const closeModal = () => {
    const modal = document.getElementById('clienteModal') as HTMLElement;
    if (modal) {
      modal.style.display = 'none';
    }
    setClienteSelecionado(null);
    setFormData(null);
  };

  const enableEdit = (id: string) => {
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      input.removeAttribute('disabled');
      input.focus();
    }
  };

  const handleInputChange = (field: keyof clienteCadastro, value: string) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const handleEnderecoChange = (field: keyof enderecoInput, value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      endereco: { ...formData.endereco, [field]: value }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !clienteSelecionado) return;

    const payload = {
      id: clienteSelecionado.id,
      ...formData
    };

    const success = await clientesApi.atualizarCliente(payload);
    if (success) {
      alert('Cliente atualizado com sucesso!');
      closeModal();
      const updatedList = await clientesApi.getAllClients();
      if (updatedList) setClientes(updatedList);
    } else {
      alert('Erro ao atualizar cliente.');
    }
  };

  return (
    <div className="clienteList">
      {clientes.length === 0 ? (
        <p>Carregando clientes...</p>
      ) : (
        clientes.map(cliente => (
          <div className="clienteUpdate" key={cliente.id}>
            <div className="clienteInfo">
              <p>{cliente.nome}</p>
              <p>{cliente.sobreNome}</p>
            </div>
            <button className='btnUpdt' onClick={() => openModal(cliente)}>Atualizar informações</button>
          </div>
        ))
      )}

      <div id="clienteModal" className='modal'>
        <div className='modal-content'>
          <div className='modal-header'>
            <span className="close" onClick={closeModal}>&times;</span>
            <h4>Atualizar informações de {formData?.nome}</h4>
          </div>
          <div className='modal-body'>
            <form className='formUpdtCliente' onSubmit={handleSubmit}>
              {formData && (
                <>
                  <div className='cli-newInfos'>
                    <div className='input-infos'>
                      <label htmlFor="nome">Nome:</label>
                      <input id="nameInput" type="text" className="validate" value={formData.nome} onChange={e => handleInputChange('nome', e.target.value)} disabled />
                    </div>
                    <span className="editInfo" onClick={() => enableEdit('nameInput')}>&#9998;</span>
                  </div>

                  <div className='cli-newInfos'>
                    <div className='input-infos'>
                      <label htmlFor="Sobrenome">Sobrenome:</label>
                      <input id="sbNameInput" type="text" className="validate" value={formData.sobreNome} onChange={e => handleInputChange('sobreNome', e.target.value)} disabled />
                    </div>
                    <span className="editInfo" onClick={() => enableEdit('sbNameInput')}>&#9998;</span>
                  </div>

                  <div className='cli-newInfos'>
                    <div className='input-infos'>
                      <label htmlFor="Cidade">Cidade:</label>
                      <input id="cityInput" type="text" className="validate" value={formData.endereco.cidade} onChange={e => handleEnderecoChange('cidade', e.target.value)} disabled />
                    </div>
                    <span className="editInfo" onClick={() => enableEdit('cityInput')}>&#9998;</span>
                  </div>
                  <div className='cli-newInfos'>
                    <div className='input-infos'>
                      <label htmlFor="bairro">Bairro:</label>
                      <input id="bairroInput" type="text" className="validate" value={formData.endereco.bairro} onChange={e => handleEnderecoChange('bairro', e.target.value)} disabled />
                    </div>
                    <span className="editInfo" onClick={() => enableEdit('bairroInput')}>&#9998;</span>
                  </div>
                  <div className='cli-newInfos'>
                    <div className='input-infos'>
                      <label htmlFor="Estado">Estado:</label>
                      <input id="stateInput" type="text" className="validate" value={formData.endereco.estado} onChange={e => handleEnderecoChange('estado', e.target.value)} disabled />
                    </div>
                    <span className="editInfo" onClick={() => enableEdit('stateInput')}>&#9998;</span>
                  </div>

                  <div className='cli-newInfos'>
                    <div className='input-infos'>
                      <label htmlFor="Rua">Rua:</label>
                      <input id="streetInput" type="text" className="validate" value={formData.endereco.rua} onChange={e => handleEnderecoChange('rua', e.target.value)} disabled />
                    </div>
                    <span className="editInfo" onClick={() => enableEdit('streetInput')}>&#9998;</span>
                  </div>

                  <div className='cli-newInfos'>
                    <div className='input-infos'>
                      <label htmlFor="Número">Número:</label>
                      <input id="numberInput" type="text" className="validate" value={formData.endereco.numero} onChange={e => handleEnderecoChange('numero', e.target.value)} disabled />
                    </div>
                    <span className="editInfo" onClick={() => enableEdit('numberInput')}>&#9998;</span>
                  </div>

                  <div className='cli-newInfos'>
                    <div className='input-infos'>
                      <label htmlFor="CodigoPostal">Código Postal:</label>
                      <input id="cdPostalInput" type="text" className="validate" value={formData.endereco.codigoPostal} onChange={e => handleEnderecoChange('codigoPostal', e.target.value)} disabled />
                    </div>
                    <span className="editInfo" onClick={() => enableEdit('cdPostalInput')}>&#9998;</span>
                  </div>

                  <div className='cli-newInfos'>
                    <div className='input-infos'>
                      <label htmlFor="InformacaoAdicional">Informações Adicionais:</label>
                      <input id="addInfoInput" type="text" className="validate" value={formData.endereco.informacoesAdicionais} onChange={e => handleEnderecoChange('informacoesAdicionais', e.target.value)} disabled />
                    </div>
                    <span className="editInfo" onClick={() => enableEdit('addInfoInput')}>&#9998;</span>
                  </div>
                </>
              )}
              <button className="btnForm" type="submit">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCliente
