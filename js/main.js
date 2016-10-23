var GameState = {
  init: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000

    this.game.world.setBounds(0,0,360,592);

    this.MINIMUM_SWIPE_LENGTH = 50;
  },

  preload: function() {
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('platform', 'assets/images/platform.png');
    this.load.image('rectangle', 'assets/images/rectangle.png');
    this.load.image('enemy', 'assets/images/enemy.png');
    this.load.image('item', 'assets/images/item.png');
  },

  create: function() {
  	this.game.stage.backgroundColor = '#FA2';

  	this.game.input.onDown.add(this.start_swipe, this);
    this.game.input.onUp.add(this.end_swipe, this);

    this.ground = this.add.sprite(0, 540, 'ground');
    this.game.physics.arcade.enable(this.ground);
    this.ground.body.allowGravity = false;
    this.ground.body.immovable = true;

    this.shelf = this.add.sprite(0, 80, 'platform');
    this.game.physics.arcade.enable(this.shelf);
    this.shelf.body.allowGravity = false;
    this.shelf.body.immovable = true;
    this.shelf.scale.setTo(1.5, 0.8);

    //bins that go on the shelf at the top
    //TODO: need to add these into a group
    this.bin1 = this.add.sprite(10, 31, 'rectangle');
    this.bin1.scale.setTo(1.5, 1);

    this.bin2 = this.add.sprite(130, 31, 'rectangle');
    this.bin2.scale.setTo(1.5, 1);

    this.bin3 = this.add.sprite(250, 31, 'rectangle');
    this.bin3.scale.setTo(1.5, 1);

    // this.item = this.add.sprite(360, 540, 'item');
    // this.game.physics.arcade.enable(this.item);
    // this.item.body.velocity.x = -80;
    // this.item.anchor.setTo(1, 1);

    this.enemy = this.add.sprite(0, 200, 'enemy');
    this.game.physics.arcade.enable(this.enemy);
    this.enemy.body.immovable = true;
    this.enemy.body.allowGravity = false;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.body.velocity.x = 80;
    this.enemy.body.bounce.set(1, 0);

    this.items = this.add.group();
    this.items.enableBody = true;

    this.createItem();
    this.itemCreator = this.game.time.events.loop(Phaser.Timer.SECOND * 3, this.createItem, this)

  },

  update: function() {
    this.game.physics.arcade.collide(this.items, this.ground);
    // this.game.physics.arcade.collide(this.player, this.platforms);

    this.game.physics.arcade.overlap(this.items, this.bin1, this.scorePoint);
    this.game.physics.arcade.overlap(this.items, this.bin2, this.scorePoint);
    this.game.physics.arcade.overlap(this.items, this.bin3, this.scorePoint);
    // this.game.physics.arcade.overlap(this.player, this.barrels, this.killPlayer);

    // this.enemy.body.collideWorldBounds = true;
    // this.enemy.body.velocity.x = 50;

    // var myOptions = {};
    // var hammertime = new Hammer(this.items, myOptions);
	// hammertime.on('swipeleft', function(ev) {
	// 	console.log(ev);
	// });
    // Hammer(this.items).on("swipeleft", function() {
    //       // this.items.animate({left: "-=100"}, 500)
    // });
    // create a manager for that element
	// var mc = new Hammer.Manager(this.items);

	// create a recognizer
	// var Rotate = new Hammer.Rotate();

	// // add the recognizer
	// mc.add(Rotate);

	// // subscribe to events
	// mc.on('rotate', function(e) {
	//     // do something cool
	//     var rotation = Math.round(e.rotation);    
	//     stage.style.transform = 'rotate('+rotation+'deg)';
	// });

    this.items.forEach(function(element){
      if(element.x < 0) {
        element.kill();
      }
    }, this);
  },

  createItem: function() {
    //give me the first dead sprite
    var item = this.items.getFirstExists(false);

    if(!item) {
      item = this.items.create(0, 0, 'item');
    }

    // item.body.collideWorldBounds = true;
    // item.body.bounce.set(1, 0);
    item.inputEnabled = true;
    item.input.enableDrag(true);

    item.reset(320, 460);
    item.body.velocity.x = -50;
  },

  scorePoint: function(){
  	alert('you scored')
  },
    start_swipe: function (pointer) {
	    "use strict";
	    this.start_swipe_point = new Phaser.Point(pointer.x, pointer.y);
	},
    end_swipe: function (pointer) {
	    "use strict";
	    var swipe_length, cut_style, cut;
	    this.end_swipe_point = new Phaser.Point(pointer.x, pointer.y);
	    swipe_length = Phaser.Point.distance(this.end_swipe_point, this.start_swipe_point);
	    // if the swipe length is greater than the minimum, a swipe is detected
	    if (swipe_length >= this.MINIMUM_SWIPE_LENGTH) {
	    	console.log(swipe_length)
	        // create a new line as the swipe and check for collisions
	        cut_style = {line_width: 5, color: 0xE82C0C, alpha: 1}
	        // cut = new FruitNinja.Cut(this, "cut", {x: 0, y: 0}, {group: "cuts", start: this.start_swipe_point, end: this.end_swipe_point, duration: 0.3, style: cut_style});
	        this.swipe = new Phaser.Line(this.start_swipe_point.x, this.start_swipe_point.y, this.end_swipe_point.x, this.end_swipe_point.y);
	    }
	}
};

var game = new Phaser.Game(360, 592, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');