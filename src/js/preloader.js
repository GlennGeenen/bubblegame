(function () {
  'use strict';

  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {

    preload: function () {
      this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.load.setPreloadSprite(this.asset);

      this.loadResources();
    },

    loadResources: function () {
        this.load.image('bubble', 'assets/bubble.png');
        this.load.image('badbubble', 'assets/badbubble.png');
        
        this.load.image('handleft0', 'assets/hand-left0.png');
        this.load.image('handright0', 'assets/hand-right0.png');
        
        this.load.image('handleft1', 'assets/hand-left1.png');
        this.load.image('handright1', 'assets/hand-right1.png');
        
        this.load.image('start', 'assets/start.png');
        this.load.image('background', 'assets/background.png');
        this.load.bitmapFont('minecraftia', 'assets/minecraftia.png', 'assets/minecraftia.xml');
    },

    create: function () {
      this.asset.cropEnabled = false;
    },

    update: function () {
      if (!!this.ready) {
        this.game.state.start('menu');
      }
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };

  window['bubblegame'] = window['bubblegame'] || {};
  window['bubblegame'].Preloader = Preloader;

}());
