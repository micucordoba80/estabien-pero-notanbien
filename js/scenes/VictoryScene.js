class VictoryScene extends Phaser.Scene {
    constructor() { super('Victory'); }

    init(data) {
        this.finalScore = data.score || 0;
        this.livesLeft = data.lives || 0;
        this.savedCount = data.savedCount || 0;
    }

    create() {
        this.add.image(400, 300, 'bg_woodlands').setDisplaySize(GAME.W, GAME.H);
        this.add.rectangle(400, 300, GAME.W, GAME.H, 0x000000, 0.3);

        this.add.text(400, 100, '🏆 ¡VICTORIA! 🏆', { fontSize: '52px', fill: '#ffd700', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.text(400, 170, 'Completaste todos los niveles', { fontSize: '22px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 220, 'Puntaje final: ' + this.finalScore, { fontSize: '26px', fill: '#ffd700' }).setOrigin(0.5);
        this.add.text(400, 265, 'Personas salvadas: ' + this.savedCount, { fontSize: '22px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 305, 'Vidas restantes: ' + '❤️'.repeat(Math.max(0, this.livesLeft)), { fontSize: '20px', fill: '#ff6666' }).setOrigin(0.5);

        this.add.text(400, 370, '"Está bien que hayas salvado a todos...\npero no tan bien porque los encerraste en jaulas"', {
            fontSize: '16px', fill: '#aaa', fontStyle: 'italic', align: 'center'
        }).setOrigin(0.5);

        const btn = this.add.rectangle(400, 450, 220, 60, 0x27ae60, 0.9).setInteractive({ useHandCursor: true });
        const btnText = this.add.text(400, 450, '🔄 JUGAR DE NUEVO', { fontSize: '22px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        btn.on('pointerover', () => { btn.setFillStyle(0x2ecc71); btnText.setScale(1.05); });
        btn.on('pointerout', () => { btn.setFillStyle(0x27ae60); btnText.setScale(1); });
        btn.on('pointerdown', () => this.scene.start('Level1', { score: 0, lives: GAME.START_LIVES, savedCount: 0 }));

        const menuBtn = this.add.rectangle(400, 530, 220, 50, 0x555, 0.9).setInteractive({ useHandCursor: true });
        const menuText = this.add.text(400, 530, '🏠 MENÚ', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
        menuBtn.on('pointerover', () => { menuBtn.setFillStyle(0x777); });
        menuBtn.on('pointerout', () => { menuBtn.setFillStyle(0x555); });
        menuBtn.on('pointerdown', () => this.scene.start('Menu'));
    }
}
