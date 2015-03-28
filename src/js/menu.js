(function () {
  'use strict';

  function Menu() {
  }

  Menu.prototype = {

    create: function () {
        
        this.add.sprite(0, 0, 'background');
        
        var x = this.game.width / 2;

        var txt = this.add.bitmapText(x, 100, 'minecraftia', 'Bubble Spel');
        txt.align = 'center';
        txt.x = this.game.width / 2 - txt.textWidth / 2;

        txt = this.add.bitmapText(x, 200, 'minecraftia', 'HANDEN OMHOOG OM TE STARTEN');
        txt.align = 'center';
        txt.x = this.game.width / 2 - txt.textWidth / 2;

        this.add.sprite(this.game.width * 0.5, this.game.height, 'start').anchor.setTo(0.5,1);
        
        this.add.sprite(this.game.width * 0.2, this.game.height * 0.5, 'circle0').anchor.set(0.5);
        this.add.sprite(this.game.width * 0.8, this.game.height * 0.5, 'circle1').anchor.set(0.5);

        if(this.game.scores && this.game.scores.length) {
            this.addScore();
        }
        
        this.input.onDown.add(this.onDown, this);
    },
      
      addScore: function() {
          
          console.log('addScores');
          
        var txt = this.add.bitmapText(this.game.width * 0.2, 360, 'minecraftia', '' + this.game.scores[0]);
        txt.align = 'center';
        txt.x -= txt.textWidth / 2;
          
        if(this.game.scores.length > 1) {
            
            txt = this.add.bitmapText(this.game.width * 0.8, 360, 'minecraftia', '' + this.game.scores[1]);
            txt.align = 'center';
            txt.x -= txt.textWidth / 2;

        }
          
      },

    update: function () {

      if (this.game.bodies && this.game.bodies.length) {
        var l = this.game.bodies.length;
        for (var i = 0; i < l; ++i) { 
          var joints = this.game.bodies[i].Joints;
          if (joints.HandLeft.Position.Y < joints.Head.Position.Y) {
            return;
          }
          if (joints.HandRight.Position.Y < joints.Head.Position.Y) {
            return;
          }
        }
        this.game.maxPlayers = l;
        this.game.state.start('game');
      }
    },

    onDown: function () {
      this.game.state.start('game');
    }
  };

  window['bubblegame'] = window['bubblegame'] || {};
  window['bubblegame'].Menu = Menu;

}());
