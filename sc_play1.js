//Escena JUEGO
var sc_play1 = new Phaser.Class({
    

    Extends: Phaser.Scene,
    initialize:
        function sc_play1(){
            Phaser.Scene.call(this, { key: 'sc_play1'});
            var variable = [];
        },

    preload (){
        this.load.image('i_sun', 'assets/tierra.png');
        this.load.image('i_fondo', 'assets/espacio-exterior.png');
        this.load.image('i_red', 'assets/red.png');
        this.load.image('i_shooter', 'assets/satelite_laser_2.png');
        this.load.image('i_opciones', 'assets/opciones.png');
        this.load.image('i_target', 'assets/input/red.png');
        this.load.spritesheet('trash', 'assets/basura.png',
            { frameWidth: 64, frameHeight: 64 }
        );
    },

    
    create (){
        score=0

        //delta consistente
        this.matter.set30Hz();

        //BACKGROUND
        var background = this.add.sprite(0, 0, 'i_fondo');
        background.setOrigin(0, 0);
        background.setScale(2);

        // TIERRA
        tierra = this.matter.add.sprite(game.config.width / 2,game.config.height / 2, 'i_sun', null, {
            label: 'tierra',
            mass: 200,
            isStatic: true,
            shape: {
                type: 'circle',
                radius: 64
            },
            plugin: {
                attractors: [
                    Phaser.Physics.Matter.Matter.Plugin.resolve("matter-attractors").Attractors.gravity
                ]
            }
        });
        can_shoot = this.can_shoot;
        can_shoot = true;
        tierra.setInteractive({ cursor: 'url(assets/input/mira_dark.cur), pointer' });
        tierra.on('pointerover', function(){
            can_shoot = false;
        });
        tierra.on('pointerout', function(){
            can_shoot = true;
        });


        //MOUSE
        this.input.setDefaultCursor('url(assets/input/mira.cur), pointer');
        
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

        //fuego sat
        var particles = this.add.particles('i_red');
               

        //SATELITE
        shooter = this.shooter;
        shooter = this.matter.add.sprite(200,100,'i_shooter', null, {
            label: 'nave',
            mass: 0.01,
            ignorePointer: true,
            inertia: Infinity,
            frictionAir: 0,
            friction: 0,
        });

        shooter.setInteractive({ cursor: 'url(assets/input/mira_dark.cur), pointer' });

        fuego = particles.createEmitter({
            speed: { min: 400, max: 600 },
            angle: {
                onEmit: function (particle, key, t, value)
                {
                    return shooter.angle-90;
                }
            },
            on: {
                onEmit: function (particle, key, t, value)
                {
                    return prop_on;
                }
            },
            lifespan: 100,
            scale: { start: 0.5, end: 2 },
            alpha: { start: 0.5, end: 0 },
            blendMode: 'ADD',

        });        
        
        fuego.startFollow(shooter);

        //BARRAS DE COMBUSTIBLE Y ENERGIA
        gasbar = this.add.graphics();
        gasbar.fillStyle(0x48c9b0,1);
        gasbar.fillRect(0, 0, game.config.width, 20);
        gasbar.x = 0;
        gasbar.y = game.config.height - 41;
        gastotal = this.gastotal;
        gastotal = 100;
        gasname = this.add.text(game.config.width / 2 - 20, game.config.height - 40, 'Fuel', {
            fontSize: '19px',
            fill: '#34495e'
        });

        energybar = this.add.graphics();
        energybar.fillStyle(0xf4d03f,1);
        energybar.fillRect(0, 0, game.config.width, 20);
        energybar.x = 0;
        energybar.y = game.config.height - 20;
        energytotal = this.gastotal;
        energytotal = 100;
        energyname = this.add.text(game.config.width / 2 - 30, game.config.height - 21, 'Energy', {
            fontSize: '18px',
            fill: ' #d35400'
        });


        //OTROS
        center = new Phaser.Geom.Point(game.config.width / 2, game.config.height / 2);
        input = this.input;

        // BASURA
        var center= new Phaser.Math.Vector2(game.config.width / 2,game.config.height / 2);
        console.log(center);
        for (var i = 0; i < 10; i++)
        {
            // generacion aleatoria de angulos
            // 1º creo vector en la esquina
            // 2º lo apunto a un x entre 90 y 250
            // 3º le doy un angulo aleatorio
            var vec_n = new Phaser.Math.Vector2();
            vec_n.x=Phaser.Math.RND.between(90, 250);
            //console.log(vec_n);
            vec_n.rotate(Phaser.Math.RND.rotation());
            //console.log(vec_n);

            //rand de escala
            esc_rnd=Phaser.Math.RND.frac()*0.5+0.1;
            cosos = this.matter.add.sprite(vec_n.x+center.x,vec_n.y+center.y,'trash', i, {
                label: 'coso',
                mass: 0.001,
                inertia: Infinity,
                ignoreGravity: false,
                frictionAir: 0,
                friction: 0,
                shape: {
                    type: 'circle',
                    radius: 32*esc_rnd
                },
                plugin: {
                    attractors: [
                        Phaser.Physics.Matter.Matter.Plugin.resolve("matter-attractors").Attractors.gravity
                    ]
                },
            });

            cosos.scale=esc_rnd;

            cosos.setInteractive({ cursor: 'url(assets/input/mira_shooting.cur), pointer' });
            cosos.on('pointerover', function(){
                este_coso = this;
                console.log(este_coso);
            });
            cosos.on('pointerout', function(){
                este_coso = null;
                console.log(este_coso);
            });
            // asignacion de velocidad
            // constante de gravitacion G*M mas o menos 54
            // la velocidad es perpendicular, por lo que giro pi/2 y calculo seno y coseno
            // velocidad angular=raiz(GM/r) 

            r_vec=vec_n.length()
            //console.log("r_vec = " + r_vec);
            dir_vec=vec_n.rotate(3.1416/2).normalize();
            //console.log(dir_vec);
            mag_vec=Math.sqrt(60/r_vec);
            cosos.setVelocity(dir_vec.x*mag_vec,dir_vec.y*mag_vec);
           
        }

        // si el objeto es la tierra, borra el otro
        this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
            if (bodyA.label==='tierra'){
                if(bodyB.label==='coso'){
                    test=bodyB;
                    bodyB.position.x=-100;
                    bodyB.destroy();
                    score+=10;
                } else{
                    this.scene.start('sc_game_over')
                }
                
            } else if (bodyB.label==='tierra'){
                if(bodyB.label==='coso'){
                    test=bodyB;
                    bodyA.position.x=-100;
                    bodyA.destroy();
                    score+=10;
                } else{
                    this.scene.start('sc_game_over')
                }
            } else if (bodyA.label==='nave'||bodyB.label==='nave'){

                //genera basura en impacto
                for (var i = 0; i < 5; i++)
                {
                    esc_rnd=Phaser.Math.RND.frac()*0.3+0.1;
                    cosos = this.matter.add.sprite(shooter.x,shooter.y,'trash', i, {
                        label: 'coso',
                        mass: 0.001,
                        inertia: Infinity,
                        ignoreGravity: false,
                        frictionAir: 0,
                        friction: 0,
                        shape: {
                            type: 'circle',
                            radius: 32*esc_rnd,
                        },
                        plugin: {
                            attractors: [
                                Phaser.Physics.Matter.Matter.Plugin.resolve("matter-attractors").Attractors.gravity
                            ]
                        },
                    });
                    cosos.scale=esc_rnd;
                    cosos.setVelocity(Phaser.Math.RND.frac(),Phaser.Math.RND.frac());
           
                }
                cosos.scale=esc_rnd;
                shooter.body.position.x=-100;
                shooter.body.destroy();
                this.time.addEvent({
                delay: 10000,
                callback: ()=>{
                    this.scene.start('sc_game_over');
                    },
                });
                
            } else{
                // genera basura en impacto
                for (var i = 0; i < 4; i++)
                {
                    esc_rnd=Phaser.Math.RND.frac()*0.3+0.1;
                    var cosos = this.matter.add.sprite(bodyA.position.x,bodyA.position.y,'trash', i, {
                        label: 'coso',
                        mass: 0.001,
                        inertia: Infinity,
                        ignoreGravity: false,
                        frictionAir: 0,
                        friction: 0,
                        shape: {
                            type: 'circle',
                            radius: 32*esc_rnd,
                        },
                        plugin: {
                            attractors: [
                                Phaser.Physics.Matter.Matter.Plugin.resolve("matter-attractors").Attractors.gravity
                            ]
                        },
                    });
                    cosos.scale=esc_rnd;
                    cosos.setVelocity(Phaser.Math.RND.frac(),Phaser.Math.RND.frac());
                }
                bodyA.position.x=-100;
                bodyA.destroy();
                score-=10;
                bodyB.position.x=-100;
                bodyB.destroy();
            }
            ;
        });
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });
    },


    update(){
        // puntaje

        scoreText.setText('Score: ' + score);

        //APUNTADOR
        var shooter_angle = Phaser.Math.Angle.Between(shooter.x,shooter.y,input.x,input.y)-Math.PI/2;
        var shooter_angledelta = Phaser.Math.Angle.Wrap(shooter_angle - shooter.rotation);
        if (shooter_angledelta > 0.1 && shooter_angledelta < Math.PI){
            shooter.setAngularVelocity(0.1*shooter_angledelta)
        }
        else{
            if(shooter_angledelta == 0 ){
                shooter.setAngularVelocity(0)

            }

            else{
                shooter.setAngularVelocity(0.1*shooter_angledelta)
            }
        };

        //PROPULSION Y BARRAS DE ESTADO
        var pointer = this.input.activePointer;//&& !tierra.on('pointerdown')
        if (pointer.leftButtonDown() && energytotal > 0 && can_shoot == true){
            var line = this.add.line(0,0,shooter.x,shooter.y,input.x,input.y,0xe74c3c).setOrigin(0, 0);
            this.time.addEvent({
                delay: 40,
                callback: ()=>{
                    line.destroy()
                    },
                loop: true
            });
            energytotal -= 0.3;
            energybar.scaleX = energytotal/100;
            energyname.x =(game.config.width / 2 - 30) * energytotal/100;

            //var touchers = get.Phaser.Types.Physics.Matter.MatterBody.intersectPoint(input.x,input.y);
            //console.log(touchers);

            //Impulsa el coso cuando haces click
            if(este_coso!=null){
                var vec_impulso=new Phaser.Math.Vector2(input.x-shooter.x,input.y-shooter.y)
                este_coso.applyForceFrom(vec_impulso, vec_impulso.normalize().scale(0.00000001));
            }
        };
        if (energytotal < 100){
            energytotal += 0.06;
            energybar.scaleX = energytotal/100
            energyname.x =(game.config.width / 2 - 30) * energytotal/100
        }
        if (pointer.rightButtonDown() && gastotal > 0){

            shooter.thrustRight(0.0000003);
            gastotal -= 0.06;
            gasbar.scaleX = gastotal/100
            gasname.x =(game.config.width / 2 - 20) * gastotal/100
            //emitter
            fuego.on= true;
        }
        else{
            fuego.on= false;
        };

    }
});