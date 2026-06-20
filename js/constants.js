const GAME = { W: 800, H: 600, START_LIVES: 3, PUSH_FORCE: 280, INVINCIBLE_MS: 1200, FONT: 'Arial, sans-serif' };
const LV = {
    woodlands: { npcs: 3, wolves: 1, wolfSpeed: 120, cages: 3, timer: 30, hasBoss: false },
    forest:    { npcs: 5, wolves: 2, wolfSpeed: 140, cages: 5, timer: 60, hasBoss: false },
    mountain:  { npcs: 6, wolves: 3, wolfSpeed: 160, cages: 6, timer: 80, hasBoss: true }
};

function getNearest(target, group, excludeSaved) {
    let nearest = null, minDist = Infinity;
    group.children.iterate(item => {
        if (excludeSaved && item.getData('saved')) return;
        const d = Phaser.Math.Distance.Between(target.x, target.y, item.x, item.y);
        if (d < minDist) { minDist = d; nearest = item; }
    });
    return nearest;
}

function sharedCreate(scene, levelKey) {
    const cfg = LV[levelKey];
    scene.score = scene.data.get('score') || 0;
    scene.lives = scene.data.get('lives') || GAME.START_LIVES;
    scene.savedCount = 0;
    scene.totalSaved = scene.data.get('totalSaved') || 0;
    scene.wolfSpeed = cfg.wolfSpeed;
    scene.totalNpcs = cfg.npcs;
    scene.timerStart = cfg.timer;
    scene.levelKey = levelKey;
    scene.gameOver = false;
    scene.gamePhase = 'prep';
    scene.timerDone = false;
    scene.keySpawned = false;
    scene.keyCollected = false;

    scene.physics.world.setBounds(0, 0, GAME.W, GAME.H);
    scene.add.image(400, 300, 'bg_' + levelKey).setDisplaySize(GAME.W, GAME.H);

    scene.cages = scene.physics.add.staticGroup();
    scene.npcs = scene.physics.add.group();
    scene.wolves = scene.physics.add.group();

    scene.player = scene.physics.add.sprite(400, 500, 'player');
    scene.player.setCollideWorldBounds(true).setData('invincible', false).setDepth(10);

    scene.playercage = scene.physics.add.staticImage(0, 0, 'playercage').setScale(1.5).setVisible(false).refreshBody();

    scene.keyItem = scene.physics.add.sprite(0, 0, 'key');
    scene.keyItem.setVisible(false);
    scene.keyItem.body.enable = false;

    scene.lockText = scene.add.text(0, 0, '🔒', { fontSize: '22px' }).setDepth(20).setVisible(false);
    scene.cursors = scene.input.keyboard.createCursorKeys();
    scene.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    const f = GAME.FONT;
    const bi = { fontSize: '16px', fill: '#fff', fontFamily: f };
    scene.timerText = scene.add.text(360, 16, '', { fontSize: '22px', fill: '#fff', fontFamily: f }).setDepth(20);
    scene.phaseText = scene.add.text(400, 50, '', { fontSize: '14px', fill: '#ffd700', fontFamily: f, backgroundColor: '#0008', padding: { x: 10, y: 4 } }).setOrigin(0.5).setDepth(20);
    scene.scoreText = scene.add.text(16, 16, 'Puntos: ' + scene.score, bi).setDepth(20);
    scene.livesText = scene.add.text(16, 40, 'Vidas: ' + '❤️'.repeat(scene.lives), bi).setDepth(20);
    scene.npcText = scene.add.text(600, 16, 'Salvados: 0/' + cfg.npcs, bi).setDepth(20);
    scene.infoText = scene.add.text(400, 570, '', { fontSize: '12px', fill: '#fff', fontFamily: f }).setOrigin(0.5).setDepth(20);

    scene.physics.add.overlap(scene.player, scene.npcs, onPushNPC, null, scene);
    scene.physics.add.overlap(scene.npcs, scene.cages, onSaveNPC, null, scene);
    scene.physics.add.overlap(scene.player, scene.playercage, onPlayerReachCage, null, scene);
    scene.physics.add.overlap(scene.wolves, scene.npcs, onWolfEat, null, scene);
    scene.physics.add.overlap(scene.wolves, scene.player, onWolfHit, null, scene);
    scene.physics.add.overlap(scene.player, scene.keyItem, onCollectKey, null, scene);
}

function sharedUpdate(scene, delta) {
    if (scene.gameOver) return;
    const dt = delta / 1000;
    const speed = 180;
    scene.player.body.setVelocity(0);
    if (scene.cursors.left.isDown) scene.player.body.setVelocityX(-speed);
    else if (scene.cursors.right.isDown) scene.player.body.setVelocityX(speed);
    if (scene.cursors.up.isDown) scene.player.body.setVelocityY(-speed);
    else if (scene.cursors.down.isDown) scene.player.body.setVelocityY(speed);

    if (scene.gamePhase === 'prep') {
        scene.timerStart -= dt;
        const t = Math.max(0, Math.ceil(scene.timerStart));
        scene.timerText.setText('⏱ ' + t);
        scene.timerText.setColor(t <= 5 ? '#ff4444' : '#fff');
        if (!scene.keySpawned && scene.savedCount >= scene.totalNpcs) spawnKey(scene);

        if (scene.timerStart <= 0 && !scene.timerDone) {
            scene.timerDone = true;
            const unsaved = scene.npcs.children.entries.filter(n => n.active && !n.getData('saved') && !n.getData('eaten'));
            if (unsaved.length > 0) {
                scene.gameOver = true;
                scene.phaseText.setText('💀 ¡Se acabó el tiempo! Alguien quedó afuera');
                scene.time.delayedCall(800, () => scene.scene.start('GameOver', { score: scene.score, level: scene.levelKey, totalSaved: scene.totalSaved }));
                return;
            }
            scene.gamePhase = 'escape';
            scene.phaseText.setText('🐺 ¡Llegaron los lobos! Agarrá la llave y escapá!');
            scene.timerText.setText('🐺 ¡HUYE!').setColor('#ff0000');
            scene.cameras.main.flash(400, 255, 0, 0);
            spawnWolves(scene);
            if (!scene.keySpawned) spawnKey(scene);
        }
    }

    if (scene.gamePhase === 'escape') {
        scene.wolves.children.iterate(wolf => {
            if (!wolf || !wolf.active) return;
            const spd = wolf.getData('isBoss') ? scene.wolfSpeed * 1.4 : scene.wolfSpeed;
            scene.physics.moveToObject(wolf, scene.player, spd);
        });
        if (!scene.keySpawned && scene.savedCount >= scene.totalNpcs) spawnKey(scene);
    }
    scene.scoreText.setText('Puntos: ' + scene.score);
    scene.livesText.setText('Vidas: ' + '❤️'.repeat(Math.max(0, scene.lives)));
    scene.npcText.setText('Salvados: ' + scene.savedCount + '/' + scene.totalNpcs);
}

function spawnKey(scene) {
    if (scene.keySpawned) return;
    const x = Phaser.Math.Between(80, 720);
    const y = Phaser.Math.Between(80, 520);
    scene.keyItem.setPosition(x, y).setVisible(true);
    scene.keyItem.body.enable = true;
    scene.keySpawned = true;
    scene.lockText.setVisible(true);
    scene.tweens.add({ targets: scene.keyItem, y: y - 8, duration: 600, yoyo: true, repeat: -1 });
    showFloatingText(scene, x, y - 20, '🔑 Llave!', '#ffd700');
    scene.infoText.setText('🔑 Apareció una llave! Agarrála para abrir tu jaula!');
}

function spawnWolves(scene) {
    const cfg = LV[scene.levelKey];
    const edges = [{x:50,y:50},{x:750,y:50},{x:50,y:550},{x:750,y:550}];
    for (let i = 0; i < cfg.wolves; i++) {
        const w = scene.wolves.create(edges[i % 4].x, edges[i % 4].y, 'wolf');
        w.setCollideWorldBounds(true);
    }
    if (cfg.hasBoss) {
        const b = scene.wolves.create(400, -30, 'boss').setData('isBoss', true);
        b.setCollideWorldBounds(true);
        scene.add.text(400, 68, 'LOBO JEFE', { fontSize: '12px', fill: '#ff4444', fontFamily: GAME.FONT, backgroundColor: '#0008', padding: { x: 8, y: 4 } }).setOrigin(0.5).setDepth(20);
    }
}

function onPushNPC(player, npc) {
    if (npc.getData('saved') || npc.getData('eaten')) return;
    const dx = npc.x - player.x, dy = npc.y - player.y;
    const a = Math.atan2(dy, dx), f = GAME.PUSH_FORCE * (1 + Math.random() * 0.3);
    npc.body.setVelocity(Math.cos(a) * f, Math.sin(a) * f);
}

function onSaveNPC(npc, cage) {
    if (npc.getData('saved') || cage.getData('filled')) return;
    npc.setData('saved', true);
    cage.setData('filled', true);
    this.score += 100;
    this.savedCount++;
    this.totalSaved++;
    npc.setTint(0x00ff00);
    npc.body.setVelocity(0, 0);
    npc.body.enable = false;
    showFloatingText(this, npc.x, npc.y - 20, '+100', '#ffd700');
}

function onWolfEat(wolf, npc) {
    if (npc.getData('saved') || npc.getData('eaten')) return;
    npc.setData('eaten', true);
    npc.setTint(0xff0000);
    npc.body.enable = false;
}

function onWolfHit(wolf, player) {
    if (player.getData('invincible') || this.gameOver) return;
    this.lives--;
    player.setData('invincible', true);
    this.tweens.add({ targets: player, alpha: 0.2, duration: 100, yoyo: true, repeat: 5,
        onComplete: () => { player.setData('invincible', false).setAlpha(1); } });
    this.cameras.main.shake(200, 0.008);
    if (this.lives <= 0) {
        this.gameOver = true;
        this.time.delayedCall(500, () => this.scene.start('GameOver', {
            score: this.score, level: this.levelKey, totalSaved: this.totalSaved }));
    }
}

function onCollectKey(player, key) {
    if (this.keyCollected || !key.visible) return;
    this.keyCollected = true;
    this.keyItem.setVisible(false);
    this.keyItem.body.enable = false;
    this.lockText.setText('🔓');
    showFloatingText(this, this.playercage.x, this.playercage.y - 30, '🔓 ¡Jaula abierta!', '#ffd700');
    this.infoText.setText('🏃 Corré a tu jaula!');
}

function onPlayerReachCage(player, cage) {
    if (this.gameOver) return;
    if (!this.keyCollected) {
        showFloatingText(this, player.x, player.y - 30, '🔒 ¡Necesitás la llave!', '#ff4444');
        return;
    }
    if (this.gamePhase === 'escape') this.wolves.children.iterate(w => { if (w && w.active) w.body.setVelocity(0, 0); });
    this.gameOver = true;
    this.player.body.setVelocity(0, 0);
    this.cameras.main.fade(500, 0, 0, 0);
    this.time.delayedCall(600, () => this.scene.start(this.data.get('nextScene'), {
        score: this.score, lives: this.lives, savedCount: 0, totalSaved: this.totalSaved }));
}

function showFloatingText(s, x, y, msg, color) {
    const t = s.add.text(x, y, msg, { fontSize: '16px', fill: color, fontFamily: GAME.FONT }).setOrigin(0.5).setDepth(25);
    s.tweens.add({ targets: t, y: y - 50, alpha: 0, duration: 800, onComplete: () => t.destroy() });
}
