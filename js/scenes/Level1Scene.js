class Level1Scene extends Phaser.Scene {
    constructor() { super('Level1'); }

    init(data) {
        this.data.set('score', data.score || 0);
        this.data.set('lives', data.lives || GAME.START_LIVES);
        this.data.set('savedCount', data.savedCount || 0);
    }

    create() {
        sharedCreate(this, 'woodlands');
        this.add.text(400, 70, '🌲 NIVEL 1 - EL BOSQUE 🌲', { fontSize: '22px', fill: '#fff', backgroundColor: '#0008', padding: { x: 16, y: 6 } }).setOrigin(0.5).setDepth(20);

        const cagePos = [{x:100,y:150},{x:400,y:100},{x:700,y:150}];
        cagePos.forEach(p => { const c = this.cages.create(p.x, p.y, 'cage'); c.setData('filled', false); c.refreshBody(); });

        const npcPos = [{x:150,y:350},{x:400,y:300},{x:650,y:350}];
        npcPos.forEach(p => {
            const n = this.npcs.create(p.x, p.y, 'npc');
            n.setData('saved', false).setData('eaten', false);
            n.setCollideWorldBounds(true); n.body.setDrag(500);
        });

        const w = this.wolves.create(400, 30, 'wolf');
        w.setCollideWorldBounds(true);

        this.add.text(400, 540, 'Salva al menos 2 personas', { fontSize: '14px', fill: '#ffd700' }).setOrigin(0.5).setDepth(20);

        this.levelState = 'playing';
    }

    update() {
        if (this.levelState !== 'playing') {
            if (this.levelState === 'complete' && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                this.scene.start('Level2', { score: this.score, lives: this.lives, savedCount: this.savedCount });
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
                this.scene.start('GameOver', { score: this.score, savedCount: this.savedCount, level: 'Bosque' });
            }
        }
    }
}
