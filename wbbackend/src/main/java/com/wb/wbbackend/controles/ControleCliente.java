package com.wb.wbbackend.controles;

import java.util.List;
import java.util.Optional; // Importar Optional

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.wb.wbbackend.atualizadores.AtualizadorCliente;
import com.wb.wbbackend.entidades.Cliente;
import com.wb.wbbackend.hateoas.HateoasCliente;
import com.wb.wbbackend.repositorios.RepositorioCliente;

// AQUI: A anotação CrossOrigin está correta para permitir credenciais da origem do frontend
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
public class ControleCliente {
    @Autowired
    private RepositorioCliente repositorio;
    @Autowired
    private HateoasCliente hateoas;
    @Autowired
    private AtualizadorCliente atualizador;

    @GetMapping("/cliente/{id}")
    public ResponseEntity<Cliente> obterCliente(@PathVariable Long id) {
        // Usar Optional para buscar o cliente de forma segura e evitar NoSuchElementException
        Optional<Cliente> clienteOptional = repositorio.findById(id);
        if (clienteOptional.isPresent()) {
            Cliente cliente = clienteOptional.get();
            hateoas.adicionarLink(cliente);
            // MUDANÇA CRÍTICA: Retornar HttpStatus.OK (200) em vez de HttpStatus.FOUND (302)
            return new ResponseEntity<Cliente>(cliente, HttpStatus.OK);
        } else {
            return new ResponseEntity<Cliente>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/clientes")
    public ResponseEntity<List<Cliente>> obterClientes() {
        List<Cliente> clientes = repositorio.findAll();
        // A lógica de adicionar links para uma lista inteira deve ser revisada no seu HateoasCliente
        // para garantir que adicione links a cada elemento da lista ou à coleção em si.
        // Por enquanto, mantenha como está, mas saiba que pode precisar de ajuste.
        hateoas.adicionarLink(clientes);
        // MUDANÇA CRÍTICA: Retornar HttpStatus.OK (200) em vez de HttpStatus.FOUND (302)
        return new ResponseEntity<List<Cliente>>(clientes, HttpStatus.OK);
    }

    @PutMapping("/cliente/atualizar")
    public ResponseEntity<?> atualizarCliente(@RequestBody Cliente atualizacao) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        // Usar findById para buscar o cliente e Optional para segurança
        Optional<Cliente> clienteOptional = repositorio.findById(atualizacao.getId());
        if (clienteOptional.isPresent()) {
            Cliente cliente = clienteOptional.get();
            atualizador.atualizar(cliente, atualizacao);
            repositorio.save(cliente);
            status = HttpStatus.OK;
        }
        return new ResponseEntity<>(status);
    }

    @PostMapping("/cliente/cadastrar")
    public ResponseEntity<?> cadastrarCliente(@RequestBody Cliente novo) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        if (novo != null) {
            repositorio.save(novo);
            status = HttpStatus.OK;
        }
        return new ResponseEntity<>(status);
    }

    @DeleteMapping("/cliente/excluir")
    public ResponseEntity<?> excluirCliente(@RequestBody Cliente exclusao) {
        // Usar findById para buscar o cliente e Optional para segurança
        Optional<Cliente> clienteOptional = repositorio.findById(exclusao.getId());
        if (clienteOptional.isEmpty()) { // Usar isEmpty() ou !isPresent() para verificar a ausência
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Ou HttpStatus.NOT_FOUND, dependendo da sua API
        } else {
            repositorio.delete(clienteOptional.get()); // Obtenha o cliente do Optional para deletar
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }
}