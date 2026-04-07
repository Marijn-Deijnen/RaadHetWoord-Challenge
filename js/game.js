const ROCKET_PARTS = ['rp-flame', 'rp-stripe', 'rp-nose', 'rp-window', 'rp-fin-r', 'rp-fin-l', 'rp-body'];
const MAX_WRONG = ROCKET_PARTS.length;

let currentLevel = 'easy';
let currentWord  = '';
let currentCat   = '';
let currentHint  = '';
let guessed      = new Set();
let wrongCount   = 0;
let hintUsed     = false;
let usedIndices  = {};

const liveRegion = document.getElementById('live-region');

function t(key) {
  return T[key];
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function announce(msg) {
  liveRegion.textContent = '';
  requestAnimationFrame(() => { liveRegion.textContent = msg; });
}

function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (T[key] !== undefined) el.innerHTML = T[key];
  });

  document.getElementById('screen-home').setAttribute('aria-label', T.homeAriaLabel);
  document.getElementById('screen-game').setAttribute('aria-label', T.gameAriaLabel);
  document.getElementById('screen-win').setAttribute('aria-label',  T.winAriaLabel);
  document.getElementById('screen-lose').setAttribute('aria-label', T.loseAriaLabel);
  document.getElementById('btn-back').setAttribute('aria-label',    T.backAriaLabel);
  document.getElementById('btn-hint').setAttribute('aria-label',    T.hintAriaLabel);
  document.getElementById('mistakes-row').setAttribute('aria-label', T.mistakesLabel);
  document.getElementById('word-display').setAttribute('aria-label', T.wordLabel);
  document.getElementById('keyboard').setAttribute('aria-label',    T.keyboardLabel);

  document.querySelectorAll('.level-btn').forEach(btn => {
    const lvl = btn.dataset.level;
    btn.setAttribute('aria-label', `${T[lvl]} — ${T[lvl + 'Desc']}`);
  });

  usedIndices = {};
}

function pickWord(level) {
  const list = WORDS_NL[level];

  if (!usedIndices[level]) usedIndices[level] = [];

  let available = list
    .map((_, i) => i)
    .filter(i => !usedIndices[level].includes(i));

  if (available.length === 0) {
    usedIndices[level] = [];
    available = list.map((_, i) => i);
  }

  const idx = available[Math.floor(Math.random() * available.length)];
  usedIndices[level].push(idx);
  return list[idx];
}

function startGame(level) {
  currentLevel = level;

  const entry  = pickWord(level);
  currentWord  = entry.word.toLowerCase();
  currentCat   = entry.category;
  currentHint  = entry.hint;
  guessed      = new Set();
  wrongCount   = 0;
  hintUsed     = false;

  resetHint();
  resetRocket();
  resetMistakeDots();
  resetKeyboard();

  document.getElementById('category-label').textContent = currentCat;
  renderWord();
  showScreen('screen-game');
}

function resetHint() {
  const hintBox = document.getElementById('hint-box');
  const hintBtn = document.getElementById('btn-hint');
  hintBox.classList.remove('visible');
  hintBox.textContent = '';
  hintBtn.classList.remove('used');
  hintBtn.disabled = false;
}

function resetRocket() {
  document.getElementById('rocket-wrap').classList.remove('launching');
  ROCKET_PARTS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('visible');
  });
}

function resetMistakeDots() {
  const row = document.getElementById('mistakes-row');
  row.innerHTML = '';
  for (let i = 0; i < MAX_WRONG; i++) {
    const dot = document.createElement('div');
    dot.className = 'mistake-dot';
    dot.setAttribute('aria-label', t('mistakeDot')(i + 1));
    row.appendChild(dot);
  }
}

function resetKeyboard() {
  document.querySelectorAll('.key').forEach(key => {
    key.classList.remove('correct', 'wrong');
    key.disabled = false;
  });
}

function renderWord() {
  const display = document.getElementById('word-display');
  display.innerHTML = '';

  for (const ch of currentWord) {
    const slot = document.createElement('div');
    slot.className = 'letter-slot';

    const char = document.createElement('div');
    char.className = 'letter-char';
    char.setAttribute('aria-hidden', 'true');

    if (guessed.has(ch)) {
      char.textContent = ch.toUpperCase();
      requestAnimationFrame(() => requestAnimationFrame(() => char.classList.add('revealed')));
    }

    const underline = document.createElement('div');
    underline.className = 'letter-underline';

    slot.appendChild(char);
    slot.appendChild(underline);
    display.appendChild(slot);
  }

  const revealed = [...currentWord]
    .map(ch => guessed.has(ch) ? ch.toUpperCase() : '_')
    .join(' ');
  display.setAttribute('aria-label', t('wordDisplayLabel')(revealed));
}

function guess(letter) {
  if (guessed.has(letter)) return;
  guessed.add(letter);

  const key = document.querySelector(`.key[data-letter="${letter}"]`);

  if (currentWord.includes(letter)) {
    if (key) key.classList.add('correct');
    renderWord();
    announce(t('announceCorrect')(letter.toUpperCase()));

    if ([...currentWord].every(ch => guessed.has(ch))) {
      setTimeout(winGame, 600);
    }
  } else {
    if (key) key.classList.add('wrong');
    wrongCount++;
    updateMistakeDots();
    revealRocketPart(wrongCount - 1);
    shakeWord();
    announce(t('announceWrong')(letter.toUpperCase(), MAX_WRONG - wrongCount));

    if (wrongCount >= MAX_WRONG) {
      setTimeout(loseGame, 600);
    }
  }

  if (key) key.disabled = true;
}

function updateMistakeDots() {
  document.querySelectorAll('.mistake-dot').forEach((dot, i) => {
    if (i < wrongCount) dot.classList.add('used');
  });
}

function revealRocketPart(index) {
  if (index >= ROCKET_PARTS.length) return;
  const el = document.getElementById(ROCKET_PARTS[index]);
  if (el) el.classList.remove('visible');
}

function shakeWord() {
  const display = document.getElementById('word-display');
  display.classList.remove('shake');
  void display.offsetWidth;
  display.classList.add('shake');
  setTimeout(() => display.classList.remove('shake'), 400);
}

function winGame() {
  document.getElementById('rocket-wrap').classList.add('launching');
  document.getElementById('win-word').textContent = currentWord.toUpperCase();

  const msgs = t('winMsgs');
  document.getElementById('win-msg').textContent = msgs[Math.floor(Math.random() * msgs.length)];

  announce(t('announceWin')(currentWord));
  setTimeout(() => showScreen('screen-win'), 1300);
}

function loseGame() {
  [...currentWord].forEach(ch => guessed.add(ch));
  renderWord();

  document.getElementById('lose-word').textContent = currentWord.toUpperCase();
  announce(t('announceLose')(currentWord));
  setTimeout(() => showScreen('screen-lose'), 800);
}

function showHint() {
  if (hintUsed) return;
  hintUsed = true;

  const hintBox = document.getElementById('hint-box');
  const hintBtn = document.getElementById('btn-hint');

  hintBox.textContent = `💡 ${currentHint}`;
  hintBox.classList.add('visible');
  hintBtn.classList.add('used');
  hintBtn.disabled = true;

  announce(t('announceHint')(currentHint));
}
