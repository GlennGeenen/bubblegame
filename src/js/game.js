(function () {
  'use strict';

  function Game() {
    this.players = [];
    this.maxPlayers = 2;
  }

  Game.prototype = {

    create: function () {

      this.createBubbles();
      this.createPlayers();

      this.time.events.loop(500, this.spawnBubble, this);

    },

    createBubbles: function () {
      
      this.bubbles = this.add.group();

      var bubble = null;

      for (var i = 0; i < 20; ++i) {
        bubble = this.bubbles.create(0, 0, 'bubble');
        bubble.anchor.set(0.5);
        bubble.kill();
      }

    },
    
    createPlayers: function() {
      
      this.hands = this.add.group();
      var hand = null;
      
      for(var i = 0; i < this.maxPlayers; ++i) {
        this.players.push({
          score: 0
        });
        
        hand = this.hands.create(0, 0, 'circle');
        hand.anchor.set(0.5);
        hand.kill();
        
        this.players[i].leftHand = hand;
        
        hand = this.hands.create(0, 0, 'circle');
        hand.anchor.set(0.5);
        hand.kill();
        
        this.players[i].rightHand = hand;
        
        this.players[i].scoreText = this.add.bitmapText(20, 20 + i * 40, 'minecraftia', 'P' + i + ': 0');
        
      }
      
    },

    spawnBubble: function spawnCar() {
      var bubble = this.bubbles.getFirstDead();

      if (bubble) {

        bubble.x = Math.random() * this.game.width;
        bubble.y = -100;

        var tweenPos = this.add.tween(bubble);
        tweenPos.to({
          x: Math.floor(Math.random() * (this.game.width * 2) - (this.game.width * 0.5)),
          y: this.game.height + 150
        }, 5000, Phaser.Easing.Sinusoidal.InOut);

        tweenPos.onComplete.add(function () {
          bubble.kill();
        });

        bubble.revive();

        tweenPos.start();
      }
    },

    update: function () {

      if (this.game.bodies && this.game.bodies.length) {

        var l = this.game.bodies.length;
        
        var halfx = this.game.width * 0.5;
        var halfy = this.game.height * 0.5;
        
        for (var i = 0; i < this.maxPlayers; ++i) {
          
          if(i < l) {
            var joints = this.game.bodies[i].Joints;
            this.bubbles.forEachAlive(function (bubble) {
              
              var leftX = halfx +  joints.HandLeft.Position.X * halfx * 0.6;
              var lefty = halfy + joints.HandLeft.Position.Y * -halfy * 0.6;
              
              var rightx = halfx + joints.HandRight.Position.X * halfx * 0.6;
              var righty = halfy + joints.HandRight.Position.Y * -halfy * 0.6;
              
              this.players[i].leftHand.x = leftX;
              this.players[i].leftHand.y = lefty;
              this.players[i].leftHand.revive();
              
              this.players[i].rightHand.x = rightx;
              this.players[i].rightHand.y = righty;
              this.players[i].rightHand.revive();

              if (this.physics.arcade.distanceToXY(bubble, leftX, lefty) < 50 ||
                this.physics.arcade.distanceToXY(bubble, rightx, righty) < 50) {

                this.tweens.removeFrom(bubble);
                bubble.kill();
                
                this.players[i].scoreText.text = 'P' + i + ': ' + (++this.players[i].score);

              }

            }, this);
            
          } else {
            this.players[i].leftHand.kill();
            this.players[i].rightHand.kill();
          }
          
        }

      } else {
        var pointer = this.input.activePointer;

        this.bubbles.forEachAlive(function (bubble) {

          if (this.physics.arcade.distanceToPointer(bubble, pointer) < 50) {
            this.tweens.removeFrom(bubble);
            bubble.kill();

            ++this.scores[0];
          }

        }, this);
      }

    },

    onInputDown: function () {
      this.game.state.start('menu');
    }

  };

  window['bubblegame'] = window['bubblegame'] || {};
  window['bubblegame'].Game = Game;

}());
