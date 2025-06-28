import { Component } from "react";
import BarraNavegacao from "../Navbar/barraNavegacao";
import FormularioCadastroCliente from "../Form/formularioCadastroCliente";
import ListaCliente from "../ListaCliente/listaCliente";
import UpdateCliente from "../UpdateCliente/updtCliente";

type state = {
    tela: string
}

export default class Roteador extends Component<{}, state> {
    constructor(props: {} | Readonly<{}>) {
        super(props)
        this.state = {
            tela: 'Lista de Clientes'
        }
        this.selecionarView = this.selecionarView.bind(this)
    }

    selecionarView(novaTela: string, evento: Event) {
        evento.preventDefault()
        console.log(novaTela);
        this.setState({
            tela: novaTela
        })
    }

    render() {
        let barraNavegacao = <BarraNavegacao seletorView={this.selecionarView} tema="indigo darken-4" botoes={['Lista de Clientes', 'Cadastro de Clientes', 'Atualizar Informações']} />
        if (this.state.tela === 'Lista de Clientes') {
            return (
                <>
                    {barraNavegacao}
                    <ListaCliente />
                </>
            )
        } else if (this.state.tela === 'Cadastro de Clientes') {
            return (
                <>
                    {barraNavegacao}
                    <FormularioCadastroCliente tema="indigo ligthen-3" />
                </>
            )
        } else {
            return(
                <>
                {barraNavegacao}
                <UpdateCliente/>
                </>
            )
        }

    }
}