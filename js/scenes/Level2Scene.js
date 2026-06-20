class Level2Scene extends Phaser.Scene {
    constructor() { super('Level2'); }

    init(data) {
        this.data.set('score', data.score || 0);
        this.data.set('lives', data.lives || GAME.START_LIVES);
        this.data.set('savedCount', 0);
        this.data.set('totalSaved', data.totalSaved || 0);
        this.data.set('nextScene', 'Level3');
    }

    create() {
        sharedCreate(this, 'forest');
        this.add.text(400, 75, 'NIVEL 2 - BOSQUE DENSO', { fontSize: '16px', fill: '#fff', fontFamily: GAME.FONT, backgroundColor: '#0008', padding: { x: 12, y: 6 } }).setOrigin(0.5).setDepth(20);

        this.player.setPosition(400, 80);
        this.playercage.setPosition(100, 120).setVisible(true).refreshBody();
        this.lockText.setPosition(100, 80).setVisible(false);
        this.add.text(100, 100, 'TU JAULA', { fontSize: '11px', fill: '#ffd700', fontFamily: GAME.FONT }).setOrigin(0.5).setDepth(20);

        [{x:150,y:350},{x:250,y:150},{x:400,y:450},{x:550,y:150},{x:700,y:350}].forEach(p => {
            const c = this.cages.create(p.x, p.y, 'cage'); c.setData('filled', false); c.refreshBody();
        });

        [{x:80,y:450},{x:250,y:250},{x:400,y:450},{x:550,y:250},{x:720,y:450}].forEach(p => {
            const n = this.npcs.create(p.x, p.y, 'npc');
            n.setData('saved', false).setData('eaten', false);
            n.setCollideWorldBounds(true); n.body.setDrag(500);
        });

        this.phaseText.setText('🏃 Meté a las 5 personas en las jaulas! ⏱️' + LV.forest.timer + 's');
    }

    update(time, delta) { sharedUpdate(this, delta); }
}
