class Level3Scene extends Phaser.Scene {
    constructor() { super('Level3'); }

    init(data) {
        this.data.set('score', data.score || 0);
        this.data.set('lives', data.lives || GAME.START_LIVES);
        this.data.set('savedCount', data.savedCount || 0);
    }

    create() {
        sharedCreate(this, 'mountain');
        this.add.text(400, 70, '⛰️ NIVEL 3 - LA MONTAÑA ⛰️', { fontSize: '22px', fill: '#fff', backgroundColor: '#0008', padding: { x: 16, y: 6 } }).setOrigin(0.5).setDepth(20);
        this.add.text(400, 540, 'Salva al menos 4 personas | ¡Evita al LOBO JEFE!', { fontSize: '14px', fill: '#ff4444' }).setOrigin(0.5).setDepth(20);

        [
            {x:100,y:500},{x:250,y:120},{x:400,y:500},{x:550,y:120},{x:700,y:500}
        ].forEach(p => { const c = this.cages.create(p.x, p.y, 'cage'); c.setData('filled', false); c.refreshBody(); });

        [
            {x:100,y:300},{x:200,y:400},{x:400,y:250},{x:500,y:350},{x:650,y:250},{x:700,y:380}
        ].forEach(p => {
            const n = this.npcs.create(p.x, p.y, 'npc');
            n.setData('saved', false).setData('eaten', false);
            n.setCollideWorldBounds(true); n.body.setDrag(500);
        });

        const w1 = this.wolves.create(50, 100, 'wolf'); w1.setCollideWorldBounds(true);
        const w2 = this.wolves.create(400, 50, 'wolf'); w2.setCollideWorldBounds(true);
        const w3 = this.wolves.create(750, 100, 'wolf'); w3.setCollideWorldBounds(true);

        const boss = this.wolves.create(400, 20, 'boss');
        boss.setData('isBoss', true); boss.setCollideWorldBounds(true);

        this.levelState = 'playing';
    }

    update() {
        if (this.levelState !== 'playing') {
            if (this.levelState === 'complete' && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                this.scene.start('Victory', { score: this.score, lives: this.lives, savedCount: this.savedCount });
            }
            return;
        }
        sharedUpdate(this);

        this.wolves.children.iterate(wolf => {
            if (!wolf || !wolf.active || !wolf.getData('isBoss')) return;
            this.physics.moveToObject(wolf, this.player, this.wolfSpeed * 1.4);
        });

        this.scoreText.setText('Puntos: ' + this.score);
        this.livesText.setText('Vidas: ' + '❤️'.repeat(Math.max(0, this.lives)));
        this.npcText.setText('Salvados: ' + this.savedCount + '/' + this.totalNpcs);

        const remain = this.npcs.children.entries.filter(n => n.active && !n.getData('saved') && !n.getData('eaten'));
        if (remain.length === 0) {
            if (this.savedCount >= this.minSave) {
                this.levelState = 'complete';
                this.infoText.setText('🏆 ¡Ganaste! Presiona ESPACIO');
                this.player.body.setVelocity(0, 0);
                this.wolves.children.iterate(w => { if (w && w.active) w.body.setVelocity(0, 0); });
            } else {
                this.gameOver = true;
                this.scene.start('GameOver', { score: this.score, savedCount: this.savedCount, level: 'Montaña' });
            }
        }
    }
}
