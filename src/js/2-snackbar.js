import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay); // ТОЛЬКО значение delay, без логики уведомлений
      } else {
        reject(delay); // ТОЛЬКО значение delay, без логики уведомлений
      }
    }, delay);
  });
}

form.addEventListener('submit', event => {
  event.preventDefault();

  const formData = new FormData(form);
  const delay = parseInt(formData.get('delay'));
  const state = formData.get('state');

  // Создаем промис
  const promise = createPromise(delay, state);

  // Обрабатываем промис в then/catch
  promise
    .then(delay => {
      // Логика уведомлений в then
      console.log(`✅ Fulfilled promise in ${delay}ms`);

      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      // Логика уведомлений в catch
      console.log(`❌ Rejected promise in ${delay}ms`);

      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
      });
    });

  form.reset();
});
