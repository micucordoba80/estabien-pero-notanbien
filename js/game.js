const config = {
    type: Phaser.AUTO,
    width: GAME.W,
    height: GAME.H,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [BootScene, MenuScene, Level1Scene, Level2Scene, Level3Scene, GameOverScene, VictoryScene]
};

const game = new Phaser.Game(config);
