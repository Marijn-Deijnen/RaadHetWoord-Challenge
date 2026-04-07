const T = {
  homeAriaLabel: 'Startscherm',
  gameAriaLabel: 'Speel het spel',
  winAriaLabel: 'Gewonnen',
  loseAriaLabel: 'Geprobeerd',

  title: 'Raad Het<br>Woord 🚀',
  subtitle: 'Kies een niveau om te beginnen',
  levelLabel: 'Niveau',

  easy: 'Makkelijk',
  easyDesc: 'Korte woorden',
  medium: 'Normaal',
  mediumDesc: 'Wat langer',
  hard: 'Moeilijk',
  hardDesc: 'Langere woorden',
  expert: 'Expert',
  expertDesc: 'Uitdagend!',

  backAriaLabel: 'Terug naar startscherm',
  hintAriaLabel: 'Hint tonen',
  mistakesLabel: 'Fouten',
  wordLabel: 'Het woord',
  keyboardLabel: 'Letters',

  winTitle: 'Gefeliciteerd!',
  winSubtitle: 'Jij hebt het woord geraden:',
  playAgain: 'Nog een woord! 🎉',
  backHome: 'Terug naar start',

  loseTitle: 'Bijna!',
  loseSubtitle: 'Het woord was:',
  loseTryAgain: 'Probeer het nog een keer, je kunt het!',
  tryAgain: 'Opnieuw proberen! 💪',

  announceCorrect: (l) => `Goed! De letter ${l} zit in het woord.`,
  announceWrong: (l, r) => `Helaas, de letter ${l} zit niet in het woord. ${r} kansen over.`,
  announceWin: (w) => `Gewonnen! Het woord was ${w}.`,
  announceLose: (w) => `Helaas, het woord was ${w}. Probeer het nog een keer!`,
  announceHint: (h) => `Hint: ${h}`,
  wordDisplayLabel: (r) => `Woord: ${r}`,
  mistakeDot: (i) => `Fout ${i}`,

  winMsgs: [
    'Super gedaan! Je bent een echte woordenraadpleger! 🌟',
    'Geweldig! Je raket heeft de ruimte bereikt! 🛸',
    'Fantastisch! Je bent zo slim als een astronaut! 👨‍🚀',
    'Wauw! Je woordenschat is echt indrukwekkend! 🎓',
  ],
};
