let startTime, timerInterval;

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    let elapsed = Date.now() - startTime;
    let time = new Date(elapsed).toISOString().substr(11, 8);
    document.getElementById("time").innerText = time;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}
