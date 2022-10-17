'use strict';

const form = document.querySelector('.form');
const routeSelect = document.querySelector('.route');
const timeToBSelect = document.querySelector('.time-a-b');
const total = document.querySelector('.total');
const timeToASelect = document.querySelector('.time-b-a');
const pathToB = document.querySelector('.path-a-b');
const pathToA = document.querySelector('.path-b-a');
const pathToABA = document.querySelector('.path-a-b-a');
const inputNumber = document.querySelector('.input');
const paths = document.querySelectorAll('.path');
const options = document.querySelectorAll('.time-a-b-a-option');

const REGULAR_TICKET = 700;
const COMPOUND_TICKET = 1200;
const TRAVEL_TIME = 50;
const MINUTES_IN_HOUR = 60;
const GMT3 = 180;

let totalPrice = 0;
let selectTime = timeToBSelect.value;

const times = {
  time: '',
  localArrivalTime: '',
  localDepartureTime: '',
  localDepartureHours: '',
  localDepartureMinutes: '',
  localArrivalHours: '',
  localArrivalMinutes: '',
  moscowArrivalTime: '',
  moscowArrivalHours: '',
  moscowArrivalMinutes: '',
  currentTime: '',
}

const cleanTotal = () => {
  total.textContent = '';
};

const getTime = () => {
  times.time = new Date(`01.01.1970 ${selectTime}`);

  times.localDepartureHours = new Date(+times.time + (Math.abs(times.time.getTimezoneOffset()) - GMT3) * 6e4).getHours();
  times.localDepartureMinutes = new Date(+times.time + (Math.abs(times.time.getTimezoneOffset()) - GMT3) * 6e4).getMinutes();
  times.localArrivalHours = new Date(+times.time + (Math.abs(times.time.getTimezoneOffset()) - GMT3 + TRAVEL_TIME) * 6e4).getHours();
  times.localArrivalMinutes = new Date(+times.time + (Math.abs(times.time.getTimezoneOffset()) - GMT3 + TRAVEL_TIME) * 6e4).getMinutes();
  times.moscowArrivalHours = new Date(+times.time + TRAVEL_TIME * 6e4).getHours();
  times.moscowArrivalMinutes = new Date(+times.time + TRAVEL_TIME * 6e4).getMinutes();

  times.localDepartureMinutes < 10 ? times.localDepartureMinutes = '00' : '0';
  times.localArrivalMinutes < 10 ? times.localArrivalMinutes = '00' : '0';

  times.localDepartureTime = `${times.localDepartureHours}:${times.localDepartureMinutes}`;
  times.localArrivalTime = `${times.localArrivalHours}:${times.localArrivalMinutes}`;

  times.moscowArrivalTime = `${times.moscowArrivalHours}:${times.moscowArrivalMinutes}`;
  times.currentTime = ((times.moscowArrivalHours * MINUTES_IN_HOUR) + times.moscowArrivalMinutes);
};

const showFirstAvailableTime = (arr) => {
  arr.length !== 0 ?
    arr[0].selected = true : '';
};

const formChangeHandler = () => {
  let availableTimes = [];

  cleanTotal();

  paths.forEach(el => {
    el.classList.add('display-none');
  });

  if (routeSelect.value === 'из A в B') {
    pathToB.classList.remove('display-none');
    selectTime = timeToBSelect.value;
  } else if ((routeSelect.value === 'из B в A')) {
    pathToA.classList.remove('display-none');
    selectTime = timeToASelect.value;
  } else if ((routeSelect.value === 'из A в B и обратно в А')) {
    pathToB.classList.remove('display-none');
    pathToABA.classList.remove('display-none');
    selectTime = timeToBSelect.value;
  }

  getTime();

  options.forEach((el) => {

    let departureTime = new Date(`01.01.1970 ${el.value}`);
    let hours = new Date(+departureTime + 0 * 6e4).getHours();
    let minutes = new Date(+departureTime + 0 * 6e4).getMinutes();
    let time1 = (hours * MINUTES_IN_HOUR) + minutes;

    if (time1 <= times.currentTime) {
      el.disabled = true;
    } else {
      el.disabled = false;
      availableTimes.push(el);
    }
  });

  showFirstAvailableTime(availableTimes);
};

const formSubmitHandler = (evt) => {

  evt.preventDefault();
  const ticket = window.getDeclension({ count: +inputNumber.value, one: 'билет', few: 'билета', many: 'билетов' });
  const time = window.getDeclension({ count: TRAVEL_TIME, one: 'минута', few: 'минуты', many: 'минут' });

  if (routeSelect.value === 'из A в B и обратно в А') {
    totalPrice = inputNumber.value * COMPOUND_TICKET;
  } else {
    totalPrice = inputNumber.value * REGULAR_TICKET;
  }

  console.log(times.localDepartureMinutes)

  total.insertAdjacentHTML('beforeend', `
    <p>Вы выбрали ${ticket} по маршруту ${routeSelect.value} стоимостью ${totalPrice}р.
    Это путешествие займет у вас ${time}.
    Теплоход отправляется в ${selectTime} (${times.localDepartureTime} по местному времени),
    а прибудет в ${times.moscowArrivalTime} (${times.localArrivalTime}  по местному времени).</p>
    `);
};

const init = () => {
  form.addEventListener('change', formChangeHandler);
  form.addEventListener('submit', formSubmitHandler);
};

init();
