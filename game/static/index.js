//  Canvas variables
const canvas = document.querySelector('canvas')
const scoreElement = document.querySelector('#scoreElement')
const ctx = canvas.getContext('2d')
const start = document.querySelector('#start_game')
let menu = document.querySelector('#menu')


canvas.width = 900;
canvas.height = innerHeight;
// Start game button
start.addEventListener('click', () => {
    menu.style.visibility = "hidden";
    menu.style.display = 'none';
    Innit()
    animate()
})


// Player
class Player {
    constructor() {

        this.velocity = {
            x: 0,
            y: 0
        }
        this.opacity = 1
        this.rotation = 0
        const image = new Image()
        image.src = spaceship
        image.onload = () => {
            const scale = 0.6
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }
    draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2
        )
        ctx.rotate(this.rotation)
        ctx.translate(
            -player.position.x - player.width / 2,
            -player.position.y - player.height / 2
        )
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
        ctx.restore()
    }
    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}
// Lives
class Lives {
    constructor() {
        this.lives = lives
        this.position = { x: 30, y: 900 };
        const image = new Image()
        image.src = heart
        image.onload = () => {
            const scale = 1
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
        }
    }
    draw() {
        if (!this.image) return
        for (let i = 0; i < this.lives; i++) {
            ctx.drawImage(
                this.image,
                this.position.x * i,
                this.position.y,
                this.width,
                this.height
            )
        }
    }
    update() {
        this.draw()
        this.lives = lives
    }
}
// Projectile
class Projectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity

        this.height = 20
        this.width = 5
    }
    draw() {
        ctx.fillStyle = 'green'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
// Particle
class Particle {
    constructor({ position, velocity, radius, color, fades }) {
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }
    draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.fades) {
            this.opacity -= 0.01
        }
    }
}
// aliens Projectiles
class AlienProjectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity

        this.width = 3
        this.height = 10
    }
    draw() {
        ctx.fillStyle = 'red'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
// Alien Class
class Alien {
    constructor({ position }) {
        this.velocity = {
            x: 0,
            y: 0
        }
        const image = new Image()
        let random = Math.floor(Math.random() * enemy.length)
        image.src = enemy[random]
        image.onload = () => {
            const scale = 1
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }
    draw() {
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }
    update({ velocity }) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }
    //  Shooting Function
    shoot(alienProjectiles) {
        alienProjectiles.push(
            new AlienProjectile({
                position: {
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height
                },
                velocity: {
                    x: 0,
                    y: 2
                }
            }))
    }
}

// Grids of enemies
class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 3,
            y: 0
        }
        this.aliens = []

        const columns = Math.floor(Math.random() * 5 + 5)
        console.log(columns)

        const rows = Math.floor(Math.random() * 5 + 2)
        console.log(rows)
        this.width = columns * 40
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                this.aliens.push(
                    new Alien({
                        position: {
                            // spacing between aliens
                            x: i * 40,
                            y: j * 40,
                        }
                    })
                )
            }
        }
    }
    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 40
        }
    }
}
// Game Variables
const dmg = new Audio(losing_lives);
const laser = new Audio(laser_sound);
const hit = new Audio(hit_sound);
const game_over = new Audio(game_over_sound);
let lives = 5
let player_lives = new Lives()
let player = new Player()
let projectiles = []
let grids = []
let alienProjectiles = []
let particles = []


const keys = {
    left: {
        downdown: false
    },
    right: {
        down: false
    },
    space: {
        down: false
    }
}

// Utilities Variables
let frames = 0
let randomInterval = Math.floor((Math.random() * 1000) + 3000)
let game = {
    over: false,
    active: true
}
let score = 0
let shoot_timer = 300
let shoot_cooldown = 50


//  Innit function
function Innit() {
    lives = 5
    player_lives = new Lives()
    player = new Player()
    projectiles = []
    grids = []

    alienProjectiles = []
    particles = []
    score = 0
    shoot_timer = 300
    shoot_cooldown = 25
    frames = 0
    randomInterval = Math.floor((Math.random() * 1000) + 3000)
    game = {
        over: false,
        active: true
    }
    for (let i = 0; i < 100; i++) {
        color = ['white', '#c7d8ff']
        let color_picker = Math.floor(Math.random() * 1)
        particles.push(
            new Particle({
                position: {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height
                },
                velocity: {
                    x: 0,
                    y: 0.5
                },
                radius: Math.random() * 3,
                color: color[color_picker]
            })
        )
    }


}
function decreaseShootCooldown() {
    if (shoot_cooldown > 0) {
        shoot_cooldown -= 1;
    }
}
// Create particles Function
function Create_particles({ object, color, fades }) {
    for (let i = 0; i < 15; i++) {
        particles.push(
            new Particle({
                position: {
                    x: object.position.x + object.width / 2,
                    y: object.position.y + object.height / 2
                },
                velocity: {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2
                },
                radius: Math.random() * 3,
                color: color,
                fades: fades
            })
        )
    }
}
// Player laseer
function laser_shot() {
    projectiles.push(
        new Projectile({
            position: {
                x: player.position.x + (player.width / 2) - 2.5,
                y: player.position.y
            },
            velocity: {
                x: 0,
                y: -10,
            }
        })
    )
}

// Animate Function
function animate() {
    if (!game.active) return
    requestAnimationFrame(animate)
    ctx.fillStyle = '#010203'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.update(ctx)
    decreaseShootCooldown()
    player_lives.update()
    particles.forEach((particle, i) => {

        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }

        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0)
        } else {
            particle.update()
        }
    })
    // Enemies Projectiles animation
    alienProjectiles.forEach((alienProjectile, index) => {
        if (alienProjectile.position.y + alienProjectile.height >= canvas.height) {
            setTimeout(() => {
                alienProjectiles.splice(index, 1)
            }, 0)
        } else alienProjectile.update()

        // Hibox logic
        if (alienProjectile.position.y + alienProjectile.height >= player.position.y && alienProjectile.position.x + alienProjectile.width >= player.position.x && alienProjectile.position.x <= player.position.x + player.width) {
            // Game over Logic
            if (lives <= 1) {
                setTimeout(() => {
                    alienProjectiles.splice(index, 1)
                    player.opacity = 0
                    game.over = true
                }, 0)
                setTimeout(() => {
                    game.active = false
                }, 2000)
                console.log('you lost the game')
                game_over.play();
                lives--;
                player_lives.update()
                menu.style.display = 'block';
                menu.style.visibility = 'visible';
                Create_particles({
                    object: player,
                    color: 'white',
                    fades: true
                })
            } else {
                // Losing lives each hit
                setTimeout(() => {
                    alienProjectiles.splice(index, 1)
                    lives--;
                    player_lives.update()
                    dmg.play()
                }, 0)

                Create_particles({
                    object: player,
                    color: 'deepskyblue',
                    fades: true
                })
            }

        }
    })
    // Projectile memory managment
    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.height.y <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        } else {
            projectile.update()
        }
    })
    grids.forEach((grid, gridIndex) => {
        grid.update()

        // Spawn projectiles
        if (frames % shoot_timer === 0 && grid.aliens.length > 0) {
            grid.aliens[Math.floor(Math.random() * grid.aliens.length)].shoot(
                alienProjectiles
            )
            // Enemies each time shoot sooner
            if (shoot_timer > 50) {
                shoot_timer -= 4
            } else {
                // time cap on shoot
                shoot_timer = 50
            }

        }
        grid.aliens.forEach((alien, i) => {
            alien.update({ velocity: grid.velocity })
            // Game Over when alien get to player position
            if (alien && alien.position && alien.position.y + alien.height >= player.position.y && player && player.position + player.height) {
                setTimeout(() => {
                    grid.aliens.splice(i, 1)
                    player.opacity = 0
                    game.over = true
                }, 0)
                setTimeout(() => {
                    game.active = false
                }, 2000)
                console.log('you lost the game')
                game_over.play();
                menu.style.display = 'block';
                menu.style.visibility = 'visible';
                Create_particles({
                    object: player,
                    color: 'deepskyblue',
                    fades: true
                })

            }
            // Alien Hitbox
            projectiles.forEach((projectile, j) => {
                if (projectile && projectile.position && projectile.position.x >= (alien && alien.position && alien.position.x - alien.width / 2) && projectile.position.x <= (alien.position.x + alien.width / 2) && projectile && projectile.position && projectile.position.y <= (alien && alien.position && alien.position.y + alien.height) && projectile.position.y >= (alien.position.y - alien.height)) {

                    // Removing alien from the grid that was shot
                    setTimeout(() => {
                        const alienFound = grid.aliens.find((alien2) => alien2 === alien)
                        const projectileFound = projectiles.find((projectile2) => projectile2 === projectile)
                        color = ['pink', 'yellow', 'deepskyblue']
                        let color_picker = Math.floor(Math.random() * 2)

                        if (alienFound && projectileFound) {
                            score += 15
                            console.log(score)
                            scoreElement.innerHTML = score
                            hit.play()
                            Create_particles({
                                color: color[color_picker],
                                object: alien,
                                fades: true
                            })
                            // remove alien and projectile
                            grid.aliens.splice(i, 1)
                            projectiles.splice(j, 1)

                            // grid get smaller when defeating all enemis in the column
                            if (grid.aliens.length > 0) {
                                const firstAlien = grid.aliens[0]
                                const lastAlien = grid.aliens[grid.aliens.length - 1]

                                grid.width = lastAlien.position.x - firstAlien.position.x + lastAlien.width
                                grid.position.x = firstAlien.position.x
                            } else {
                                grids.splice(gridIndex, 1)
                            }
                        }
                    }, 0)
                }
            })
        })
    })
    // Player movement
    if (keys.left.down && player.position.x >= 0) {
        player.velocity.x = -5
        player.rotation = -0.15
    } else if (keys.right.down && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 5
        player.rotation = 0.15
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }
    // random number of when next Grid is going to get spawn
    if (frames % randomInterval === 0) {
        grids.push(new Grid())
        randomInterval = Math.floor((Math.random() * 1000) + 3000)
        frames = 0
        console.log(randomInterval)
    }
    frames++
}

// event listeners for key down
addEventListener('keydown', ({ key }) => {
    if (game.over) return
    switch (key) {
        case 'ArrowLeft':
            // console.log("left")
            keys.left.down = true
            break
        case 'ArrowRight':
            // console.log("right")
            keys.right.down = true
            break
        case ' ':
            if (shoot_cooldown > 0) return;
            // console.log("space")
            keys.space.down = true
            laser_shot()
            laser.play()
            shoot_cooldown = 25
            // console.log(projectiles)
            break
    }
})
// event listeners for key up
addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'ArrowLeft':
            // console.log("left")
            keys.left.down = false
            break
        case 'ArrowRight':
            // console.log("right")
            keys.right.down = false
            break
        case ' ':
            // console.log("space")
            keys.space.down = false
            break
    }
})
// save score into the database
document.querySelector('#post_score').onclick = new_score;
function new_score() {
    const new_user = document.querySelector('#username').value;
    console.log(new_user);
    console.log(score);

    fetch('/new_score', {
        method: 'POST',
        body: JSON.stringify({
            name: new_user,
            number: score
        })
    })

        .then(response => response.json())
        .then(response => {
            console.log(response)
        });
    location.reload();
    return false;
}