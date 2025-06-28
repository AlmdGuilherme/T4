import React, { useState } from "react";
import { clientesApi } from "../../services/ClienteService";
import { clienteCadastroData } from "../../types/Cliente";

interface telefoneInput {
    ddd: string;
    numero: string;
}

interface enderecoInput {
    id?: string | null;
    links?: any;
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
    telefones: telefoneInput[]
}

type Props = {
    tema: string;
}

const FormularioCadastroCliente = ({ tema }: Props) => {

    const [formData, setFormData] = useState<clienteCadastro>({
        nome: '',
        sobreNome: '',
        email: '',
        endereco: {
            estado: '',
            cidade: '',
            bairro: '',
            rua: '',
            numero: '',
            codigoPostal: '',
            informacoesAdicionais: ''
        },
        telefones: [{ ddd: '', numero: '' }],
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const data = new FormData(form);

        const clienteParaCadastro: clienteCadastroData = {
            nome: data.get('nomeCliente') as string,
            sobreNome: data.get('sobreNome') as string,
            email: data.get('email') as string || null,
            endereco: {
                id: null,
                links: [],
                estado: data.get('Estado') as string,
                cidade: data.get('Cidade') as string,
                bairro: data.get('Bairro') as string || '',
                rua: data.get('Rua') as string,
                numero: data.get('Numero') as string,
                codigoPostal: data.get('CodigoPostal') as string,
                informacoesAdicionais: data.get('InformacoesAdicionais') as string,
            },
            telefones: []
        };
        
        const success = await clientesApi.cadastrarCliente(clienteParaCadastro);

        if (success) {
            alert('Cliente cadastrado com sucesso!');
            form.reset();
        } else {
            alert('Falha ao cadastrar cliente. Verifique o console do navegador e o log do backend para mais detalhes.');
        }
    };

    return (
        <div className='formCliente'>
            <form className="formInfos" onSubmit={handleSubmit}>
                <div className='cliInfos'>
                    <div>
                        <label className='infoLbl' htmlFor="nomeCliente">Nome:</label>
                        <input id="nomeCliente" name="nomeCliente" type="text" className="validate" />
                    </div>
                    <div>
                        <label className='infoLbl' htmlFor="sobreNome">Sobrenome:</label>
                        <input id="sobreNome" name="sobreNome" type="text" className="validate" />
                    </div>
                    <div>
                        <label className='infoLbl' htmlFor="Cidade">Cidade:</label>
                        <input id="Cidade" name="Cidade" type="text" className="validate" />
                    </div>
                    
                    <div className="cli-newInfos datesDiv">
                        <div>
                            <label className="infoLbl" htmlFor="Estado">Estado:</label>
                            <input id="Estado" name="Estado" type="text" className="validate" />
                        </div>
                        <div>
                            <label className='infoLbl' htmlFor="Rua">Rua:</label>
                            <input id="Rua" name="Rua" type="text" className="validate" />
                        </div>
                        <div>
                            <label className='infoLbl' htmlFor="Numero">Numero:</label>
                            <input id="Numero" name="Numero" type="text" className="validate" />
                        </div>
                    </div>
                    <div className="cli-newInfos datesDiv">
                        <div>
                            <label className='infoLbl' htmlFor="CodigoPostal">Codigo Postal:</label>
                            <input id="CodigoPostal" name="CodigoPostal" type="text" className="validate" />
                        </div>
                        <div>
                            <label className='infoLbl' htmlFor="InformacoesAdicionais">Informações Adicionais:</label>
                            <input id="InformacoesAdicionais" name="InformacoesAdicionais" type="text" className="validate" />
                        </div>
                    </div>
                </div>
                <button className='btnForm' type="submit" name="action">Submit
                    <i className="material-icons right">send</i>
                </button>
            </form>
        </div>
    );
}

export default FormularioCadastroCliente;