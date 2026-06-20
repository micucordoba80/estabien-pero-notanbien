class VictoryScene extends Phaser.Scene {
    constructor() { super('Victory'); }

    init(data) {
        this.finalScore = data.score || 0;
        this.livesLeft = data.lives || 0;
        this.savedCount = data.totalSaved || 0;
    }

    create() {
        const f = GAME.FONT;
        this.add.image(400, 300, 'bg_woodlands').setDisplaySize(GAME.W, GAME.H);
        this.add.rectangle(400, 300, GAME.W, GAME.H, 0x000000, 0.3);

        this.add.text(400, 100, 'VICTORIA', { fontSize: '40px', fill: '#ffd700', fontFamily: f }).setOrigin(0.5);
        this.add.text(400, 155, 'Completaste todos los niveles', { fontSize: '14px', fill: '#fff', fontFamily: f }).setOrigin(0.5);
        this.add.text(400, 200, 'Puntaje final: ' + this.finalScore, { fontSize: '18px', fill: '#ffd700', fontFamily: f }).setOrigin(0.5);
        this.add.text(400, 240, 'Personas salvadas: ' + this.savedCount, { fontSize: '14px', fill: '#fff', fontFamily: f }).setOrigin(0.5);
        this.add.text(400, 275, 'Vidas restantes: ' + '❤️'.repeat(Math.max(0, this.livesLeft)), { fontSize: '14px', fill: '#ff6666', fontFamily: f }).setOrigin(0.5);

        this.add.text(400, 340, 'Esta bien que hayas salvado a todos...', { fontSize: '12px', fill: '#aaa', fontFamily: f }).setOrigin(0.5);
        this.add.text(400, 360, 'pero no tan bien porque los encerraste en jaulas', { fontSize: '12px', fill: '#aaa', fontFamily: f }).setOrigin(0.5);

        const btn = this.add.rectangle(400, 430, 220, 60, 0x27ae60, 0.9).setInteractive({ useHandCursor: true });
        const btnText = this.add.text(400, 430, 'JUGAR DE NUEVO', { fontSize: '16px', fill: '#fff', fontFamily: f }).setOrigin(0.5);
        btn.on('pointerover', () => { btn.setFillStyle(0x2ecc71); btnText.setScale(1.05); });
        btn.on('pointerout', () => { btn.setFillStyle(0x27ae60); btnText.setScale(1); });
        btn.on('pointerdown', () => this.scene.start('Level1', { score: 0, lives: GAME.START_LIVES }));

        const menuBtn = this.add.rectangle(400, 510, 220, 50, 0x555, 0.9).setInteractive({ useHandCursor: true });
        const menuText = this.add.text(400, 510, 'MENU', { fontSize: '16px', fill: '#fff', fontFamily: f }).setOrigin(0.5);
        menuBtn.on('pointerover', () => { menuBtn.setFillStyle(0x777); });
        menuBtn.on('pointerout', () => { menuBtn.setFillStyle(0x555); });
        menuBtn.on('pointerdown', () => this.scene.start('Menu'));
    }
}
