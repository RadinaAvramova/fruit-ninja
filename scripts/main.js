var timeline = require("timeline");
var tools = require("tools");
var scene = require("scene");
var Ucren = require("lib/ucren");
var buzz = require("lib/buzz");
var control = require("control");
var csl = require("object/console");
var message = require("message");
var state = require("state");

var game = require("game");

var collide = require("collide");

var setTimeout = timeline.setTimeout.bind(timeline);

var log = function() {
    var time = 1000, add = 300, fn;
    fn = function(text) {
        setTimeout(function() { csl.log(text); }, time);
        time += add;
    };
    fn.clear = function() {
        setTimeout(csl.clear.bind(csl), time);
        time += add;
    };
    return fn;
}();

exports.start = function() {
    [timeline, scene, control].invoke("init");

    log("Loading mouse control script");
    log("Loading image resources");
    log("Loading game script");
    log("Loading storyline");
    log("Initializing");
    log("Starting game...");
    log.clear();

    setTimeout(function() {
        scene.switchScene("home-menu");
    }, 3000);
};

message.addEventListener("slice", function(knife) {
    var fruits = collide.check(knife), angle;
    if (fruits.length) {
        angle = tools.getAngleByRadian(tools.pointToRadian(knife.slice(0, 2), knife.slice(2, 4)));
        fruits.forEach(function(fruit) {
            message.postMessage(fruit, angle, "slice.at");
        });
    }
});

message.addEventListener("slice.at", function(fruit, angle) {
    if (state("scene-state").isNot("ready")) {
        return;
    }

    if (state("scene-name").is("game-body")) {
        game.sliceAt(fruit, angle);
        return;
    }

    if (state("scene-name").is("home-menu")) {
        fruit.broken(angle);
        switch (true) {
            case fruit.isDojoIcon:
                scene.switchScene("dojo-body");
                break;
            case fruit.isNewGameIcon:
                scene.switchScene("game-body");
                break;
            case fruit.isQuitIcon:
                scene.switchScene("quit-body");
                break;
        }
        return;
    }
});

var tip = "";

if (!Ucren.isChrome) {
    tip = "For the best performance, we recommend using <span class='b'>Google Chrome</span> to play this game.";
}

if (!buzz.isSupported()) {
    tip = tip.replace("$", "Your browser does not support <audio> for sound effects, and");
}

tip = tip.replace("$", "");

Ucren.Element("browser").html(tip);
