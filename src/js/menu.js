(function () {
  'use strict';

  function Menu() {
    this.titleTxt = null;
    this.startTxt = null;
  }

  Menu.prototype = {

    create: function () {
      var x = this.game.width / 2;
      var y = this.game.height / 2;


      this.titleTxt = this.add.bitmapText(x, y, 'minecraftia', 'Example Game');
      this.titleTxt.align = 'center';
      this.titleTxt.x = this.game.width / 2 - this.titleTxt.textWidth / 2;

      y = y + this.titleTxt.height + 5;
      this.startTxt = this.add.bitmapText(x, y, 'minecraftia', 'START');
      this.startTxt.align = 'center';
      this.startTxt.x = this.game.width / 2 - this.startTxt.textWidth / 2;

      this.input.onDown.add(this.onDown, this);
    },

    update: function () {

      if (this.bodies && this.bodies.length) {
        var l = this.bodies.length;
        for (var i = 0; i < l; ++i) {

          var joints = this.bodies[i];

          if (joints.HandLeft.Position.Y < joints.Head.Position.Y) {
            return;
          }
          if (joints.HandRight.Position.Y < joints.Head.Position.Y) {
            return;
          }

        }

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