var config = {
    type: Phaser.AUTO,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false
        }
    },

    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var score = 0;
var numBombas = 0;
var aguaAzul;
var aguaVerde;
var lava;
var platforms;
var redDiamonds;
var blueDiamonds;
var portoes;
var player;
var player2;
var playButton;
function preload() {
    //CARREGAR IMAGENS E SPRITESHEETS
    this.load.image('background', 'assets/background.png');
    this.load.image('barraVertical', 'assets/barraVertical.png');
    this.load.image('barraHorizontal', 'assets/barraHorizontal.png');
    this.load.image('barraVertical2', 'assets/barraVertical2.png');
    this.load.image('barraHorizontal2', 'assets/barraHorizontal2.png');
    this.load.image('contorno', 'assets/contorno.png')
    this.load.image('diamanteAzul', 'assets/diamanteAzul.png');
    this.load.image('diamanteVermelho', 'assets/diamanteVermelho.png');
    this.load.image('agua', 'assets/agua.png');
    this.load.image('aguaVerde', 'assets/aguaVerde.png');
    this.load.image('lava', 'assets/lava.png');
    this.load.image('titulo', 'assets/titulo.png');
    this.load.image("playbutton", "assets/playbutton.png");
    this.load.image('bomb', 'assets/bomb.png');
    this.load.audio("death", ["assets/death.mp3", "assets/death.ogg"]);

    this.load.spritesheet('playerVermelho', 'assets/playerVermelho.png', {
        frameWidth: 32, frameHeight: 48
    });
    this.load.spritesheet('playerAzul', 'assets/playerAzul.png', {
        frameWidth: 32, frameHeight: 48
    });

    this.load.image('portao1', 'assets/portao1.png');
    this.load.image('portao4', 'assets/portao4.png');
    this.load.image('fimJogo', 'assets/fimDeJogo.png');
    this.load.audio("pick", ["assets/pick.ogg", "assets/pick.mp3"]);
    this.load.audio("somFundo", ["assets/somFundo.mp3", "assets/somFundo.mp3"]);
    this.load.audio("levelUp", ["assets/levelUp.mp3", "assets/levelUp.mp3"]);
}


function create() {
    //CRIA OS SONS

    const pickSound = this.sound.add('pick', {
        volume:0.5
    });
    somFundo = this.sound.add('somFundo',{
        volume: 0.05
    });

    somFundo.play();

    this.deathSound = this.sound.add("death");

    this.levelUpSound = this.sound.add('levelUp');



    //ADICIONA O BACKGROUND
    this.add.image(400, 300, 'background')


        // CRIAR TITULO DO JOGO

    //CRIA GRUPO DE FÍSICA ESTÁTICA E ATRIBUI À VARIÁVEL PLATFORMS
    platforms = this.physics.add.staticGroup();




    //ADICIONA E CONFIGURA O CHÃO
    ground = this.physics.add.sprite(400, 600, "barraHorizontal2");
    ground.setOrigin(0, 0);
    ground.setCollideWorldBounds(true);

    //ADICIONA PLATAFORMAS AO BACKGROUND
    platforms.create(270, 455, 'barraHorizontal2');
    platforms.create(161, 521, 'barraHorizontal');
    platforms.create(461, 521, 'barraHorizontal');
    platforms.create(755, 535, 'barraHorizontal');
    platforms.create(755, 549, 'barraHorizontal');
    platforms.create(755, 563, 'barraHorizontal');
    platforms.create(755, 577, 'barraHorizontal');
    platforms.create(530, 335, 'barraHorizontal2');
    platforms.create(270, 114, 'barraHorizontal2');
    platforms.create(300, 280, 'barraHorizontal');
    platforms.create(445, 250, 'barraHorizontal');
    platforms.create(590, 220, 'barraHorizontal');
    platforms.create(725, 190, 'barraHorizontal');
    platforms.create(40, 390, 'barraHorizontal');

    //ADICIONAR AGUA AZUL E CONFIGURAR

    aguaAzul = this.physics.add.staticGroup();
    aguaAzul.create(305, 451, 'agua');
    aguaAzul.create(161, 587, 'agua');
    aguaAzul.create(300,110,'agua')
    aguaAzul.create(461,514,'agua')

    this.physics.add.collider(aguaAzul);

    //ADICIONAR AGUA VERDE E CONFIGURAR

    aguaVerde = this.physics.add.staticGroup();
    aguaVerde.create(305, 451,'aguaVerde');
    aguaVerde.create(300,331,'aguaVerde');
    aguaVerde.create(340,331,'aguaVerde');
    aguaVerde.create(380,331,'aguaVerde');
    aguaVerde.create(420,331,'aguaVerde');
    aguaVerde.create(460,331,'aguaVerde');
    aguaVerde.create(500,331,'aguaVerde');
    aguaVerde.create(540,331,'aguaVerde');
    aguaVerde.create(580,331,'aguaVerde');


    this.physics.add.collider(aguaVerde);

    //ADICIONAR LAVA E CONFIGURAR

    lava = this.physics.add.staticGroup();
    lava.create(461, 587, 'lava');
    lava.create(500,110,'lava')
    lava.create(161,514,'lava')
    this.physics.add.collider(lava);

    //ADICIONAR BOMBAS

    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);


    //ADICIONAR PORTOES

    portoes = this.physics.add.staticGroup();
    portoes.create(65, 75, 'portao1');

    var tocaportao = false;

    //ADICIONA O TETO
    platforms.create(400, 9, 'barraHorizontal2');

    //ADICIONA PAREDES
    platforms.create(7, 300, 'barraVertical2');
    platforms.create(792, 300, 'barraVertical2');


    //BONECO VERMELHO

    player = this.physics.add.sprite(25, 500, 'playerVermelho');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(400);

    //ANIMAÇÕES BONECO VERMELHO
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('playerVermelho', {start: 3, end: 0}),
        frameRate: 10,
        repeat: -1
    })


    this.anims.create({
        key: 'turn',
        frames: [{key: 'playerVermelho', frame: 4}],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('playerVermelho', {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, ground);

    //BONECO AZUL

    player2 = this.physics.add.sprite(20, 500, 'playerAzul');
    player2.setBounce(0.2);
    player2.setCollideWorldBounds(true);
    player2.body.setGravityY(400);


    //ANIMAÇÕES BONECO AZUL
    this.anims.create({
        key: 'esquerda',
        frames: this.anims.generateFrameNumbers('playerAzul', {start: 3, end: 0}),
        frameRate: 10,
        repeat: -1
    })

    this.anims.create({
        key: 'virar',
        frames: [{key: 'playerAzul', frame: 4}],
        frameRate: 20
    });

    this.anims.create({
        key: 'direita',
        frames: this.anims.generateFrameNumbers('playerAzul', {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
    });


    this.physics.add.collider(player2, platforms)
    this.physics.add.collider(player2, ground)

    //ADICIONA OS DIAMANTES E CONFIGURA

    blueDiamonds = this.physics.add.group();
    redDiamonds = this.physics.add.group();

    function adicionarDiamantes(){
        redDiamonds.create(150,0,'diamanteVermelho')
        redDiamonds.create(200,100,'diamanteVermelho')
        redDiamonds.create(420,120,'diamanteVermelho')
        redDiamonds.create(30,150,'diamanteVermelho')
        redDiamonds.create(150,450,'diamanteVermelho')
        redDiamonds.create(290,395,'diamanteVermelho')

        blueDiamonds.create(200,0,'diamanteAzul')
        blueDiamonds.create(330,100,'diamanteAzul')
        blueDiamonds.create(700,120,'diamanteAzul')
        blueDiamonds.create(715,400,'diamanteAzul')
        blueDiamonds.create(485,450,'diamanteAzul')
        blueDiamonds.create(320,395,'diamanteAzul')

        redDiamonds.children.iterate(function (child) {
            child.setScale(0.5);
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));

        });

        blueDiamonds.children.iterate(function (child) {
            child.setScale(0.5);
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));

        });


    }
    adicionarDiamantes();


    this.physics.add.collider(blueDiamonds, platforms);
    this.physics.add.collider(blueDiamonds, ground);

    this.physics.add.collider(redDiamonds, platforms);
    this.physics.add.collider(redDiamonds, ground);

    //COLETAR DIAMANTES
    this.physics.add.overlap(player2, blueDiamonds, collectBlueDiamonds, null, this);

    function collectBlueDiamonds(playerAzul, diamanteAzul) {
        diamanteAzul.disableBody(true, true);
        score += 10;
        scoreText.setText('Score: ' + score);
        pickSound.play();

    }

    this.physics.add.overlap(player, redDiamonds, collectRedDiamonds, null, this);

    function collectRedDiamonds(playerVermelho, diamanteVermelho) {
        diamanteVermelho.disableBody(true, true);
        score += 10;
        scoreText.setText('Score: ' + score);
        pickSound.play();


    }



    var scoreText;

    scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000000'});




}

function update() {


    arrows = this.input.keyboard.createCursorKeys();
    cursors = this.input.keyboard.addKeys({
        'up': Phaser.Input.Keyboard.KeyCodes.W,
        'down': Phaser.Input.Keyboard.KeyCodes.S,
        'left': Phaser.Input.Keyboard.KeyCodes.A,
        'right': Phaser.Input.Keyboard.KeyCodes.D
    });

    //CONTROLOS PARA O JOGADOR AZUL
    if (arrows.left.isDown) {
        player2.setVelocityX(-200);

        player2.anims.play('esquerda', true);


    } else if (arrows.right.isDown) {
        player2.setVelocityX(200);

        player2.anims.play('direita', true);


    } else {
        player2.setVelocityX(0);

        player2.anims.play('virar');


    }

    if (arrows.up.isDown && player2.body.touching.down) {
        player2.setVelocityY(-330);


    }
//CONTROLOS PARA O JOGADOR VERMELHO
    if (cursors.left.isDown) {
        //SE A TECLA A FOR APERTADA...
        player.setVelocityX(-200);

        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        //SE A TECLA D FOR APERTADA...
        player.setVelocityX(200);

        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        //SE A TECLA W FOR APERTADA E O JOGADOR ESTIVER NO CHÃO O JOGADOR VAI SALTAR
        player.setVelocityY(-330);
    }

    this.physics.add.overlap(player, aguaAzul, killplayer, null, this);
    this.physics.add.overlap(player2, lava, killplayer, null, this);
    this.physics.add.overlap(player2, aguaVerde, killplayer, null, this);
    this.physics.add.overlap(player, aguaVerde, killplayer, null, this);


    function killplayer(player) {
        {
            this.physics.pause();

            player.setTint(0xff0000);

            player.anims.play('turn');

            gameOver = true;
            somFundo.stop();
            this.deathSound.play();
            bombs.setVisible(false);
            platforms.setVisible(false);
            aguaVerde.setVisible(false);
            redDiamonds.setVisible(false);
            blueDiamonds.setVisible(false);
            portoes.setVisible(false);
            aguaAzul.setVisible(false);
            lava.setVisible(false);
            this.add.image(400,300, 'fimJogo').setScale(0.3);

        }

    }

    this.physics.add.collider(player, portoes, hitPortao, null, this);
    this.physics.add.collider(player2, portoes, hitPortao, null, this);

    function adicionarDiamantes(){
        redDiamonds.create(150,0,'diamanteVermelho')
        redDiamonds.create(200,100,'diamanteVermelho')
        redDiamonds.create(420,120,'diamanteVermelho')
        redDiamonds.create(30,150,'diamanteVermelho')
        redDiamonds.create(150,450,'diamanteVermelho')
        redDiamonds.create(300,395,'diamanteVermelho')

        blueDiamonds.create(490,0,'diamanteAzul')
        blueDiamonds.create(330,100,'diamanteAzul')
        blueDiamonds.create(700,120,'diamanteAzul')
        blueDiamonds.create(715,400,'diamanteAzul')
        blueDiamonds.create(485,450,'diamanteAzul')
        blueDiamonds.create(300,395,'diamanteAzul')

        redDiamonds.children.iterate(function (child) {
            child.setScale(0.5);
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));

        });

        blueDiamonds.children.iterate(function (child) {
            child.setScale(0.5);
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));

        });
    }
    function hitPortao() {
        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        numBombas++;
        if(score%120==0){
            this.levelUpSound.play();
            var bomb = bombs.create(x,150, 'bomb');

            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-100, 100), 20);

            player.setPosition(20, 550);
            player2.setPosition(22,550);
            adicionarDiamantes();
        }else{

        }
    }

    this.physics.add.collider(player, bombs, hitBomb, null, this);
    this.physics.add.collider(player2, bombs, hitBomb, null, this);


    function hitBomb(player) {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        gameOver = true;

        somFundo.stop();
        this.deathSound.play();
        bombs.setVisible(false);
        platforms.setVisible(false);
        aguaVerde.setVisible(false);
        redDiamonds.setVisible(false);
        blueDiamonds.setVisible(false);
        portoes.setVisible(false);
        aguaAzul.setVisible(false);
        lava.setVisible(false);
        this.add.image(400,300, 'fimJogo').setScale(0.3);

    }


}

