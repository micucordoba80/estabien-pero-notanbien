from fpdf import FPDF

class GDD(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font('Helvetica', 'I', 8)
            self.set_text_color(100, 100, 100)
            self.cell(0, 6, 'Game Design Document - "Est\xe1 bien, pero no tan bien"', align='C')
            self.ln(8)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, f'Pagina {self.page_no()}', align='C')

    def chapter_title(self, title):
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(30, 60, 120)
        self.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(30, 60, 120)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)

    def section_title(self, title):
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(50, 50, 50)
        self.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def body_text(self, text):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 5, text)
        self.ln(2)

    def bullet(self, text):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(30, 30, 30)
        self.set_x(self.l_margin)
        self.cell(5, 5, '-')
        self.multi_cell(0, 5, text)

pdf = GDD()
pdf.set_auto_page_break(auto=True, margin=20)
pdf.add_page()

# Portada
pdf.ln(50)
pdf.set_font('Helvetica', 'B', 28)
pdf.set_text_color(200, 50, 50)
pdf.cell(0, 14, 'ESTA BIEN,', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.set_text_color(50, 50, 50)
pdf.cell(0, 14, 'PERO NO TAN BIEN', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.ln(8)
pdf.set_font('Helvetica', '', 18)
pdf.set_text_color(100, 100, 100)
pdf.cell(0, 10, '"Cuidado con los Lobos"', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.ln(20)
pdf.set_font('Helvetica', '', 12)
pdf.set_text_color(80, 80, 80)
pdf.cell(0, 7, 'Game Design Document', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 7, 'Version 1.0', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.ln(40)
pdf.set_font('Helvetica', 'I', 10)
pdf.set_text_color(120, 120, 120)
pdf.cell(0, 7, 'Desarrollado por: Micaela', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 7, 'Junio 2026', align='C', new_x="LMARGIN", new_y="NEXT")

# Indice
pdf.add_page()
pdf.chapter_title('Indice')
pdf.set_font('Helvetica', '', 11)
toc = [
    '1. Resumen',
    '2. Concepto y Premisa',
    '3. Mecanicas Principales',
    '4. Controles',
    '5. Niveles',
    '6. Enemigos',
    '7. UI y HUD',
    '8. Flujo del Juego',
    '9. Paleta de Colores y Estilo Visual',
    '10. Sonido y Musica',
    '11. Creditos',
]
for item in toc:
    pdf.cell(0, 7, item, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)

# 1. Resumen
pdf.add_page()
pdf.chapter_title('1. Resumen')
pdf.body_text(
    'Est\xe1 bien, pero no tan bien (subtitulado "Cuidado con los Lobos") es un juego de accion y '
    'estrategia en 2D desarrollado con Phaser 3. El jugador debe rescatar personas encerrandolas en '
    'jaulas antes de que lleguen los lobos. La mecanica central mezcla empuje fisico con gestion del '
    'tiempo, creando una tension creciente a medida que avanza la partida.'
)
pdf.body_text(
    'Plataforma: Navegador web (HTML5 + JavaScript)\n'
    'Libreria: Phaser 3.60.0\n'
    'Genero: Accion / Estrategia / Arcade\n'
    'P\xfablico objetivo: Casual, todas las edades'
)

# 2. Concepto
pdf.add_page()
pdf.chapter_title('2. Concepto y Premisa')
pdf.body_text(
    'El juego presenta una premisa ironica y humoristica: el jugador "salva" a las personas '
    'encerrandolas en jaulas. Esta bien porque las salvas de los lobos, pero no tan bien porque '
    'las estas encerrando. Este tono se mantiene en los textos del juego y en la pantalla de victoria.'
)
pdf.body_text(
    'La accion se divide en dos fases:\n'
    '- Fase de Preparacion (PREP): El jugador tiene un tiempo limite para empujar a todos los NPCs '
    'a las jaulas. Cuando todos estan a salvo, aparece una llave.\n'
    '- Fase de Escape: Los lobos aparecen y persiguen al jugador. Este debe tomar la llave, '
    'llegar a su propia jaula y escapar.'
)

# 3. Mecanicas
pdf.chapter_title('3. Mecanicas Principales')
pdf.section_title('3.1 Empuje de NPCs')
pdf.body_text(
    'El jugador empuja a los NPCs al colisionar con ellos. La fuerza de empuje tiene un componente '
    'aleatorio para que los NPCs se dispersen de forma impredecible. Los NPCs rebotan contra los '
    'limites del mapa (bounce = 1) para evitar que queden pegados en los bordes.'
)
pdf.section_title('3.2 Rescate en Jaulas')
pdf.body_text(
    'Cada NPC puede ser encerrado en una jaula. Al hacerlo, el jugador gana 100 puntos y el NPC '
    'queda marcado como "salvado" (inmune a lobos). Cada jaula solo puede contener un NPC.'
)
pdf.section_title('3.3 Llave y Jaula del Jugador')
pdf.body_text(
    'Cuando todos los NPCs estan enjaulados, aparece una llave en una posicion aleatoria. El '
    'jugador debe recogerla para abrir su propia jaula. Sin la llave, no puede escapar aunque '
    'llegue a la jaula.'
)
pdf.section_title('3.4 Lobos')
pdf.body_text(
    'Al agotarse el tiempo, entran lobos desde las esquinas del mapa. Persiguen al jugador '
    'constantemente. Si tocan al jugador, este pierde una vida y obtiene invencibilidad temporal '
    '(1.2 segundos). Si un lobo alcanza a un NPC antes de ser enjaulado, el NPC es devorado.'
)
pdf.section_title('3.5 Vidas y Game Over')
pdf.body_text(
    'El jugador comienza con 3 vidas. Al perder todas, es Game Over. Si el tiempo se acaba y '
    'queda alg\xfan NPC sin salvar, tambien es Game Over inmediato.'
)

# 4. Controles
pdf.add_page()
pdf.chapter_title('4. Controles')
pdf.bullet('Flechas direccionales (Arriba, Abajo, Izquierda, Derecha): Movimiento del jugador')
pdf.bullet('No se requieren controles adicionales; toda la interaccion es por contacto fisico')
pdf.ln(2)

# 5. Niveles
pdf.chapter_title('5. Niveles')
pdf.body_text('El juego consta de 3 niveles con dificultad progresiva:')

pdf.section_title('Nivel 1 - El Bosque (Woodlands)')
pdf.bullet('Fondo: verde claro')
pdf.bullet('NPCs: 3 | Lobos: 1 | Jaulas: 3 | Tiempo: 30 segundos')
pdf.bullet('Velocidad de lobos: 120 px/s')
pdf.bullet('Sin jefe final')
pdf.ln(1)

pdf.section_title('Nivel 2 - Bosque Denso (Forest)')
pdf.bullet('Fondo: verde oscuro con patron de cuadros')
pdf.bullet('NPCs: 5 | Lobos: 2 | Jaulas: 5 | Tiempo: 35 segundos')
pdf.bullet('Velocidad de lobos: 140 px/s')
pdf.bullet('Sin jefe final')
pdf.ln(1)

pdf.section_title('Nivel 3 - La Montana (Mountain)')
pdf.bullet('Fondo: azul oscuro con circulos')
pdf.bullet('NPCs: 6 | Lobos: 3 | Jaulas: 6 | Tiempo: 40 segundos')
pdf.bullet('Velocidad de lobos: 160 px/s')
pdf.bullet('Incluye LOBO JEFE (boss) - 1.4x velocidad, textura roja mas grande')

# 6. Enemigos
pdf.chapter_title('6. Enemigos')
pdf.section_title('6.1 Lobo Comun')
pdf.body_text(
    'Textura gris de 40x28 px. Persigue al jugador a velocidad constante. Nace en las esquinas '
    'del mapa al iniciar la fase de escape.'
)
pdf.section_title('6.2 Lobo Jefe (Nivel 3)')
pdf.body_text(
    'Textura roja de 52x32 px. Aparece en la parte superior del mapa. Se mueve un 40% mas rapido '
    'que los lobos comunes. Tiene un indicador de texto "LOBO JEFE" sobre el.'
)

# 7. UI
pdf.add_page()
pdf.chapter_title('7. UI y HUD')
pdf.body_text('Elementos en pantalla durante el juego:')
pdf.bullet('Puntos: Esquina superior izquierda')
pdf.bullet('Vidas: Corazones debajo de los puntos')
pdf.bullet('Salvados: Contador "Salvados: X/Y" en la esquina superior derecha')
pdf.bullet('Timer: Centro superior, cambia a rojo cuando quedan <= 5 segundos')
pdf.bullet('Texto de fase: Centro, indica si estas en prep o escape')
pdf.bullet('Indicador de llave: candado cerrado > abierto al recoger la llave')
pdf.bullet('Textos flotantes: "+100", "Llave!", etc. aparecen y se desvanecen')
pdf.bullet('Mensaje inferior: texto informativo con pistas para el jugador')
pdf.ln(2)

# 8. Flujo
pdf.chapter_title('8. Flujo del Juego')
pdf.body_text(
    'Menu Principal -> Nivel 1 -> Nivel 2 -> Nivel 3 -> Pantalla de Victoria\n'
    '                                        |\n'
    '                                   Game Over -> Reintentar / Menu'
)
pdf.body_text(
    'El progreso entre niveles se mantiene: los puntos y las vidas se acumulan. Si el jugador '
    'pierde todas las vidas en cualquier nivel, vuelve al menu de Game Over con opcion de '
    'reintentar desde el Nivel 1 o volver al menu principal.'
)

# 9. Estilo
pdf.add_page()
pdf.chapter_title('9. Paleta de Colores y Estilo Visual')
pdf.body_text(
    'Los graficos son generados proceduralmente con la API de Graphics de Phaser. '
    'Estilo minimalista y retro, con formas geometricas simples.'
)
pdf.section_title('Paleta:')
pdf.bullet('Fondo general: #1a1a2e (azul oscuro)')
pdf.bullet('Jugador: azul (#3498db)')
pdf.bullet('NPC: naranja (#f39c12)')
pdf.bullet('Lobo comun: gris (#444444)')
pdf.bullet('Lobo jefe: rojo oscuro (#8B0000)')
pdf.bullet('Jaula: marron (#8B4513)')
pdf.bullet('Jaula del jugador: dorado (#ffd700)')
pdf.bullet('Llave: dorado (#ffd700)')
pdf.bullet('Botones: verde (#27ae60) / rojo (#c0392b)')
pdf.ln(2)

pdf.section_title('Tipografia:')
pdf.body_text('Arial (sans-serif) - sistema, para garantizar compatibilidad y legibilidad.')

# 10. Sonido
pdf.chapter_title('10. Sonido y Musica')
pdf.body_text(
    'El juego actualmente no incluye efectos de sonido ni musica. Es una area de mejora '
    'futura. Pendientes:\n'
    '- Efecto de empuje al colisionar con NPCs\n'
    '- Sonido al enjaular un NPC\n'
    '- Alarma cuando se acaba el tiempo\n'
    '- Musica de fondo para fase preparacion y fase de escape\n'
    '- Sonido de lobos (aullidos)\n'
    '- Sonido al recoger la llave\n'
    '- Musica de victoria y game over'
)

# 11. Creditos
pdf.add_page()
pdf.chapter_title('11. Creditos')
pdf.body_text('Desarrollado por Micaela')
pdf.body_text('Herramientas utilizadas:')
pdf.bullet('Phaser 3.60.0 (libreria de juegos HTML5)')
pdf.bullet('JavaScript (ES6)')
pdf.bullet('HTML5 + CSS')
pdf.bullet('VS Code')
pdf.ln(5)
pdf.body_text('Gracias por jugar "Esta bien, pero no tan bien"!')

# Guardar
pdf.output('GDD_Esta_bien_pero_no_tan_bien.pdf')
print('PDF generado: GDD_Esta_bien_pero_no_tan_bien.pdf')
