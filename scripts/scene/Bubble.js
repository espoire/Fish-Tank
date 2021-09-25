import { randInt } from "../util/Random.js";
import { now } from "../util/Time.js";
import Drawable from "./Drawable.js";

export default class Bubble extends Drawable {
    static image = {
        name: 'bubble',
        size: {
            x: 16,
            y: 16,
        },
    };

    constructor() {
        super();

        const depth = Math.random();

        this.scale = Math.pow(depth, 3) * 9 + 1;
        this.zIndex = Math.round(depth * 100);
    }

    getRandomPosition() {
        const max = this.getMaxPosition();
        return {
            x: randInt(0, max.x),
            y: max.y,
        };
    }

    getMaxPosition() {
        const size = this.getSize();
        return {
            x: this.tank.size.x - size.x - 1,
            y: this.tank.size.y + size.y,
        }
    }

    getSize() {
        return {
            x: this.scale * Bubble.image.size.x,
            y: this.scale * Bubble.image.size.y,
        }
    }

    onAddToTank() {
        this.position = this.getRandomPosition();

        const imgEl = document.createElement('img');

        imgEl.src = `images/bubble/${Bubble.image.name}.png`;
        imgEl.width = Math.round(Bubble.image.size.x * this.scale);
        imgEl.height = Math.round(Bubble.image.size.y * this.scale);
        imgEl.style.zIndex = this.zIndex;

        imgEl.style.position = 'absolute';
        imgEl.style.opacity = 0.5;

        this.addEl(imgEl);
        this.updatePosition();
    }

    updatePosition() {
        this.els[0].style.left = `${this.position.x}px`;
        this.els[0].style.top = `${this.position.y}px`;
    }

    update(time) {
        if(!this.tank) return;

        if(!this.movement) this.pickMovement(time);
        if(time > this.movement.endTime) {
            this.removeFromTank();
        }
    }

    pickMovement(time) {
        const startTime = time;
        
        const speedPerSec = 40 * this.scale;
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
        
        this.els[0].style.transition = `top ${this.movement.duartionSecs}s linear`;
        this.els[0].style.top  = `${this.movement.end.y}px`;
    }
}