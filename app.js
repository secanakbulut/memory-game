// memory game
// click a card, then another. if they match, they stay open.
// timer counts up from the first click, move counter ticks once per pair tried.
// best time per grid size is kept in localStorage.

var board = document.getElementById('board');
var resetBtn = document.getElementById('reset');
var sizeEl = document.getElementById('size');
var timeEl = document.getElementById('time');
var movesEl = document.getElementById('moves');
var bestEl = document.getElementById('best');
var doneEl = document.getElementById('done');

// 18 unique labels is enough for the 6x6 grid (which needs 18 pairs).
// for 4x4 we just take the first 8.
var allLabels = [
  'AB', 'CD', 'EF', 'GH', 'IJ', 'KL', 'MN', 'OP',
  'QR', 'ST', 'UV', 'WX', 'YZ',
  '01', '02', '03', '04', '05'
];

var size = 4;       // grid side, 4 or 6
var pairs = 8;      // pairs needed for current size

var first = null;
var second = null;
var locked = false;
var moves = 0;
var matchedCount = 0;
var startedAt = 0;
var timerId = null;

// proper Fisher-Yates. pick a random index up to i and swap in place.
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
  var picks = allLabels.slice(0, pairs);
  var deck = [];
  for (var i = 0; i < picks.length; i++) {
    deck.push(picks[i]);
    deck.push(picks[i]);
  }
  return shuffle(deck);
}

function pad(n) { return n < 10 ? '0' + n : '' + n; }

function fmt(seconds) {
  var m = Math.floor(seconds / 60);
  var s = seconds % 60;
  return pad(m) + ':' + pad(s);
}

function bestKey() {
  return 'memory.best.' + size;
}

function readBest() {
  var raw = localStorage.getItem(bestKey());
  if (!raw) return null;
  var n = parseInt(raw, 10);
  return isNaN(n) ? null : n;
}

function paintBest() {
  var b = readBest();
  bestEl.textContent = b === null ? '--:--' : fmt(b);
}

// score is here for completeness, not shown in the UI.
// final = matches * 1000 - moves * 10 - elapsedSeconds
function score(matches, m, secs) {
  return matches * 1000 - m * 10 - secs;
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

function finish() {
  stopTimer();
  var elapsed = Math.floor((Date.now() - startedAt) / 1000);
  timeEl.textContent = fmt(elapsed);

  var prev = readBest();
  var newBest = false;
  if (prev === null || elapsed < prev) {
    localStorage.setItem(bestKey(), '' + elapsed);
    newBest = true;
  }
  paintBest();

  // computed but intentionally not displayed
  var s = score(pairs, moves, elapsed);
  void s;

  doneEl.hidden = false;
  doneEl.classList.toggle('new-best', newBest);
  doneEl.textContent = newBest
    ? 'done in ' + fmt(elapsed) + '. new best.'
    : 'done in ' + fmt(elapsed) + '.';
}

function render() {
  board.innerHTML = '';
  board.className = 'board grid-' + size;
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
  size = parseInt(sizeEl.value, 10) === 6 ? 6 : 4;
  pairs = (size * size) / 2;

  stopTimer();
  first = null;
  second = null;
  locked = false;
  moves = 0;
  matchedCount = 0;
  startedAt = 0;
  movesEl.textContent = '0';
  timeEl.textContent = '00:00';
  doneEl.hidden = true;
  doneEl.classList.remove('new-best');

  paintBest();
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
    if (matchedCount === pairs) finish();
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
sizeEl.addEventListener('change', reset);

reset();
