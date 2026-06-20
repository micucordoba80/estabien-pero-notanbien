class BootScene extends Phaser.Scene {
    constructor() { super('Boot'); }

    create() {
        const g = this.make.graphics({ add: false });

        g.fillStyle(0x3498db); g.fillRect(4, 0, 24, 36); g.fillStyle(0x5dade2); g.fillCircle(16, 10, 10);
        g.generateTexture('player', 32, 40);
        g.clear();

        g.fillStyle(0xf39c12); g.fillRect(4, 0, 24, 36); g.fillStyle(0xf7c948); g.fillCircle(16, 10, 10);
        g.generateTexture('npc', 32, 40);
        g.clear();

        g.fillStyle(0x444444); g.fillRect(0, 4, 40, 20); g.fillStyle(0x666); g.fillTriangle(4, 4, 12, 4, 8, 0); g.fillTriangle(20, 4, 28, 4, 24, 0);
        g.fillStyle(0x222); g.fillCircle(10, 16, 4); g.fillCircle(30, 16, 4);
        g.generateTexture('wolf', 40, 28);
        g.clear();

        g.lineStyle(3, 0x8B4513); g.strokeRect(2, 2, 28, 28); g.lineBetween(2, 10, 30, 10); g.lineBetween(2, 18, 30, 18);
        g.lineBetween(15, 2, 15, 30); g.lineStyle(1, 0x654321); g.strokeRect(0, 0, 32, 32);
        g.generateTexture('cage', 32, 32);
        g.clear();

        g.fillStyle(0x8B0000); g.fillRect(0, 4, 52, 26); g.fillStyle(0xcc0000); g.fillTriangle(6, 4, 16, 4, 11, 0); g.fillTriangle(26, 4, 36, 4, 31, 0);
        g.fillStyle(0x440000); g.fillCircle(12, 20, 6); g.fillCircle(40, 20, 6); g.fillStyle(0xff0000); g.fillCircle(12, 18, 2); g.fillCircle(40, 18, 2);
        g.generateTexture('boss', 52, 32);
        g.clear();

        g.fillStyle(0xff0000, 0.35); g.fillCircle(16, 16, 16); g.lineStyle(2, 0xff0000, 0.6); g.strokeCircle(16, 16, 16);
        g.generateTexture('warning', 32, 32);
        g.clear();

        g.fillStyle(0x2d5a27); g.fillRect(0, 0, 16, 16);
        g.generateTexture('bg_woodlands', 16, 16);
        g.clear();

        g.fillStyle(0x1a4a1a); g.fillRect(0, 0, 16, 16); g.fillStyle(0x2a5a2a); g.fillRect(0, 0, 8, 8); g.fillRect(8, 8, 8, 8);
        g.generateTexture('bg_forest', 16, 16);
        g.clear();

        g.fillStyle(0x1a1a3a); g.fillRect(0, 0, 16, 16); g.fillStyle(0x2a2a4a); g.fillCircle(8, 8, 4);
        g.generateTexture('bg_mountain', 16, 16);
        g.clear();

        g.fillStyle(0xffd700); g.fillRect(0, 0, 10, 10);
        g.generateTexture('coin', 10, 10);
        g.clear();

        g.lineStyle(4, 0xffd700); g.strokeRect(0, 0, 36, 36);
        g.lineStyle(2, 0xffaa00); g.strokeRect(2, 2, 32, 32);
        g.lineBetween(0, 12, 36, 12); g.lineBetween(0, 24, 36, 24);
        g.lineBetween(18, 0, 18, 36);
        g.fillStyle(0xffd700, 0.15); g.fillRect(0, 0, 36, 36);
        g.generateTexture('playercage', 36, 36);
        g.clear();

        g.destroy();
        this.scene.start('Menu');
    }
}
