
# Faultline
Browser Risk Map. Find the crack before everything breaks.

## Riskmap

Herramienta de análisis de riesgo operacional que corre 100% en el browser. Sin backend, sin cuenta, sin instalación. Dibuja el grafo de dependencias de tu organización y descubre qué falla primero — y qué arrastra con él.

---

## Qué hace

**Editar** — construye el mapa de tu organización: procesos, personas, sistemas y proveedores. Conecta nodos con aristas dirigidas para representar dependencias. Ajusta la probabilidad de fallo de cada nodo con un slider.

**¿Qué pasa si...?** — marca cualquier nodo como caído con un clic. La app propaga el fallo automáticamente por todas las dependencias aguas abajo (BFS) y te muestra cuántos nodos quedan afectados y qué porcentaje de la red está comprometida.

**Monte Carlo** — corre +1000 simulaciones usando las probabilidades de fallo de cada nodo. Entrega el promedio de nodos afectados por simulación, el porcentaje de veces que un SPOF estuvo involucrado, el peor caso observado, y un histograma de distribución de impacto.

**Detección de SPOFs automática** — el algoritmo de Tarjan corre en tiempo real. Los nodos de articulación (cuya caída partiría el grafo) se marcan con un anillo naranja.

---

## Inicio rápido

1. Descarga `riesgo-operacional.html`
2. Ábrelo en cualquier browser moderno (Chrome, Firefox, Safari, Edge)
3. Haz clic en **Cargar ejemplo** para ver un mapa de demostración con 7 nodos
4. Empieza a explorar los tres modos desde la barra superior

No requiere servidor, Node.js, ni ninguna dependencia externa.

---

## Cómo usar cada modo

### Modo Editar

Este es el punto de partida. Aquí construyes el mapa.

**Agregar un nodo:**
1. Escribe el nombre en el campo "Nombre del proceso..." (panel izquierdo)
2. Presiona `Enter` o haz clic en `+`
3. El nodo aparece en el canvas y puedes arrastrarlo a donde quieras

**Configurar un nodo:**
1. Haz clic sobre él en el canvas o en la lista izquierda
2. En el panel derecho (Inspector) puedes:
   - Cambiar su nombre
   - Asignar un tipo: `proceso`, `persona`, `sistema`, o `proveedor`
   - Ajustar su probabilidad de fallo con el slider (1%–99%)
3. El color del nodo refleja automáticamente el nivel de riesgo: verde (bajo), naranja (medio), rojo (alto)

**Conectar dos nodos:**
1. En el panel izquierdo, sección "Conectar", selecciona el nodo origen en "Desde..." y el destino en "Hasta..."
2. Haz clic en **Agregar arista**
3. La flecha representa una dependencia: si el nodo origen falla, el destino puede verse afectado

**Quitar una arista:**
1. Selecciona los mismos nodos en "Desde..." y "Hasta..."
2. Haz clic en **Quitar**

**Re-layout:**
Redistribuye los nodos automáticamente usando la simulación de física de D3. Útil cuando los nodos quedan amontonados después de agregar varios de golpe.

**Eliminar un nodo:**
Selecciónalo y haz clic en **Eliminar nodo** en el Inspector (panel derecho). Esto también elimina todas sus aristas.

---

### Modo ¿Qué pasa si...?

Sirve para simular el efecto dominó de un fallo manualmente.

1. Cambia al modo desde la barra superior
2. Haz clic en cualquier nodo para marcarlo como **caído** (se pone rojo)
3. El sistema propaga el fallo por todas las dependencias en cadena
4. El panel flotante (arriba a la derecha del canvas) muestra:
   - Nodos afectados en total
   - Nodos que permanecen activos
   - Porcentaje de la red comprometida
   - SPOFs detectados en el grafo actual
5. Puedes marcar múltiples nodos para simular fallos simultáneos
6. Haz clic en **Resetear fallos** para volver al estado original

> **Tip:** Empieza siempre por los nodos marcados con anillo naranja (SPOFs). Son los que más daño causan al caer.

---

### Modo Monte Carlo

Simula el comportamiento probabilístico de la red completa.

1. Asegúrate de haber asignado probabilidades de fallo realistas a cada nodo en modo Editar
2. Cambia al modo Monte Carlo desde la barra superior
3. Haz clic en **Correr +1000 simulaciones**
4. En 1–2 segundos verás los resultados:
   - **Nodos afectados (promedio):** cuántos nodos caen en promedio por simulación
   - **Simulaciones con SPOF caído:** en qué porcentaje de los escenarios un punto crítico estuvo involucrado
   - **Peor caso observado:** el escenario más catastrófico encontrado entre las +1000 simulaciones
   - **Barras de impacto:** visual del promedio y el peor caso como fracción de la red total
   - **Histograma:** distribución de cuántos nodos se vieron afectados a lo largo de todas las simulaciones

> **Cómo leer el histograma:** las barras a la izquierda (pocos nodos afectados) son escenarios benignos; las barras a la derecha (muchos nodos) son los peligrosos. Si la distribución tiene una cola larga hacia la derecha, tu red tiene vulnerabilidades sistémicas.

---

## Guardar y compartir

Haz clic en **Exportar .json** para descargar el estado actual del mapa como archivo `riskmap.json`. Este archivo contiene todos los nodos, aristas y probabilidades configuradas.

Para cargar un mapa guardado, arrastra el archivo al browser o usa el código como base para agregar un botón de importación (ver sección de desarrollo abajo).

---

## Tipos de nodo y colores

| Tipo | Color base | Cuándo usarlo |
|------|-----------|---------------|
| `proceso` | Azul | Flujos de trabajo, procedimientos, actividades |
| `persona` | Violeta | Empleados clave, roles críticos sin respaldo |
| `sistema` | Verde | Software, plataformas, APIs, bases de datos |
| `proveedor` | Naranja | Terceros, SaaS externo, proveedores de infraestructura |

El color final del nodo en el canvas varía según la probabilidad de fallo configurada, independientemente del tipo.

---

## Algoritmos

**Propagación de fallos (BFS):** cuando un nodo cae, se recorren todas las aristas salientes en anchura. Cada nodo alcanzable queda marcado como impactado. Esto modela dependencias en cadena de forma conservadora — si A depende de B y B depende de C, la caída de C puede arrastrar a B y luego a A.

**Detección de SPOFs (Tarjan):** se ejecuta automáticamente al modificar el grafo. Encuentra los vértices de articulación — nodos cuya eliminación desconecta el grafo — usando el algoritmo de Tarjan con DFS y valores `disc`/`low`. Estos nodos se marcan visualmente como puntos de fallo únicos.

**Monte Carlo:** cada simulación hace una pasada sobre todos los nodos, aplicando su probabilidad de fallo para decidir si cae o no. Luego corre BFS desde los caídos para propagar el impacto. El proceso se repite +1000 veces en memoria usando Web-compatible JS síncrono dentro de un `setTimeout` para no bloquear la UI.

---

## Stack técnico

- **D3.js v7** — simulación de fuerzas, layout del grafo, arrastre de nodos
- **HTML/CSS/JS vanilla** — sin frameworks, sin bundler, todo en un archivo
- **localStorage** — no se usa en esta versión; el estado vive en memoria durante la sesión
- **Vercel / cualquier hosting estático** — un solo archivo HTML, se puede servir desde cualquier CDN

---

## Roadmap

- [ ] Importar `.json` desde el browser (drag & drop)
- [ ] Integración con APIs de monitoreo (PagerDuty, Datadog) para nodos en tiempo real
- [ ] Recomendaciones automáticas con LLM basadas en el grafo serializado
- [ ] Historial de versiones del mapa con diff visual
- [ ] Modo exportar como GIF animado (estilo Fluyo)

---

## Licencia

MIT — úsalo, modifícalo, distribúyelo libremente.
