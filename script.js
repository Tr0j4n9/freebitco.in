// Variable to change:
var baseBetAmount = 0.00000001;
var betMultiplier = 2;
var supportedLoseSequenceBetsLength = 20;
var betsPatternsLengthInDecimal = [4];
var betPatternReversed = 1; // Will create the pattern reverse only when equal to 1!
var patternPlayPeriodInSeconds = 100; // The period of playing a single pattern.
var binarySequenceOpposite = 1; // If equal to 1, will create binary opposed sequences pattern. value vary from 0 to 2.
var maxGain = 0.00001;
var satWagered = 0;

// First we load all bets sequences:
var betsPatterns = [];

function reverseString(str) {
    return str.split('').reverse().join('');
}

function isNumberBetweenInterval(number, a, b, inclusive) {
    var min = Math.min(a, b),
        max = Math.max(a, b);
    return inclusive ? number >= min && number <= max : number > min && number < max;
}

function loadBetsPattern() {
    betsPatternsLengthInDecimal.forEach(function (t) {

        // Looking for regular binary:
        if (isNumberBetweenInterval(binarySequenceOpposite, 0, 1, true)) {
            current = [];
            for (i = 0; i < Math.pow(2, t); i++) {
                // It support only 9!
                binary = ("00000000" + i.toString(2)).slice(-1 * t);
                current.push(binary);
            }
            betsPatterns.push(current);
            // Looking for reverse:
            if (betPatternReversed === 1) {
                current = [];
                for (i = Math.pow(2, t) - 1; i >= 0; i--) {
                    // It support only 9!
                    binary = ("00000000" + i.toString(2)).slice(-1 * t);
                    current.push(binary);
                }
                betsPatterns.push(current);
            }
        }

        // Looking for binary opposite:
        if (isNumberBetweenInterval(binarySequenceOpposite, 1, 2, true)) {
            current = [];
            for (i = 0; i < Math.pow(2, t); i++) {
                // It support only 9!
                binary = ("00000000" + i.toString(2)).slice(-1 * t);
                current.push(reverseString(binary));
            }
            betsPatterns.push(current);
            // Looking for reverse:
            if (betPatternReversed === 1) {
                current = [];
                for (i = Math.pow(2, t) - 1; i >= 0; i--) {
                    // It support only 9!
                    binary = ("00000000" + i.toString(2)).slice(-1 * t);
                    current.push(reverseString(binary));
                }
                betsPatterns.push(current);
            }
        }
    });
}

loadBetsPattern();
console.log(betsPatterns);

var currentPattern = 0;
var currentPatternSequenceIndex = 0;
var currentInnerSequencePosition = 0;
var betsCounter = 0;
var currentLoseSequenceBetsCounter = 0;
var maxLoseSequenceBetsCounter = 0;
var maxBet = 0;
var betsButtons = [$('#double_your_btc_bet_hi_button'), $('#double_your_btc_bet_lo_button')]; // We can reverse them here if needed.
var bets = ["h", "l"];
var currentBetIndex = parseInt(betsPatterns[currentPattern][currentPatternSequenceIndex].charAt(currentInnerSequencePosition));
var $betButton = betsButtons[currentBetIndex];
var gameStopped = false;
var patternStartingDateTime = new Date();
var startingBalance = parseFloat($('#balance').html());

function getSecondsBetweenDates(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();
    return (diff / 1000);
}

function setRandomClientSeed() {
    var chaine_CLIENT =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var generate, i;
    var CLIENT_SEED = "";
    var CLIENT_SEED_size = 64;
    for (i = 0; i < CLIENT_SEED_size; i++) {
        if (!i) {
            generate = Math.floor(Math.random() * chaine_CLIENT.length + 1);
        } else {
            generate = Math.floor(Math.random() * chaine_CLIENT.length);
        }

        CLIENT_SEED += chaine_CLIENT.charAt(generate);
    }
    $("#next_client_seed").val(CLIENT_SEED);
    return CLIENT_SEED;
}

function setMultiply() {
    var current = $('#double_your_btc_stake').val();
    var nbr = parseInt(current * 100000000 * betMultiplier) / 100000000;
    var multiply = nbr.toFixed(8);
    $('#double_your_btc_stake').val(multiply);
    return multiply;
}

function reset() {
    satWagered += parseFloat(baseBetAmount);
    $('#double_your_btc_stake').val(parseFloat(baseBetAmount).toFixed(8));
}

function stop() {
    console.log('Game will stop soon! Let me finish.');
    gameStopped = true;
}

function getCurrentBalance() {
    return parseFloat($('#balance').html());
}

function getProfit() {
    return (getCurrentBalance() - startingBalance).toFixed(8);
}

function start() {
    console.log('Game started!');
    // Change client seed, that have to be changed for every roll:
    setRandomClientSeed();
    // Return to base bet amount:
    reset();
    // We start betting:
    $betButton.trigger('click');
}

// Unbind old shit:
$('#double_your_btc_bet_lose').unbind();
$('#double_your_btc_bet_win').unbind();

// LOSER
$('#double_your_btc_bet_lose').bind("DOMSubtreeModified", function (event) {
    if ($(event.currentTarget).is(':contains("lose")')) {
        // When losing, follow current sequence, when finished start the next sequence
        // save the old bet in current lose sequence and general bets counters.
        // Index: local variable: will save the old value for a bit, till we update them.
        index = currentPatternSequenceIndex;

        currentInnerSequencePosition++;
        currentPatternSequenceIndex = (currentPatternSequenceIndex + parseInt(currentInnerSequencePosition / betsPatterns[currentPattern][index].length)) % betsPatterns[currentPattern].length;
        currentInnerSequencePosition = currentInnerSequencePosition % betsPatterns[currentPattern][index].length;

        currentLoseSequenceBetsCounter++;
        if (currentLoseSequenceBetsCounter > maxLoseSequenceBetsCounter) {
            maxLoseSequenceBetsCounter = currentLoseSequenceBetsCounter;
        }

        betsCounter++;

        // Changing the loose pattern:
        String.prototype.replaceAt = function (index, replacement) {
            return this.substr(0, index) + replacement + this.substr(index + replacement.length);
        }
        var change_old = betsPatterns[currentPattern][currentPatternSequenceIndex];
        var change_new = '0000';

        for (var i = 0; i < change_old.length; i++) {
            if (change_old.charAt(i) == '0')
                change_new = change_new.replaceAt(i, '1');
            else
                change_new = change_new.replaceAt(i, '0');
        }
        betsPatterns[currentPattern][currentPatternSequenceIndex] = change_new;

        // Start working on the next bet.
        // Change client seed, that have to be changed for every roll:
        setRandomClientSeed();
        
        // Multiply bet amount:
        var multiply = setMultiply();

        if (multiply > maxBet) {
            maxBet = multiply;
        }

        console.log('Bets: ' + betsCounter + ' || Profit: ' + getProfit() + ' || Lose sequence: ' +
            currentLoseSequenceBetsCounter + ' || Current bet: ' + bets[currentBetIndex] +
            ' || Max lose consecutive: ' + maxLoseSequenceBetsCounter + ' || Max satoshi bet: ' + maxBet + ' || Wagered: ' + satWagered.toFixed(8));

        if (currentLoseSequenceBetsCounter < supportedLoseSequenceBetsLength) {
            // We still can bet supporting another lose bet, so we build the next bet.
            // We load next bet index from betsPattern:
            currentBetIndex = parseInt(betsPatterns[currentPattern][currentPatternSequenceIndex].charAt(currentInnerSequencePosition));
            // We load the next bet button:
            $betButton = betsButtons[currentBetIndex];
            satWagered += parseFloat(multiply);
            // We play another new bet:
            $betButton.trigger('click');
        } else {
           // We can't support another bet! so we stop the game
           // Nothing to do now, and the game will be stopped. but we need to make sure, that browser didn't refresh automatically
           console.log('Game stopped after losing. supported lose sequence reached.');
        }
    }
});

// WINNER
$('#double_your_btc_bet_win').bind("DOMSubtreeModified", function (event) {
    if ($(event.currentTarget).is(':contains("win")')) {
        // When winning, stop current sequence and start the next sequence.
        // The first character in the next looped sequence:
        currentPatternSequenceIndex = ++currentPatternSequenceIndex % betsPatterns[currentPattern].length;
        currentInnerSequencePosition = 0;

        // Save the old winning bet:
        betsCounter++;
        currentLoseSequenceBetsCounter = 0;

        // Stop if gain tot. satoshi:
        if (getProfit() > maxGain) {
            gameStopped = true;
        }

        console.log('Bets: ' + betsCounter + ' || Profit: ' + getProfit() + ' || Lose sequence: ' +
            currentLoseSequenceBetsCounter + ' || Current bet: ' + bets[currentBetIndex] +
            ' || Max lose consecutive: ' + maxLoseSequenceBetsCounter + ' || Max satoshi bet: ' + maxBet + ' || Wagered: ' + satWagered.toFixed(8));

        // When winning, we check pattern validity. We change pattern every fixed minutes only when we win!
        if (getSecondsBetweenDates(patternStartingDateTime, new Date()) >= patternPlayPeriodInSeconds) {
            // We update the date:
            patternStartingDateTime = new Date();
            // We loop the next pattern and start fresh:
            currentPattern = ++currentPattern % betsPatterns.length;
            currentPatternSequenceIndex = 0;
            currentInnerSequencePosition = 0;
            console.log('Single Pattern Play Period Reached ==> Moving to the next pattern!');
        }

        if (!gameStopped) {
            // Start working on the next bet.
            // Hange client seed, that have to be changed for every roll:
            setRandomClientSeed();
            // Return to base bet amount:
            reset();
            // We load next bet index from betsPattern:
            currentBetIndex = parseInt(betsPatterns[currentPattern][currentPatternSequenceIndex].charAt(currentInnerSequencePosition));
            // We load the next bet button:
            $betButton = betsButtons[currentBetIndex];
            $betButton.trigger('click');
        } else {
            console.log('Game Stopped.');
        }
    }
});

// Starting the script:
start();
