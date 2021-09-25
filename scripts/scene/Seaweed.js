import { randInt, random } from "../util/Random.js";
import Drawable from "./Drawable.js";
import { degToRad } from "../util/Geom.js";
import { linearInterpolate } from "../util/Interpolation.js";
import Horizon from "./Horizon.js";

export default class Seaweed extends Drawable {
    constructor() {
        super();

        this.zIndex = randInt(0, 100);

        this.anchor = {
            x: 0,
            y: linearInterpolate(this.zIndex, Horizon.height, 0, 0, 100),
        }

        this.numTiers = randInt(10, 15);
        this.size = linearInterpolate(this.zIndex, 10, 50, 0, 100);
        this.wilt = {
            hueRotate: random(-120, 0),
        };
    }

    onAddToTank() {
        this.anchor.x = randInt(0, this.tank.size.x);

        // Create the "tiers"
        // Each tier will have a left and right leaf
        // and be similar to the previous tier.
        this.tiers = [];
        let tier, prev;
        for(let i = 0; i < this.numTiers; i++) {
            tier = new SeaweedTier(this, prev, i);
            if(prev) prev.next = tier;

            this.tiers.push(tier);
            this.addEl(tier.left.el);
            this.addEl(tier.left.el);
            this.addEl(tier.right.el);

            prev = tier;
        }
    }

    update(time) {
        const angle = 2 * Math.sin(time / 5000);
        this.tiers[0].setAngleCascade(angle);        
    }
}

class SeaweedTier {
    constructor(plant, prev, i) {
        const tierPortion = i / plant.numTiers;
        const size = prev ? prev.size * 0.9 : plant.size;

        this.plant = plant;
        this.size = size;

        this.shadow = linearInterpolate(tierPortion, 0.8, 0, 0, 0.4);
        this.wiltIntensity = linearInterpolate(tierPortion, 0, 1, 0.6, 1);

        this.left = {
            el: null,
        };
        this.right = {
            el: null,
        };
        this.prev = prev;

        this.angle = 0;

        if(this.prev) {
            this.angle = this.prev.angle + random(-5, 0);
        } else {
            this.angle = 0;
        }

        this.left.el = document.createElement('img');
        this.left.el.src = 'images/seaweed/leaf1.png';
        this.left.el.width = this.size;
        this.left.el.height = this.size;
        this.left.el.style.zIndex = this.plant.zIndex;
        this.left.el.style.position = 'absolute';
        this.left.el.style.filter = `brightness(${1 - this.shadow}) hue-rotate(${this.wiltIntensity * this.plant.wilt.hueRotate}deg)`;
        this.left.el.style.transition = `left 1s linear, top 1s linear, transform 1s linear`;

        this.right.el = document.createElement('img');
        this.right.el.src = 'images/seaweed/leaf1.png';
        this.right.el.width = this.size;
        this.right.el.height = this.size;
        this.right.el.style.zIndex = this.plant.zIndex;
        this.right.el.style.position = 'absolute';
        this.right.el.style.filter = `brightness(${1 - this.shadow}) hue-rotate(${this.wiltIntensity * this.plant.wilt.hueRotate}deg)`;
        this.right.el.style.transition = `left 1s linear, top 1s linear, transform 1s linear`;

        this.updateAnchor();
    }

    updateAnchor() {
        let anchor;

        if(this.prev) {
            anchor = this.prev.getSuccessorAnchor();
        } else {
            anchor = this.plant.anchor;
        }

        this.setAnchor(anchor);
    }

    setAnchor(anchor) {
        if(!this.anchor) this.anchor = {};
        this.anchor.x = anchor.x;
        this.anchor.y = anchor.y;

        this.updateLeafPositions();
    }

    setAngleCascade(baseAngle) {
        this.angle = baseAngle;
        if(this.prev) this.angle += this.prev.angle;

        this.updateAnchor();

        if(this.next) this.next.setAngleCascade(baseAngle);
    }

    updateLeafPositions() {
        this.left.el.style.transform = `rotate(${this.angle}deg)`;
        this.right.el.style.transform = `scaleX(-1) rotate(${-this.angle}deg)`;

        this.left.el.style.left = `${this.anchor.x - this.size}px`;
        this.left.el.style.top = `${this.plant.tank.size.y - this.anchor.y - this.size}px`;
        this.right.el.style.left = `${this.anchor.x}px`;
        this.right.el.style.top = `${this.plant.tank.size.y - this.anchor.y - this.size}px`;
    }

    getSuccessorAnchor() {
        const rads = degToRad(this.angle);

        return {
            x: this.anchor.x + this.size * Math.sin(rads),
            y: this.anchor.y + this.size * Math.cos(rads),
        }
    }
}