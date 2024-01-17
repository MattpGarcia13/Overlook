/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   displayInfoProper: () => (/* binding */ displayInfoProper),
/* harmony export */   findCustomerRooms: () => (/* binding */ findCustomerRooms),
/* harmony export */   totalCostCalc: () => (/* binding */ totalCostCalc)
/* harmony export */ });
/* harmony import */ var _css_styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _images_turing_logo_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(13);
/* harmony import */ var _api_calls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(14);
/* harmony import */ var _domUpdates__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(15);
// ===================================================================
// ===============   variables and imports   =========================
// ===================================================================





const tabs = document.querySelectorAll('.tablinks')
const tabContents = document.querySelectorAll('.tab')
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const bookingsErrorDisplay = document.querySelector('#bookingsErrorDisplay');
const planTripsBtn = document.querySelector('#planTrips');
const pastTripsBtn = document.querySelector('#pastTrips');
const upcomingTripsBtn = document.querySelector('#upcomingTrips');
const planTripSection = document.querySelector('#planTripSection');
const pastTripSection = document.querySelector('#pastTripSection');
const upcomingTripSection = document.querySelector('#upcomingTripSection');
const loginButton = document.querySelector('#loginButton');
const submitButton = document.querySelector('#submit-button');
const usernameLogin = document.querySelector('#usernameLogin');
const passwordLogin = document.querySelector('#passwordLogin');

const aboutButton = document.querySelector('#about')
const aboutSection = document.querySelector('#aboutContent')

let allCustomers
let bookings
let rooms
let currentCustomerID
let customerRooms = []
let customerBookings;
let totalCost
let bookedDate

// ===================================================================
// ===============   functions   =====================================
// ===================================================================

window.addEventListener('load', () => {
    wrapper.classList.add('active-popup');
    retrieveData()
})

const loginUser = (event) => {
    event.preventDefault()
    // console.log(usernameLogin.value, passwordLogin.value)
    const regex = new RegExp(/^customer\d{1,}$/);
    if (regex.test(usernameLogin.value) && passwordLogin.value === 'overlook2021') {
        currentCustomerID = Number(usernameLogin.value.split('customer')[1])
        ;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_3__.showPastTrips)(currentCustomerID, bookings)
        customerBookings = (0,_domUpdates__WEBPACK_IMPORTED_MODULE_3__.showPastTrips)(currentCustomerID, bookings)
        ;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_3__.showUpcomingTrips)(currentCustomerID, bookings)
        findCustomerRooms(customerBookings)
        ;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_3__.welcomeUser)(currentCustomerID, allCustomers)
    } else {
        // handle authentification error
    }
}

function retrieveData() {
    ;(0,_api_calls__WEBPACK_IMPORTED_MODULE_2__.fetchData)()
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
            allCustomers = data[0].customers;
            bookings = data[1].bookings;
            rooms = data[2].rooms;
        })
        .catch(err => console.log(err.message, err));
}

const postRequest = (url, number, bookDate) => {

    const data = {
        userID: parseInt(currentCustomerID),
        date: `${bookDate.value.replaceAll('-', '/')}`,
        roomNumber: parseInt(number),
    };
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            bookings.push(data.newBooking)
            ;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_3__.showUpcomingTrips)(currentCustomerID, bookings)
            toggleBookingsSection() //changeView
        })
        .catch(err => console.log(err.message, err));
}

function postBooking(event) {
    let currentbookedRoom = event.target.closest('.newBookingsCard');

    if (currentbookedRoom) {
        const roomNumberElement = currentbookedRoom.querySelector('#room-number');
        if (roomNumberElement) {
            const roomNumber = roomNumberElement.textContent.trim().replace('Room Number: ', '');
            postRequest('http://localhost:3001/api/v1/bookings', roomNumber, bookedDate)

        } else {
            console.error('Room number element not found in the selected room card.');
        }
    } else {
        alert('Please select a room to book');
    }
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(`#${tab.id}Content`)
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active')
        })
        target.classList.add('active')

        if (currentCustomerID) {
            planTripSection.hidden = false
        } else {
            bookingsErrorDisplay.hidden = false
        }
    })
})

const toggleBookingsSection = (tabName) => {
    if (tabName === 'planTrips') {
        planTripSection.hidden = false;
        pastTripSection.hidden = true;
        upcomingTripSection.hidden = true;
        aboutButton.hidden = false;
    } else if (tabName === 'pastTrips') {
        planTripSection.hidden = true;
        pastTripSection.hidden = false;
        upcomingTripSection.hidden = true;
        aboutButton.hidden = true;
    } else if (tabName === 'upcomingTrips') {
        planTripSection.hidden = true;
        pastTripSection.hidden = true;
        upcomingTripSection.hidden = false;
        aboutButton.hidden = true;
    }
}

const findCustomerRooms = (customerBookings) => {
    customerBookings.forEach(booking => {
        rooms.map(room => {
            if (room.number === booking.roomNumber) {
                customerRooms.push(room)
            }
        })
    })
    return customerRooms
}

const totalCostCalc = () => {
    return customerRooms.reduce((acc, room) => {
        console.log(room.costPerNight)
        acc += room.costPerNight
        return acc
    }, 0)
}

const displayInfoProper = () => {
    aboutSection.innerHTML = ''

    const totalSign = document.createElement('h2');
    let totalCosts = totalCostCalc()
    totalSign.classList.add('totalSign');
    totalSign.textContent = `Total Cost: $${totalCosts.toFixed(2)}`;

    aboutSection.appendChild(totalSign);
    customerRooms.forEach(room => {
        aboutSection.innerHTML += `
        <article class='room-card'> 
            <p id="room-number">Room Number: ${room.number}</p>
            <p>Room Type: ${room.roomType}</p>
            <p>Cost per Night: $${room.costPerNight}</p>
        </article>`;
    });
}

// ===================================================================
// ===============   Event Listeners   ===============================
// ===================================================================

aboutButton.addEventListener('click', displayInfoProper) //changVariable name

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

planTripsBtn.addEventListener('click', (event) => {
    toggleBookingsSection('planTrips')

})
planTripSection.addEventListener('click', (event) => {
    if (event.target.id === 'bookRoomButton') {
        postBooking(event);
        toggleBookingsSection('upcomingTrips')
    }
});

pastTripsBtn.addEventListener('click', () => {
    toggleBookingsSection('pastTrips')
})

upcomingTripsBtn.addEventListener('click', () => {
    toggleBookingsSection('upcomingTrips')
})

loginButton.addEventListener('click', (event) => {
    loginUser(event)
})

submitButton.addEventListener('click', (event) => {
    bookedDate = document.querySelector('#date');
    event.preventDefault()
    ;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_3__.showAvailableRooms)(bookings, rooms)
});



/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),
/* 2 */
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 3 */
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),
/* 4 */
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),
/* 5 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),
/* 6 */
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),
/* 7 */
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),
/* 8 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _images_stanleyhotel_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12);
// Imports




var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap);"]);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_images_stanleyhotel_png__WEBPACK_IMPORTED_MODULE_3__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: 'Poppins', sans-serif;\n}\n\n:root {\n  spookyGlow: hsl(0 100% 50%);\n  spookyBackground: hsl(323 21% 16%);\n}\n\nbody {\n  position: relative;\n  min-height: 100vh;\n  background: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") no-repeat;\n  background-size: cover;\n  background-position: center;\n}\n\n/* .body-bookingBackground {\n  background: url('../images/stanleyhotelhallway.png') no-repeat;\n  background-size: cover;\n  background-position: center;\n} */\n\n\n\nheader {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  padding: 20px 100px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  z-index: 99;\n  backdrop-filter: blur(9px);\n}\n\n.logo {\n  font-size: 2em;\n  color: black;\n  user-select: none;\n}\n\n.navigation a {\n  position: relative;\n  font-size: 1.1em;\n  color: black;\n  text-decoration: none;\n  font-weight: 500;\n  margin-left: 40px;\n}\n\n.navigation a::after {\n  content: '';\n  position: absolute;\n  left: 0;\n  bottom: -6px;\n  width: 100%;\n  height: 3px;\n  background: white;\n  border-radius: 5px;\n  transform-origin: right;\n  transform: scaleX(0);\n  transition: transform .5s;\n}\n\n.navigation a:hover::after {\n  transform-origin: left;\n  transform: scaleX(1);\n}\n\n.navigation .btnLogin-popup {\n  width: 130px;\n  height: 50px;\n  background: black;\n  border: 2px solid white;\n  outline: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 1.1em;\n  color: white;\n  font-weight: 500;\n  margin-left: 40px;\n  transition: .5s;\n}\n\n.navigation .btnLogin-popup:hover {\n  background: white;\n  color: #162938;\n}\n\n.tab {\n  display: none;\n}\n\n.tab.active {\n  display: block;\n}\n\n.wrapper {\n  position: absolute;\n  top: 10%;\n  left: 75%;\n  width: 400px;\n  height: 440px;\n  background: transparent;\n  border: 2px solid rgba(255, 255, 255, .5);\n  border-radius: 20px;\n  backdrop-filter: blur(20px);\n  box-shadow: 0 0 30px rgba(0, 0, 0, .5);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  overflow: hidden;\n  transition: transform .5s ease, height .2s ease;\n  transform: scale(0);\n}\n\n.wrapper .form-box {\n  width: 100%;\n  padding: 40px;\n}\n\n.wrapper .form-box.login {\n  transition: transform .20s ease;\n  transform: translateX(0);\n}\n\n.wrapper .form-box.registration {\n  position: absolute;\n  transform: translateX(400px);\n  transition: none;\n}\n\n.wrapper.active-popup {\n  transform: scale(1);\n}\n\n.wrapper.active .form-box.login {\n  transition: none;\n  transform: translateX(-400px);\n}\n\n.wrapper.active .form-box.registration {\n  transition: transform .20s ease;\n  transform: translateX(0);\n}\n\n.wrapper .icon-close {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 50px;\n  height: 50px;\n  background: #162938;\n  font-size: 2em;\n  color: white;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border-bottom-left-radius: 20px;\n  cursor: pointer;\n  z-index: 1;\n}\n\n.wrapper.active {\n  height: 520px;\n}\n\n.form-box h2 {\n  font-size: 2em;\n  color: #162938;\n  text-align: center;\n}\n\n.input-box {\n  position: relative;\n  width: 100%;\n  height: 50px;\n  border-bottom: 2px solid #162938;\n  margin: 30px 0;\n}\n\n.input-box label {\n  position: absolute;\n  top: 50%;\n  left: 5px;\n  transform: translateY(-50%);\n  font-size: 1em;\n  color: #162938;\n  font-weight: 500;\n  pointer-events: none;\n  transition: .5s;\n}\n\n.input-box input:focus~label,\n.input-box input:valid~label {\n  top: -5px;\n}\n\n.input-box input {\n  width: 100%;\n  height: 100%;\n  background: transparent;\n  border: none;\n  outline: none;\n  font-size: 1em;\n  color: #162938;\n  font-weight: 600;\n  padding: 0 35px 0 5px;\n}\n\n.input-box .icon {\n  position: absolute;\n  right: 8px;\n  font-size: 1.2em;\n  color: #162938;\n  line-height: 60px;\n}\n\n.remember-forgot {\n  font-size: .9em;\n  color: #162938;\n  font-weight: 500;\n  margin: -15px 0 15px;\n  display: flex;\n  justify-content: space-between;\n}\n\n.remember-forgot label input {\n  accent-color: #162938;\n  margin-right: 3px;\n}\n\n.remember-forgot a {\n  color: #162938;\n  text-decoration: none;\n}\n\n.remember-forgot a:hover {\n  text-decoration: underline;\n}\n\n.btn {\n  width: 100%;\n  height: 50px;\n  background: #162938;\n  border: none;\n  outline: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 1em;\n  color: white;\n  font-weight: 500;\n}\n\n.login-register {\n  font-size: .9em;\n  color: #162938;\n  text-align: center;\n  font-weight: 500;\n  margin: 25px 0 10px;\n}\n\n.login-register p a {\n  color: #162938;\n  text-decoration: none;\n  font-weight: 600;\n}\n\n.login-register p a:hover {\n  text-decoration: underline;\n}\n\n.bookingsTabs {\n  position: relative;\n  margin-top: 6vh;\n  left: 31.8vw;\n  padding-right: 5px;\n  padding-left: 5px;\n  margin-right: 20px;\n  font-size: 1.3rem;\n  background-color: transparent;\n  border: currentColor 0.125em solid;\n  cursor: pointer;\n  text-decoration: none;\n  border-radius: 0.25em;\n  /* text-shadow: 0 0 0.125em white, 0 0 0.25em currentColor;\n  color: var(--clr-neon); */\n}\n\n#bookingsErrorDisplay {\n  position: absolute;\n  left: 30vw;\n  top: 40vh;\n  font-size: 5em;\n  text-shadow:\n    1.2px 1.2px 0 #ff0000,\n    -1.2px 1.2px 0 #ff0000,\n    -1.2px -1.2px 0 #ff0000,\n    1.2px -1.2px 0 #ff0000;\n}\n\n#userGreeting {\n  position: relative;\n  top: 10vh;\n  left: 38.5vw;\n  color: white;\n  font-size: 2em;\n  text-shadow:\n    1.8px 1.8px 0 #000,\n    -1.8px 1.8px 0 #000,\n    -1.8px -1.8px 0 #000,\n    1.8px -1.8px 0 #000;\n}\n\n#plannedTripForm {\n  position: relative;\n  top: 2vh;\n  left: 37vw;\n}\n\n#apology {\n  position: relative;\n  font-size: 1.8em;\n}\n\n#about {\n  position: relative;\n  top: 20vh;\n  left: 48vw;\n  color: red;\n  font-size: 1.7em;\n}\n\n.hidden {\n  display: none;\n}\n\n.pastTripsCard {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 200px;\n  height: 200px;\n  margin: 20px;\n  padding: 20px;\n  background-color: #64e2f0;\n  border-radius: 5px;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);\n  transition: box-shadow 0.3s;\n}\n\n.room-card {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 200px;\n  height: 200px;\n  margin: 20px;\n  padding: 20px;\n  background-color: #64e2f0;\n  border-radius: 5px;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);\n  transition: box-shadow 0.3s;\n}\n\n.newBookingsCard {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 200px;\n  height: 200px;\n  margin: 20px;\n  padding: 20px;\n  background-color: #64e2f0;\n  border-radius: 5px;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);\n  transition: box-shadow 0.3s;\n}\n\n.upcomingTripCards {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 200px;\n  height: 200px;\n  margin: 20px;\n  padding: 20px;\n  background-color: #64e2f0;\n  border-radius: 5px;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);\n  transition: box-shadow 0.3s;\n}", "",{"version":3,"sources":["webpack://./src/css/styles.css"],"names":[],"mappings":"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","sourcesContent":["@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap');\n\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: 'Poppins', sans-serif;\n}\n\n:root {\n  spookyGlow: hsl(0 100% 50%);\n  spookyBackground: hsl(323 21% 16%);\n}\n\nbody {\n  position: relative;\n  min-height: 100vh;\n  background: url('../images/stanleyhotel.png') no-repeat;\n  background-size: cover;\n  background-position: center;\n}\n\n/* .body-bookingBackground {\n  background: url('../images/stanleyhotelhallway.png') no-repeat;\n  background-size: cover;\n  background-position: center;\n} */\n\n\n\nheader {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  padding: 20px 100px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  z-index: 99;\n  backdrop-filter: blur(9px);\n}\n\n.logo {\n  font-size: 2em;\n  color: black;\n  user-select: none;\n}\n\n.navigation a {\n  position: relative;\n  font-size: 1.1em;\n  color: black;\n  text-decoration: none;\n  font-weight: 500;\n  margin-left: 40px;\n}\n\n.navigation a::after {\n  content: '';\n  position: absolute;\n  left: 0;\n  bottom: -6px;\n  width: 100%;\n  height: 3px;\n  background: white;\n  border-radius: 5px;\n  transform-origin: right;\n  transform: scaleX(0);\n  transition: transform .5s;\n}\n\n.navigation a:hover::after {\n  transform-origin: left;\n  transform: scaleX(1);\n}\n\n.navigation .btnLogin-popup {\n  width: 130px;\n  height: 50px;\n  background: black;\n  border: 2px solid white;\n  outline: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 1.1em;\n  color: white;\n  font-weight: 500;\n  margin-left: 40px;\n  transition: .5s;\n}\n\n.navigation .btnLogin-popup:hover {\n  background: white;\n  color: #162938;\n}\n\n.tab {\n  display: none;\n}\n\n.tab.active {\n  display: block;\n}\n\n.wrapper {\n  position: absolute;\n  top: 10%;\n  left: 75%;\n  width: 400px;\n  height: 440px;\n  background: transparent;\n  border: 2px solid rgba(255, 255, 255, .5);\n  border-radius: 20px;\n  backdrop-filter: blur(20px);\n  box-shadow: 0 0 30px rgba(0, 0, 0, .5);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  overflow: hidden;\n  transition: transform .5s ease, height .2s ease;\n  transform: scale(0);\n}\n\n.wrapper .form-box {\n  width: 100%;\n  padding: 40px;\n}\n\n.wrapper .form-box.login {\n  transition: transform .20s ease;\n  transform: translateX(0);\n}\n\n.wrapper .form-box.registration {\n  position: absolute;\n  transform: translateX(400px);\n  transition: none;\n}\n\n.wrapper.active-popup {\n  transform: scale(1);\n}\n\n.wrapper.active .form-box.login {\n  transition: none;\n  transform: translateX(-400px);\n}\n\n.wrapper.active .form-box.registration {\n  transition: transform .20s ease;\n  transform: translateX(0);\n}\n\n.wrapper .icon-close {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 50px;\n  height: 50px;\n  background: #162938;\n  font-size: 2em;\n  color: white;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border-bottom-left-radius: 20px;\n  cursor: pointer;\n  z-index: 1;\n}\n\n.wrapper.active {\n  height: 520px;\n}\n\n.form-box h2 {\n  font-size: 2em;\n  color: #162938;\n  text-align: center;\n}\n\n.input-box {\n  position: relative;\n  width: 100%;\n  height: 50px;\n  border-bottom: 2px solid #162938;\n  margin: 30px 0;\n}\n\n.input-box label {\n  position: absolute;\n  top: 50%;\n  left: 5px;\n  transform: translateY(-50%);\n  font-size: 1em;\n  color: #162938;\n  font-weight: 500;\n  pointer-events: none;\n  transition: .5s;\n}\n\n.input-box input:focus~label,\n.input-box input:valid~label {\n  top: -5px;\n}\n\n.input-box input {\n  width: 100%;\n  height: 100%;\n  background: transparent;\n  border: none;\n  outline: none;\n  font-size: 1em;\n  color: #162938;\n  font-weight: 600;\n  padding: 0 35px 0 5px;\n}\n\n.input-box .icon {\n  position: absolute;\n  right: 8px;\n  font-size: 1.2em;\n  color: #162938;\n  line-height: 60px;\n}\n\n.remember-forgot {\n  font-size: .9em;\n  color: #162938;\n  font-weight: 500;\n  margin: -15px 0 15px;\n  display: flex;\n  justify-content: space-between;\n}\n\n.remember-forgot label input {\n  accent-color: #162938;\n  margin-right: 3px;\n}\n\n.remember-forgot a {\n  color: #162938;\n  text-decoration: none;\n}\n\n.remember-forgot a:hover {\n  text-decoration: underline;\n}\n\n.btn {\n  width: 100%;\n  height: 50px;\n  background: #162938;\n  border: none;\n  outline: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 1em;\n  color: white;\n  font-weight: 500;\n}\n\n.login-register {\n  font-size: .9em;\n  color: #162938;\n  text-align: center;\n  font-weight: 500;\n  margin: 25px 0 10px;\n}\n\n.login-register p a {\n  color: #162938;\n  text-decoration: none;\n  font-weight: 600;\n}\n\n.login-register p a:hover {\n  text-decoration: underline;\n}\n\n.bookingsTabs {\n  position: relative;\n  margin-top: 6vh;\n  left: 31.8vw;\n  padding-right: 5px;\n  padding-left: 5px;\n  margin-right: 20px;\n  font-size: 1.3rem;\n  background-color: transparent;\n  border: currentColor 0.125em solid;\n  cursor: pointer;\n  text-decoration: none;\n  border-radius: 0.25em;\n  /* text-shadow: 0 0 0.125em white, 0 0 0.25em currentColor;\n  color: var(--clr-neon); */\n}\n\n#bookingsErrorDisplay {\n  position: absolute;\n  left: 30vw;\n  top: 40vh;\n  font-size: 5em;\n  text-shadow:\n    1.2px 1.2px 0 #ff0000,\n    -1.2px 1.2px 0 #ff0000,\n    -1.2px -1.2px 0 #ff0000,\n    1.2px -1.2px 0 #ff0000;\n}\n\n#userGreeting {\n  position: relative;\n  top: 10vh;\n  left: 38.5vw;\n  color: white;\n  font-size: 2em;\n  text-shadow:\n    1.8px 1.8px 0 #000,\n    -1.8px 1.8px 0 #000,\n    -1.8px -1.8px 0 #000,\n    1.8px -1.8px 0 #000;\n}\n\n#plannedTripForm {\n  position: relative;\n  top: 2vh;\n  left: 37vw;\n}\n\n#apology {\n  position: relative;\n  font-size: 1.8em;\n}\n\n#about {\n  position: relative;\n  top: 20vh;\n  left: 48vw;\n  color: red;\n  font-size: 1.7em;\n}\n\n.hidden {\n  display: none;\n}\n\n.pastTripsCard {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 200px;\n  height: 200px;\n  margin: 20px;\n  padding: 20px;\n  background-color: #64e2f0;\n  border-radius: 5px;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);\n  transition: box-shadow 0.3s;\n}\n\n.room-card {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 200px;\n  height: 200px;\n  margin: 20px;\n  padding: 20px;\n  background-color: #64e2f0;\n  border-radius: 5px;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);\n  transition: box-shadow 0.3s;\n}\n\n.newBookingsCard {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 200px;\n  height: 200px;\n  margin: 20px;\n  padding: 20px;\n  background-color: #64e2f0;\n  border-radius: 5px;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);\n  transition: box-shadow 0.3s;\n}\n\n.upcomingTripCards {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 200px;\n  height: 200px;\n  margin: 20px;\n  padding: 20px;\n  background-color: #64e2f0;\n  border-radius: 5px;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);\n  transition: box-shadow 0.3s;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 9 */
/***/ ((module) => {



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),
/* 10 */
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 11 */
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    // eslint-disable-next-line no-param-reassign
    options = {};
  } // eslint-disable-next-line no-underscore-dangle, no-param-reassign


  url = url && url.__esModule ? url.default : url;

  if (typeof url !== "string") {
    return url;
  } // If url is already wrapped in quotes, remove them


  if (/^['"].*['"]$/.test(url)) {
    // eslint-disable-next-line no-param-reassign
    url = url.slice(1, -1);
  }

  if (options.hash) {
    // eslint-disable-next-line no-param-reassign
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/stanleyhotel.png");

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/turing-logo.png");

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchData: () => (/* binding */ fetchData)
/* harmony export */ });
const getPromises = [
    fetch('http://localhost:3001/api/v1/customers/'),
    fetch('http://localhost:3001/api/v1/bookings'),
    fetch('http://localhost:3001/api/v1/rooms')
];
const fetchData = () => {
    return Promise.all(getPromises);
}



/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   entryDate: () => (/* binding */ entryDate),
/* harmony export */   formView: () => (/* binding */ formView),
/* harmony export */   locateAvailableRooms: () => (/* binding */ locateAvailableRooms),
/* harmony export */   locateBookedRooms: () => (/* binding */ locateBookedRooms),
/* harmony export */   locateUnbookedRooms: () => (/* binding */ locateUnbookedRooms),
/* harmony export */   pastTripSection: () => (/* binding */ pastTripSection),
/* harmony export */   planTripSection: () => (/* binding */ planTripSection),
/* harmony export */   showAvailableRooms: () => (/* binding */ showAvailableRooms),
/* harmony export */   showPastTrips: () => (/* binding */ showPastTrips),
/* harmony export */   showUpcomingTrips: () => (/* binding */ showUpcomingTrips),
/* harmony export */   upcomingTripSection: () => (/* binding */ upcomingTripSection),
/* harmony export */   welcomeUser: () => (/* binding */ welcomeUser)
/* harmony export */ });
/* harmony import */ var _scripts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
// ===================================================================
// ===============   variables and imports   =========================
// ===================================================================



const pastTripSection = document.querySelector('#pastTripSection');
const upcomingTripSection = document.querySelector('#upcomingTripSection');
const planTripSection = document.querySelector('#planTripSection');
const entryDate = document.querySelector('#date');
const formView = document.querySelector('#date');
const userGreeting = document.querySelector('#userGreeting');
const bookingsTab = document.querySelector('.bookingsTabs');


// ===================================================================
// ===============   functions   =====================================
// ===================================================================

const locateBookedRooms = (bookings) => {
    let arrivalDate = entryDate.value
        .split('-')
        .join('/');

    return bookings.filter((booking) => booking.date === arrivalDate)
        .map((rooms) => rooms.roomNumber)
}

const locateUnbookedRooms = (bookedRooms, rooms) => {
    return rooms.filter((room) => !bookedRooms.includes(room.number));
}

const locateAvailableRooms = (bookings, rooms) => {
    const amountOfBeds = document.getElementById('bed-number').value;
    const locateBookedRoom = locateBookedRooms(bookings)
    const locateUnbookedRoom = locateUnbookedRooms(locateBookedRoom, rooms)

    return locateUnbookedRoom.filter((room) => room.numBeds >= amountOfBeds)
}

function showAvailableRooms(bookings, rooms) {
    const availableRooms = locateAvailableRooms(bookings, rooms);
    formView.classList.add('hidden');
    planTripSection.classList.remove('hidden');
    planTripSection.innerHTML = '';
    if (availableRooms.length > 0) {
        planTripSection.innerHTML += `
        ${availableRooms.map(room => `
            <div class="newBookingsCard">
                <p id='room-number'>Room Number: ${room.number}</p>
                <p>Room Type: ${room.roomType}</p>
                <p>Cost Per Night: $${room.costPerNight}</p>
                <button id='bookRoomButton'>Book Room</button>
            </div>
        `).join('')}
    `;
    } else {
        planTripSection.innerHTML += '<p id="apology">So Sorry! We have no available rooms at that time, please refresh and find another date!</p>';
    }
}

const showPastTrips = (userID, bookings) => {

    const currentUsersBookings = bookings.filter(currentBooking => {
        if (currentBooking.userID === userID) {
            return currentBooking
        }
    });
    const todaysDate = new Date()
    const pastBookings = currentUsersBookings.filter(currentBooking => {
        const thisBookingsDate = new Date(currentBooking.date)
        if (thisBookingsDate < todaysDate) {
            return currentBooking
        }

    });
    pastTripSection.innerHTML = ''

    pastBookings.forEach(booking => {
        pastTripSection.innerHTML += `
    <article class='pastTripsCard'> 
    <p>Booking ID: ${booking.id}</p>
    <p>Booking Date: ${new Date(booking.date).toLocaleString()}</p>
    <p>Booking Room Number: ${booking.roomNumber}</p>
    </article>`
    })
    return currentUsersBookings
}

const showUpcomingTrips = (userID, bookings) => {
    const currentUsersBookings = bookings.filter(currentBooking => {
        if (currentBooking.userID === userID) {
            return currentBooking
        }
    });
    const todaysDate = new Date()
    const futureBookings = currentUsersBookings.filter(currentBooking => {
        const thisBookingsDate = new Date(currentBooking.date)
        if (thisBookingsDate > todaysDate) {
            return currentBooking
        }
    })

    upcomingTripSection.innerHTML = ''
    futureBookings.forEach(booking => {
        upcomingTripSection.innerHTML += `
        <article class="upcomingTripCards"> 
            <p>Booking ID: ${booking.id}</p>
            <p>Booking Date: ${new Date(booking.date).toLocaleString()}</p>
            <p>Booking Room Number: ${booking.roomNumber}</p>
        </article>`
    })
}

const welcomeUser = (userID, users) => {
    const matchingUser = users.find(currentUser => {
        return currentUser.id === userID
    })
    userGreeting.innerHTML = `Welcome ${matchingUser.name}!`
}

bookingsTab.addEventListener('click', () => {
    if (bookingsTab.classList.contains('active')) {
        document.body.style.background = 'url(\'../images/stanleyhotelhallway.png\') no-repeat';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    }
});


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map