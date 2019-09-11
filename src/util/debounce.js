/**
* @desc Debounces a function preventing it from running more then every so many milliseconds.
* Useful for scroll or resize handlers.
* @param {function} func - The function that should be debounced.
* @param {number} wait - The amount of time a function should wait before it fires again.
* @return - Returns a function every so many milliseconds based on the provided parameters.
* */
export default function debounce(func, wait) {
  let timeout;
  return function debounceTimer(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(this, args);
    }, wait);
  };
}
