//Escena JUEGO
var sc_play1 = new Phaser.Class({
    

    Extends: Phaser.Scene,
    initialize:
        function sc_play1(){
            Phaser.Scene.call(this, { key: 'sc_play1'});
            var variable = [];
        },

    preload (){
        this.load.image('i_fondo', 'assets/espacio-exterior.png');
        this.load.image('i_red', 'assets/red.png');
        this.load.image('i_shooter', 'assets/satelite_laser_2.png');
        this.load.image('i_opciones', 'assets/opciones.png');
        this.load.image('i_alien', 'assets/space-baddie.png');

        this.load.image('i_target', 'assets/input/red.png');
    },

    
    create (){

        //MOUSE
        this.input.setDefaultCursor('url(assets/input/mira.cur), pointer');
        //BACKGROUND
        var background = this.add.sprite(0, 0, 'i_fondo');
        background.setOrigin(0, 0);
        //BOTON DE PAUSA ENGRANAJE
        var pausa = this.add.sprite(game.config.width - 45, 5, 'i_opciones').setInteractive();
        pausa.setOrigin(0, 0);
        pausa.setScale(0.8);
        pausa.on('pointerover', function() {
            pausa.setTint(0x7878ff);
        });
        pausa.on('pointerout', function() {
            pausa.clearTint();
        });
        pausa.on('pointerdown', ()=>{
            this.scene.start('sc_menu')
        });
        //SATELITE
        shooter = this.shooter;
        shooter = this.matter.add.sprite(200,100,'i_shooter', null, {
            mass: 1,
            ignorePointer: true,
            inertia: Infinity,
            frictionAir: 0,
            friction: 0
        });
        shooter.setInteractive({ cursor: 'url(assets/input/mira_dark.cur), pointer' });
        //EMITTER sat
        var particles = this.add.particles('i_red');
        var emitter = particles.createEmitter({
        speed: 5,
        lifespan: 5,
        /*{
            onEmit: function (particle, key, t, value)
            {
                return Phaser.Math.Percent(shooter.body.speed, 0, 300) * 20000;
            }
        },*/
        alpha: 5, /*{
            onEmit: function (particle, key, t, value)
            {
                return Phaser.Math.Percent(shooter.body.speed, 0, 300) * 1000;
            }
        },*/
        scale: { start: 5, end: 0 },
        blendMode: 'ADD',
    });
        //BARRA DE COMBUSTIBLE
        gasbar = this.add.graphics();
        gasbar.fillStyle(0x2ecc71,1);
        gasbar.fillRect(0, 0, game.config.width+50, 20);
        gasbar.x = -50;
        gasbar.y = game.config.height - 20;
        gastotal = this.gastotal;
        gastotal = 100;
        



        emitter.startFollow(shooter);
        //OTROS
        center = new Phaser.Geom.Point(game.config.width / 2, game.config.height / 2);
        input = this.input;






        var cosos = this.matter.add.imageStack('i_alien', null, 0, 1, 1, 2, 0, 400, {
            mass: 1,
            ignorePointer: true,
            inertia: Infinity,
            frictionAir: 0,
            friction: 0
        });



    },

    update(){
        //Apuntador
        var shooter_angle = Phaser.Math.Angle.Between(shooter.x,shooter.y,input.x,input.y)-Math.PI/2;
        var shooter_angledelta = Phaser.Math.Angle.Wrap(shooter_angle - shooter.rotation);
        if (shooter_angledelta > 0 && shooter_angledelta < Math.PI){
            shooter.setAngularVelocity(0.02)
        }
        else{
            if(shooter_angledelta == 0){
                shooter.setAngularVelocity(0)
            }

            else{
                shooter.setAngularVelocity(-0.02)
            }
        };


        var pointer = this.input.activePointer;
        if (pointer.leftButtonDown()){
            console.log(input)
        };
        if (pointer.rightButtonDown() && gastotal > 0){
            shooter.thrustRight(0.0001);
            gasbar.scaleX = gastotal/100;
            gastotal -= 0.05
        }
        
    }
});