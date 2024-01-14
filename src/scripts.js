// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'
import { fetchData } from './api-calls';

console.log('This is the JavaScript entry file - your code begins here.');

const tabs = document.querySelectorAll('.tablinks')
const tabContents = document.querySelectorAll('.tab')
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
var holdCustomer
var bookings

window.addEventListener('load', () => {
    retrieveData()
})

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
})

loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
})

btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
})

iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
})

function retrieveData() {
    fetchData()
        .then(responses => {
            return Promise.all(
                responses.map(response => {
                    if (!response.ok) {
                        throw new Error('Oops! Something went awry, please try again!')
                    }
                    return response.json();
                })
            );
        })
        .then(data => {
            console.log(data);
            holdCustomer = data[0].customers[5];
            bookings = data[1].bookings;
        })
        .catch(err => console.log(err.message, err));
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(`#${tab.id}Content`)
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active')
            console.log(tab.id)
        })
        target.classList.add('active')
    })
})

