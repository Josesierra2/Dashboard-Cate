package com.example.beta_1_Bizti.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.beta_1_Bizti.models.Empresa;

@Repository 
public interface iRepositorioEmpresa extends JpaRepository <Empresa, UUID> {

}
