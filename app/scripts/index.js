import 'babel-polyfill';
import '../styles/index.scss';

(function () {
    console.log('OK');
}());

setTimeout(() => {
    console.log('1000ms');
}, 1000);

const s = new Set();

console.log(s);

window.onload = function () {
    const types = document.getElementsByClassName('type')[0].getElementsByTagName('li');
    for (let i = 0; i < types.length; i++) {
        console.log(types[i].getAttribute('data-type'));
    }
};
