// Datos de ejemplo para ver el dashboard cuando el backend no responde.
// Cada categoría trae sus retos; las fechas se calculan desde hoy.
function dia(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

let seq = 0;
const id = (p) => `demo-${p}-${String(++seq).padStart(4, '0')}`;
const reto = (nombre, descripcion, ini, fin, estado) => ({
  id: id('reto'), nombre, descripcion, fecha_inicio: dia(ini), fecha_fin: dia(fin), estado,
});

export function crearCategoriasDemo() {
  seq = 0;
  return [
    {
      id: id('cat'), nombre: 'Operaciones', descripcion: 'Procesos de bodega, inventario y logística.',
      retos: [
        reto('Optimizar inventario de bodega', 'Reducir el tiempo de conteo físico en un 30 %.', -40, 5, 'En progreso'),
        reto('Rutas de entrega eficientes', 'Disminuir kilómetros recorridos por ruta.', -15, 2, 'En progreso'),
        reto('Reducir devoluciones', 'Identificar causas raíz de las devoluciones.', -60, -3, 'En progreso'),
        reto('Digitalizar actas de entrega', 'Firmas digitales para la entrega de equipos.', -120, -45, 'Finalizado'),
      ],
    },
    {
      id: id('cat'), nombre: 'Tecnología', descripcion: 'Desarrollo de aplicaciones y automatización.',
      retos: [
        reto('App de pedidos para tenderos', 'Prototipo móvil para pedidos sin llamar.', -20, 45, 'En progreso'),
        reto('Chatbot de soporte', 'Atención automática de preguntas frecuentes.', -30, 30, 'En revisión'),
        reto('Portal de proveedores', 'Consulta de órdenes de compra y pagos.', -150, -60, 'Finalizado'),
      ],
    },
    {
      id: id('cat'), nombre: 'Ventas', descripcion: 'Indicadores comerciales y satisfacción del cliente.',
      retos: [
        reto('Tablero de ventas regional', 'Indicadores de venta por zona actualizados a diario.', -90, -10, 'Finalizado'),
        reto('Encuesta de satisfacción', 'Medir la satisfacción de clientes empresariales.', 10, 40, 'Pendiente'),
      ],
    },
    {
      id: id('cat'), nombre: 'Sostenibilidad', descripcion: 'Ahorro de recursos y gestión ambiental.',
      retos: [
        reto('Programa de reciclaje', null, 20, 80, 'Pendiente'),
        reto('Ahorro de energía en planta', 'Bajar el consumo eléctrico del turno nocturno.', -75, -20, 'Cancelado'),
      ],
    },
    {
      id: id('cat'), nombre: 'Talento humano', descripcion: 'Formación y bienestar del personal.',
      retos: [
        reto('Capacitación en Excel avanzado', 'Formación para el área administrativa.', -5, 25, 'En progreso'),
      ],
    },
    { id: id('cat'), nombre: 'Finanzas', descripcion: 'Presupuesto, costos y control del gasto.', retos: [] },
  ];
}
