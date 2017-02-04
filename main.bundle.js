webpackJsonp([0,3],{

/***/ 139:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_localStorage__ = __webpack_require__(202);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return CurrentUser; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CurrentUser = (function () {
    function CurrentUser(localStorage) {
        this.localStorage = localStorage;
    }
    CurrentUser.prototype.getUserName = function () {
        return this.localStorage.read("userName");
    };
    CurrentUser.prototype.getTomCode = function () {
        return this.localStorage.read("tomCode");
    };
    CurrentUser = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__helpers_localStorage__["a" /* LocalStorage */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__helpers_localStorage__["a" /* LocalStorage */]) === 'function' && _a) || Object])
    ], CurrentUser);
    return CurrentUser;
    var _a;
}());
//# sourceMappingURL=/Users/loyd/personal/feed-tom/src/currentUser.js.map

/***/ },

/***/ 140:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_services__ = __webpack_require__(302);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_stateService__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_localStorage__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__helpers_currentUser__ = __webpack_require__(139);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return ActionCreators; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





//import { StateService } from '../services/stateService';
var ActionCreators = (function () {
    function ActionCreators(services, stateService, localStorage, currentUser) {
        this.services = services;
        this.stateService = stateService;
        this.localStorage = localStorage;
        this.currentUser = currentUser;
    }
    ActionCreators.prototype.setIdentity = function (userName, tomCode) {
        this.localStorage.write("userName", userName);
        this.localStorage.write("tomCode", tomCode);
        var action = {
            type: "SET_IDENTITY",
            payload: {}
        };
        this.stateService.reduce(action);
        this.connectToFirebase(userName, tomCode);
    };
    ;
    ActionCreators.prototype.initializeFirebase = function () {
        this.services.initializeFirebase();
    };
    ;
    // Can specify credentials, or omit them
    ActionCreators.prototype.connectToFirebase = function (userName, tomCode) {
        // [1] Was the supplied tomCode valid?
        if (tomCode == null || tomCode.length == 0) {
            var localTomCode = this.currentUser.getTomCode();
            // [2] is the tomCode in storage valid?
            if (localTomCode == null || localTomCode.length == 0) {
                // [3] couldn't resolve a valid tomCode, give up, trigger a state refresh
                var action = {
                    type: "",
                    payload: {}
                };
                this.stateService.reduce(action);
                return;
            }
            else {
                // [3] Use the localStorage tomCode
                tomCode = localTomCode;
            }
        }
        else {
            // [2] Storage the supplied tomCode
            this.localStorage.write("tomCode", tomCode);
        }
        // Resolve a proper userName value
        if (userName == null || userName.length == 0) {
            var localUserName = this.currentUser.getUserName();
            if (localUserName == null || localUserName.length == 0) {
                userName = "anonymous";
                this.localStorage.write("userName", userName);
            }
            else {
                userName = localUserName;
            }
        }
        console.log("connecting to firebase with: ");
        console.log("userName: " + userName);
        console.log("tomCode: " + tomCode);
        this.getPreferences(tomCode);
    };
    ActionCreators.prototype.getPreferences = function (tomCode) {
        if (tomCode == null || tomCode.length == 0) {
            return;
        }
        this.services.getPreferences(tomCode);
    };
    ;
    // Figures out whether we or adding or removing a preference
    ActionCreators.prototype.togglePreference = function (restaurantId, userName, restaurants, preferences, tomCode) {
        for (var _i = 0, preferences_1 = preferences; _i < preferences_1.length; _i++) {
            var preference = preferences_1[_i];
            if (preference.restaurantId == restaurantId && preference.userName == userName) {
                this.services.deletePreference(preference.id, restaurantId, tomCode);
                return;
            }
        }
        this.services.addPreference(restaurantId, userName, tomCode);
    };
    ;
    ActionCreators.prototype.purgePreferences = function (restaurants, preferences, tomCode) {
        for (var _i = 0, preferences_2 = preferences; _i < preferences_2.length; _i++) {
            var preference = preferences_2[_i];
            this.services.deletePreference(preference.id, preference.restaurantId, tomCode);
        }
        for (var _a = 0, restaurants_1 = restaurants; _a < restaurants_1.length; _a++) {
            var restaurant = restaurants_1[_a];
            for (var _b = 0, _c = restaurant.preferenceIds; _b < _c.length; _b++) {
                var preferenceId = _c[_b];
                this.services.deletePreference(preferenceId, restaurant.id, tomCode);
            }
        }
    };
    ;
    ActionCreators = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_services__["a" /* Services */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_services__["a" /* Services */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_stateService__["a" /* StateService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__services_stateService__["a" /* StateService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__helpers_localStorage__["a" /* LocalStorage */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__helpers_localStorage__["a" /* LocalStorage */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__helpers_currentUser__["a" /* CurrentUser */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__helpers_currentUser__["a" /* CurrentUser */]) === 'function' && _d) || Object])
    ], ActionCreators);
    return ActionCreators;
    var _a, _b, _c, _d;
}());
//# sourceMappingURL=/Users/loyd/personal/feed-tom/src/actionCreators.js.map

/***/ },

/***/ 202:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return LocalStorage; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var LocalStorage = (function () {
    function LocalStorage() {
    }
    LocalStorage.prototype.write = function (key, value) {
        if (value) {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    };
    LocalStorage.prototype.read = function (key) {
        var value = localStorage.getItem(key);
        if (value && value != "undefined" && value != "null") {
            return JSON.parse(value);
        }
        return null;
    };
    LocalStorage = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [])
    ], LocalStorage);
    return LocalStorage;
}());
//# sourceMappingURL=/Users/loyd/personal/feed-tom/src/localStorage.js.map

/***/ },

/***/ 302:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_firebase__ = __webpack_require__(613);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_stateService__ = __webpack_require__(95);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return Services; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var Services = (function () {
    function Services(stateService) {
        this.stateService = stateService;
    }
    Services.prototype.initializeFirebase = function () {
        var firebaseConfig = {
            apiKey: "AIzaSyBxk_oFZ3moeV_ymxHiOUHdTy7Q3D2B8NA",
            authDomain: "feed-tom.firebaseapp.com",
            databaseURL: "https://feed-tom.firebaseio.com",
            storageBucket: "feed-tom.appspot.com",
            messagingSenderId: "175595419965"
        };
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_firebase__["initializeApp"])(firebaseConfig);
    };
    ;
    Services.prototype.addPreference = function (restaurantId, userName, tomCode) {
        var newPreferenceRef = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_firebase__["database"])().ref().child(tomCode).child("preferences").push();
        // Create preference
        var preferenceId = newPreferenceRef.key;
        var preference = { id: preferenceId, restaurantId: restaurantId, userName: userName, createdOn: null };
        newPreferenceRef.set(preference);
        // Add reference to preference in restaurants list
        var ref = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_firebase__["database"])().ref(tomCode + "/restaurants/" + restaurantId + "/preferenceIds/" + preferenceId);
        ref.set(preferenceId);
    };
    ;
    Services.prototype.deletePreference = function (preferenceId, restaurantId, tomCode) {
        // Remove reference to preference in restaurant
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_firebase__["database"])().ref(tomCode + "/restaurants/" + restaurantId + "/preferenceIds/" + preferenceId).remove();
        // Remove preference
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_firebase__["database"])().ref(tomCode + "/preferences/" + preferenceId).remove();
    };
    ;
    Services.prototype.getPreferences = function (tomCode) {
        console.log("get preferences");
        var self = this;
        if (this.firebaseRef) {
            this.firebaseRef.off();
        }
        this.firebaseRef = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_firebase__["database"])().ref().child(tomCode);
        this.firebaseRef.on("value", function (snapshot) {
            var payload = {};
            var preferences = [];
            var restaurants = [];
            if (snapshot.val()) {
                console.log("data found in firebase, processing it");
                // Convert from firebase associative array to array
                for (var key in snapshot.val().preferences) {
                    var preference = snapshot.val().preferences[key];
                    preferences.push(preference);
                }
                // Convert from firebase associative array to array
                for (var key in snapshot.val().restaurants) {
                    var restaurant = snapshot.val().restaurants[key];
                    // Convert restaurants preferenceIds associative array to array
                    var preferenceIds = [];
                    for (var key in restaurant.preferenceIds) {
                        var preferenceId = restaurant.preferenceIds[key];
                        preferenceIds.push(preferenceId);
                    }
                    restaurant.preferenceIds = preferenceIds;
                    restaurants.push(restaurant);
                }
            }
            payload.restaurants = restaurants;
            payload.preferences = preferences;
            self.processData(payload);
        });
    };
    ;
    Services.prototype.processData = function (payload) {
        var action = {
            type: "PROCESS_DATA",
            payload: payload
        };
        this.stateService.reduce(action);
    };
    ;
    Services = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__services_stateService__["a" /* StateService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__services_stateService__["a" /* StateService */]) === 'function' && _a) || Object])
    ], Services);
    return Services;
    var _a;
}());
//# sourceMappingURL=/Users/loyd/personal/feed-tom/src/services.js.map

/***/ },

/***/ 344:
/***/ function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 344;


/***/ },

/***/ 345:
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts__ = __webpack_require__(459);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(434);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(458);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_app_module__ = __webpack_require__(454);





if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_4__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=/Users/loyd/personal/feed-tom/src/main.js.map

/***/ },

/***/ 454:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(424);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(430);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_app_component__ = __webpack_require__(455);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_landing_landing_component__ = __webpack_require__(456);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_main_main_component__ = __webpack_require__(457);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_actionCreators__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_services__ = __webpack_require__(302);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_stateService__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__helpers_localStorage__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__helpers_currentUser__ = __webpack_require__(139);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












// Imports: Specify other modules here to make their exported declarations available in this module
// Declarations: Specify directives/components/pipes in this module, that you want to make available. Everything inside declarations knows each other!
// Providers: Make Services/Values available for Dependency Injection. Components/Directives 
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__components_app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_6__components_main_main_component__["a" /* MainComponent */],
                __WEBPACK_IMPORTED_MODULE_5__components_landing_landing_component__["a" /* LandingComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_7__services_actionCreators__["a" /* ActionCreators */],
                __WEBPACK_IMPORTED_MODULE_8__services_services__["a" /* Services */],
                __WEBPACK_IMPORTED_MODULE_9__services_stateService__["a" /* StateService */],
                __WEBPACK_IMPORTED_MODULE_10__helpers_localStorage__["a" /* LocalStorage */],
                __WEBPACK_IMPORTED_MODULE_11__helpers_currentUser__["a" /* CurrentUser */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4__components_app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=/Users/loyd/personal/feed-tom/src/app.module.js.map

/***/ },

/***/ 455:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_actionCreators__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_stateService__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_currentUser__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AppComponent = (function () {
    function AppComponent(zone, actionCreators, stateService, currentUser) {
        this.zone = zone;
        this.actionCreators = actionCreators;
        this.stateService = stateService;
        this.currentUser = currentUser;
        this.preferences = new Array();
        this.restaurants = new Array();
        this.displayPage = "main";
        this.userName = "";
        this.tomCode = "";
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Set up subscription to data
        this.stateService.state$.subscribe(function (state) {
            _this.zone.run(function () {
                _this.state = state;
                _this.restaurants = state.restaurants;
                _this.preferences = state.preferences;
                _this.userName = state.userName;
                _this.tomCode = state.tomCode;
                _this.displayPage = state.displayPage;
            });
        });
        // Query for Data
        this.actionCreators.initializeFirebase();
        this.actionCreators.connectToFirebase(null, null);
    };
    ;
    AppComponent.prototype.isIdentitySet = function () {
        if (this.userName.length == 0 || this.tomCode.length == 0) {
            return false;
        }
        return true;
    };
    ;
    AppComponent.prototype.setDisplayPage = function (page) {
        this.displayPage = page;
    };
    ;
    AppComponent.prototype.getPreferences = function (tomCode) {
        this.actionCreators.getPreferences(tomCode);
    };
    ;
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__angular_core__["U" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(620),
            styles: [__webpack_require__(617)],
            providers: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__angular_core__["I" /* NgZone */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__angular_core__["I" /* NgZone */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__services_actionCreators__["a" /* ActionCreators */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__services_actionCreators__["a" /* ActionCreators */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__services_stateService__["a" /* StateService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_stateService__["a" /* StateService */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_2__helpers_currentUser__["a" /* CurrentUser */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__helpers_currentUser__["a" /* CurrentUser */]) === 'function' && _d) || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b, _c, _d;
}());
//# sourceMappingURL=/Users/loyd/personal/feed-tom/src/app.component.js.map

/***/ },

/***/ 456:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_actionCreators__ = __webpack_require__(140);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return LandingComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var LandingComponent = (function () {
    function LandingComponent(actionCreators) {
        this.actionCreators = actionCreators;
    }
    LandingComponent.prototype.ngOnInit = function () {
    };
    LandingComponent.prototype.setIdentity = function () {
        this.actionCreators.setIdentity(this.userName, this.tomCode);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', String)
    ], LandingComponent.prototype, "tomCode", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', String)
    ], LandingComponent.prototype, "userName", void 0);
    LandingComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* Component */])({
            selector: 'app-landing',
            template: __webpack_require__(621),
            styles: [__webpack_require__(618)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_actionCreators__["a" /* ActionCreators */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_actionCreators__["a" /* ActionCreators */]) === 'function' && _a) || Object])
    ], LandingComponent);
    return LandingComponent;
    var _a;
}());
//# sourceMappingURL=/Users/loyd/personal/feed-tom/src/landing.component.js.map

/***/ },

/***/ 457:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_actionCreators__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_stateService__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return MainComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var MainComponent = (function () {
    function MainComponent(actionCreators, stateService) {
        this.actionCreators = actionCreators;
        this.stateService = stateService;
    }
    MainComponent.prototype.ngOnInit = function () {
    };
    ;
    MainComponent.prototype.togglePreference = function (restaurant) {
        this.actionCreators.togglePreference(restaurant.id, this.userName, this.restaurants, this.preferences, this.tomCode);
    };
    ;
    MainComponent.prototype.purgePreferences = function () {
        this.actionCreators.purgePreferences(this.restaurants, this.preferences, this.tomCode);
    };
    ;
    MainComponent.prototype.getRestaurantDescription = function (restaurantId) {
        for (var _i = 0, _a = this.restaurants; _i < _a.length; _i++) {
            var restaurant = _a[_i];
            if (restaurant.id == restaurantId) {
                return restaurant.name;
            }
        }
        return "restaurantId: " + restaurantId + " not found";
    };
    ;
    MainComponent.prototype.getPreferenceUserName = function (preferenceId) {
        for (var _i = 0, _a = this.preferences; _i < _a.length; _i++) {
            var preference = _a[_i];
            if (preference.id == preferenceId) {
                return preference.userName;
            }
        }
        return "preferenceId: " + preferenceId + " not found";
    };
    ;
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Array)
    ], MainComponent.prototype, "preferences", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Array)
    ], MainComponent.prototype, "restaurants", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["w" /* Input */])(), 
        __metadata('design:type', String)
    ], MainComponent.prototype, "userName", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["w" /* Input */])(), 
        __metadata('design:type', String)
    ], MainComponent.prototype, "tomCode", void 0);
    MainComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["U" /* Component */])({
            selector: 'app-main',
            template: __webpack_require__(622),
            styles: [__webpack_require__(619)],
            providers: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__services_actionCreators__["a" /* ActionCreators */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__services_actionCreators__["a" /* ActionCreators */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__services_stateService__["a" /* StateService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_stateService__["a" /* StateService */]) === 'function' && _b) || Object])
    ], MainComponent);
    return MainComponent;
    var _a, _b;
}());
//# sourceMappingURL=/Users/loyd/personal/feed-tom/src/main.component.js.map

/***/ },

/***/ 458:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=/Users/loyd/personal/feed-tom/src/environment.js.map

/***/ },

/***/ 459:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__ = __webpack_require__(473);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__ = __webpack_require__(466);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__ = __webpack_require__(462);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__ = __webpack_require__(468);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__ = __webpack_require__(467);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__ = __webpack_require__(465);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__ = __webpack_require__(464);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__ = __webpack_require__(472);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__ = __webpack_require__(461);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__ = __webpack_require__(460);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__ = __webpack_require__(470);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__ = __webpack_require__(463);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__ = __webpack_require__(471);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__ = __webpack_require__(469);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__ = __webpack_require__(474);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__ = __webpack_require__(634);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__);
















//# sourceMappingURL=/Users/loyd/personal/feed-tom/src/polyfills.js.map

/***/ },

/***/ 617:
/***/ function(module, exports) {

module.exports = ".san-serif {\n\tfont-family: 'Open Sans Condensed', sans-serif;\n}\n\n.slab-serif {\n\tfont-family: 'Josefin Slab', serif;\n}\n\n.preference-square {\n\t-webkit-box-flex: 0;\n\t    -ms-flex: 0 0 20vh;\n\t        flex: 0 0 20vh;\n\tborder: 1px solid black;\n\theight: 20vh;\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\t-webkit-box-orient: vertical;\n\t-webkit-box-direction: normal;\n\t    -ms-flex-direction: column;\n\t        flex-direction: column;\n\t-webkit-box-align: center;\n\t    -ms-flex-align: center;\n\t        align-items: center;\n\t-ms-flex-pack: distribute;\n\t    justify-content: space-around;\n}\n\n.restaurant-square {\n\t-webkit-box-flex: 1;\n\t    -ms-flex: 1 0 15%;\n\t        flex: 1 0 15%;\n\tborder: 1px solid black;\n\theight: 20vh;\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\t-webkit-box-orient: vertical;\n\t-webkit-box-direction: normal;\n\t    -ms-flex-direction: column;\n\t        flex-direction: column;\n\t-webkit-box-align: center;\n\t    -ms-flex-align: center;\n\t        align-items: center;\n\t-ms-flex-pack: distribute;\n\t    justify-content: space-around;\n}\n\n.restaurant-square.liked {\n\tbackground-image: url(/assets/images/preference.png);\n\tbackground-size: 100% 100%;\n\theight: 100%;\n}"

/***/ },

/***/ 618:
/***/ function(module, exports) {

module.exports = ".landing-page-container {\n\t\tbackground-image: url(/assets/images/landing-page-background.png);\n\t\tbackground-size: 100% 100%;\n\t\theight: 100%;\n}"

/***/ },

/***/ 619:
/***/ function(module, exports) {

module.exports = ".san-serif {\n\tfont-family: 'Open Sans Condensed', sans-serif;\n}\n\n.slab-serif {\n\tfont-family: 'Josefin Slab', serif;\n}\n\n.preference-square {\n\t-webkit-box-flex: 0;\n\t    -ms-flex: 0 0 20vh;\n\t        flex: 0 0 20vh;\n\tborder: 1px solid black;\n\theight: 20vh;\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\t-webkit-box-orient: vertical;\n\t-webkit-box-direction: normal;\n\t    -ms-flex-direction: column;\n\t        flex-direction: column;\n\t-webkit-box-align: center;\n\t    -ms-flex-align: center;\n\t        align-items: center;\n\t-ms-flex-pack: distribute;\n\t    justify-content: space-around;\n}\n\n.restaurant-square {\n\t-webkit-box-flex: 1;\n\t    -ms-flex: 1 0 15%;\n\t        flex: 1 0 15%;\n\tborder: 1px solid black;\n\theight: 20vh;\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\t-webkit-box-orient: vertical;\n\t-webkit-box-direction: normal;\n\t    -ms-flex-direction: column;\n\t        flex-direction: column;\n\t-webkit-box-align: center;\n\t    -ms-flex-align: center;\n\t        align-items: center;\n\t-ms-flex-pack: distribute;\n\t    justify-content: space-around;\n}\n\n.restaurant-square.liked {\n\tcolor: white;\n\tbackground-image: url(/assets/images/preference.png);\n\tbackground-size: cover;\n\tbackground-position: 50% 50%;\n}"

/***/ },

/***/ 620:
/***/ function(module, exports) {

module.exports = "<!-- HEADER -->\n<div style=\"display: flex; width: 100vw; height: 7vh; background-color: black;\">\n\t<div style=\"flex: 0 0 5vw;\"></div>\n\t<div class=\"image-holder\" style=\"flex: 5 0 0px; display: flex; align-items: center;\">\n\t\t<div style=\"color: white; letter-spacing: .1rem; font-size: 1.4rem;\" class=\"san-serif\">\n\t\t\tFEED TOM ({{ userName }}) <button (click)=\"setDisplayPage('landing')\">edit</button>\n\t\t</div>\n\t</div>\n\t<div style=\"flex: 3 0 0px; display: flex; justify-content: center; align-items: center;\">\n\t\t<div style=\"color: white; letter-spacing: .1rem; font-size: 1rem;\" class=\"san-serif\">\n\t\t\tWhen fooding decision is very hard and important\n\t\t</div>\n\t</div>\n</div>\n<div *ngIf=\"state\" style=\"height: 93vh; width: 100vw;\">\n\t<app-landing *ngIf=\"displayPage == 'landing' || isIdentitySet() == false\"\n\t\t\t\t\t\t\t\t[userName]=\"userName\"\n\t\t\t\t\t\t\t\t[tomCode]=\"tomCode\">\n\t</app-landing>\n\t<app-main *ngIf=\"displayPage == 'main' && isIdentitySet() == true\"\n\t\t\t\t\t\t[preferences]=\"preferences\"\n\t\t\t\t\t\t[restaurants]=\"restaurants\"\n\t\t\t\t\t\t[tomCode]=\"tomCode\"\n\t\t\t\t\t\t[userName]=\"userName\">\n\t</app-main>\n</div>"

/***/ },

/***/ 621:
/***/ function(module, exports) {

module.exports = "<div class=\"landing-page-container\">\n\t\n\tEnter User Name: <input [(ngModel)]=\"userName\">\n\t<br />\n\tEnter Tom Code: <input [(ngModel)]=\"tomCode\">\n\t<br />\n\t<button (click)=\"setIdentity()\">Get Preferences</button>\n</div>"

/***/ },

/***/ 622:
/***/ function(module, exports) {

module.exports = "<!-- MAIN CONTENT -->\n<div class=\"san-serif\">\n\t<div style=\"height: 100%; display: flex; width: 100vw;\">\n\n\t\t<!-- LEFT COLUMN -->\n\t\t<div style=\"flex: 0 0 15%; display: flex; flex-direction: column; background-color: rgba(255,255,255,.9)\">\n\t\t\t<div>\n\t\t\t\t<button (click)=\"purgePreferences()\">\n\t\t\t\t\tPurge preferences\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<!-- LOOP over preferences -->\n\t\t\t<div *ngFor=\"let preference of preferences\" class=\"preference-square\">\n\t\t\t\t<div>\n\t\t\t\t\t{{ getRestaurantDescription(preference.restaurantId) }}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"slab-serif\" style=\"font-size: 1rem; color: red; font-weight: 800;\">\n\t\t\t\t\t{{ preference.userName }}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<!-- RIGHT COLUMN -->\n\t\t<div style=\"overflow-y: scroll; align-content: flex-start; display: flex; flex-direction: row; flex-wrap: wrap; flex: 0 0 85%; background-color: rgba(255,255,255,.9)\">\n\n\t\t\t<!-- LOOP over restaurants -->\n\t\t\t<div *ngFor=\"let restaurant of restaurants\"\n\t\t\t\t\t\t(click)=\"togglePreference(restaurant)\"\n\t\t\t\t\t\t[class.liked]=\"restaurant.preferenceIds.length > 0\"\n\t\t\t\t\t\tclass=\"restaurant-square\">\n\t\t\t\t<div style=\"font-size: 1rem;\">\n\t\t\t\t\t{{ restaurant.name }}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\n\t</div>\n</div>"

/***/ },

/***/ 635:
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(345);


/***/ },

/***/ 95:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_currentUser__ = __webpack_require__(139);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return StateService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var StateService = (function () {
    function StateService(currentUser) {
        this.currentUser = currentUser;
        // Scaffolding out values to avoid nulls
        // TODO: Rearchitect to a typed state so this is not necessary
        this.state = { preferences: [], restaurants: [], userName: "", tomCode: "" };
        // Setting up 'state' observable
        this.stateSource = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this.state$ = this.stateSource.asObservable();
    }
    StateService.prototype.preferenceReducers = function (action, preferences) {
        switch (action.type) {
            case "PROCESS_DATA":
                preferences = action.payload.preferences;
                return preferences;
            default:
                return preferences;
        }
    };
    ;
    StateService.prototype.restaurantReducers = function (action, restaurants) {
        switch (action.type) {
            case "PROCESS_DATA":
                restaurants = action.payload.restaurants;
                return restaurants;
            default:
                return restaurants;
        }
    };
    ;
    StateService.prototype.stateReducers = function (action, state) {
        switch (action.type) {
            case "PROCESS_DATA":
                //	var restaurants = action.payload.restaurants;
                return state;
            default:
                return state;
        }
    };
    ;
    StateService.prototype.reduce = function (action) {
        // Scaffolding out values to avoid nulls
        // TODO: Rearchitect to a typed state so this is not necessary
        var newState = {};
        newState.preferences = this.preferenceReducers(action, this.state.preferences);
        newState.restaurants = this.restaurantReducers(action, this.state.restaurants);
        this.state = {};
        this.state.preferences = newState.preferences;
        this.state.restaurants = newState.restaurants;
        this.state.userName = this.currentUser.getUserName();
        this.state.tomCode = this.currentUser.getTomCode();
        // Send the user to the landing page if username and tomCode aren't set
        if (this.state.userName
            && this.state.userName.length > 0
            && this.state.tomCode
            && this.state.tomCode.length > 0) {
            this.state.displayPage = "main";
        }
        else {
            this.state.displayPage = "landing";
        }
        this.broadcast();
    };
    StateService.prototype.broadcast = function () {
        console.log("state updated");
        console.log(this.state);
        this.stateSource.next(Object.assign([], this.state));
    };
    StateService.prototype.purgeData = function () {
        this.stateSource.next(null);
    };
    StateService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__helpers_currentUser__["a" /* CurrentUser */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__helpers_currentUser__["a" /* CurrentUser */]) === 'function' && _a) || Object])
    ], StateService);
    return StateService;
    var _a;
}());
//# sourceMappingURL=/Users/loyd/personal/feed-tom/src/stateService.js.map

/***/ }

},[635]);
//# sourceMappingURL=main.bundle.map