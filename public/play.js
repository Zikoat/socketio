//strict should not be used
/*jshint esversion: 6 */ 
var socket = io();

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render:render });

let platforms, player, cursors, stars, score = 0, scoreText, globalScoreText = 0, controlState;

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
    game.load.image('ship', 'assets/ship.png');
}

class Player extends Phaser.Sprite {
	constructor(x=50, y=50){
		super(game, x, y, "ship");
	}

	movement () {

	}
}

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.add.sprite(0,0,"sky");

	
	player = game.add.sprite(32, game.world.height - 150, "ship");
	game.physics.arcade.enable(player);
	player.scale.setTo(0.5, 0.5);
	player.anchor.setTo(0.5, 0.5);
	player.body.collideWorldBounds = true;
	player.rotation = - Math.PI/2;
	// player.body.drag = new Phaser.Point(100,100);


	//controlState = "4-way"
	controlState = "rotate";

	cursors = game.input.keyboard.createCursorKeys();

	stars = game.add.group();
	stars.enableBody = true;
	for (var i = 0; i < 12; i++) {
		var star = stars.create(Math.random()*(game.world.width - 24), Math.random()*(game.world.height - 22), "star");
	}

	scoreText = game.add.text(16, 16, "Score: 0", {fontSize: "32px", fill:"#000"});
	globalScoreText = game.add.text(16, 64, "Global Score: ", {fontSize: "32px", fill:"#000"});
}

function update() {

	game.physics.arcade.overlap(player, stars, collectStar, null, this);

	function collectStar(player, star) {
		star.reset(Math.random()*(game.world.width - 24), Math.random()*(game.world.height - 22));
		socket.emit('increase', globalScore);
		score++;
		scoreText.text = "Score: " + score;
		star.body.bounce.y =0.7 + Math.random() * 0.2;
	}
	playerMovement.rotate();
}


function playerMovement(controlState) {
	// movement--------
	if(controlState == "4-way"){
		if (cursors.left.isDown) {
			if(player.body.velocity.x > 0) player.body.velocity.x /= 1.3;
			player.body.velocity.x += -20;
		} else if (cursors.right.isDown) {
			if(player.body.velocity.x < 0) player.body.velocity.x /= 1.3;
			player.body.velocity.x += 20;
		} else {player.body.velocity.x =player.body.velocity.x / 1.1;}

		if (cursors.up.isDown) {
			if(player.body.velocity.y > 0) player.body.velocity.y /= 1.3;
			player.body.velocity.y += -20;
		} else if (cursors.down.isDown) {
			if(player.body.velocity.y < 0) player.body.velocity.y /= 1.3;
			player.body.velocity.y += 20;
		} else {player.body.velocity.y = player.body.velocity.y / 1.1;}

		player.body.velocity.x = game.math.clamp(player.body.velocity.x, -400, 400);
		player.body.velocity.y = game.math.clamp(player.body.velocity.y, -400, 400);
	}
}

playerMovement.rotate = function () {
	let left = cursors.left.isDown;
	let right = cursors.right.isDown;
	let up = cursors.up.isDown;
	let down = cursors.down.isDown;

	// player.rotation = horizontalAxis(left, right);
	if(left){player.rotation -= 0.05;}
	if(right){player.rotation += 0.05;}
	if(up){
		player.body.acceleration = game.physics.arcade.accelerationFromRotation(player.rotation, 200);
	} else {player.body.acceleration = 0;}
	player.body.velocity.clamp(-200,200);
};

function horizontalAxis(left, right) {
	let axis = right ? 1 : 0;
	axis -= left ? 1 : 0;
	return axis;
}

function verticalAxis(up, down) {

}

function render() {
	//game.debug.pointer(game.input.pointer1);
	//game.debug.inputInfo(20,20);
	// game.debug.text(player.body.acceleration, 20, 20);

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