//strict should not be used
/*jshint esversion: 6 */ 

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render:render });

let platforms, player, cursors, stars, score = 0, scoreText, globalScoreText = 0, controlState, space;

function preload() {
    game.load.image('space', 'assets/space.png');
    game.load.image('space2', 'assets/space2.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
    game.load.image('ship', 'assets/ship.png');
    game.load.audio("space groove", 'assets/8 Bit Space Groove! by HeatleyBros.wav'); 

}

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	space = game.add.tileSprite(0, 0, game.width, game.height, "space2");

	
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
	for (var i = 0; i < 100; i++) {
		var star = stars.create(Math.random()*(game.world.width - 24), Math.random()*(game.world.height - 22), "star");
	}

	scoreText = game.add.text(16, 16, "Score: 0", {fontSize: "32px", fill:"#fff"});
	// globalScoreText = game.add.text(16, 64, "Global Score: ", {fontSize: "32px", fill:"#000"});

	music = game.add.audio("space groove");
	music.play();
	music.loop = true;
}

function update() {

	game.physics.arcade.overlap(player, stars, collectStar, null, this);

	

	playerMovement.rotate(4.5, 5);
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

playerMovement.rotate = function (speed=1, rotationSpeed=6.5) {
	let left = cursors.left.isDown;
	let right = cursors.right.isDown;
	let up = cursors.up.isDown;
	let down = cursors.down.isDown;

	player.rotation += (getAxis(right, left) / 100) * rotationSpeed;

	let torque = getAxis(up, down);
	let direction = game.physics.arcade.velocityFromRotation(player.rotation, speed * 60 * torque);



	player.body.velocity = direction;
	/*if(up){
		player.body.acceleration = ;
	} else {player.body.acceleration = 0;}
	player.body.velocity.clamp(-200,200);*/
};

function collectStar(player, star) {
	star.reset(Math.random()*(game.world.width - 24), Math.random()*(game.world.height - 22));
	// socket.emit('increase', globalScore);
	score++;
	scoreText.text = "Score: " + score;
	star.body.bounce.y =0.7 + Math.random() * 0.2;
	// scale++
	// alpha--
}

function getAxis(positive, negative) {
	return (positive ? 1 : 0) - (negative ? 1 : 0);
}

function render() {
	//game.debug.pointer(game.input.pointer1);
	//game.debug.inputInfo(20,20);
	// game.debug.text("velocity = " + player.body.velocity, 20, 20);
	// game.debug.spriteInfo(player, 20, 40);

}

window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);


/*
socket.on("increase", function(count){
	globalScore = count;
	// $('.counter').html(globalScore);
	globalScoreText.text = "Global Score: " + globalScore;
});

socket.on("reset", function() {
	$('.counter').html(0);
});*/