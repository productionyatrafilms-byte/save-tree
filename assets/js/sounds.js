// ---------- Shared UI sounds (same set as the other projects) ----------
// One Audio object per sound, reused (currentTime reset) so a quick repeat
// click restarts the sound instead of overlapping it.
function playSound(audio) {
  try {
    audio.currentTime = 0;
    const promise = audio.play();
    if (promise !== undefined) promise.catch(() => {});
  } catch (e) {}
}

// Navigating on the same tick as the click kills the page (and its Audio)
// before playback starts, so wait a moment before leaving.
function playSoundThenNavigate(audio, href, delayMs) {
  playSound(audio);
  setTimeout(() => {
    audio.pause();
    window.location.href = href;
  }, delayMs || 120);
}

function isPlainClick(event) {
  return !(event.ctrlKey || event.metaKey || event.shiftKey || event.which === 2);
}

// Language toggle (E / H / G).
const langAudio = {
  english: new Audio("./assets/audio/Eng.mpeg"),
  hindi: new Audio("./assets/audio/Hin.mpeg"),
  gujrati: new Audio("./assets/audio/Guj.mpeg"),
};
document.querySelectorAll(".language-container > div").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = Object.keys(langAudio).find((k) => btn.classList.contains(k));
    if (key) playSound(langAudio[key]);
  });
});

// Home / back buttons.
const popAudio = new Audio("./assets/audio/pop.mp3");
document.querySelectorAll(".home-btn, .home-btn-1, .back-btn").forEach((el) => {
  el.addEventListener("click", (event) => {
    const href = el.getAttribute("href");
    if (!href || !isPlainClick(event)) return;
    event.preventDefault();
    playSoundThenNavigate(popAudio, href);
  });
});

// Slider prev / next arrows.
const swiperAudio = new Audio("./assets/audio/swiper.mp3");
document.querySelectorAll(".prev-btn, .next-btn").forEach((btn) => {
  btn.addEventListener("click", () => playSound(swiperAudio));
});

// Subpoints: topic bubbles on the menu and the 1-4 page numbers.
// Only the first second of topic.mp3 is heard.
const topicAudio = new Audio("./assets/audio/topic.mp3");
let topicTimer;
function playTopicSound() {
  playSound(topicAudio);
  clearTimeout(topicTimer);
  topicTimer = setTimeout(() => topicAudio.pause(), 1000);
}
document.querySelectorAll(".topic, .page").forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href === "#" || !isPlainClick(event)) return;
    event.preventDefault();
    playTopicSound();
    setTimeout(() => {
      window.location.href = href;
    }, 1000);
  });
});

// Start button on the menu page.
const startAudio = new Audio("./assets/audio/transistion-click.mp3");
document.querySelectorAll(".start-btn").forEach((btn) => {
  btn.addEventListener("click", () => playSound(startAudio));
});

// Pranam page: played once on load (retried on the first interaction if the
// browser blocks autoplay).
if (document.querySelector(".pranam-img")) {
  const pranamAudio = new Audio("./assets/audio/pranam.mp3");
  pranamAudio.preload = "auto";
  let played = false;
  const playOnce = () => {
    if (played) return;
    played = true;
    const promise = pranamAudio.play();
    if (promise !== undefined) {
      promise.catch(() => {
        played = false;
        ["click", "keydown", "touchstart"].forEach((ev) =>
          document.addEventListener(ev, playOnce, { once: true }),
        );
      });
    }
  };
  playOnce();
}

// Pranam arrow on the last slide: sound, then navigate.
document.querySelectorAll(".pranam-link").forEach((el) => {
  el.addEventListener("click", (event) => {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    playSoundThenNavigate(swiperAudio, el.getAttribute("href"));
  });
});
