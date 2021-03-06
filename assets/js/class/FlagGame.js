class FlagGame {
    constructor() {
        this.startBtn = document.getElementById("start-btn");
        this.displayScore = document.getElementById("display-score");
        this.flagImg = document.getElementById("flag-img");
        this.flagText = document.getElementById("flag-text");
        this.answerA = document.getElementById("answer-a");
        this.answerB = document.getElementById("answer-b");
        this.answerC = document.getElementById("answer-c");
        this.answerD = document.getElementById("answer-d");

        this.answerArray = [this.answerA, this.answerB, this.answerC, this.answerD];
        this.score = 0;
        this.delayStart = 1500;
        this.displayAnwsersTime = 2500;
        this.gameStarted = false;
        this.clicked = false;
    };

    randomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    startGame() {
        if (this.startBtn.textContent === "START") {
            this.startBtn.textContent = "Restart";
        }
        if (this.answerA.textContent !== " ") {
            for (let entrie of this.answerArray) {
                entrie.textContent = " ";
            }
        }

        for (let answer of this.answerArray) {
            answer.classList.remove(...answer.classList);
        }

        this.score = 0;
        this.displayScore.textContent = this.score;
        this.flagText.style.display = "flex";
        this.flagImg.style.display = "none";
        setTimeout(() => {
            this.flagText.style.display = "none";
        }, this.delayStart);
    }

    nextQuestion() {
        setTimeout(() => {
            this.answerArray.forEach((element) => {
                element.textContent = " ";
            });
            this.clicked = false;
            this.getGamesFetch();
        }, this.displayAnwsersTime);
    }


    // ----------- FETCH COUTRY LIST --------------

    getGamesFetch() {
        return fetch("https://restcountries.com/v3.1/all")
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((value) => {
                setTimeout(() => {
                    this.displayAnwsers(value);
                    this.startBtn.disabled = false;
                    this.startBtn.style = "#000";
                }, this.delayStart);
            })
            .catch(err => console.log(err.message))
    };


    displayAnwsers(value) {
        // good value
        let randomLi = this.answerArray[this.randomNumber(0, 3)];
        let randomRef = this.randomNumber(0, value.length);
        this.flagImg.src = `https://countryflagsapi.com/svg/${value[randomRef].cca3}`;
        this.flagImg.style.display = "block";
        randomLi.textContent = value[randomRef].name.common;
        randomLi.classList.add("good");
        console.log("cheater mode [ON] :" + value[randomRef].name.common);

        // wrong values
        for (let entrie in this.answerArray) {
            if (this.answerArray[entrie].textContent === " ") {
                let randomWrongRef = this.randomNumber(0, value.length);
                this.answerArray[entrie].textContent = value[randomWrongRef].name.common;
                while (value[randomWrongRef].name.common === value[randomRef].name.common) {
                    randomWrongRef = this.randomNumber(0, value.length);
                    this.answerArray[entrie].textContent = value[randomWrongRef].name.common;
                }
            }
        }
    }

    init() {
        this.initControls();
    };

    initControls() {

        this.startBtn.addEventListener("click", () => {
            this.startBtn.disabled = true;
            this.startBtn.style = "#000";
            this.startBtn.style.color = "#fff";
            this.startGame();
            this.getGamesFetch();
            this.gameStarted = true;

        });

        // addEventListener ON ALL ANSWERS
        for (let entrie of this.answerArray) {
            entrie.addEventListener("click", () => {
                this.startBtn.disabled = true;
                this.startBtn.style = "#000";

                if (this.gameStarted && !this.clicked) {
                    if (entrie.classList.contains("good")) {
                        this.score++;
                        this.displayScore.textContent = this.score;
                        entrie.classList.add("good-answer");
                        setTimeout(() => {
                            entrie.classList.remove(...entrie.classList);
                        }, this.displayAnwsersTime);
                        setTimeout(() => {
                            entrie.classList.remove(...entrie.classList);
                        }, this.displayAnwsersTime);

                    } else {
                        this.score = 0;
                        this.displayScore.textContent = this.score;
                        entrie.classList.add("wrong-answer");
                        setTimeout(() => {
                            for (let answer of this.answerArray) {
                                answer.classList.remove(...answer.classList);
                            }
                        }, this.displayAnwsersTime);
                    }
                    this.clicked = true;
                    this.nextQuestion();
                }
            })
        }
    };
}

export default FlagGame;