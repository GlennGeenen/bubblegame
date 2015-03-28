(function () {
  'use strict';

  function Game() {
    this.kinectScale = 500;
  }

  Game.prototype = {

    create: function () {
        
        this.add.sprite(0, 0, 'background');

        this.createBubbles();
        this.createPlayers();
        
        this.timeDone = 60;
        this.timeText = this.add.bitmapText(this.game.width - 100, 20, 'minecraftia', '' + (this.timeDone));

        this.time.events.loop(250, this.spawnBubble, this);
        this.time.events.loop(1000, this.spawnBadBubble, this);

    },

    createBubbles: function () {
      
      this.bubbles = this.add.group();

      var bubble = null;
        var i;

      for (i = 0; i < 50; ++i) {
        bubble = this.bubbles.create(0, 0, 'bubble');
        bubble.anchor.set(0.5);
        bubble.kill();
      }
        
        this.badbubbles = this.add.group();
        
        for (i = 0; i < 10; ++i) {
            bubble = this.badbubbles.create(0, 0, 'badbubble');
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
        
        hand = this.hands.create(0, 0, 'handleft' + i);
        hand.anchor.set(0.5);
        
        this.players[i].leftHand = hand;
        
        hand = this.hands.create(0, 0, 'handright' + i);
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
      
    spawnBadBubble: function spawnCar() {
        
        this.timeText.text = --this.timeDone + '';
        if(this.timeDone <= 0) {
            return this.onGameOver();
        }
        
      var bubble = this.badbubbles.getFirstDead();

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

        this.updateKinect();

        this.checkBubbleHit();

    },
      
      findBody: function (trackid) {
          return _.find(this.game.bodies, function(body){ return body.TrackingId === trackid; });
      },
      
      updateKinect: function () {
          
          if (this.game.bodies && this.game.bodies.length) {

            var halfx = this.game.width * 0.5;
            var halfy = this.game.height * 0.5;

              var trackingids = _.map(this.game.bodies, function(body){ return body.TrackingId; });
              var trackid = null;
              var joints = null;
              var hasBody = false;

            for (var i = 0; i < this.game.maxPlayers; ++i) {

                trackid = this.players[i].trackid;

                if (!_.contains(trackingids, trackid)) {
                  console.log('no ' + trackid);
                  continue;
                }

                joints = this.findBody(trackid);
                if(!joints) {
                  console.log('invalid ' + trackid);
                  continue;
                }
                
                hasBody = true;
                joints = joints.Joints;

                this.players[i].leftHand.x = halfx + joints.HandLeft.Position.X * this.kinectScale;
                this.players[i].leftHand.y = halfy + joints.HandLeft.Position.Y * -this.kinectScale;

                this.players[i].rightHand.x = halfx + joints.HandRight.Position.X * this.kinectScale;
                this.players[i].rightHand.y = halfy + joints.HandRight.Position.Y * -this.kinectScale;          
            }
              
              if(!hasBody) {
                  this.onGameOver();
              }
              
          } else {
              this.onGameOver();
          }
      },
      
      checkBubbleHit: function () {
          
          this.badbubbles.forEachAlive(function (bubble) {
            
            for (var i = 0; i < this.game.maxPlayers; ++i) {
                if (this.physics.arcade.distanceToXY(bubble, this.players[i].leftHand.x, this.players[i].leftHand.y) < 75 ||
                    this.physics.arcade.distanceToXY(bubble, this.players[i].rightHand.x, this.players[i].rightHand.y) < 75) {
                    this.tweens.removeFrom(bubble);
                    bubble.kill();
                    this.players[i].scoreText.text = 'P' + (i+1) + ': ' + (this.players[i].score -= 5);
                }
            }

        }, this);
          
          this.bubbles.forEachAlive(function (bubble) {
            
            for (var i = 0; i < this.game.maxPlayers; ++i) {

                if (this.physics.arcade.distanceToXY(bubble, this.players[i].leftHand.x, this.players[i].leftHand.y) < 75 ||
                    this.physics.arcade.distanceToXY(bubble, this.players[i].rightHand.x, this.players[i].rightHand.y) < 75) {

                    this.tweens.removeFrom(bubble);
                    bubble.kill();

                    this.players[i].scoreText.text = 'P' + (i+1) + ': ' + (++this.players[i].score);

                    if(this.players[i].score >= 20) {
                        this.onGameOver();
                    }
                }
            }

        }, this);
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
