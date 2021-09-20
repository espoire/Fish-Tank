import { randInt, random, randomElementFromArray } from "./scripts/util/Random.js";

const tank = document.body;
const fishes = [];
const bubbles = [];

function onResize() {}

function init() {
    for(let i = 0; i < 20; i++) {
        const fish = new Fish();
        fish.addToTank();
        fishes.push(fish);
    }

    window.addEventListener('resize', onResize);
    window.setInterval(update, 1000);
}

function update() {
    for(const fish of fishes) {
        fish.swim();
    }

    for(let i = 0; i < bubbles.length; i++) {
        const bubble = bubbles[i];
        bubble.float();
        if(bubble.expired) bubbles.splice(i--, 1);
    }
    if(randInt(1, 6) <= 6) bubbles.push(new Bubble());
}

function now() {
    return +new Date();
}

class Fish {
    static scale = 3;
    static types = [{
        name: 'clown',
        size: {
            x: 16,
            y: 10,
        },
    }, {
        name: 'acrobat',
        size: {
            x: 25,
            y: 17,
        },
    }, {
        name: 'jelly',
        size: {
            x: 21,
            y: 35,
        },
    }, {
        name: 'turtle',
        size: {
            x: 38,
            y: 16,
        },
    }, {
        name: 'babywhale',
        size: {
            x: 31,
            y: 21,
        },
    }, {
        name: 'whale',
        size: {
            x: 92,
            y: 62,
        },
    }];

    constructor() {
        this.type = randomElementFromArray(Fish.types);
        this.position = this.getRandomPosition();
    }

    getMaxPosition() {
        return {
            x: window.innerWidth  - this.type.size.x * Fish.scale - 1,
            y: window.innerHeight - this.type.size.y * Fish.scale - 1,
        }
    }

    getRandomPosition() {
        const max = this.getMaxPosition();

        return {
            x: randInt(0, max.x),
            y: randInt(0, max.y),
        };
    }

    addToTank() {
        const imgEl = document.createElement('img');

        imgEl.src = `images/fish/${this.type.name}.png`;
        imgEl.width = this.type.size.x * Fish.scale;
        imgEl.height = this.type.size.y * Fish.scale;

        imgEl.style.position = 'absolute';

        this.imgEl = imgEl;
        this.updatePosition();
        tank.appendChild(imgEl);
    }

    updatePosition() {
        this.imgEl.style.left = `${this.position.x}px`;
        this.imgEl.style.top = `${this.position.y}px`;
    }

    swim() {
        if(!this.movement) {
            this.pickMovement();
        } else if(now() > this.movement.endTime) {
            this.position = this.movement.end;
            this.pickMovement();
        }
    }

    pickMovement() {
        const startTime = now();
        const durationMillis = random(4000, 15000);
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
        
        this.imgEl.style.transition = `left ${this.movement.duartionSecs}s ease-in-out, top ${this.movement.duartionSecs}s ease-in-out`;
        this.imgEl.style.left = `${this.movement.end.x}px`;
        this.imgEl.style.top  = `${this.movement.end.y}px`;
    }

    flipForMovement() {
        if(this.movement.start.x > this.movement.end.x) {
            this.imgEl.style.transform = '';
        } else {
            this.imgEl.style.transform = 'scaleX(-1)';
        }
    }
}

class Bubble {
    static image = {
        name: 'bubble',
        size: {
            x: 16,
            y: 16,
        },
    };

    constructor() {
        console.log('bloop');
        
        this.scale = random(1, 10);
        this.scale = Math.pow(Math.random(), 3) * 9 + 1;

        this.position = this.getRandomPosition();
        
        console.log(this.position);

        this.addToTank();
    }

    getSize() {
        return {
            x: this.scale * Bubble.image.size.x,
            y: this.scale * Bubble.image.size.y,
        }
    }

    getMaxPosition() {
        const size = this.getSize();
        return {
            x: window.innerWidth  - size.x - 1,
            y: window.innerHeight + size.y,
        }
    }

    getRandomPosition() {
        const max = this.getMaxPosition();
        return {
            x: randInt(0, max.x),
            y: max.y,
        };
    }

    addToTank() {
        const imgEl = document.createElement('img');

        imgEl.src = `images/bubble/${Bubble.image.name}.png`;
        imgEl.width = Math.round(Bubble.image.size.x * this.scale);
        imgEl.height = Math.round(Bubble.image.size.y * this.scale);

        imgEl.style.position = 'absolute';
        imgEl.style.opacity = 0.5;

        this.imgEl = imgEl;
        this.updatePosition();
        tank.appendChild(imgEl);
    }

    updatePosition() {
        this.imgEl.style.left = `${this.position.x}px`;
        this.imgEl.style.top = `${this.position.y}px`;
    }

    float() {
        if(!this.movement) this.pickMovement();

        if(now() > this.movement.endTime) {
            console.log('pop');

            this.expired = true;
            if(this.imgEl) {
                tank.removeChild(this.imgEl);
                this.imgEl = null;
            }
        }
    }

    pickMovement() {
        const startTime = now();
        
        const speedPerSec = 20 * this.scale;
        const startY = this.position.y;
        const endY = - Bubble.image.size.y * this.scale;
        const distance = startY - endY;

        const duartionSecs = distance / speedPerSec;
        const durationMillis = duartionSecs * 1000;
        const endTime = startTime + durationMillis;

        this.movement = {
            start: {
                x: this.position.x,
                y: this.position.y,
            },
            end: {
                x: this.position.x,
                y: endY,
            },
            startTime: startTime,
            endTime: endTime,
            durationMillis: durationMillis,
            duartionSecs: duartionSecs,
        };
        
        this.imgEl.style.transition = `top ${this.movement.duartionSecs}s linear`;
        this.imgEl.style.top  = `${this.movement.end.y}px`;
    }
}

init();