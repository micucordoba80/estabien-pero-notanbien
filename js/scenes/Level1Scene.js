class Level1Scene extends Phaser.Scene {
    constructor() { super('Level1'); }

    init(data) {
        this.data.set('score', data.score || 0);
        this.data.set('lives', data.lives || GAME.START_LIVES);
        this.data.set('savedCount', 0);
        this.data.set('totalSaved', data.totalSaved || 0);
        this.data.set('nextScene', 'Level2');
    }

    create() {
        sharedCreate(this, 'woodlands');
        this.add.text(400, 75, 'NIVEL 1 - EL BOSQUE', { fontSize: '16px', fill: '#fff', fontFamily: GAME.FONT, backgroundColor: '#0008', padding: { x: 12, y: 6 } }).setOrigin(0.5).setDepth(20);

        this.playercage.setPosition(700, 120).setVisible(true).refreshBody();
        this.lockText.setPosition(700, 80).setVisible(false);
        this.add.text(700, 100, 'TU JAULA', { fontSize: '11px', fill: '#ffd700', fontFamily: GAME.FONT }).setOrigin(0.5).setDepth(20);

        [{x:120,y:200},{x:400,y:150},{x:680,y:200}].forEach(p => {
            const c = this.cages.create(p.x, p.y, 'cage'); c.setData('filled', false); c.refreshBody();
        });

        [{x:150,y:380},{x:400,y:330},{x:650,y:380}].forEach(p => {
            const n = this.npcs.create(p.x, p.y, 'npc');
            n.setData('saved', false).setData('eaten', false);
            n.setCollideWorldBounds(true); n.body.setDrag(500);
        });

        this.phaseText.setText('🏃 Meté a las 3 personas en las jaulas! ⏱️' + LV.woodlands.timer + 's');
    }

    update(time, delta) { sharedUpdate(this, delta); }
}
