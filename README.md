# memory-game

small concentration game. click two cards, match the pair. built one weekend in december, then came back a few days later to add the bigger grid and best-time tracking.

## how to run it

no build step. just open the file.

```
git clone https://github.com/secanakbulut/memory-game.git
cd memory-game
open index.html
```

or serve it with anything (`python3 -m http.server`) if your browser is grumpy about file://.

## what is in it

- 4x4 grid by default (8 pairs), optional 6x6 (18 pairs)
- click two cards, match keeps them open, miss flips both back after 0.8s
- timer counts up from the first click, move counter ticks once per pair tried
- best time per grid size, kept in localStorage
- proper Fisher-Yates shuffle, the `.sort(()=>Math.random()-0.5)` trick is biased

## a note on the cards

i went back and forth on what to put on the cards. emojis felt cheap, and you also have to deal with font rendering across browsers. so the cards just show two-letter pairs. less pretty, but you can read them and they print fine if you ever wanted to print this out for some reason.

## scoring

there is a small scoring formula in the code:

```
final = matches * 1000 - moves * 10 - elapsedSeconds
```

i did not end up showing it in the UI. the time and move count are enough, and adding a number on top of those felt like one too many things to look at. left the function in there in case i change my mind.

## license

PolyForm Noncommercial 1.0.0. play with it, fork it, just no commercial use without asking.
