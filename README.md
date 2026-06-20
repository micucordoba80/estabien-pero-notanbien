# 🐺 ¡Cuidado con los lobos!

**Nombre:** Micaela Córdoba

---

## 📖 Descripción

Un videojuego 2D desarrollado con Phaser.js donde tenés que **meter personas en jaulas** para salvarlas de los lobos... y después escapar vos también.

**El concepto:** *"Está bien porque las salvas de los lobos... pero no tan bien porque las encerrás en jaulas"*

---

## 🎮 Controles

- **FLECHAS** (← → ↑ ↓) — Movimiento del personaje

---

## 🎯 Objetivo del juego

**FASE 1 — Preparación ⏱️**
Tenés un tiempo límite para meter a todas las personas en las jaulas empujándolas.

**FASE 2 — Escape 🏃💨**
Cuando se acaba el tiempo, aparecen los lobos. Si dejaste a alguien afuera, perdés.
Si todas las personas están a salvo en sus jaulas, los lobos te persiguen a VOS.
Tenés que llegar a **tu jaula dorada** 🏠 antes que te atrapen.

---

## ⚙️ Mecánicas principales

- **Empujar NPCs:** Al chocar con una persona, la empujás. Tenés que llevarla hasta una jaula.
- **Jaulas:** Zonas seguras para las personas. Una vez adentro, quedan salvadas.
- **Tu jaula dorada:** Al final de cada nivel, tenés que llegar a esta jaula para escapar de los lobos.
- **Timer:** Contador regresivo. Cuando llega a 0, los lobos aparecen.
- **Lobos:** Persiguen al jugador en la fase de escape. Si te tocan, perdés una vida.

---

## 🏞️ Niveles

### Nivel 1 - El Bosque 🌲
- ⏱️ 30 segundos | 👥 3 personas | 🐺 1 lobo
- Introducción a la mecánica

### Nivel 2 - Bosque Denso 🌳
- ⏱️ 25 segundos | 👥 5 personas | 🐺 2 lobos
- Más personas que salvar en menos tiempo

### Nivel 3 - La Montaña ⛰️
- ⏱️ 20 segundos | 👥 6 personas | 🐺 3 lobos + LOBO JEFE
- El **Lobo Jefe** (rojo) es más rápido y peligroso

---

## ⭐ Puntos

- Salvar una persona en una jaula: **+100 puntos**

---

## ❤️ Vidas

- Comenzás con 3 vidas
- Si un lobo te toca en la fase de escape, perdés una vida
- Al quedarte sin vidas → **Game Over**
- Entre niveles se mantienen las vidas y los puntos

---

## 🧍 NPCs

- **Personas (Naranja):** Hay que empujarlas a las jaulas antes que se acabe el tiempo
- **Lobos (Gris):** Aparecen cuando el timer llega a 0 y persiguen al jugador
- **Lobo Jefe (Rojo, Nivel 3):** Más rápido, persigue al jugador directamente

---

## 🔗 Link al juego publicado

[https://micucordoba80.github.io/estabien-pero-notanbien/](https://micucordoba80.github.io/estabien-pero-notanbien/)

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
