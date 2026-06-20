class MenuScene extends Phaser.Scene {
    constructor() { super('Menu'); }

    create() {
        const f = GAME.FONT;
        this.add.image(400, 300, 'bg_woodlands').setDisplaySize(GAME.W, GAME.H);

        this.add.text(400, 120, 'ESTÁ BIEN,', { fontSize: '44px', fill: '#ffd700', fontFamily: f }).setOrigin(0.5);
        this.add.text(400, 170, 'PERO NO TAN BIEN', { fontSize: '32px', fill: '#ff6600', fontFamily: f }).setOrigin(0.5);
        this.add.text(400, 220, 'Atrapa personas en jaulas para salvarlas de los lobos', { fontSize: '12px', fill: '#fff', fontFamily: f }).setOrigin(0.5);
        this.add.text(400, 245, 'Está bien porque las salvas... pero no tan bien porque las encierras', { fontSize: '10px', fill: '#aaa', fontFamily: f }).setOrigin(0.5);

        const btn = this.add.rectangle(400, 340, 220, 60, 0x27ae60, 0.9).setInteractive({ useHandCursor: true });
        const btnText = this.add.text(400, 340, 'JUGAR', { fontSize: '22px', fill: '#fff', fontFamily: f }).setOrigin(0.5);

        btn.on('pointerover', () => { btn.setFillStyle(0x2ecc71); btnText.setScale(1.05); });
        btn.on('pointerout', () => { btn.setFillStyle(0x27ae60); btnText.setScale(1); });
        btn.on('pointerdown', () => this.scene.start('Level1', { score: 0, lives: GAME.START_LIVES }));

        this.add.text(400, 420, 'FLECHAS para moverte', { fontSize: '11px', fill: '#ccc', fontFamily: f }).setOrigin(0.5);
        this.add.text(400, 440, 'Mete a todos en las jaulas ->aparece llave', { fontSize: '10px', fill: '#ccc', fontFamily: f }).setOrigin(0.5);
        this.add.text(400, 458, 'Llave + jaula antes del tiempo = GANAS', { fontSize: '10px', fill: '#4c4', fontFamily: f }).setOrigin(0.5);
        this.add.text(400, 476, 'Si se acaba el tiempo: sobrevive a los lobos', { fontSize: '10px', fill: '#ff6666', fontFamily: f }).setOrigin(0.5);

        const wolf = this.add.image(150, 350, 'wolf').setScale(2);
        this.tweens.add({ targets: wolf, x: 650, duration: 4000, yoyo: true, repeat: -1 });
    }
}
