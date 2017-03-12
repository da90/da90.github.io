var s, r, a, dice;
var isPlaying = true;
var lastDice;

init();

var d = document.querySelector(".dice");
d.style.display = "none";

document.querySelector(".btn-roll").addEventListener("click", function () {
    if (isPlaying)
    {
        //rng between 1 and 6 ...
        dice = Math.floor(Math.random() * 6) + 1;
        d.style.display = "block";
        d.src = "dice-" + dice + ".png";

        if (dice === 6 && lastDice === 6) {
            //player loses score
            scores[a] = 0;
            document.querySelector("#score-" + a).textContent = "0";
            nextPlayer();
        }
        //update round score if the rolled number was not a 1
        else if (dice !== 1) {
            //Add score
            r += dice;
            document.querySelector("#current-" + a).textContent = r;
        } else {
            //if ap 0 then ap 1 else 0 remember it's because we rolled a 1
            //Next player
            nextPlayer();
        }
        lastDice = dice;
    }


});



document.querySelector(".btn-hold").addEventListener("click", function () {
    if (isPlaying) {
        //Add current score to global
        s[a] += r;
        //Update the UI
        document.getElementById("score-" + a).textContent = s[a];
        //Check if video gamer won
        if (s[a] >= 100) {
            document.getElementById("name-" + a).textContent = "Winner!";
            d.style.display = "none";
            document.querySelector(".player-" + a + "-panel").classList.add("winner");
            document.querySelector(".player-" + a + "-panel").classList.remove("active");
            isPlaying = false;
        } else {
            nextPlayer();
        }
    }
});


document.querySelector(".btn-new").addEventListener("click", init);

function init() {
    s = [0, 0];
    r = 0;
    a = 0;
    isPlaying = true;

    document.getElementById("score-0").textContent = "0";
    document.getElementById("score-1").textContent = "0";
    document.getElementById("current-0").textContent = "0";
    document.getElementById("current-1").textContent = "0";

    document.getElementById("name-0").textContent = "Player 1";
    document.getElementById("name-1").textContent = "Player 2";

    document.querySelector(".player-0-panel").classList.remove("winner");
    document.querySelector(".player-1-panel").classList.remove("winner");
    document.querySelector(".player-0-panel").classList.remove("active");
    document.querySelector(".player-0-panel").classList.add("active");
    document.querySelector(".player-1-panel").classList.remove("active");

}

function nextPlayer() {

    a === 0 ? a = 1 : a = 0;

    r = 0;

    document.getElementById("current-0").textContent = "0";
    document.getElementById("current-1").textContent = "0";

    document.querySelector(".player-0-panel").classList.toggle("active");
    document.querySelector(".player-1-panel").classList.toggle("active");

    d.style.display = "none";
}
//junk code
//getter...
//var x = document.querySelector("#score-0").textContent;
//document.querySelector("#current-" + a).innerHTML = "<em>" + dice + "</em>";
//document.querySelector(".dice").style.display = "none";

//document.querySelector('.btn-hold').addEventListener('click', function () {
//    // Add current score to global
//    s[a] += r;

//    // ui update
//    document.querySelector('#score-' + a).textContent = s[a];

//    // player won?
//    if (s[a] >= 100) {
//        document.querySelector('#name-' + a).textContent = 'Winner!';
//        d.style.display = "none";
//        document.querySelector('.player-' + a + '-panel').classList.add('winner');
//        document.querySelector('.player-' + a + '-panel').classList.remove('active');
//        gamePlaying = false;
//    } else {
//        nextPlayer();
//    }
//});