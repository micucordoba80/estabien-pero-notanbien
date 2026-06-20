const GAME = {
    W: 800, H: 600, START_LIVES: 3, PUSH_FORCE: 280,
    INVINCIBLE_MS: 1200
};

const LV = {
    woodlands: { npcs: 3, wolves: 1, wolfSpeed: 120, cages: 3, timer: 30, hasBoss: false },
    forest:    { npcs: 5, wolves: 2, wolfSpeed: 140, cages: 4, timer: 25, hasBoss: false },
    mountain:  { npcs: 6, wolves: 3, wolfSpeed: 160, cages: 5, timer: 20, hasBoss: true }
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
    scene.savedCount = scene.data.get('savedCount') || 0;
    scene.wolfSpeed = cfg.wolfSpeed;
    scene.totalNpcs = cfg.npcs;
    scene.timerStart = cfg.timer;
    scene.levelKey = levelKey;
    scene.gameOver = false;
    scene.gamePhase = 'prep';
    scene.timerDone = false;

    scene.physics.world.setBounds(0, 0, GAME.W, GAME.H);
    scene.add.image(400, 300, 'bg_' + levelKey).setDisplaySize(GAME.W, GAME.H);

    scene.cages = scene.physics.add.staticGroup();
    scene.npcs = scene.physics.add.group();
    scene.wolves = scene.physics.add.group();

    scene.player = scene.physics.add.sprite(400, 500, 'player');
    scene.player.setCollideWorldBounds(true);
    scene.player.setData('invincible', false);
    scene.player.setDepth(10);

    scene.playercage = scene.physics.add.staticImage(0, 0, 'playercage');
    scene.playercage.setScale(1.5).setVisible(false).refreshBody();

    scene.cursors = scene.input.keyboard.createCursorKeys();
    scene.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    scene.timerText = scene.add.text(360, 16, '', { fontSize: '28px', fill: '#fff' }).setDepth(20);
    scene.phaseText = scene.add.text(400, 50, '', { fontSize: '16px', fill: '#ffd700', backgroundColor: '#0008', padding: { x: 10, y: 4 } }).setOrigin(0.5).setDepth(20);
    scene.scoreText = scene.add.text(16, 16, 'Puntos: ' + scene.score, { fontSize: '18px', fill: '#ffd700' }).setDepth(20);
    scene.livesText = scene.add.text(16, 40, 'Vidas: ' + '❤️'.repeat(scene.lives), { fontSize: '18px', fill: '#fff' }).setDepth(20);
    scene.npcText = scene.add.text(600, 16, 'Salvados: 0/' + cfg.npcs, { fontSize: '18px', fill: '#fff' }).setDepth(20);
    scene.infoText = scene.add.text(400, 570, '', { fontSize: '16px', fill: '#fff' }).setOrigin(0.5).setDepth(20);

    scene.physics.add.overlap(scene.player, scene.npcs, onPushNPC, null, scene);
    scene.physics.add.overlap(scene.npcs, scene.cages, onSaveNPC, null, scene);
    scene.physics.add.overlap(scene.player, scene.playercage, onPlayerReachCage, null, scene);
    scene.physics.add.overlap(scene.wolves, scene.npcs, onWolfEat, null, scene);
    scene.physics.add.overlap(scene.wolves, scene.player, onWolfHit, null, scene);
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

        if (scene.timerStart <= 0 && !scene.timerDone) {
            scene.timerDone = true;
            const unsaved = scene.npcs.children.entries.filter(n =>
                n.active && !n.getData('saved') && !n.getData('eaten'));
            if (unsaved.length > 0) {
                scene.gameOver = true;
                scene.phaseText.setText('💀 ¡Alguien quedó afuera!');
                scene.time.delayedCall(800, () => {
                    scene.scene.start('GameOver', { score: scene.score, savedCount: scene.savedCount, level: scene.levelKey });
                });
                return;
            }
            scene.gamePhase = 'escape';
            scene.phaseText.setText('🐺 ¡Llegaron los lobos! Corré a tu jaula! 🏃');
            scene.timerText.setText('🐺 ¡HUYE!');
            scene.timerText.setColor('#ff0000');
            scene.cameras.main.flash(400, 255, 0, 0);
            spawnWolves(scene);
        }
    }

    if (scene.gamePhase === 'escape') {
        scene.wolves.children.iterate(wolf => {
            if (!wolf || !wolf.active) return;
            const spd = wolf.getData('isBoss') ? scene.wolfSpeed * 1.4 : scene.wolfSpeed;
            scene.physics.moveToObject(wolf, scene.player, spd);
        });
    }

    scene.scoreText.setText('Puntos: ' + scene.score);
    scene.livesText.setText('Vidas: ' + '❤️'.repeat(Math.max(0, scene.lives)));
    scene.npcText.setText('Salvados: ' + scene.savedCount + '/' + scene.totalNpcs);
}

function spawnWolves(scene) {
    const cfg = LV[scene.levelKey];
    const edges = [{x:50,y:50},{x:750,y:50},{x:50,y:550},{x:750,y:550}];
    for (let i = 0; i < cfg.wolves; i++) {
        const p = edges[i % edges.length];
        const w = scene.wolves.create(p.x, p.y, 'wolf');
        w.setCollideWorldBounds(true);
    }
    if (cfg.hasBoss) {
        const b = scene.wolves.create(400, -30, 'boss');
        b.setData('isBoss', true);
        b.setCollideWorldBounds(true);
        scene.add.text(400, 68, '🐺 ¡LOBO JEFE!', { fontSize: '14px', fill: '#ff4444', backgroundColor: '#0008', padding: { x: 8, y: 4 } }).setOrigin(0.5).setDepth(20);
    }
}

function onPushNPC(player, npc) {
    if (npc.getData('saved') || npc.getData('eaten')) return;
    const dx = npc.x - player.x;
    const dy = npc.y - player.y;
    const angle = Math.atan2(dy, dx);
    const force = GAME.PUSH_FORCE * (1 + Math.random() * 0.3);
    npc.body.setVelocity(Math.cos(angle) * force, Math.sin(angle) * force);
}

function onSaveNPC(npc, cage) {
    if (npc.getData('saved') || cage.getData('filled')) return;
    npc.setData('saved', true);
    cage.setData('filled', true);
    this.score += 100;
    this.savedCount++;
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
    this.tweens.add({
        targets: player, alpha: 0.2, duration: 100, yoyo: true, repeat: 5,
        onComplete: () => { player.setData('invincible', false); player.setAlpha(1); }
    });
    this.cameras.main.shake(200, 0.008);
    if (this.lives <= 0) {
        this.gameOver = true;
        this.time.delayedCall(500, () => {
            this.scene.start('GameOver', { score: this.score, savedCount: this.savedCount, level: this.levelKey });
        });
    }
}

function onPlayerReachCage(player, cage) {
    if (this.gamePhase !== 'escape' || this.gameOver) return;
    this.gameOver = true;
    this.player.body.setVelocity(0, 0);
    this.wolves.children.iterate(w => { if (w && w.active) w.body.setVelocity(0, 0); });
    this.cameras.main.fade(500, 0, 0, 0);
    this.time.delayedCall(600, () => {
        const next = { score: this.score, lives: this.lives, savedCount: this.savedCount };
        this.scene.start(this.data.get('nextScene'), next);
    });
}

function showFloatingText(s, x, y, msg, color) {
    const t = s.add.text(x, y, msg, { fontSize: '18px', fill: color, fontStyle: 'bold' }).setOrigin(0.5).setDepth(25);
    s.tweens.add({ targets: t, y: y - 50, alpha: 0, duration: 800, onComplete: () => t.destroy() });
}
