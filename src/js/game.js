(function () {
  'use strict';

  function Game() {}

  Game.prototype = {

    create: function () {

      this.scores = [0, 0, 0, 0, 0, 0];

      this.createBubbles();

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

      if (this.bodies && this.bodies.length) {

        var l = this.bodies.length;
        for (var i = 0; i < l; ++i) {

          var joints = this.bodies[i];

          this.bubbles.forEachAlive(function (bubble) {

            if (this.physics.arcade.distanceToXY(bubble, joints.HandLeft.Position.X, joints.HandLeft.Position.Y) < 50 ||
              this.physics.arcade.distanceToXY(bubble, joints.HandRight.Position.X, joints.HandRight.Position.Y) < 50) {

              this.tweens.removeFrom(bubble);
              bubble.kill();
              ++this.scores[i];

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

    onInputDown: function () {
      this.game.state.start('menu');
    }

  };

  window['bubblegame'] = window['bubblegame'] || {};
  window['bubblegame'].Game = Game;

}());
