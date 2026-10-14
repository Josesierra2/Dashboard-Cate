package com.example.beta_1_Bizti.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.beta_1_Bizti.models.Categoria;
import com.example.beta_1_Bizti.repository.IRepositorioCategoria;

@Service 
public class ServiciosCategoria {

    @Autowired 
        private IRepositorioCategoria repositorioCategoria;

    //Guardar 
    public Categoria guardCategoria(Categoria datosCategoria){
        return this.repositorioCategoria.save(datosCategoria);
        }

    public List<Categoria> buscar(){
        return this.repositorioCategoria.findAll();
        }

    public Categoria modificar(UUID id, Categoria datosNuevos){
        Optional<Categoria> categoriaBuscado=this.repositorioCategoria.findById(id);
        if(categoriaBuscado.isPresent()){
            //Actualizar
            Categoria categoriaEncontrado=categoriaBuscado.get();
            
            //Modificar
            categoriaEncontrado.setNombre(datosNuevos.getNombre());
            categoriaEncontrado.setDescripcion(datosNuevos.getDescripcion());

            //Guardar los cambios
            return 
                this.repositorioCategoria.save(categoriaEncontrado);
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Categoria no encontrada");
        }
    }

    public boolean eliminar(UUID id){
        Optional<Categoria> categoriaBuscado=this.repositorioCategoria.findById(id);
        if (categoriaBuscado.isPresent()){
            this.repositorioCategoria.deleteById(id);
            return true;

        }else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"No se encontro la Categoria");
        }
    }
}