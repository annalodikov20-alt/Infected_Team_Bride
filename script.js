// deadline: tomorrow at 12:00 noon, local time
var now = new Date();
var deadline = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12, 0, 0);

function updateCountdown() {
  var diff = deadline.getTime() - Date.now();
  if (diff <= 0) {
    document.getElementById('countdown').textContent = '00:00:00';
    document.querySelector('.subtitle').textContent = 'זה קורה עכשיו!';
    return;
  }
  var totalSeconds = Math.floor(diff / 1000);
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  var hh = String(hours).padStart(2, '0');
  var mm = String(minutes).padStart(2, '0');
  var ss = String(seconds).padStart(2, '0');
  document.getElementById('countdown').textContent = hh + ':' + mm + ':' + ss;
}

updateCountdown();
setInterval(updateCountdown, 1000);

var audio = document.getElementById('bgMusic');
var musicBtn = document.getElementById('musicBtn');

function safePlay() {
  var p = audio.play();
  if (p && typeof p.catch === 'function') {
    p.catch(function () {});
  }
}

audio.addEventListener('play', function () {
  musicBtn.textContent = '🔇 עצור מוזיקה';
  musicBtn.classList.remove('pulse');
});
audio.addEventListener('pause', function () {
  musicBtn.textContent = '🎵 נגן מוזיקה';
  musicBtn.classList.add('pulse');
});

musicBtn.addEventListener('click', function () {
  if (audio.paused) {
    safePlay();
  } else {
    audio.pause();
  }
});

// Most mobile browsers block autoplay with sound until the user
// interacts with the page. If autoplay was blocked, start playback
// on the very first tap/click/key press ANYWHERE OTHER THAN the
// music button itself (the button handles its own click; handling it
// here too caused a play/pause race that needed several taps to settle).
var initialPlay = audio.play();
if (initialPlay && typeof initialPlay.catch === 'function') {
  initialPlay.catch(function () {
    var events = ['pointerdown', 'touchstart', 'keydown'];
    function startOnFirstInteraction(e) {
      if (e.target.closest && e.target.closest('#musicBtn')) return;
      safePlay();
      events.forEach(function (evt) {
        document.removeEventListener(evt, startOnFirstInteraction);
      });
    }
    events.forEach(function (evt) {
      document.addEventListener(evt, startOnFirstInteraction);
    });
  });
}
