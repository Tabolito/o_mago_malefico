export class Fase1 extends Phaser.Scene {
  constructor() {
    super('Fase1');
  }

  preload() {
        this.load.image('Floresta', 'assets/Floresta.jpeg');
        this.load.image('FlorestaChao', 'assets/FlorestaChao.png');
        this.load.atlas('magoAtlas', 'assets/sprites/AndarDoMago.png', 'assets/sprites/AndarDoMago.json');
        this.load.image('FlorestaTitulo', 'assets/aFlorestaPerdida.png')
        this.load.atlas('magoPulo', 'assets/sprites/PuloDoMago.png', 'assets/sprites/PuloDoMago.json')

    }

  create() {


            this.background = this.add.tileSprite(400, 300, 800, 600, 'Floresta');

            const fase2 = this.add.image(400, 100, 'FlorestaTitulo');
            fase2.setScale(0.3);


            this.chao = this.physics.add.staticImage(400, 300, 'FlorestaChao')
         



            this.anims.create({
                key: 'andarMago',
                frames: this.anims.generateFrameNames('magoAtlas', {
                    start: 0,
                    end: 3,
                    zeroPad: 0,
                    prefix: 'AndarDoMago ',
                    suffix: '.aseprite'
                }),
                frameRate: 5,
                repeat: -1
            });

             this.anims.create({
                key: 'PuloMago',
                frames: this.anims.generateFrameNames('magoPulo', {
                    start: 1,
                    end: 5,
                    zeroPad: 0,
                    prefix: 'PuloDoMago ',
                    suffix: '.aseprite'
                }),
                frameRate: 5,
                repeat: 0
            });


            this.player = this.physics.add.sprite(100, 450,'magoAtlas', 'AndarDoMago 0.aseprite'); // nome da imagem carregada no preload

            this.player.setScale(2);

            this.player.setDebug(true);

            this.player.setSize(42, 42);  // Largura, Altura (ajuste conforme seu sprite)
            this.player.setOffset(22, 32); // Deslocamento X, Y (ajuste conforme necessário)
            
            
            this.player.setDebug(true);

            this.physics.add.collider(this.player, this.chao);

            this.cursors = this.input.keyboard.createCursorKeys();

            this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


            this.physics.world.setBounds(0, 0, 1600, 600); // Exemplo: mapa 2x mais largo que a tela

            // Verifica se o player saiu da tela (lado direito)
            this.player.body.setCollideWorldBounds(true);


           
        }

        update() {

            const speed = 160;
            let moving = false;

            if (this.player.x >= this.scale.width - this.player.width / 2) {
                this.scene.start('Fase1_1');
        }

            // Resetar movimento horizontal
            this.player.setVelocityX(0);

            // Movimento lateral
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-speed);
                this.player.setFlipX(true);
                moving = true;
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(speed);
                this.player.setFlipX(false);
                moving = true;
            }

            if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.player.body.onFloor()) {
                this.player.setVelocityY(-400);
                this.player.play('PuloMago', true); // Força a animação imediatamente
            }
            
            // Se está NO AR, toca animação de pulo
            if (!this.player.body.onFloor) {
                if (this.player.anims.getName() !== 'PuloMago') {
                this.player.play('PuloMago', true);
                    }
            return;
            // interrompe o resto
            } 

            // Se está no chão:
            if (moving) {
                if (this.player.anims.getName() !== 'andarMago') {
                this.player.play('andarMago', true);
                }
            } else {
                this.player.setFrame('AndarDoMago 0.aseprite');
            }


            // Verifica se o player chegou no limite d  ireito
            if (this.player.x >= this.cameras.main.width) {
                
                this.comecarTransicaoParaFase2();
            }
         }


            comecarTransicaoParaFase2() {
            // Desativa controles e física
            this.player.setVelocity(0, 0);
            this.cursors.left.enabled = false;
            this.cursors.right.enabled = false;
            this.spaceKey.enabled = false;

   

            // Aguarda o fade completar e inicia a Fase2
             this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Fase1_1', {
                    // Dados persistentes (ex.: vida, itens)
                    //vida: 100,
                    //magias: ['fireball']
                });
            });
    }
}