class Level2Scene extends Phaser.Scene {
    constructor() { super('Level2'); }

    init(data) {
        this.data.set('score', data.score || 0);
        this.data.set('lives', data.lives || GAME.START_LIVES);
        this.data.set('savedCount', data.savedCount || 0);
    }

    create() {
        sharedCreate(this, 'forest');
        this.add.text(400, 70, '🌳 NIVEL 2 - BOSQUE DENSO 🌳', { fontSize: '22px', fill: '#fff', backgroundColor: '#0008', padding: { x: 16, y: 6 } }).setOrigin(0.5).setDepth(20);
        this.add.text(400, 540, 'Salva al menos 3 personas', { fontSize: '14px', fill: '#ffd700' }).setOrigin(0.5).setDepth(20);

        const cagePos = [{x:80,y:200},{x:350,y:120},{x:600,y:80},{x:720,y:250}];
        cagePos.forEach(p => { const c = this.cages.create(p.x, p.y, 'cage'); c.setData('filled', false); c.refreshBody(); });

        const npcPos = [{x:100,y:400},{x:250,y:300},{x:400,y:350},{x:550,y:300},{x:700,y:400}];
        npcPos.forEach(p => {
            const n = this.npcs.create(p.x, p.y, 'npc');
            n.setData('saved', false).setData('eaten', false);
            n.setCollideWorldBounds(true); n.body.setDrag(500);
        });

        const w1 = this.wolves.create(200, 30, 'wolf');
        w1.setCollideWorldBounds(true);
        const w2 = this.wolves.create(600, 30, 'wolf');
        w2.setCollideWorldBounds(true);

        this.add.text(120, 477, '💀', { fontSize: '32px' }).setDepth(1);
        this.add.text(680, 477, '💀', { fontSize: '32px' }).setDepth(1);

        this.levelState = 'playing';
    }

    update() {
        if (this.levelState !== 'playing') {
            if (this.levelState === 'complete' && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                this.scene.start('Level3', { score: this.score, lives: this.lives, savedCount: this.savedCount });
            }
            return;
        }
        sharedUpdate(this);
        this.scoreText.setText('Puntos: ' + this.score);
        this.livesText.setText('Vidas: ' + '❤️'.repeat(Math.max(0, this.lives)));
        this.npcText.setText('Salvados: ' + this.savedCount + '/' + this.totalNpcs);

        const remain = this.npcs.children.entries.filter(n => n.active && !n.getData('saved') && !n.getData('eaten'));
        if (remain.length === 0) {
            if (this.savedCount >= this.minSave) {
                this.levelState = 'complete';
                this.infoText.setText('✅ ¡Completaste el nivel! Presiona ESPACIO');
                this.player.body.setVelocity(0, 0);
                this.wolves.children.iterate(w => { if (w && w.active) w.body.setVelocity(0, 0); });
            } else {
                this.gameOver = true;
                this.scene.start('GameOver', { score: this.score, savedCount: this.savedCount, level: 'Bosque Denso' });
            }
        }
    }
}
