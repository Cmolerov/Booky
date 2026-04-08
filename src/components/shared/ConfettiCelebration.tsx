import confetti from 'canvas-confetti';

export const triggerPointsConfetti = () => {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#facc15', '#fb923c', '#38bdf8']
  });
};

export const triggerLevelUpConfetti = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#facc15', '#fb923c', '#38bdf8', '#c084fc', '#fb7185']
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#facc15', '#fb923c', '#38bdf8', '#c084fc', '#fb7185']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};
