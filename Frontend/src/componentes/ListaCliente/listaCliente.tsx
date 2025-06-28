/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { clientesApi } from "../../services/ClienteService";
import 'materialize-css/dist/css/materialize.min.css';
import { clienteData } from "../../types/Cliente";

const ListaCliente = () => {
    const [clientes, setClientes] = useState<clienteData[]>([]);
    const [clienteSelecionado, setClienteSelecionado] = useState<clienteData | null>(null);

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
    };

    const deleteCliente = async (id: number) => {
        try {
            const success = await clientesApi.deleteCliente(id);
            if (success) {
                setClientes(prevClientes => prevClientes.filter(cliente => cliente.id !== id));
            } else {
                console.error(`Erro ao excluir o cliente.`);
            }
        } catch (error) {
            console.error(`Erro ao fazer requisição para excluir cliente: ${error}`);
        }
    };

    return (
        <div className="clienteList">
            {clientes.length === 0 ? (
                <p>Carregando...</p>
            ) : (
                clientes.map(cliente => (
                    <div className="cliente" id={`cli${cliente.id}`} key={cliente.id}>
                        <p>{cliente.nome} - {cliente.sobreNome}</p>
                        <div className='buttons-cliente'>
                            <button className='btnMore' onClick={() => openModal(cliente)}>Ver mais</button>
                            <button className='deleteCliente' onClick={() => deleteCliente(cliente.id)}>Deletar</button>
                        </div>
                    </div>
                ))
            )}
            <div id="clienteModal" className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h4>Informações do cliente: {clienteSelecionado?.nome} {clienteSelecionado?.sobreNome}</h4>
                    </div>
                    <div className="modal-body">
                        {clienteSelecionado ? (
                            <div className="personalInfos">
                                <div className="individualPInfos">
                                    <label htmlFor="nome">Nome: </label>
                                    <p>{clienteSelecionado.nome}</p>
                                </div>
                                <div className="individualPInfos">
                                    <label htmlFor="sobreNome">Sobrenome: </label>
                                    <p>{clienteSelecionado.sobreNome}</p>
                                </div>
                                <div className="individualPInfos">
                                    <label htmlFor="email">Email: </label>
                                    <p>{clienteSelecionado.email || 'N/A'}</p>
                                </div>
                                {clienteSelecionado.endereco && (
                                    <div className="address-info">
                                        <h5>Endereço:</h5>
                                        <div className="individualPInfos">
                                            <label htmlFor="rua">Rua: </label>
                                            <p>{clienteSelecionado.endereco.rua}, {clienteSelecionado.endereco.numero}</p>
                                        </div>
                                        <div className="individualPInfos">
                                            <label htmlFor="bairro">Bairro: </label>
                                            <p>{clienteSelecionado.endereco.bairro}</p>
                                        </div>
                                        <div className="individualPInfos">
                                            <label htmlFor="cidade">Cidade/Estado: </label>
                                            <p>{clienteSelecionado.endereco.cidade}, {clienteSelecionado.endereco.estado}</p>
                                        </div>
                                        <div className="individualPInfos">
                                            <label htmlFor="cep">CEP: </label>
                                            <p>{clienteSelecionado.endereco.codigoPostal}</p>
                                        </div>
                                        {clienteSelecionado.endereco.informacoesAdicionais && (
                                            <div className="individualPInfos">
                                                <label htmlFor="infoAdicionais">Informações Adicionais: </label>
                                                <p>{clienteSelecionado.endereco.informacoesAdicionais}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {clienteSelecionado.telefone && clienteSelecionado.telefone.length > 0 && (
                                    <div className="phonesGroup">
                                        <h5>Telefones:</h5>
                                        {clienteSelecionado.telefone.map((tel, index) => (
                                            <div className='individualPhone' key={tel.id || index}>
                                                <label htmlFor={`telefone-${index}`}>Telefone {index + 1}:</label>
                                                <p>({tel.ddd}) {tel.numero}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p>Nenhum cliente selecionado.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListaCliente;