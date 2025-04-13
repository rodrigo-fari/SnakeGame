const canvas = document.querySelector('canvas')
const score = document.querySelector('.score-value')
const finalScore = document.querySelector('.final-score > span')
const menu = document.querySelector('.menu-screen')
const buttonPlay = document.querySelector('.btn-play')
const ctx = canvas.getContext('2d')
const audio = new Audio('../assets/audio.mp3')
const size = 30
const initialPosition = {x:270, y:240}
const scoreLabel = document.querySelector('.score-label')
let velocity = 150
let loopId
let direction
let snake = [initialPosition]
let isGameOver = false; // Variável para rastrear o estado do jogo

const incrementScore = () => {
	score.innerText = +score.innerText + 1
}

const randomNumber = (min, max) => {
	return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
	const number = randomNumber(0, canvas.width - size)
	return Math.round(number / 30) * 30
}

const randomColor = () => {
	const red = randomNumber(0, 255)
	const green = randomNumber(0, 255)
	const blue = randomNumber(0, 255)
	
	return `rgb(${red}, ${green}, ${blue})`
}

let color = randomColor()

const food = {
	x: randomPosition(),
	y: randomPosition(),
	color: randomColor()
}

const drawFood = () => {
	const { x, y, color } = food

	ctx.shadowColor = color
	ctx.shadowBlur = 6
	ctx.fillStyle = color
	ctx.fillRect(x, y, size, size)
	ctx.shadowBlur = 0
}

const drawSnake = () => {
	ctx.fillStyle = color
	snake.forEach((position, index) => {
		if (index == snake.length - 1) {
			ctx.fillStyle = "white"
		}
		ctx.fillRect(position.x, position.y, size, size)
	})
}

const moveSnake = () => {
	if (direction == undefined) return
	const head = snake[snake.length - 1]
	if (direction == "right") {
		snake.push({x: head.x + size, y: head.y})
	}
	if (direction == "left") {
		snake.push({x: head.x - size, y: head.y})
	}
	if (direction == "down") {
		snake.push({x: head.x, y: head.y + size})
	}
	if (direction == "up") {
		snake.push({x: head.x, y: head.y - size})
	}

	snake.shift()
}

const drawGrid = () => {
	ctx.lineWidth = 1
	ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
	for (let i = 30; i < canvas.width; i += 30) {
		ctx.beginPath()
		ctx.lineTo(i, 0)
		ctx.lineTo(i, 600)
		ctx.stroke()
		ctx.beginPath()
		ctx.lineTo(0, i)
		ctx.lineTo(600, i)
		ctx.stroke()
	}
}
const checkEat = () => {
	const head = snake[snake.length - 1]
	if (head.x == food.x && head.y == food.y) {
		color = randomColor()
		incrementScore()
		snake.push(head)
		audio.play()
		
		let x = randomPosition()
		let y = randomPosition()

		while (snake.find((position) => position.x == x && position.y == y)) {
			x = randomPosition()
			y = randomPosition()
		}
		food.x = x
		food.y = y
		food.color = randomColor()
	}
}

const checkCollision = () => {
	const head = snake[snake.length - 1]
	const canvasLimit = canvas.width - size
	const neckIndex = snake.length - 2

	const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

	const selfCollision = snake.find((position, index) => {
		return index < neckIndex && position.x == head.x && position.y == head.y
	})

	if (wallCollision || selfCollision) {
		gameOver()
	}
}

const gameOver = () => {
	direction = undefined
	isGameOver = true; // Define o estado do jogo como "terminado"
	menu.style.display = "flex"
	finalScore.innerText = score.innerText
	canvas.style.filter = "blur(4px)"
	score.style.filter = "blur(4px)"
	scoreLabel.style.filter = "blur(4px)"
}

const gameLoop = () => {
	if (isGameOver) return; // Interrompe o loop se o jogo terminou

	clearInterval(loopId)
	ctx.clearRect(0, 0, 600, 600)
	drawGrid()
	drawFood()
	moveSnake()
	drawSnake()
	checkEat()
	checkCollision()
	
	loopId = setTimeout(() => {
		gameLoop()
	}, velocity)
}

gameLoop()

document.addEventListener("keydown", ({ key }) => {
	if (key == "ArrowRight" && direction != "left")
		direction = "right"
	if (key == "ArrowLeft" && direction != "right")
		direction = "left"
	if (key == "ArrowUp" && direction != "down")
		direction = "up"
	if (key == "ArrowDown" && direction != "up")
		direction = "down"
})

buttonPlay.addEventListener('click', () => {
	score.innerText = "00"
	menu.style.display = "none"
	canvas.style.filter = "none"
	score.style.filter = "none"
	scoreLabel.style.filter = "none"
	snake = [{ ...initialPosition, color: randomColor() }];
	direction = undefined;
	isGameOver = false; // Redefine o estado do jogo como "ativo"
})