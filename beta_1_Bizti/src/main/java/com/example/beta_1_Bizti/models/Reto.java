package com.example.beta_1_Bizti.models;

import java.time.LocalDate;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "retos")
public class Reto {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name="nombre",nullable = false, unique = false, length = 50)
    private String nombre;
    @Column(name = "descripcion",nullable = true, unique = false, length = 200)
    private String descripcion;
    @Column(name = "fecha inicio", nullable = false, unique = false)
    private LocalDate fecha_inicio;
    @Column(name = "fecha fin", nullable = false, unique = false)
    private LocalDate fecha_fin;
    @Column(name = "estado", nullable = false, unique = false, length = 50)
    private String estado;
    
    @ManyToOne 
    @JoinColumn(name="fk_empresa")
    @JsonBackReference ("empresa_reto")
    private Empresa empresa;

    @ManyToOne
    @JoinColumn(name="fk_categoria")
    @JsonBackReference("reto_categoria")
    private Categoria categoria;

    @ManyToOne 
    @JoinColumn(name="fk_prioridad")
    @JsonBackReference("reto_prioridad")
    private Prioridad prioridad;


    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public LocalDate getFecha_inicio() {
        return fecha_inicio;
    }
    public void setFecha_inicio(LocalDate fecha_inicio) {
        this.fecha_inicio = fecha_inicio;
    }
    public LocalDate getFecha_fin() {
        return fecha_fin;
    }
    public void setFecha_fin(LocalDate fecha_fin) {
        this.fecha_fin = fecha_fin;
    }
    public String getEstado() {
        return estado;
    }
    public void setEstado(String estado) {
        this.estado = estado;
    }
    
}
