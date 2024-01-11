document.addEventListener("DOMContentLoaded", function () {
	// global elements
	var highScoreElement = document.querySelector("#highScore");
	var currentQuestion;
	var interval;
	var timeLeft = 10;
	var score = 0;
	var storedHighScore = localStorage.getItem("highScore") || 0;
	var numberChosen = 10;

	var selected;
	var selectType = function () {
		selected = _.sample(types).toString();
		return selected;
	};

	var updateTimeLeft = function (amount) {
		timeLeft += amount;
		$("#time-left").text(timeLeft);
	};

	var updateScore = function (amount) {
		score += amount;
		$("#score").text(score);

		if (score > storedHighScore) {
			storedHighScore = score;
			localStorage.setItem("highScore", storedHighScore);
			highScoreElement.textContent = storedHighScore;
		}
	};

	var startGame = function () {
		if (!interval) {
			if (timeLeft === 0) {
				updateTimeLeft(10);
				updateScore(-score);
			}
			interval = setInterval(function () {
				updateScore(0); // call updateScore with 0 to check for high score update
				updateTimeLeft(-1);
				if (timeLeft === 0) {
					clearInterval(interval);
					interval = undefined;
				}
			}, 1000);
		}
	};

	var randomNumberGenerator = function (size) {
		return Math.ceil(Math.random() * size);
	};

	var questionGenerator = function () {
		var question = {};
		var num1 = randomNumberGenerator(10);
		var num2 = randomNumberGenerator(10);

		question.answer = num1 + num2;
		question.equation = `${num1} + ${num2}`;

		return question;
	};

	var renderNewQuestion = function () {
		currentQuestion = questionGenerator();
		$("#equation").text(currentQuestion.equation);
	};

	var checkAnswer = function (userInput, answer) {
		if (userInput === answer) {
			renderNewQuestion();
			$("#user-input").val("");
			updateTimeLeft(+1);
			updateScore(+1);
		}
	};

	$("#user-input").on("keyup", function () {
		startGame();
		checkAnswer(Number($(this).val()), currentQuestion.answer);
	});

	// Initialize high score on page load
	highScoreElement.textContent = storedHighScore;

	$("#numberLimit").on("submit", function (e) {
		e.preventDefault();
		$("#currentLimit").html($("#numberInput").val());
		numberChosen = $("#numberInput").val();
		$("#numberInput").val("");
	});

	renderNewQuestion();
});
