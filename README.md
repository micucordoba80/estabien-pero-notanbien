# 🐺 Está Bien, Pero No Tan Bien

**Nombre:** Micaela Córdoba

---

## 📖 Descripción

Un videojuego 2D desarrollado con Phaser.js donde controlás a un personaje que debe **meter personas en jaulas** para salvarlas de los lobos.

**El concepto:** *"Está bien porque las salvas de los lobos... pero no tan bien porque las encerrás en jaulas"*

---

## 🎮 Controles

- **FLECHAS** (← → ↑ ↓) — Movimiento del personaje
- **ESPACIO** — Avanzar al siguiente nivel

---

## 🎯 Objetivo del juego

Salvar la cantidad mínima de personas en cada nivel empujándolas hacia las jaulas antes de que los lobos las atrapen.

---

## ⚙️ Mecánicas principales

- **Empujar NPCs:** Al chocar con una persona, la empujás en la dirección contraria. Tenés que llevarla hasta una jaula.
- **Jaulas:** Son zonas seguras. Si una persona llega a una jaula, queda salvada.
- **Lobos:** Persiguen a las personas automáticamente. Si alcanzan a una persona antes de que llegue a la jaula, la pierdes.
- **Señales de advertencia:** Cuando un lobo está cerca de una persona, aparece un círculo rojo en el suelo indicando el peligro.

---

## 🏞️ Niveles

### Nivel 1 - El Bosque 🌲
- 3 personas en peligro, 1 lobo
- Objetivo: salvar al menos 2 personas
- Introducción a la mecánica principal

### Nivel 2 - Bosque Denso 🌳
- 5 personas en peligro, 2 lobos
- Objetivo: salvar al menos 3 personas
- Mayor dificultad, más lobos y personas distribuidas

### Nivel 3 - La Montaña ⛰️
- 6 personas en peligro, 3 lobos + LOBO JEFE
- Objetivo: salvar al menos 4 personas
- El **Lobo Jefe** (rojo) persigue al jugador directamente y te saca vidas

---

## ⭐ Puntos

**Suma puntos:**
- Salvar una persona en una jaula: +100 puntos

**Resta puntos:**
- *(No implementado en esta versión)*

---

## ❤️ Vidas

- Comenzás con 3 vidas
- Si un lobo te toca, perdés una vida
- Al quedarte sin vidas → **Game Over**
- Entre niveles se mantienen las vidas y los puntos

---

## 🧍 NPCs

- **Personas (Naranja):** Están en peligro. Hay que empujarlas a las jaulas.
- **Lobos (Gris):** Persiguen a las personas automáticamente.
- **Lobo Jefe (Rojo, Nivel 3):** Persigue al jugador y le saca vidas al contacto.

---

## 🔗 Link al juego publicado

*[Agregar link de GitHub Pages cuando esté publicado]*

---

## 🛠️ Tecnologías

- [Phaser.js 3.60](https://phaser.io/) — Framework de videojuegos
- JavaScript (ES6)
- HTML5 + CSS3
- Sprites generados proceduralmente con Phaser Graphics API

---

## ▶️ Cómo ejecutar localmente

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/micucordoba80/estabien-pero-notanbien.git
   ```
2. Abrir la carpeta y servir con un servidor HTTP:
   ```bash
   python -m http.server 8080
   ```
3. Abrir en el navegador: `http://localhost:8080`

> También se puede usar la extensión **Live Server** de VS Code.
