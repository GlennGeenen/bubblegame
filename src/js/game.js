(function () {
  'use strict';

  function Game() {
    
  }

  Game.prototype = {

    create: function () {
        
        this.add.sprite(0, 0, 'background');

        this.createBubbles();
        this.createPlayers();

        this.time.events.loop(250, this.spawnBubble, this);

    },

    createBubbles: function () {
      
      this.bubbles = this.add.group();

      var bubble = null;

      for (var i = 0; i < 50; ++i) {
        bubble = this.bubbles.create(0, 0, 'bubble');
        bubble.anchor.set(0.5);
        bubble.kill();
      }

    },
    
    createPlayers: function() {
      
      this.players = [];
      this.hands = this.add.group();
      var hand = null;
      
      for(var i = 0; i < this.game.maxPlayers; ++i) {
        this.players.push({
          score: 0
        });
        
        hand = this.hands.create(0, 0, 'circle' + i);
        hand.anchor.set(0.5);
        
        this.players[i].leftHand = hand;
        
        hand = this.hands.create(0, 0, 'circle' + i);
        hand.anchor.set(0.5);
        
        this.players[i].rightHand = hand;
        
        this.players[i].scoreText = this.add.bitmapText(20, 20 + i * 40, 'minecraftia', 'P' + (i+1) + ': 0');
        
      }
        
        if(this.game.bodies.length) {
            this.game.bodies = _.sortBy(this.game.bodies, function(body){ return body.Joints.Head.X; });
            
            for(i = 0; i < this.game.maxPlayers; ++i) {
              if(this.game.bodies[i]) {
                this.players[i].trackid = this.game.bodies[i].TrackingId;
              }
            }            
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

        var halfx = this.game.width * 0.5;
        var halfy = this.game.height * 0.5;
          
          var trackingids = _.map(this.game.bodies, function(body){ return body.TrackingId; });
          
          var trackid = null;
          var joints = null;
        
          // Check hit bubble
        for (var i = 0; i < this.game.maxPlayers; ++i) {
            
            trackid = this.players[i].trackid;
      
            if (!_.contains(trackingids, trackid)) {
              console.log('no ' + trackid);
              continue;
            }
            
            joints = _.find(this.game.bodies, function(body){ return body.TrackingId === trackid; });
            if(!joints) {
              console.log('invalid ' + trackid);
              continue;
            }
            joints = joints.Joints;
          

            this.bubbles.forEachAlive(function (bubble) {
              
              var leftx = halfx + joints.HandLeft.Position.X * 200;
              var lefty = halfy + joints.HandLeft.Position.Y * -200;
              
              var rightx = halfx + joints.HandRight.Position.X * 200;
              var righty = halfy + joints.HandRight.Position.Y * -200;
              
              this.players[i].leftHand.x = leftx;
              this.players[i].leftHand.y = lefty;
              
              this.players[i].rightHand.x = rightx;
              this.players[i].rightHand.y = righty;

              if (this.physics.arcade.distanceToXY(bubble, leftx, lefty) < 75 ||
                this.physics.arcade.distanceToXY(bubble, rightx, righty) < 75) {

                this.tweens.removeFrom(bubble);
                bubble.kill();
                
                this.players[i].scoreText.text = 'P' + (i+1) + ': ' + (++this.players[i].score);
                  
                  if(this.players[i].score >= 20) {
                      this.onGameOver();
                  }

              }

            }, this);
          
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
      
      onGameOver: function () {

          var scores = [];
          for (var i = 0; i < this.game.maxPlayers; ++i) {
              scores.push(this.players[i].score);
          }

          this.game.scores = scores;
          this.game.state.start('menu');
      }

  };

  window['bubblegame'] = window['bubblegame'] || {};
  window['bubblegame'].Game = Game;

}());
