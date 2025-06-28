export interface Telefone {
    id?: number | null;
    ddd: string;
    numero: string;
    links?: any[]
}

export interface Endereco {
    id: number | null;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
    codigoPostal: string;
    informacoesAdicionais: string;
    links?: any[]
}


export interface clienteData {
    id: number;
    nome: string;
    sobreNome: string;
    email: string|null;
    cpf: null;
    rg: null;
    endereco: Endereco;
    telefone: Telefone[];
    links: any[]
}

export interface clienteCadastroData {
  nome: string;
  sobreNome: string;
  email?: string | null;
  endereco: Endereco;
  telefones: Telefone[]
}

export interface clienteUpdateData {
    id: number;
    nome: string;
    sobreNome: string;
    email?: string|null;
    endereco: Endereco;
    telefones: Telefone[]
}