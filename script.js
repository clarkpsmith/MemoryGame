const gameContainer = document.getElementById('game');
const startBtn = document.querySelector('#start-game');
const scoreboard = document.querySelector('#score');
const lowScore = document.querySelector('#lowest-score');
const scoreRecord = document.querySelector('#score-record');
const directions = document.querySelector('#rules');
let card1 = null;
let card2 = null;
let cardsFlipped = 0;
let noClicking = false;
let score = 0;
let startBtnClicked = 0;
let lowestScore = JSON.parse(localStorage.getItem('score')) || null;
startBtn.addEventListener('click', startGame);

if (lowestScore) lowScore.innerText = `LOWEST SCORE IS ${lowestScore}`;
function startGame() {
	startBtn.remove();
	directions.remove();
	createDivsForColors(shuffledColors);
	scoreboard.textContent = `SCORE: ${score}`;
	const btn = document.createElement('button');
	btn.classList.add('restart');
	btn.innerText = 'PLAY AGAIN';
	btn.addEventListener('click', () => {
		window.location.reload();
	});
	gameContainer.appendChild(btn);
}

const COLORS = [ 'red', 'blue', 'green', 'orange', 'purple', 'red', 'blue', 'green', 'orange', 'purple' ];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
	let counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		let index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
	for (let color of colorArray) {
		// create a new div
		const newDiv = document.createElement('div');

		// give it a class attribute for the value we are looping over
		newDiv.classList.add(color);

		// call a function handleCardClick when a div is clicked on
		newDiv.addEventListener('click', handleCardClick);

		// append the div to the element with an id of game
		gameContainer.append(newDiv);
	}
}

// TODO: Implement this function!

function handleCardClick(event) {
	if (noClicking) return; //if two cards have been clicked
	if (event.target.classList.contains('up')) return; //stops the card counter from counting if a card is clicked twice

	let currentCard = event.target;
	score++;
	scoreboard.textContent = `SCORE: ${score}`;

	currentCard.style.backgroundColor = currentCard.classList[0];

	if (!card1 || !card2) {
		currentCard.classList.add('up');
		card1 = card1 || currentCard;
		card2 = card1 === currentCard ? null : currentCard;
	}
	if (card1 && card2) {
		noClicking = true; //stop more than two cards being clicked at a time
		let color1 = card1.className;
		let color2 = card2.className;

		if (color1 === color2) {
			cardsFlipped += 2;

			card1.removeEventListener('click', handleCardClick);
			card2.removeEventListener('click', handleCardClick);
			card1 = null;
			card2 = null;
			noClicking = false;
		} else {
			setTimeout(() => {
				card1.style.backgroundColor = '';
				card2.style.backgroundColor = '';
				card1.classList.remove('up');
				card2.classList.remove('up');
				card1 = null;
				card2 = null;
				noClicking = false;
			}, 1000);
		}
	}
	if (cardsFlipped === COLORS.length) {
		if (score < lowestScore || !lowestScore) {
			lowestScore = score;
			scoreRecord.textContent = `NEW LOW SCORE RECORD OF ${lowestScore}!!!`;
			localStorage.setItem('score', JSON.stringify(lowestScore));
			lowScore.textContent = `LOWEST SCORE RECORD IS ${lowestScore}`;
		} else {
			scoreboard.textContent = `GAME OVER! YOU WON IN ${score} CARDS`;
		}
	}
}
