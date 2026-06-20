class MenuScene extends Phaser.Scene {
    constructor() { super('Menu'); }

    create() {
        this.add.image(400, 300, 'bg_woodlands').setDisplaySize(GAME.W, GAME.H);

        this.add.text(400, 120, 'ESTÁ BIEN,', { fontSize: '52px', fill: '#ffd700', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.text(400, 175, 'PERO NO TAN BIEN', { fontSize: '40px', fill: '#ff6600', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.text(400, 230, '🐺 Atrapa personas en jaulas para salvarlas de los lobos 🐺', { fontSize: '16px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 255, '"Está bien porque las salvas... pero no tan bien porque las encierras"', { fontSize: '14px', fill: '#aaa', fontStyle: 'italic' }).setOrigin(0.5);

        const btn = this.add.rectangle(400, 350, 220, 60, 0x27ae60, 0.9).setInteractive({ useHandCursor: true });
        const btnText = this.add.text(400, 350, '🎮 JUGAR', { fontSize: '28px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

        btn.on('pointerover', () => { btn.setFillStyle(0x2ecc71); btnText.setScale(1.05); });
        btn.on('pointerout', () => { btn.setFillStyle(0x27ae60); btnText.setScale(1); });
        btn.on('pointerdown', () => this.scene.start('Level1', { score: 0, lives: GAME.START_LIVES, savedCount: 0 }));

        this.add.text(400, 430, 'Controles: FLECHAS para moverte', { fontSize: '14px', fill: '#ccc' }).setOrigin(0.5);
        this.add.text(400, 450, 'FASE 1: Meté a todos en las jaulas antes del tiempo ⏱️', { fontSize: '14px', fill: '#ccc' }).setOrigin(0.5);
        this.add.text(400, 470, 'FASE 2: Buscá la 🗝️ que aparece, abrí tu jaula y escapá!', { fontSize: '14px', fill: '#ccc' }).setOrigin(0.5);
        this.add.text(400, 490, '🐺 Los lobos te persiguen... ¡no te dejes atrapar!', { fontSize: '14px', fill: '#ff6666' }).setOrigin(0.5);

        const wolf = this.add.image(150, 350, 'wolf').setScale(2);
        this.tweens.add({ targets: wolf, x: 650, duration: 4000, yoyo: true, repeat: -1 });
    }
}
