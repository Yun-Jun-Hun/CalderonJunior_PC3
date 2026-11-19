import { useEffect, useMemo, useState } from "react";
import "./App.css";

type Universidad = {
  nombre: string;
  ciudad: string;
  tipo: string;
  dominio: string;
  web: string;
};

type UniversidadApi = {
  name: string;
  "state-province": string | null;
  domains: string[];
  web_pages: string[];
};

function App() {
  const [universidades, setUniversidades] = useState<Universidad[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/universidades")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("No se pudo consultar la API.");
        }
        return respuesta.json() as Promise<UniversidadApi[]>;
      })
      .then((datos) => {
        setUniversidades(
          datos.map((universidad) => ({
            nombre: universidad.name,
            ciudad: universidad["state-province"] || "Perú",
            tipo: universidad.name.includes("Nacional")
              ? "Pública"
              : "Privada",
            dominio: universidad.domains[0] || "No disponible",
            web: universidad.web_pages[0] || "",
          })),
        );
      })
      .catch(() => setError("No se pudo cargar la información."))
      .finally(() => setCargando(false));
  }, []);

  const universidadesFiltradas = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return universidades.filter((universidad) =>
      [universidad.nombre, universidad.ciudad, universidad.tipo]
        .join(" ")
        .toLowerCase()
        .includes(texto),
    );
  }, [busqueda, universidades]);

  return (
    <main className="pagina">
      <nav className="barra-navegacion">
        <div className="marca">
          <span className="marca-icono">U</span>
          <span>UniPerú</span>
        </div>
        <span className="estado">
          <span className="punto" />
          Directorio académico
        </span>
      </nav>

      <header className="hero">
        <div className="hero-contenido">
          <span className="etiqueta">DIRECTORIO UNIVERSITARIO</span>
          <h1>Universidades de nuestro país</h1>
          <p>
            Encuentra información de universidades peruanas en un solo lugar.
          </p>
        </div>
        <div className="hero-forma hero-forma-uno" />
        <div className="hero-forma hero-forma-dos" />
      </header>

      <section className="panel">
        <div className="buscador">
          <span className="buscador-icono" aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            placeholder="Busca por nombre, ciudad o tipo..."
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
          {busqueda && (
            <button type="button" onClick={() => setBusqueda("")}>
              Limpiar
            </button>
          )}
        </div>

        <div className="resumen">
          <div>
            <strong>{cargando ? "..." : universidadesFiltradas.length}</strong>
            <span> universidades encontradas</span>
          </div>
          <span className="filtro">Perú · Todas las universidades</span>
        </div>

        {cargando && <p className="sin-resultados">Cargando universidades...</p>}

        {error && <p className="sin-resultados">{error}</p>}

        {!cargando && !error && <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Universidad</th>
                <th>Ciudad</th>
                <th>Tipo</th>
                <th>Dominio</th>
              </tr>
            </thead>
            <tbody>
              {universidadesFiltradas.map((universidad) => (
                <tr key={`${universidad.nombre}-${universidad.dominio}`}>
                  <td>
                    <div className="nombre-universidad">
                      <span className="escudo">{universidad.nombre.charAt(0)}</span>
                      <strong>{universidad.nombre}</strong>
                    </div>
                  </td>
                  <td>{universidad.ciudad}</td>
                  <td>
                    <span className={`tipo ${universidad.tipo.toLowerCase()}`}>
                      {universidad.tipo}
                    </span>
                  </td>
                  <td>
                    {universidad.web ? (
                      <a
                        className="dominio"
                        href={universidad.web}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {universidad.dominio}
                      </a>
                    ) : (
                      <span className="dominio">{universidad.dominio}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}

        {!cargando && !error && universidadesFiltradas.length === 0 && (
          <p className="sin-resultados">
            No encontramos universidades con ese criterio.
          </p>
        )}
      </section>

      <footer>Información académica · Perú</footer>
    </main>
  );
}

export default App;
