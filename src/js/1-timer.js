import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.getElementById('datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let countdownInterval = null;

// Кнопка неактивна при загрузке страницы
startBtn.disabled = true;

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true; // Неактивна при невалидной дате
      userSelectedDate = null;
    } else {
      userSelectedDate = selectedDate;
      startBtn.disabled = false; // Активна при валидной дате
    }
  },
};

flatpickr('#datetime-picker', options);

function updateTimer() {
  if (!userSelectedDate) return;

  const currentDate = new Date();
  const timeDifference = userSelectedDate - currentDate;

  if (timeDifference <= 0) {
    // Таймер дошел до 00:00:00:00
    clearInterval(countdownInterval);
    countdownInterval = null;

    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';

    // Делаем инпут активным снова
    datetimePicker.disabled = false;

    // Кнопка остается неактивной (как в требованиях)
    startBtn.disabled = true;

    userSelectedDate = null;

    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeDifference);

  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function startTimer() {
  if (!userSelectedDate) return;

  // Делаем кнопку и инпут неактивными при запуске таймера
  startBtn.disabled = true;
  datetimePicker.disabled = true;

  updateTimer();

  countdownInterval = setInterval(updateTimer, 1000);
}

startBtn.addEventListener('click', startTimer);
