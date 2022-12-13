// memory game
// click a card, then another. if they match, they stay open.
// timer counts up from the first click. move counter ticks once per pair tried.

var board = document.getElementById('board');
var resetBtn = document.getElementById('reset');
var timeEl = document.getElementById('time');
var movesEl = document.getElementById('moves');

// 8 pairs for the 4x4 grid. two-letter labels so the cards stay readable.
var labels = ['AB', 'CD', 'EF', 'GH', 'IJ', 'KL', 'MN', 'OP'];

var first = null;
var second = null;
var locked = false;
var moves = 0;
var matchedCount = 0;
var startedAt = 0;
var timerId = null;

// proper Fisher-Yates. picks a random index up to i and swaps in place.
// the .sort(()=>Math.random()-0.5) trick is biased, so don't use it.
function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

function buildDeck() {
  var deck = [];
  for (var i = 0; i < labels.length; i++) {
    deck.push(labels[i]);
    deck.push(labels[i]);
  }
  return shuffle(deck);
}

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

function fmt(seconds) {
  var m = Math.floor(seconds / 60);
  var s = seconds % 60;
  return pad(m) + ':' + pad(s);
}

function tick() {
  var elapsed = Math.floor((Date.now() - startedAt) / 1000);
  timeEl.textContent = fmt(elapsed);
}

function startTimer() {
  if (timerId) return;
  startedAt = Date.now();
  timerId = setInterval(tick, 250);
}

function stopTimer() {
  if (timerId) clearInterval(timerId);
  timerId = null;
}

function render() {
  board.innerHTML = '';
  var deck = buildDeck();
  for (var i = 0; i < deck.length; i++) {
    var c = document.createElement('div');
    c.className = 'card';
    c.dataset.value = deck[i];
    c.textContent = deck[i];
    c.addEventListener('click', onClick);
    board.appendChild(c);
  }
}

function reset() {
  stopTimer();
  first = null;
  second = null;
  locked = false;
  moves = 0;
  matchedCount = 0;
  startedAt = 0;
  movesEl.textContent = '0';
  timeEl.textContent = '00:00';
  render();
}

function onClick(e) {
  if (locked) return;
  var card = e.currentTarget;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

  if (!timerId) startTimer();

  card.classList.add('flipped');

  if (first === null) {
    first = card;
    return;
  }
  second = card;
  moves += 1;
  movesEl.textContent = '' + moves;

  if (first.dataset.value === second.dataset.value) {
    first.classList.add('matched');
    second.classList.add('matched');
    first = null;
    second = null;
    matchedCount += 1;
    if (matchedCount === labels.length) stopTimer();
    return;
  }

  // miss, flip both back after a beat
  locked = true;
  setTimeout(function () {
    first.classList.remove('flipped');
    second.classList.remove('flipped');
    first = null;
    second = null;
    locked = false;
  }, 800);
}

resetBtn.addEventListener('click', reset);

reset();
