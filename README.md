# FreeBitco.in
This script is to play around with the Multiplier in Freebitco.in

# Basic settings
There are many settings you can modify before run the script.
```
var baseBetAmount = 0.00000001; // The base amount that you want to bet.
var betMultiplier = 2; // the multiplier value used.
var supportedLoseSequenceBetsLength = 16; // After 16 consecutive loose the script stops
var patternPlayPeriodInSeconds = 100; // The period of playing a single pattern.
var maxGain = 0.00001; // The scripts stop when a maximum number of satoshi have benn earned.
```
# Instruction
Please support me by creating your account through this link: https://freebitco.in/?r=8717825

To run this bot:
1. open up your Google Chrome Console by pressing "Ctrl+Shift+J" (On Firefox Press F12 and navigate to the console).
2. Copy and paste one of the scripts into the console and hit Enter.

# How it works
This strategy is divided into different parts. Once win in a section it goes to the next section to play. It is a total of 16 sequences, each sequences contains 4 inner sequence in it. No sequence is the same. Onces loss in a sequence it will go to the next inner sequence and continue playing until win.
Example 01: You loss on the first inner sequence HHHH it will continue playing from the next inner sequence which is LHHH, if win it will play the next sequence.
Example 02: you play on the first sequence beginning with H and win it jumps and play the second sequence beginning with lo if win, it jumps and play the third sequence beginning with lo.

Here is the 16 sequence binary strategy.
HHHH / LHHH / HLHH / LLHH / HHLH / LHLH / HLLH / LLLH / HHHL/ LHHL/ HLHL / LLHL / HHLL/ LHLL/ HLLL / LLLL.

Onces the script has completed betting the 16 sequence binary pattern, it will now change all the losses encountered while playing the first phase of the 16 sequence replacing the loses with the opposite. 
For example while playing the 16 sequence losses where encountered in the following: I use a sign to identity loses at the top of the alphabets "H" "H" HH/ "L"" H""H""H"/ "H" LHL/ ........... till the last 16 sequence. Now after playing the 16 sequence the script will replace all those losses encountered with their opposite.

Any help would be greatly appreciated.
Thanks.
