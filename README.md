# memory-game

small concentration game. click two cards, match the pair. built one weekend in december.

## how to run it

no build step. just open the file.

```
git clone https://github.com/secanakbulut/memory-game.git
cd memory-game
open index.html
```

or serve it with anything (`python3 -m http.server`) if your browser is grumpy about file://.

## what is in it

- 4x4 grid by default (8 pairs)
- click two cards, match keeps them open, miss flips both back
- timer counts up from the first click, move counter ticks once per pair tried
- proper Fisher-Yates shuffle, the `.sort(()=>Math.random()-0.5)` trick is biased

## license

PolyForm Noncommercial 1.0.0. play with it, fork it, just no commercial use without asking.
