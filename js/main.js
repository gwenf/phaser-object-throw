var GameState = {
    init: function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1000

        this.game.world.setBounds(0,0,360,592);

        this.MINIMUM_SWIPE_LENGTH = 50;
        this.points = 0;
        this.itemsWasted = 0;
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

        this.pointText = game.add.text(game.world.centerX, game.world.centerY, "You have recycled \n0 items!", {
            font: "16px Arial",
            fill: "#000",
            align: "center"
        });
        this.pointText.anchor.setTo(0.5, 0.5);

        this.itemsWastedText = game.add.text(game.world.centerX, game.world.centerY + 50, "You have wasted \n0 items!", {
            font: "16px Arial",
            fill: "#ff0044",
            align: "center"
        });
        this.itemsWastedText.anchor.setTo(0.5, 0.5);

      	// this.game.input.onDown.add(this.start_swipe, this);
       //  this.game.input.onUp.add(this.end_swipe, this);

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
        this.game.physics.arcade.enable(this.bin1);
        this.bin1.body.immovable = true;
        this.bin1.body.allowGravity = false;
        this.bin1.scale.setTo(1.5, 1);

        this.bin2 = this.add.sprite(130, 31, 'rectangle');
        this.game.physics.arcade.enable(this.bin2);
        this.bin2.body.immovable = true;
        this.bin2.body.allowGravity = false;
        this.bin2.scale.setTo(1.5, 1);

        this.bin3 = this.add.sprite(250, 31, 'rectangle');
        this.game.physics.arcade.enable(this.bin3);
        this.bin3.body.immovable = true;
        this.bin3.body.allowGravity = false;
        this.bin3.scale.setTo(1.5, 1);

        // this.item = this.add.sprite(360, 540, 'item');
        // this.game.physics.arcade.enable(this.item);
        // this.item.body.velocity.x = -80;
        // this.item.anchor.setTo(1, 1);

        //TODO: need to have enemies in a group so I can add more
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

        this.game.physics.arcade.overlap(this.items, this.bin1, this.scorePoint, null, this);
        this.game.physics.arcade.overlap(this.items, this.bin2, this.scorePoint, null, this);
        this.game.physics.arcade.overlap(this.items, this.bin3, this.scorePoint, null, this);
        // this.game.physics.arcade.overlap(this.items, this.bin2, this.scorePoint);
        // this.game.physics.arcade.overlap(this.items, this.bin3, this.scorePoint);
        // game.physics.arcade.overlap(this.items, this.bin1, this.collisionHandler, null, this);
        // this.game.physics.arcade.overlap(this.player, this.barrels, this.killPlayer);

        // this.enemy.body.collideWorldBounds = true;
        // this.enemy.body.velocity.x = 50;

        this.items.forEach(function(element){
            this.game.physics.arcade.overlap(element, this.enemy, this.killItem, null, this);
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
        item.events.onDragStart.add(this.onDragStart, this);
        item.events.onDragUpdate.add(this.dragUpdate, this);
        item.events.onDragStop.add(this.onDragStop, this);
        // item.input.onDown.add(this.start_swipe, this);
        // item.input.onUp.add(this.end_swipe, this);

        item.reset(320, 460);
        item.body.velocity.x = -50;
    },

    scorePoint: function(bin, item){
        this.points++;
        item.kill();
        this.pointText.setText("You have recycled \n" + this.points + " items!");
        // game.input.onDown.addOnce(this.updatePointText, this);
      	console.log('you scored', bin, this.points)
    },
    killItem: function(item, enemy){
        item.kill();
        this.itemsWasted++;
        this.itemsWastedText.setText("You have wasted \n" + this.itemsWasted + " items :(");
        console.log('killed');
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
	},
    onDown: function (sprite, pointer) {
        result = "Down " + sprite.key;
        console.log('down', sprite.key);
    },

    onDragStart:function (sprite, pointer) {
        // console.log(sprite)
        this.dragStart = {};
        this.dragStart.x = pointer.x;
        this.dragStart.y = pointer.y;

        result = sprite.key + " started at x:" + pointer.x + " y: " + pointer.y;
        console.log(result)
    },

    dragUpdate: function (sprite, pointer, dragX, dragY, snapPoint) {
        //  As we drag the ship around inc the angle
        // angle += 0.01;

        // //  This just circles the copySprite around the sprite being dragged
        // copySprite.x = dragSprite.x + 220 * Math.cos(angle);
        // copySprite.y = dragSprite.y + 220 * Math.sin(angle);

        // //  And this points the copySprite at the current pointer
        // copySprite.rotation = game.physics.arcade.angleToPointer(copySprite);
    },

    onDragStop: function (sprite, pointer) {
        result = sprite.key + " dropped at x:" + pointer.x + " y: " + pointer.y;
        var directionX = -1 * (this.dragStart.x - pointer.x);
        var directionY = -1 * (this.dragStart.y - pointer.y);
        // sprite.body.allowGravity = false;
        // sprite.body.velocity.x = 0;
        sprite.body.velocity.set(directionX * 10, directionY * 10);
        console.log(directionY)
        // if (pointer.y > 400)
        // {
        //     console.log('input disabled on', sprite.key);
        //     // sprite.input.enabled = false;
        //     // sprite.sendToBack();
        // }
    },
    collisionHandler: function (items, bin) {
        console.log('collision')
        //  If the player collides with the chillis then they get eaten :)
        //  The chilli frame ID is 17

        // if (veg.frame == 17)
        // {
        //     veg.kill();
        // }
    }
};

var game = new Phaser.Game(360, 592, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');