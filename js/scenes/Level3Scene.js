class Level3Scene extends Phaser.Scene {
    constructor() { super('Level3'); }

    init(data) {
        this.data.set('score', data.score || 0);
        this.data.set('lives', data.lives || GAME.START_LIVES);
        this.data.set('savedCount', data.savedCount || 0);
        this.data.set('nextScene', 'Victory');
    }

    create() {
        sharedCreate(this, 'mountain');
        this.add.text(400, 75, '⛰️ NIVEL 3 - LA MONTAÑA ⛰️', { fontSize: '22px', fill: '#fff', backgroundColor: '#0008', padding: { x: 16, y: 6 } }).setOrigin(0.5).setDepth(20);

        this.playercage.setPosition(400, 500).setVisible(true).refreshBody();
        this.add.text(400, 478, '🏠 TU JAULA', { fontSize: '12px', fill: '#ffd700' }).setOrigin(0.5).setDepth(20);
        this.player.setPosition(400, 80);

        [{x:80,y:150},{x:200,y:400},{x:350,y:150},{x:500,y:400},{x:650,y:150},{x:720,y:350}].forEach(p => {
            const c = this.cages.create(p.x, p.y, 'cage'); c.setData('filled', false); c.refreshBody();
        });

        [{x:100,y:300},{x:200,y:200},{x:350,y:450},{x:500,y:250},{x:650,y:450},{x:700,y:300}].forEach(p => {
            const n = this.npcs.create(p.x, p.y, 'npc');
            n.setData('saved', false).setData('eaten', false);
            n.setCollideWorldBounds(true); n.body.setDrag(500);
        });

        this.phaseText.setText('🏃 Nivel final! Meté a las 6 personas! ⏱️' + LV.mountain.timer + 's');
    }

    update(time, delta) { sharedUpdate(this, delta); }
}
