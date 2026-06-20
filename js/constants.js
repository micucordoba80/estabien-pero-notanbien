const GAME = {
    W: 800, H: 600, START_LIVES: 3, PUSH_FORCE: 280,
    WARN_RADIUS: 130, INVINCIBLE_MS: 1200
};

const LV = {
    woodlands: { npcs: 3, wolves: 1, minSave: 2, wolfSpeed: 55, cages: 3, hasBoss: false },
    forest:    { npcs: 5, wolves: 2, minSave: 3, wolfSpeed: 80, cages: 4, hasBoss: false },
    mountain:  { npcs: 6, wolves: 3, minSave: 4, wolfSpeed: 100, cages: 5, hasBoss: true }
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
    scene.minSave = cfg.minSave;
    scene.totalNpcs = cfg.npcs;
    scene.levelKey = levelKey;
    scene.gameOver = false;

    scene.physics.world.setBounds(0, 0, GAME.W, GAME.H);
    scene.add.image(400, 300, 'bg_' + levelKey).setDisplaySize(GAME.W, GAME.H);

    scene.cages = scene.physics.add.staticGroup();
    scene.npcs = scene.physics.add.group();
    scene.wolves = scene.physics.add.group();

    scene.player = scene.physics.add.sprite(400, 500, 'player');
    scene.player.setCollideWorldBounds(true);
    scene.player.setData('invincible', false);
    scene.player.setDepth(10);

    scene.cursors = scene.input.keyboard.createCursorKeys();
    scene.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    scene.scoreText = scene.add.text(16, 16, 'Puntos: 0', { fontSize: '20px', fill: '#ffd700' }).setDepth(20);
    scene.livesText = scene.add.text(16, 44, 'Vidas: ❤❤❤', { fontSize: '20px', fill: '#fff' }).setDepth(20);
    scene.npcText = scene.add.text(600, 16, 'Salvados: 0/' + cfg.npcs, { fontSize: '20px', fill: '#fff' }).setDepth(20);
    scene.infoText = scene.add.text(400, 570, '', { fontSize: '16px', fill: '#fff' }).setOrigin(0.5).setDepth(20);

    scene.physics.add.overlap(scene.player, scene.npcs, onPushNPC, null, scene);
    scene.physics.add.overlap(scene.npcs, scene.cages, onSaveNPC, null, scene);
    scene.physics.add.overlap(scene.wolves, scene.npcs, onWolfEat, null, scene);
    scene.physics.add.overlap(scene.wolves, scene.player, onWolfHit, null, scene);
}

function sharedUpdate(scene) {
    if (scene.gameOver) return;
    const speed = 180;
    scene.player.body.setVelocity(0);
    if (scene.cursors.left.isDown) scene.player.body.setVelocityX(-speed);
    else if (scene.cursors.right.isDown) scene.player.body.setVelocityX(speed);
    if (scene.cursors.up.isDown) scene.player.body.setVelocityY(-speed);
    else if (scene.cursors.down.isDown) scene.player.body.setVelocityY(speed);

    scene.wolves.children.iterate(wolf => {
        if (!wolf || !wolf.active || wolf.getData('isBoss')) return;
        const target = getNearest(wolf, scene.npcs, true);
        if (target) {
            scene.physics.moveToObject(wolf, target, scene.wolfSpeed);
            const dist = Phaser.Math.Distance.Between(wolf.x, wolf.y, target.x, target.y);
            const warn = wolf.getData('warnSprite');
            if (dist < GAME.WARN_RADIUS) {
                if (!warn) {
                    const w = scene.add.image(target.x, target.y, 'warning').setAlpha(0.4).setDepth(1).setScale(1.5);
                    wolf.setData('warnSprite', w);
                } else {
                    warn.setPosition(target.x, target.y);
                }
            } else {
                if (warn) { warn.destroy(); wolf.setData('warnSprite', null); }
            }
        }
    });
}

function onPushNPC(player, npc) {
    if (npc.getData('saved') || npc.getData('eaten')) return;
    const dx = npc.x - player.x;
    const dy = npc.y - player.y;
    const angle = Math.atan2(dy, dx);
    npc.body.setVelocity(Math.cos(angle) * GAME.PUSH_FORCE, Math.sin(angle) * GAME.PUSH_FORCE);
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
    showFloatingText(this, npc.x, npc.y - 20, '¡Perdido!', '#ff0000');
    const warn = wolf.getData('warnSprite');
    if (warn) { warn.destroy(); wolf.setData('warnSprite', null); }
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

function showFloatingText(s, x, y, msg, color) {
    const t = s.add.text(x, y, msg, { fontSize: '18px', fill: color, fontStyle: 'bold' }).setOrigin(0.5).setDepth(25);
    s.tweens.add({ targets: t, y: y - 50, alpha: 0, duration: 800, onComplete: () => t.destroy() });
}
