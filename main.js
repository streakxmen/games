window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 600;

    let player = {
        x: 50,
        y: 300,
        width: 50,
        height: 50,
        color: 'green',
        speed: 5,
        dy: 0,
        gravity: 0.2,
        jumpStrength: -3,
        jumps: 0,
        maxJumps: 9999999999,
        hp: 3 // Player's health points
    };

    let pipes = []; // Array to store pipe pairs

    let keys = {};

    window.addEventListener('keydown', function(e) {
        keys[e.key] = true;

        // Make the player jump when the spacebar is pressed
        if (e.key === ' ' && player.jumps < player.maxJumps) {
            player.dy = player.jumpStrength;
            player.jumps++;
        }
    });

    window.addEventListener('keyup', function(e) {
        keys[e.key] = false;
    });

    function generateRandomGap() {
        // Generate random gap position between 100 and 400 pixels from the top
        return Math.random() * (400 - 100) + 100;
    }

    function createPipes() {
        // Create a pair of pipes and position them randomly on the canvas
        let gapY = generateRandomGap();
        let pipeTop = {
            x: canvas.width,
            y: 0,
            width: 50,
            height: gapY,
            color: 'red'
        };
        let pipeBottom = {
            x: canvas.width,
            y: gapY + 150, // Gap of 150 pixels between pipes
            width: 50,
            height: canvas.height - gapY - 150,
            color: 'red'
        };
        pipes.push(pipeTop, pipeBottom);
    }

    createPipes(); // Create initial pair of pipes

    function update() {
        // Apply gravity
        player.dy += player.gravity;
        player.y += player.dy;

        

        // Prevent the player from falling out of the canvas
        if (player.y + player.height > canvas.height) {
            player.y = canvas.height - player.height;
            player.dy = 0;  // Reset the vertical speed when hitting the ground
            player.jumps = 0; // Reset jumps when hitting the ground
        }

        if (player.y < 0) player.y = 0;
        if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;


   

        // Allow the player to jump
        if (keys['ArrowUp'] || keys[' ']) {
            player.dy = player.jumpStrength;
            player.jumps++;
        }

        // Update pipes
        pipes.forEach(function(pipe) {
            pipe.x -= player.speed - 3; // Move pipes to the left
  
            // Check for collision with pipes
            if (
                player.x + player.width >= pipe.x &&
                player.x <= pipe.x + pipe.width &&
                (player.y <= pipe.y + pipe.height || player.y + player.height >= pipe.y + 150)
            ) {
                player.hp--; // Decrease player's HP
            }

            // Remove pipes when they go off-screen
            if (pipe.x + pipe.width < 0) {
                pipes.shift(); // Remove the first pipe in the array
                pipes.shift(); // Remove the second pipe in the array
                createPipes(); // Add new pair of pipes
            }
        });

        // Check if player's HP is zero
        if (player.hp <= 0) {
            gameOver = true;
        }
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw player
        context.fillStyle = player.color;
        context.fillRect(player.x, player.y, player.width, player.height);

        // Draw pipes
        pipes.forEach(function(pipe) {
            context.fillStyle = pipe.color;
            context.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
        });

        // Draw "GAME OVER" if player's HP is zero
        if (player.hp <= 0) {
            context.font = '30px Arial';
            context.fillStyle = 'white';
            //context.fillText('GAME OVER', canvas.width / 2 - 80, canvas.height / 2);
        }
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
};
