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
                // Exiting since valid tomCode was not found
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
                // Both username sources had nothing, default to "anonymous"
                userName = "anonymous";
                this.localStorage.write("userName", userName);
            }
            else {
                userName = localUserName;
            }
        }
        this.getPreferences(tomCode, userName);
    };
    ActionCreators.prototype.getPreferences = function (tomCode, currentUser) {
        if (tomCode == null || tomCode.length == 0) {
            return;
        }
        this.services.getPreferences(tomCode, currentUser);
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
            if (restaurant.preferenceIds) {
                for (var _b = 0, _c = restaurant.preferenceIds; _b < _c.length; _b++) {
                    var preferenceId = _c[_b];
                    this.services.deletePreference(preferenceId, restaurant.id, tomCode);
                }
            }
        }
    };
    ;
    ActionCreators.prototype.addRestaurant = function (tomCode, name) {
        this.services.addRestaurant(tomCode, name);
    };
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_firebase__ = __webpack_require__(614);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__entities_preference__ = __webpack_require__(458);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_stateService__ = __webpack_require__(95);
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
        var preference = new __WEBPACK_IMPORTED_MODULE_2__entities_preference__["a" /* Preference */]({ id: preferenceId, restaurantId: restaurantId, userName: userName, createdOn: null });
        newPreferenceRef.set(preference);
        // Add reference to preference in restaurants list
        var ref = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_firebase__["database"])().ref(tomCode + "/restaurants/" + restaurantId + "/preferenceIds/" + preferenceId);
        ref.set(preferenceId);
    };
    ;
    Services.prototype.addRestaurant = function (tomCode, name) {
        var newRestaurantRef = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_firebase__["database"])().ref().child(tomCode).child("restaurants").push();
        var restaurantId = newRestaurantRef.key;
        var restaurant = { id: restaurantId, name: name };
        newRestaurantRef.set(restaurant);
    };
    Services.prototype.deletePreference = function (preferenceId, restaurantId, tomCode) {
        // Remove reference to preference in restaurant
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_firebase__["database"])().ref(tomCode + "/restaurants/" + restaurantId + "/preferenceIds/" + preferenceId).remove();
        // Remove preference
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_firebase__["database"])().ref(tomCode + "/preferences/" + preferenceId).remove();
    };
    ;
    Services.prototype.getPreferences = function (tomCode, currentUser) {
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
            self.processData(payload, currentUser);
        });
    };
    ;
    Services.prototype.processData = function (payload, currentUser) {
        var action = {
            type: "PROCESS_DATA",
            payload: payload,
            currentUser: currentUser
        };
        this.stateService.reduce(action);
    };
    ;
    Services = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__services_stateService__["a" /* StateService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__services_stateService__["a" /* StateService */]) === 'function' && _a) || Object])
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts__ = __webpack_require__(460);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(434);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(459);
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
        this.popularRestaurants = new Array();
        this.displayPage = "main";
        this.userName = "";
        this.tomCode = "";
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Set up subscription to data
        this.stateService.state$.subscribe(function (state) {
            _this.zone.run(function () {
                _this.state = state.state;
                _this.restaurants = state.state.restaurants;
                _this.popularRestaurants = state.state.popularRestaurants;
                _this.preferences = state.preferences;
                _this.userName = state.userName;
                _this.tomCode = state.tomCode;
                _this.displayPage = state.displayPage;
                _this.userCount = state.state.userCount;
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
        this.actionCreators.getPreferences(tomCode, this.userName);
    };
    ;
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__angular_core__["U" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(621),
            styles: [__webpack_require__(618)],
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
            template: __webpack_require__(622),
            styles: [__webpack_require__(619)]
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
    MainComponent.prototype.addRestaurant = function () {
        this.actionCreators.addRestaurant(this.tomCode, this.newRestaurantName);
        this.newRestaurantName = "";
    };
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
        __metadata('design:type', Array)
    ], MainComponent.prototype, "popularRestaurants", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["w" /* Input */])(), 
        __metadata('design:type', String)
    ], MainComponent.prototype, "userName", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["w" /* Input */])(), 
        __metadata('design:type', String)
    ], MainComponent.prototype, "tomCode", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Number)
    ], MainComponent.prototype, "userCount", void 0);
    MainComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["U" /* Component */])({
            selector: 'app-main',
            template: __webpack_require__(623),
            styles: [__webpack_require__(620)],
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
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return Preference; });
var Preference = (function () {
    function Preference(preferenceDTO) {
        this.scaffolding();
        if (preferenceDTO == null) {
            return this;
        }
        if (preferenceDTO.id) {
            this.id = preferenceDTO.id;
        }
        if (preferenceDTO.userName) {
            this.userName = preferenceDTO.userName;
        }
        if (preferenceDTO.restaurantId) {
            this.restaurantId = preferenceDTO.restaurantId;
        }
        if (preferenceDTO.createdOn) {
            this.createdOn = preferenceDTO.createdOn;
        }
        return this;
    }
    Preference.prototype.scaffolding = function () {
        this.id = null;
        this.userName = null;
        this.restaurantId = null;
        this.createdOn = null;
    };
    return Preference;
}());
//# sourceMappingURL=/Users/loyd/personal/feed-tom/src/preference.js.map

/***/ },

/***/ 459:
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

/***/ 460:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__ = __webpack_require__(474);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__ = __webpack_require__(467);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__ = __webpack_require__(463);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__ = __webpack_require__(469);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__ = __webpack_require__(468);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__ = __webpack_require__(466);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__ = __webpack_require__(465);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__ = __webpack_require__(473);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__ = __webpack_require__(462);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__ = __webpack_require__(461);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__ = __webpack_require__(471);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__ = __webpack_require__(464);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__ = __webpack_require__(472);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__ = __webpack_require__(470);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__ = __webpack_require__(475);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__ = __webpack_require__(635);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__);
















//# sourceMappingURL=/Users/loyd/personal/feed-tom/src/polyfills.js.map

/***/ },

/***/ 618:
/***/ function(module, exports) {

module.exports = ".header-container {\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\t-ms-flex-pack: distribute;\n\t    justify-content: space-around;\n\twidth: 100vw;\n\theight: 14vh;\n\tbackground-color: #4b4c4d;\n}\n\n.header-title-container {\n\t-webkit-box-pack: start;\n\t    -ms-flex-pack: start;\n\t        justify-content: flex-start;\n\t-webkit-box-flex: 3;\n\t    -ms-flex: 3 0 0px;\n\t        flex: 3 0 0px;\n\theight: 100%;\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\t-webkit-box-align: center;\n\t    -ms-flex-align: center;\n\t        align-items: center;\n}\n\n.header-text-container {\n\t-webkit-box-align: center;\n\t    -ms-flex-align: center;\n\t        align-items: center;\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\t-webkit-box-flex: 3;\n\t    -ms-flex: 3 0 0px;\n\t        flex: 3 0 0px;\n\tcolor: white;\n\tletter-spacing: .1rem;\n\tfont-size: 1rem;\n\tfont-weight: 400;\n}\n\n.header-config-container {\n\t-webkit-box-align: center;\n\t    -ms-flex-align: center;\n\t        align-items: center;\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\t-webkit-box-pack: end;\n\t    -ms-flex-pack: end;\n\t        justify-content: flex-end;\n\t-webkit-box-flex: 1;\n\t    -ms-flex: 1 0 0px;\n\t        flex: 1 0 0px;\n\tcolor: white;\n}\n\n.header-config {\n\tpadding-right: 5%;\n}\n\n.header-title {\n\t-webkit-box-align: center;\n\t    -ms-flex-align: center;\n\t        align-items: center;\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\theight: 70%;\n\twidth: 100%;\n}\n\n.header-logo {\n\tpadding-left: 5%;\n\theight: 100%;\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\t-webkit-box-align: center;\n\t    -ms-flex-align: center;\n\t        align-items: center;\n}\n\n.potato {\n\tmax-width:100%;\n\tmax-height:50%;\n}\n\n.header-name {\n\twidth: 100%;\n\tpadding-left: 2%;\n\tcolor: white;\n\tletter-spacing: .1rem;\n\tfont-size: 1.4rem;\n\tfont-weight: 900;\n}\n\n\n\n\n/* body */\n\n.body-container {\n\theight: 86vh;\n\twidth: 100vw;\n}\n\n/* Mobile tweaks */\n@media all and (device-width: 375px) and (device-height: 667px) {\n\t/* Should be 14% of 667 to match 14vh from desktop */\n\n\t.header-container {\n\t\theight: 97px;\n\t\twidth: 375px;\n\t}\n\n\t.body-container {\n\t\theight: 570px;\n\t\twidth: 375px;\n\t}\n\n\t.header-text {\n\t\tdisplay: none;\n\t}\n}\n\n@media all and (device-width: 414px) and (device-height: 736px) {\n\t/* Should be 14% of 736 to match 14vh from desktop */\n\n\t.header-container {\n\t\theight: 100px;\n\t\twidth: 414px;\n\t}\n\n\t.body-container {\n\t\theight: 636px;\n\t\twidth: 414px;\n\t}\n\n\t.header-text {\n\t\tdisplay: none;\n\t}\n}"

/***/ },

/***/ 619:
/***/ function(module, exports) {

module.exports = ".landing-page-container {\n\t\tbackground-image: url(/assets/images/landing-page-background.png);\n\t\tbackground-size: 100% 100%;\n\t\theight: 100%;\n\t\tdisplay: -webkit-box;\n\t\tdisplay: -ms-flexbox;\n\t\tdisplay: flex;\n\t\t-webkit-box-pack: center;\n\t\t    -ms-flex-pack: center;\n\t\t        justify-content: center;\n\t\t-webkit-box-align: center;\n\t\t    -ms-flex-align: center;\n\t\t        align-items: center;\n}\n\n.login-form {\n\t-webkit-box-flex: 0;\n\t    -ms-flex: 0 0 30%;\n\t        flex: 0 0 30%;\n\t-ms-flex-flow: column;\n\t    flex-flow: column;\n\t-webkit-box-align: center;\n\t    -ms-flex-align: center;\n\t        align-items: center;\n}\n\n.username-input,\n.tomcode-input {\n\tborder: 1px solid black;\n}"

/***/ },

/***/ 620:
/***/ function(module, exports) {

module.exports = ".main-container {\n\theight: 100%;\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\twidth: 100%;\t\n}\n\n.popular-header {\n\tcolor: #f0523e;\n\t-webkit-box-align: center;\n\t    -ms-flex-align: center;\n\t        align-items: center;\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\t-ms-flex-flow: column;\n\t    flex-flow: column;\n\tpadding-bottom: 5px;\n\tpadding-top: 5px;\n}\n\n.popular-square {\n\t-webkit-box-flex: 0;\n\t    -ms-flex: 0 0 auto;\n\t        flex: 0 0 auto;\n\tbackground-color: #f0523e;\n\tcolor: white;\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\t-webkit-box-orient: vertical;\n\t-webkit-box-direction: normal;\n\t    -ms-flex-direction: column;\n\t        flex-direction: column;\n\t-webkit-box-align: center;\n\t    -ms-flex-align: center;\n\t        align-items: center;\n\t-ms-flex-pack: distribute;\n\t    justify-content: space-around;\n\tmargin-left: 5px;\n\tmargin-right: 5px;\n\tmargin-bottom: 5px;\n\tpadding-left: 10px;\n\tpadding-right: 10px;\n}\n\n.restaurant-square {\n\t-webkit-box-flex: 1;\n\t    -ms-flex: 1 0 auto;\n\t        flex: 1 0 auto;\n\tmin-width: 150px;\n\tbackground-color: #f2f3f4;\n\theight: 100px;\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\t-webkit-box-orient: vertical;\n\t-webkit-box-direction: normal;\n\t    -ms-flex-direction: column;\n\t        flex-direction: column;\n\t-webkit-box-align: center;\n\t    -ms-flex-align: center;\n\t        align-items: center;\n\t-ms-flex-pack: distribute;\n\t    justify-content: space-around;\n\tmargin-right: 3px;\n\tmargin-bottom: 3px;\n}\n\n.restaurant-square.liked-by-me {\n\tcolor: white;\n\tbackground-image: url(/assets/images/preference.png);\n\tbackground-size: cover;\n\tbackground-position: 50% 50%;\n}\n\n.restaurant-square.liked-by-others {\n\tbackground-image: url(/assets/images/preference-star.png);\n\tbackground-size: cover;\n\tbackground-position: 50% 50%;\n}\n\n.popular-column {\n\t-webkit-box-flex: 1;\n\t    -ms-flex: 1 0 0px;\n\t        flex: 1 0 0px;\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\t-webkit-box-orient: vertical;\n\t-webkit-box-direction: normal;\n\t    -ms-flex-direction: column;\n\t        flex-direction: column;\n}\n\n.restaurants-column {\n\toverflow-y: scroll;\n\t-ms-flex-line-pack: start;\n\t    align-content: flex-start;\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\t-webkit-box-orient: horizontal;\n\t-webkit-box-direction: normal;\n\t    -ms-flex-direction: row;\n\t        flex-direction: row;\n\t-ms-flex-wrap: wrap;\n\t    flex-wrap: wrap;\n\t-webkit-box-flex: 6;\n\t    -ms-flex: 6 0 0px;\n\t        flex: 6 0 0px;\t\n}\n\n/* Mobile tweaks */\n@media all and (device-width: 375px) and (device-height: 667px) {\n\t.popular-column {\n\t\t-webkit-box-flex: 3;\n\t\t    -ms-flex: 3 0 0px;\n\t\t        flex: 3 0 0px;\n\t\tdisplay: -webkit-box;\n\t\tdisplay: -ms-flexbox;\n\t\tdisplay: flex;\n\t\t-webkit-box-orient: vertical;\n\t\t-webkit-box-direction: normal;\n\t\t    -ms-flex-direction: column;\n\t\t        flex-direction: column;\n\t}\n\n\t.restaurants-column {\n\t\toverflow-y: scroll;\n\t\t-ms-flex-line-pack: start;\n\t\t    align-content: flex-start;\n\t\tdisplay: -webkit-box;\n\t\tdisplay: -ms-flexbox;\n\t\tdisplay: flex;\n\t\t-webkit-box-orient: horizontal;\n\t\t-webkit-box-direction: normal;\n\t\t    -ms-flex-direction: row;\n\t\t        flex-direction: row;\n\t\t-ms-flex-wrap: wrap;\n\t\t    flex-wrap: wrap;\n\t\t-webkit-box-flex: 6;\n\t\t    -ms-flex: 6 0 0px;\n\t\t        flex: 6 0 0px;\t\n\t}\n}\n"

/***/ },

/***/ 621:
/***/ function(module, exports) {

module.exports = "<!-- HEADER -->\n<div class=\"header-container\">\n\n\t<div class=\"header-title-container\">\n\t\t<div class=\"header-title\">\n\t\t\t<div class=\"header-logo\">\n\t\t\t\t<img class=\"potato\" src=\"/assets/images/potato.png\">\n\t\t\t</div>\n\n\t\t\t<div class=\"header-name\">\n\t\t\t\tFEED TOM\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n\t<div class=\"header-text-container\">\n\t\t<div class=\"header-text\">\n\t\t\tWhen fooding decision is very hard and important\n\t\t</div>\n\t</div>\n\n\t<div class=\"header-config-container\">\n\t\t<div class=\"header-config\">\n\t\t\t<div class=\"glyphicon glyphicon-cog\">\n\t\t\t</div>\n\t\t\t{{ userName }} | <button class=\"btn btn-gray\" (click)=\"setDisplayPage('landing')\">Update</button>\n\t\t</div>\n\t</div>\n</div>\n\n<!-- BODY -->\n<div *ngIf=\"state\" class=\"body-container\">\n\t<app-landing *ngIf=\"displayPage == 'landing' || isIdentitySet() == false\"\n\t\t\t\t\t\t\t\t[userName]=\"userName\"\n\t\t\t\t\t\t\t\t[tomCode]=\"tomCode\">\n\t</app-landing>\n\t<app-main *ngIf=\"displayPage == 'main' && isIdentitySet() == true\"\n\t\t\t\t\t\t[preferences]=\"preferences\"\n\t\t\t\t\t\t[popularRestaurants]=\"popularRestaurants\"\n\t\t\t\t\t\t[restaurants]=\"restaurants\"\n\t\t\t\t\t\t[tomCode]=\"tomCode\"\n\t\t\t\t\t\t[userName]=\"userName\"\n\t\t\t\t\t\t[userCount]=\"userCount\">\n\t</app-main>\n</div>"

/***/ },

/***/ 622:
/***/ function(module, exports) {

module.exports = "<div class=\"landing-page-container\">\n\t<div class=\"login-form\">\n\t\t<div style=\"width: 50%;\">\n\t\t\tDisplay Name\n\t\t</div>\n\t\t<div>\n\t\t\t<input class=\"username-input\" [(ngModel)]=\"userName\">\n\t\t</div>\n\n\t\t<div style=\"padding-top: 30px;\">\n\t\t\tTom Code (You and your friends should all use the same tom code to pick restaurants together)\n\t\t</div>\n\t\t<input class=\"tomcode-input\"[(ngModel)]=\"tomCode\">\n\t\t<button class=\"btn btn-green\" (click)=\"setIdentity()\">Submit</button>\n\t</div>\n</div>"

/***/ },

/***/ 623:
/***/ function(module, exports) {

module.exports = "<!-- MAIN CONTENT -->\n<div class=\"main-container\">\n\n\t<!-- LEFT COLUMN -->\n\t<div class=\"popular-column\">\n\t\t<div class=\"popular-header\">\n\t\t\t<div>\n\t\t\t\tParticipants: {{ userCount }}\n\t\t\t</div>\n\t\t\t<button class=\"btn btn-gray\" (click)=\"purgePreferences()\">\n\t\t\t\tSTART OVER\n\t\t\t</button>\n\t\t</div>\n\n\t\t<!-- LOOP over preferences -->\n\t\t<div *ngFor=\"let restaurant of popularRestaurants\" class=\"popular-square\">\n\t\t\t<div>\n\t\t\t\t{{ restaurant.name }}\n\t\t\t</div>\n\t\t\t<div style=\"font-size: 1rem;\">\n\t\t\t\t{{ restaurant.numberOfPreferences }}\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n\t<!-- RIGHT COLUMN -->\n\t<div class=\"restaurants-column\">\n\n\t\t<!-- LOOP over restaurants -->\n\t\t<div *ngFor=\"let restaurant of restaurants\"\n\t\t\t\t\t(click)=\"togglePreference(restaurant)\"\n\t\t\t\t\t[class.liked-by-me]=\"restaurant.isUserPreference\"\n\t\t\t\t\t[class.liked-by-others]=\"restaurant.isOthersPreference && restaurant.isUserPreference == false\"\n\t\t\t\t\tclass=\"restaurant-square\">\n\t\t\t<div style=\"font-size: 1rem;\">\n\t\t\t\t{{ restaurant.name }}\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"restaurant-square\">\n\t\t\t<input [(ngModel)]=\"newRestaurantName\" placeholder=\"New Restaurant\">\n\t\t\t<button (click)=\"addRestaurant()\" class=\"btn btn-green\">Add</button>\n\t\t</div>\n\t</div>\n\n</div>"

/***/ },

/***/ 636:
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
                var rawPreferences = action.payload.preferences;
                var rawRestaurants = action.payload.restaurants;
                var currentUser = action.currentUser;
                state.restaurants = [];
                state.userCount = 0;
                var uniqueUserNames = [];
                // Restaurants list
                // restaurant.id
                // restaurant.name
                // restaurant.isUserPreference
                // restaurant.userPreferenceId
                // restaurant.isOthersPreference
                // restaurant.numberOfPreferences
                for (var _i = 0, rawRestaurants_1 = rawRestaurants; _i < rawRestaurants_1.length; _i++) {
                    var rawRestaurant = rawRestaurants_1[_i];
                    var newRestaurant = {};
                    newRestaurant.id = rawRestaurant.id;
                    newRestaurant.name = rawRestaurant.name;
                    newRestaurant.isUserPreference = false;
                    newRestaurant.userPreferenceId = null;
                    newRestaurant.isOthersPreference = false;
                    newRestaurant.numberOfPreferences = 0;
                    // Was this restaurant preferred by current user, others, or both?
                    for (var _a = 0, _b = rawRestaurant.preferenceIds; _a < _b.length; _a++) {
                        var preferenceId = _b[_a];
                        var preference = null;
                        // Find preference that matches the restaurant.preferenceIds
                        for (var _c = 0, rawPreferences_1 = rawPreferences; _c < rawPreferences_1.length; _c++) {
                            var rawPreference = rawPreferences_1[_c];
                            if (rawPreference.id == preferenceId) {
                                preference = rawPreference;
                            }
                        }
                        // Add preference to uniquePreference Counter
                        if (uniqueUserNames.indexOf(preference.userName) == -1) {
                            uniqueUserNames.push(preference.userName);
                            state.userCount++;
                        }
                        // Who belongs to this preference?
                        if (preference.userName == currentUser) {
                            newRestaurant.isUserPreference = true;
                            newRestaurant.userPreferenceId = preference.id;
                        }
                        else {
                            newRestaurant.isOthersPreference = true;
                        }
                        newRestaurant.numberOfPreferences++;
                    }
                    // Add restaurant to state
                    state.restaurants.push(newRestaurant);
                }
                // Alphabetize by restaurant name
                state.restaurants = state.restaurants.sort(function (r1, r2) {
                    if (r1.name >= r2.name) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                });
                // TODO: And popular restaurant calculations seemed to be affecting
                // Popular restaurants
                state.popularRestaurants = Object.assign([], state.restaurants);
                state.popularRestaurants = this.selectMostPopularRestaurants(state.popularRestaurants, 5);
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
        newState.state = this.stateReducers(action, this.state);
        newState.preferences = this.preferenceReducers(action, this.state.preferences);
        newState.restaurants = this.restaurantReducers(action, this.state.restaurants);
        this.state = {};
        this.state.state = newState.state;
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
    StateService.prototype.selectMostPopularRestaurants = function (restaurants, numberToSelect) {
        var sorted = restaurants.sort(function (r1, r2) { return r2.numberOfPreferences - r1.numberOfPreferences; });
        var sliced = sorted.slice(0, numberToSelect);
        var mostPopular = [];
        // Prune restaurants with zero preferences
        for (var _i = 0, sliced_1 = sliced; _i < sliced_1.length; _i++) {
            var restaurant = sliced_1[_i];
            if (restaurant.numberOfPreferences > 0) {
                mostPopular.push(restaurant);
            }
        }
        return mostPopular;
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

},[636]);
//# sourceMappingURL=main.bundle.map