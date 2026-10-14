import { useState } from 'react';
import RetosDashboard from './pages/RetosDashboard.jsx';
import CategoriasDashboard from './pages/CategoriasDashboard.jsx';

// Menú simple para cambiar entre dashboards. Cuando se sumen Empresa, Prioridad, etc.,
// solo hay que agregar una entrada aquí.
const PAGINAS = [
  { key: 'retos', label: 'Retos', Componente: RetosDashboard },
  { key: 'categorias', label: 'Categorías', Componente: CategoriasDashboard },
];

export default function App() {
  const [actual, setActual] = useState('retos');
  const { Componente } = PAGINAS.find((p) => p.key === actual);
  return (
    <>
      <nav className="bz-page" style={{ paddingBottom: 0 }} aria-label="Dashboards">
        <div className="bz-row">
          {PAGINAS.map((p) => (
            <button key={p.key} type="button" aria-current={p.key === actual ? 'page' : undefined}
              className={`bz-btn bz-btn-sm ${p.key === actual ? 'bz-btn-primary' : ''}`}
              onClick={() => setActual(p.key)}>
              {p.label}
            </button>
          ))}
        </div>
      </nav>
      <Componente />
    </>
  );
}
