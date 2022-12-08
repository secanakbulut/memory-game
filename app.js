// memory game
// click a card, then another. if they match, they stay open.

var board = document.getElementById('board');
var resetBtn = document.getElementById('reset');

// 8 pairs for the 4x4 grid. using two-letter labels so the cards stay
// readable even on small screens. could also use shapes later.
var labels = ['AB', 'CD', 'EF', 'GH', 'IJ', 'KL', 'MN', 'OP'];

var first = null;
var second = null;
var locked = false;

function shuffle(arr) {
  // not great, but fine for now
  return arr.slice().sort(function () { return Math.random() - 0.5; });
}

function buildDeck() {
  var deck = [];
  for (var i = 0; i < labels.length; i++) {
    deck.push(labels[i]);
    deck.push(labels[i]);
  }
  return shuffle(deck);
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

function onClick(e) {
  if (locked) return;
  var card = e.currentTarget;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');

  if (first === null) {
    first = card;
    return;
  }
  second = card;

  if (first.dataset.value === second.dataset.value) {
    first.classList.add('matched');
    second.classList.add('matched');
    first = null;
    second = null;
    return;
  }

  // miss, flip both back
  locked = true;
  setTimeout(function () {
    first.classList.remove('flipped');
    second.classList.remove('flipped');
    first = null;
    second = null;
    locked = false;
  }, 800);
}

resetBtn.addEventListener('click', function () {
  first = null;
  second = null;
  locked = false;
  render();
});

render();
