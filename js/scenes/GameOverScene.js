class GameOverScene extends Phaser.Scene {
    constructor() { super('GameOver'); }

    init(data) {
        this.finalScore = data.score || 0;
        this.savedCount = data.totalSaved || 0;
        this.level = data.level || '';
    }

    create() {
        const f = GAME.FONT;
        this.add.image(400, 300, 'bg_mountain').setDisplaySize(GAME.W, GAME.H);
        this.add.rectangle(400, 300, GAME.W, GAME.H, 0x000000, 0.5);

        this.add.text(400, 120, 'GAME OVER', { fontSize: '36px', fill: '#ff4444', fontFamily: f }).setOrigin(0.5);
        this.add.text(400, 180, 'Fallaste en: ' + this.level, { fontSize: '14px', fill: '#fff', fontFamily: f }).setOrigin(0.5);
        this.add.text(400, 220, 'Puntaje: ' + this.finalScore, { fontSize: '18px', fill: '#ffd700', fontFamily: f }).setOrigin(0.5);
        this.add.text(400, 260, 'Personas salvadas: ' + this.savedCount, { fontSize: '14px', fill: '#fff', fontFamily: f }).setOrigin(0.5);
        this.add.text(400, 310, 'Esta bien que lo hayas intentado...', { fontSize: '12px', fill: '#aaa', fontFamily: f }).setOrigin(0.5);
        this.add.text(400, 335, 'pero no tan bien porque no lo lograste', { fontSize: '12px', fill: '#aaa', fontFamily: f }).setOrigin(0.5);

        const btn = this.add.rectangle(400, 410, 220, 60, 0xc0392b, 0.9).setInteractive({ useHandCursor: true });
        const btnText = this.add.text(400, 410, 'REINTENTAR', { fontSize: '18px', fill: '#fff', fontFamily: f }).setOrigin(0.5);
        btn.on('pointerover', () => { btn.setFillStyle(0xe74c3c); btnText.setScale(1.05); });
        btn.on('pointerout', () => { btn.setFillStyle(0xc0392b); btnText.setScale(1); });
        btn.on('pointerdown', () => this.scene.start('Level1', { score: 0, lives: GAME.START_LIVES }));

        const menuBtn = this.add.rectangle(400, 490, 220, 50, 0x555, 0.9).setInteractive({ useHandCursor: true });
        const menuText = this.add.text(400, 490, 'MENU', { fontSize: '16px', fill: '#fff', fontFamily: f }).setOrigin(0.5);
        menuBtn.on('pointerover', () => { menuBtn.setFillStyle(0x777); });
        menuBtn.on('pointerout', () => { menuBtn.setFillStyle(0x555); });
        menuBtn.on('pointerdown', () => this.scene.start('Menu'));
    }
}
