// Datos de ejemplo para ver el dashboard cuando el backend no responde.
// Las fechas se calculan desde hoy para que siempre haya retos en curso,
// por vencer y vencidos.
function dia(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

let seq = 0;
const id = () => `demo-${String(++seq).padStart(4, '0')}-0000-0000-000000000000`;

export function crearRetosDemo() {
  seq = 0;
  return [
    { id: id(), nombre: 'Optimizar inventario de bodega', descripcion: 'Reducir el tiempo de conteo físico en un 30 %.', fecha_inicio: dia(-40), fecha_fin: dia(5), estado: 'En progreso' },
    { id: id(), nombre: 'App de pedidos para tenderos', descripcion: 'Prototipo móvil para que los tenderos hagan pedidos sin llamar.', fecha_inicio: dia(-20), fecha_fin: dia(45), estado: 'En progreso' },
    { id: id(), nombre: 'Tablero de ventas regional', descripcion: 'Indicadores de venta por zona actualizados a diario.', fecha_inicio: dia(-90), fecha_fin: dia(-10), estado: 'Finalizado' },
    { id: id(), nombre: 'Reducir devoluciones', descripcion: 'Identificar causas raíz de las devoluciones de producto.', fecha_inicio: dia(-60), fecha_fin: dia(-3), estado: 'En progreso' },
    { id: id(), nombre: 'Encuesta de satisfacción', descripcion: 'Medir la satisfacción de clientes empresariales.', fecha_inicio: dia(10), fecha_fin: dia(40), estado: 'Pendiente' },
    { id: id(), nombre: 'Rutas de entrega eficientes', descripcion: 'Disminuir kilómetros recorridos por ruta.', fecha_inicio: dia(-15), fecha_fin: dia(2), estado: 'En progreso' },
    { id: id(), nombre: 'Digitalizar actas de entrega', descripcion: 'Firmas digitales para la entrega de equipos.', fecha_inicio: dia(-120), fecha_fin: dia(-45), estado: 'Finalizado' },
    { id: id(), nombre: 'Programa de reciclaje', descripcion: null, fecha_inicio: dia(20), fecha_fin: dia(80), estado: 'Pendiente' },
    { id: id(), nombre: 'Chatbot de soporte', descripcion: 'Atención automática de preguntas frecuentes.', fecha_inicio: dia(-30), fecha_fin: dia(30), estado: 'En revisión' },
    { id: id(), nombre: 'Ahorro de energía en planta', descripcion: 'Bajar el consumo eléctrico del turno nocturno.', fecha_inicio: dia(-75), fecha_fin: dia(-20), estado: 'Cancelado' },
    { id: id(), nombre: 'Capacitación en Excel avanzado', descripcion: 'Formación para el área administrativa.', fecha_inicio: dia(-5), fecha_fin: dia(25), estado: 'En progreso' },
    { id: id(), nombre: 'Portal de proveedores', descripcion: 'Consulta de órdenes de compra y pagos.', fecha_inicio: dia(-150), fecha_fin: dia(-60), estado: 'Finalizado' },
  ];
}
