import { randInt, random, randomCubicCenter } from "../util/Random.js";
import Drawable from "./Drawable.js";

// TODO periodic add/remove
// TODO maintain fish-density after resize
// TODO move into FishManager

export default class Fish extends Drawable {
    static maxScale = 3;
    static types = [{
        name: 'clown',
        probability: 1,
        size: {
            x: 16,
            y: 10,
        },
    }, {
        name: 'acrobat',
        probability: 1,
        size: {
            x: 25,
            y: 17,
        },
    }, {
        name: 'smol',
        probability: 1,
        size: {
            x: 13,
            y: 9,
        },
    }, {
        name: 'jelly',
        probability: 0.6,
        size: {
            x: 21,
            y: 35,
        },
    }, {
        name: 'turtle',
        probability: 0.4,
        size: {
            x: 38,
            y: 16,
        },
    }, {
        name: 'babywhale',
        probability: 0.1,
        size: {
            x: 31,
            y: 21,
        },
    }, {
        name: 'whale',
        probability: 0.1,
        size: {
            x: 92,
            y: 62,
        },
    }];
    static totalProbability = Fish.types.reduce(
        (total, element) => (total + element.probability),
        0
    );

    constructor() {
        super();

        const depth = Math.random();
        this.scale = depth * (Fish.maxScale - 1) + 1;
        this.zIndex = Math.round(depth * 100);

        this.type = Fish.getRandomType();
    }

    static getRandomType() {
        let roll = random(0, Fish.totalProbability);

        for(const type of Fish.types) {
            if(roll < type.probability) return type;
            roll -= type.probability;
        }
    }

    onAddToTank() {
        this.position = this.getRandomPosition();

        const imgEl = document.createElement('img');

        imgEl.src = `images/fish/${this.type.name}.png`;
        imgEl.width  = this.type.size.x * this.scale;
        imgEl.height = this.type.size.y * this.scale;
        imgEl.style.zIndex = this.zIndex;

        const rarity = randomCubicCenter(-1, 1);
        const recolor = rarity * 75;
        const saturate = Math.floor(100 + Math.abs(rarity) * 30);
        const contrast = Math.floor(100 + Math.abs(rarity) * 30);

        imgEl.style.filter = `hue-rotate(${recolor}deg) saturate(${saturate}%) contrast(${contrast}%)`;
        imgEl.style.position = 'absolute';

        this.addEl(imgEl);
        this.updatePosition();
    }

    getRandomPosition() {
        const max = this.getMaxPosition();

        return {
            x: randInt(0, max.x),
            y: randInt(0, max.y),
        };
    }

    getMaxPosition() {
        return {
            x: this.tank.clientWidth  - this.type.size.x * this.scale - 1,
            y: this.tank.clientHeight - this.type.size.y * this.scale - 1,
        }
    }

    updatePosition() {
        this.els[0].style.left = `${this.position.x}px`;
        this.els[0].style.top  = `${this.position.y}px`;
    }

    update(time) {
        if(!this.movement) {
            this.pickMovement(time);
        } else if(time > this.movement.endTime) {
            this.position = this.movement.end;
            this.pickMovement(time);
        }
    }

    pickMovement(time) {
        const startTime = time;
        const durationMillis = random(6000, 15000);
        const duartionSecs = durationMillis / 1000;
        const endTime = startTime + durationMillis;

        this.movement = {
            start: {
                x: this.position.x,
                y: this.position.y,
            },
            end: this.getRandomPosition(),
            startTime: startTime,
            endTime: endTime,
            durationMillis: durationMillis,
            duartionSecs: duartionSecs,
        };

        this.flipForMovement();
        
        this.els[0].style.transition = `left ${this.movement.duartionSecs}s ease-in-out, top ${this.movement.duartionSecs}s ease-in-out`;
        this.els[0].style.left = `${this.movement.end.x}px`;
        this.els[0].style.top  = `${this.movement.end.y}px`;
    }

    flipForMovement() {
        if(this.movement.start.x > this.movement.end.x) {
            this.els[0].style.transform = '';
        } else {
            this.els[0].style.transform = 'scaleX(-1)';
        }
    }
}