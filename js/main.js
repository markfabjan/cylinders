/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global Phaser */

var Boot = function () {};
Boot.prototype = {
    init: function () {
        this.input.maxPointers = 1;
        // pause game when not focused
        this.stage.disableVisibilityChange = false;
    },
    create: function () {
        this.game.state.start("Preloader", true, false);
    }
}

var Preloader = function () {};
Preloader.prototype = {
    preload: function () {
        // load assets
        var path = Global.assetsPath;
        
        //this.load.atlas("Hero", path + "Hero.png", path + "Hero.json");
        //this.load.xml("HeroData", path + "Hero.xml");
        
        this.load.atlas("testAnimation", path + "testAnimation.png", path + "testAnimation.json");
        this.load.xml("testAnimationData", path + "testAnimation_opt_000.xml");
        
        this.load.atlas("cylinder", path + "visual/cylinder.png", path + "visual/cylinder.json");
        this.load.xml("cylinderData", path + "visual/cylinder.xml");
        
        this.load.atlas("effect", path + "visual/effect.png", path + "visual/effect.json");
        this.load.xml("effectData", path + "visual/effect.xml");
        
        this.load.image("background", path + "backgrounds/background_720.jpg");
        
        this.game.load.audio('bgm', path + 'audio/bensound-countryboy.mp3');
        this.game.load.audio('click', [path + 'audio/click.mp3', path + 'audio/click.ogg']);
        this.game.load.audio('fire', [path + 'audio/fire.mp3', path + 'audio/fire.ogg']);
        this.game.load.audio('spin', [path + 'audio/spin.mp3', path + 'audio/spin.ogg']);
    },
    create: function () {
        this.game.state.start("Test");
    }
};

//visual
var cylinders = new Array();
var effects = new Array();
var stvar1;

//audio
var bgm;
var spin1;
var spin2;
var spin3;
var click1;
var click2;
var click3;
var bang1;
var bang2;
var bang3;

//buttons
var spinButton;

//logic
var stage = 0;
var timer;

var delay = 0;

var Test = function () {};
Test.prototype = {
    create: function () {
        //AUDIO
        bgm = this.game.add.audio('bgm');
        bgm.play();
        bgm.loop = true;
        bgm.volume = 0.01;
        
        spin1 = this.game.add.audio('spin');
        spin1.volume = 0.1;
        spin2 = this.game.add.audio('spin');
        spin2.volume = 0.1;
        spin3 = this.game.add.audio('spin');
        spin3.volume = 0.1;
        
        click1 = this.game.add.audio('click');
        click1.volume = 0.1;
        click2 = this.game.add.audio('click');
        click2.volume = 0.1;
        click3 = this.game.add.audio('click');
        click3.volume = 0.1;
        
        bang1 = this.game.add.audio('bang');
        bang1.volume = 0.1;
        bang2 = this.game.add.audio('bang');
        bang2.volume = 0.1;
        bang3 = this.game.add.audio('bang');
        bang3.volume = 0.1;
        
        //spin1.play();
        
        
        //CONTROLS
        
        //this.game.input.addPointer();
        this.game.input.touch.preventDefault = false;
        this.game.input.onDown.add( touchCommand, this);
        
        //BACKGROUND
        //this.stage.backgroundColor = 0x00DFFF;
        //this.game.stage.backgroundColor = 0x00DFFF;
        this.stage.backgroundColor = 0xFFFFFF;
        //this.game.stage.backgroundColor = 0xFAFAFA;
        this.background = this.game.add.tileSprite(0, 0, 1280, 720, "background");
        //this.background.alpha = 0.5;
        //this.add.tileSprite(0, 0, Global.GAME_WIDTH, Global.GAME_HEIGHT, "background");
        //this.add.tileSprite(0, 0, 1920, 1280, "background"s);
        
        
        //VISUALS
        
        var spriterLoader = new Spriter.Loader();
        
        var spriterData = spriterLoader.load(this.cache.getXML("cylinderData"));
        /*for(i = 0; i < 15; i++){
            cylinders.push(null);
        }*/
        for(i = 0; i < 15; i++){
            cylinders.push(new Spriter.SpriterGroup(this.game, spriterData, "cylinder", "entity_000", 0, 100));
            //cylinders[i]=(new Spriter.SpriterGroup(this.game, spriterData, "cylinder", "entity_000", 0, 100));
            var height = (Global.GAME_HEIGHT/5) ;
            if(i > 4){
                height = (Global.GAME_HEIGHT/5) * 2;
            }
            if(i > 9){
                height = (Global.GAME_HEIGHT/5) * 3;
            }
            //cylinders[i].position.setTo((Global.GAME_WIDTH/6) * ((i%5)+1), (Global.GAME_HEIGHT/5) * ((i%3)+1));
            cylinders[i].position.setTo((Global.GAME_WIDTH/6) * ((i%5)+1), height);
            this.world.add(cylinders[i]);
            cylinders[i].setAnimationById(1);
        }
        
        var spriterData = spriterLoader.load(this.cache.getXML("effectData"));
        
        for(i = 0; i < 15; i++){
            effects.push(new Spriter.SpriterGroup(this.game, spriterData, "effect", "entity_000", 0, 100));
            var height = (Global.GAME_HEIGHT/5) ;
            if(i > 4){
                height = (Global.GAME_HEIGHT/5) * 2;
            }
            if(i > 9){
                height = (Global.GAME_HEIGHT/5) * 3;
            }
            //effects[i].position.setTo((Global.GAME_WIDTH/6) * ((i%5)+1), (Global.GAME_HEIGHT/5) * ((i%3)+1));
            effects[i].position.setTo((Global.GAME_WIDTH/6) * ((i%5)+1), height);
            this.world.add(effects[i]);
            //cylinders[i].setAnimationById(2);
        }
        
        spriterData = spriterLoader.load(this.cache.getXML("testAnimationData"));
        stvar1 = new Spriter.SpriterGroup(this.game, spriterData, "testAnimation", "stvar", 0, 100);
        stvar1.position.setTo((Global.GAME_WIDTH/6) * (5), (Global.GAME_HEIGHT/5) * (5));
        this.world.add(stvar1);
        stvar1.setAnimationById(3);
        
        
        
        //BUTTONS
        
        //this.game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
        
        //spinButton = this.game.add.button(this.game.world.centerX - 95, 400, 'spin', actionOnClick, this, 2, 1, 0);
        
        
        //LEY LISTENERS
        
        /*var keyy = this.game.input.keyboard.addKey(Phaser.Keyboard.Y);
        keyy.onDown.add(function () {
            this.spriterGroupb.disabled = true;
        }, this);
        var keyx = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
        keyx.onDown.add(function () {
            this.spriterGroupb.disabled = false;
        }, this);*/
        
        /* var keyc = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        keyc.onDown.add(function () {
            this.spriterGroupb.setAnimationSpeedPercent(50);
        }, this);
        var keyd = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
        keyd.onDown.add(function () {
            this.spriterGroupb.setAnimationSpeedPercent(100);
        }, this);
        var keye = this.game.input.keyboard.addKey(Phaser.Keyboard.G);
        keye.onDown.add(function () {
            this.spriterGroupb.setAnimationSpeedPercent(150);
        }, this);*/
        
    },
    
    update: function () {
        //GAME LOGIC HERE:
        //game.time.time
        /*this.spriterGroup.updateAnimation();
        var finished = this.spriterGroupb.updateAnimation();
        if(finished == 1){
            this.spriterGroupb.setAnimationById(0);
            this.animationb = 0;
        }
        this.spriterGroupb.rotation += 0.01;*/
        
        //SET ROTATIONS
        
        if(stage == 1){ //spin stage
           
            for(i = 0; i < 15; i++){
                cylinders[i].setAnimationById(2);
                cylinders[i].setAnimationSpeedPercent(150)
                spin1.play();
            }
            
            for(i = 0; i < 15; i++){
                var random = Math.floor(Math.random()*6);
                cylinders[i].rotation = random * (Math.PI/3);
                cylinders[i].value = random;
            }

            stage=2;
        }
        
        if(stage==2){ //delay stage start 1
            if(cylinders[14].getFinished()){
                stage=3;
                //timer = this.game.time.time;
            }
        }

        if(stage==3){ //delay stage end 1
            //console.log(this.game.time.time);
            //if((this.game.time.time - timer) >= 1000){
                stage = 4;
            //}
        }
        
        if(stage==4){
            for(i = 0; i < 15; i++){
                if(cylinders[i].value == 0){
                    effects[i].setAnimationById(3);
                    //console.log("value 0 cylinder "+i);
                }else{
                    effects[i].setAnimationById(Math.floor(Math.random()*2)+1);
                    //console.log("value 0 cylinder "+i);
                }
            }
            stage = 0;
        }
        
        //UPDATE ANIMATIONS
     
        for(i = 0; i < 15; i++){
            cylinders[i].updateAnimation();
        }
        
        for(i = 0; i < 15; i++){
            effects[i].updateAnimation();
        }

        stvar1.updateAnimation();
        
        //c00.rotation += 0.01;

        delay--;

    },
    // -------------------------------------------------------------------------
    render: function () {
        //this.game.debug.pointer(this.game.input.mousePointer);
        //this.game.debug.pointer(this.game.input.pointer1);
        /*this.game.debug.text(" GreyGuy animation: " + this.spriterGroup.currentAnimationName + " ( A - switch )", 100, 15, "rgb(0, 0, 0)");
        this.game.debug.text(" stvar animation: " + this.spriterGroupb.currentAnimationName + " ( S - switch )", 0, 30, "rgb(0, 0, 0)");
        this.game.debug.text(" stvar animation speed: " + this.spriterGroupb._animationSpeed + " ( D:0.5,F:1,G:1.5 )", 0, 45, "rgb(0, 0, 0)");*/
    }
}

function touchCommand(pointer) {
    if (pointer.y > (Global.GAME_HEIGHT/6)*5)
    {
        if(stage == 0){
            stage++;
            console.log("began");
        }
    }
    /*else if (pointer.y < 300)
    {
        music.volume += 0.1;
    }
    else
    {
        music.volume -= 0.1;
    }*/
}

var Global = (function () {
    function Global() {
    }
    // game derived from Phaser.Game
    Global.game = null;
    // game size
    //Global.GAME_WIDTH = 640;
    Global.GAME_WIDTH = $(window).width()-18;
    //Global.GAME_HEIGHT = 400;
    Global.GAME_HEIGHT = $(window).height()-18;
    // assets path
    Global.assetsPath = "assets/";
    return Global;
})();
//SpriterExample.Global = Global;

// -------------------------------------------------------------------------
window.onload = function () {
    //SpriterExample.Global.game = new SpriterExample.Game();
    Global.game = new Game();
};

function Game(){
    this.game = new Phaser.Game(Global.GAME_WIDTH, Global.GAME_HEIGHT, Phaser.AUTO, "content", null);
    this.game.state.add("Boot", Boot);
    this.game.state.add("Preloader", Preloader);
    this.game.state.add("Test", Test);
    this.game.state.start("Boot");
    return this.game;
}

//# sourceMappingURL=SpriterExample.js.map