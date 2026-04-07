function buildStars() {
  const container = document.getElementById('stars');

  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3 + 1;
    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      --dur: ${2 + Math.random() * 4}s;
      --delay: ${Math.random() * 4}s;
      --op: ${0.4 + Math.random() * 0.6};
    `;
    container.appendChild(star);
  }
}

function bindEvents() {
  document.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', () => startGame(btn.dataset.level));
  });

  document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', () => {
      if (!key.disabled) guess(key.dataset.letter);
    });
  });

  document.addEventListener('keydown', e => {
    if (!document.getElementById('screen-game').classList.contains('active')) return;
    const letter = e.key.toLowerCase();
    if (!/^[a-z]$/.test(letter)) return;
    const key = document.querySelector(`.key[data-letter="${letter}"]`);
    if (key && !key.disabled) guess(letter);
  });

  document.getElementById('btn-back').addEventListener('click', () => showScreen('screen-home'));
  document.getElementById('btn-hint').addEventListener('click', showHint);

  document.getElementById('btn-win-again').addEventListener('click', () => startGame(currentLevel));
  document.getElementById('btn-win-home').addEventListener('click',  () => showScreen('screen-home'));

  document.getElementById('btn-lose-again').addEventListener('click', () => startGame(currentLevel));
  document.getElementById('btn-lose-home').addEventListener('click',  () => showScreen('screen-home'));
}

buildStars();
bindEvents();
applyLang();
