package com.example.beta_1_Bizti.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.annotation.UserConfigurations;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.beta_1_Bizti.models.Registro;
import com.example.beta_1_Bizti.repository.IRepositorioRegistro;

@Service 
public class ServiciosRegistros {

@Autowired 
private IRepositorioRegistro repositorioRegistro;
  
//Operaciones
//Guardar
public Registro guardarRegistro(Registro datosRegistro) {
  return this.repositorioRegistro.save(datosRegistro);

}

public List<Registro> buscar() {
  return this.repositorioRegistro.findAll();
}

public Registro modificar(UUID id, Registro datosNuevos) {

  Optional<Registro> registroBuscado = this.repositorioRegistro.findById(id);
  if (registroBuscado.isPresent()) {
    //Hay a quien actualizar
    Registro registroEncontrado = registroBuscado.get();

    //Modificando los datos
    registroEncontrado.setObservacion(datosNuevos.getObservacion());
    registroEncontrado.setEstado(datosNuevos.getEstado());

    // Guardo los datos

    return this.repositorioRegistro.save(registroEncontrado);

  } else {
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
  }
}


  public boolean eliminar(UUID id){
    Optional<Registro> registroBuscado = this.repositorioRegistro.findById(id);
    if (registroBuscado.isPresent()) {
      this.repositorioRegistro.deleteById(id);
      return true;
    }else{
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
    }
  }


}
