# Faultline
Browser Risk Map. Find the crack before everything breaks.

## A Browser Riskmap

Operational risk analysis tool that runs 100% in the browser. No backend, no account, no installation. Draw your organization's dependency graph and discover what fails first — and what it takes down with it.

---

## What it does

**Edit** — build your organization's map: processes, people, systems, and vendors. Connect nodes with directed edges to represent dependencies. Adjust each node's failure probability with a slider.

**What if...?** — mark any node as down with a single click. The app automatically propagates the failure through all downstream dependencies (BFS) and shows how many nodes are affected and what percentage of the network is compromised.

**Monte Carlo** — run +1000 simulations using each node's failure probabilities. Delivers the average number of affected nodes per simulation, the percentage of runs where a SPOF was involved, the worst case observed, and an impact distribution histogram.

**Automatic SPOF detection** — Tarjan's algorithm runs in real time. Articulation nodes (whose failure would partition the graph) are marked with an orange ring.

---

## Quick start

1. Download `app.html`
2. Open it in any modern browser (Chrome, Firefox, Safari, Edge)
3. Click **Example** to load a demo map with 7 nodes
4. Start exploring the three modes from the top bar

No server, Node.js, or external dependencies required.

---

## How to use each mode

### Edit mode

This is the starting point. Here you build the map.

**Add a node:**
1. Type the name in the "Name…" field (left panel)
2. Press `Enter` or click `+`
3. The node appears on the canvas and can be dragged anywhere

**Configure a node:**
1. Click on it in the canvas or in the left list
2. In the right panel (Inspector) you can:
   - Change its name
   - Assign a type: `process`, `person`, `system`, or `vendor`
   - Adjust its failure probability with the slider (1%–99%)
3. The node color automatically reflects the risk level: green (low), orange (medium), red (high)

**Connect two nodes:**
1. In the left panel, under "Connect", select the source node in "From…" and the destination in "To…"
2. Click **Add**
3. The arrow represents a dependency: if the source node fails, the target may be affected

**Remove an edge:**
1. Select the same nodes in "From…" and "To…"
2. Click **Remove**

**Re-layout:**
Automatically redistributes nodes using D3's physics simulation. Useful when nodes end up clustered after adding several at once.

**Delete a node:**
Select it and click **Delete node** in the Inspector (right panel). This also removes all its edges.

---

### What if…? mode

Used to manually simulate the domino effect of a failure.

1. Switch to this mode from the top bar
2. Click any node to mark it as **down** (turns red)
3. The system propagates the failure through all chained dependencies
4. The floating panel (top right of the canvas) shows:
   - Total affected nodes
   - Nodes that remain active
   - Percentage of the network compromised
   - SPOFs detected in the current graph
5. You can mark multiple nodes to simulate simultaneous failures
6. Click **Reset failures** to return to the original state

> **Tip:** Always start with the nodes marked with an orange ring (SPOFs). They cause the most damage when they go down.

---

### Monte Carlo mode

Simulates the probabilistic behavior of the entire network.

1. Make sure you've assigned realistic failure probabilities to each node in Edit mode
2. Switch to Monte Carlo mode from the top bar
3. Click **Run +1000 simulations**
4. In 1–2 seconds you'll see the results:
   - **Avg. affected nodes:** how many nodes fail on average per simulation
   - **Simulations with SPOF failure:** what percentage of scenarios involved a critical point
   - **Worst case observed:** the most catastrophic scenario found across all +1000 simulations
   - **Impact bars:** visual of the average and worst case as a fraction of the total network
   - **Histogram:** distribution of how many nodes were affected across all simulations

> **How to read the histogram:** bars on the left (few affected nodes) are benign scenarios; bars on the right (many nodes) are dangerous ones. If the distribution has a long tail to the right, your network has systemic vulnerabilities.

---

## Save and share

Click **Export .json** to download the current map state as a `riskmap.json` file. This file contains all configured nodes, edges, and probabilities.

To load a saved map, drag the file into the browser or use the code as a base to add an import button (see development section below).

---

## Node types and colors

| Type | Base color | When to use |
|------|-----------|-------------|
| `process` | Blue | Workflows, procedures, activities |
| `person` | Violet | Key employees, critical roles with no backup |
| `system` | Green | Software, platforms, APIs, databases |
| `vendor` | Orange | Third parties, external SaaS, infrastructure providers |

The final node color on the canvas varies based on the configured failure probability, regardless of type.

---

## Algorithms

**Failure propagation (BFS):** when a node goes down, all outgoing edges are traversed in breadth-first order. Every reachable node is marked as impacted. This conservatively models chain dependencies — if A depends on B and B depends on C, C's failure can bring down B and then A.

**SPOF detection (Tarjan):** runs automatically whenever the graph is modified. Finds articulation vertices — nodes whose removal disconnects the graph — using Tarjan's algorithm with DFS and `disc`/`low` values. These nodes are visually marked as single points of failure.

**Monte Carlo:** each simulation makes a pass over all nodes, applying their failure probability to decide whether they go down. It then runs BFS from the failed nodes to propagate the impact. The process repeats +1000 times in memory using synchronous browser-compatible JS inside a `setTimeout` to avoid blocking the UI.

---

## Tech stack

- **D3.js v7** — force simulation, graph layout, node dragging
- **HTML/CSS/JS vanilla** — no frameworks, no bundler, everything in one file
- **localStorage** — not used in this version; state lives in memory during the session
- **Vercel / any static hosting** — a single HTML file, deployable from any CDN

---

## Roadmap

- [ ] Import `.json` from the browser (drag & drop)
- [ ] Integration with monitoring APIs (PagerDuty, Datadog) for live nodes
- [ ] Automatic recommendations using an LLM based on the serialized graph
- [ ] Map version history with visual diff
- [ ] Export as animated GIF (Fluyo-style)

---

## License

MIT — use it, modify it, distribute it freely.
