class GameOverScene extends Phaser.Scene {
    constructor() { super('GameOver'); }

    init(data) {
        this.finalScore = data.score || 0;
        this.savedCount = data.totalSaved || 0;
        this.level = data.level || '';
    }

    create() {
        this.add.image(400, 300, 'bg_mountain').setDisplaySize(GAME.W, GAME.H);
        this.add.rectangle(400, 300, GAME.W, GAME.H, 0x000000, 0.5);

        this.add.text(400, 120, '💀 GAME OVER 💀', { fontSize: '52px', fill: '#ff4444', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.text(400, 200, 'Fallaste en: ' + this.level, { fontSize: '22px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 250, 'Puntaje final: ' + this.finalScore, { fontSize: '24px', fill: '#ffd700' }).setOrigin(0.5);
        this.add.text(400, 290, 'Personas salvadas: ' + this.savedCount, { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 340, '"Está bien que lo hayas intentado...\npero no tan bien porque no lo lograste"', { fontSize: '16px', fill: '#aaa', fontStyle: 'italic', align: 'center' }).setOrigin(0.5);

        const btn = this.add.rectangle(400, 430, 220, 60, 0xc0392b, 0.9).setInteractive({ useHandCursor: true });
        const btnText = this.add.text(400, 430, '🔄 REINTENTAR', { fontSize: '24px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        btn.on('pointerover', () => { btn.setFillStyle(0xe74c3c); btnText.setScale(1.05); });
        btn.on('pointerout', () => { btn.setFillStyle(0xc0392b); btnText.setScale(1); });
        btn.on('pointerdown', () => this.scene.start('Level1', { score: 0, lives: GAME.START_LIVES, savedCount: 0 }));

        const menuBtn = this.add.rectangle(400, 510, 220, 50, 0x555, 0.9).setInteractive({ useHandCursor: true });
        const menuText = this.add.text(400, 510, '🏠 MENÚ', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
        menuBtn.on('pointerover', () => { menuBtn.setFillStyle(0x777); });
        menuBtn.on('pointerout', () => { menuBtn.setFillStyle(0x555); });
        menuBtn.on('pointerdown', () => this.scene.start('Menu'));
    }
}
