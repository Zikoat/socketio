var socket = io();

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var platforms, player, cursors, stars, score = 0, scoreText, globalScoreText = 0, enemy;

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32)
}

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.add.sprite(0,0,"sky");

	platforms = game.add.group();
	platforms.enableBody = true;

	var ground = platforms.create(0, game.world.height - 64, "ground");
	ground.scale.setTo(2, 2);
	ground.body.immovable = true;

	var ledge = platforms.create(400, 400, "ground");
	ledge.body.immovable = true;
	ledge = platforms.create(-150, 250, "ground");
	ledge.body.immovable = true;

	player = game.add.sprite(32, game.world.height - 150, "dude");
	game.physics.arcade.enable(player);

	
	player.body.gravity.y = 300;
	player.body.collideWorldBounds = true;

	player.animations.add("left", [0,1,2,3], 10, true);
	player.animations.add("right", [5,6,7,8], 10, true);

	cursors = game.input.keyboard.createCursorKeys();

	stars = game.add.group();
	stars.enableBody = true;
	for (var i = 0; i < 12; i++) {
		var star = stars.create(i * 70, 0, "star");

		star.body.gravity.y = 6;
		star.body.bounce.y =0.7 + Math.random() * 0.2;
	}

	scoreText = game.add.text(16, 16, "Score: 0", {fontSize: "32px", fill:"#000"})
	globalScoreText = game.add.text(16, 64, "Global Score: ", {fontSize: "32px", fill:"#000"})

	enemy = game.add.sprite(0, 0, "baddie");
	game.physics.arcade.enable(enemy);
	enemy.body.enableBody = true;
	enemy.body.gravity.y = 300;
	enemy.animations.add("left", [0,1], 5, true);
	enemy.animations.add("right", [2,3], 5, true);

	enemy.body.velocity.x = 150;
	enemy.animations.play("right");
	enemy.body.collideWorldBounds = true;

}

function update() {
	game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.collide(enemy, platforms);

	game.physics.arcade.overlap(player, stars, collectStar, null, this);

	function collectStar(player, star) {
		star.reset(Math.random() * (game.world.width - 24), 0);
		socket.emit('increase', globalScore);
		score++;
		scoreText.text = "Score: " + score;
		star.body.bounce.y =0.7 + Math.random() * 0.2;
	}



	player.body.velocity.x = 0;

	if (cursors.left.isDown) {
		player.body.velocity.x = -150;
		player.animations.play("left");
	} else if (cursors.right.isDown) {
		player.body.velocity.x = 150;
		player.animations.play("right");
	} else {
		player.animations.stop();
		player.frame = 4;
	}

	if (cursors.up.isDown && player.body.touching.down) {
		player.body.velocity.y = -350;
	}

	if(enemy.body.touching.right){
		enemy.body.velocity.x = 150;
		enemy.animations.play("left");
		console.log(enemy.body.touching);
	} else if(enemy.body.touching.left){
		enemy.body.velocity.x = -150;
		enemy.animations.play("right");
		
	}

}

window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);


socket.on("increase", function(count){
	globalScore = count;
	// $('.counter').html(globalScore);
	globalScoreText.text = "Global Score: " + globalScore;
});

socket.on("reset", function() {
	$('.counter').html(0);
});
