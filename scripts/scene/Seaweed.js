import { randInt } from "../util/Random.js";
import Drawable from "./Drawable.js";

export default class Seaweed extends Drawable {
    constructor() {
        super();

        this.size = randInt(10, 50);
        this.numTiers = 20;
    }

    onAddToTank() {
        this.zIndex = 150;

        // Create the "tiers"
        // Each tier will have a left and right leaf
        // and be similar to the previous tier.
        this.tiers = [];
        let tier, prev;
        for(let i = 0; i < this.numTiers; i++) {
            tier = this.createTier(prev, i);

            this.tiers.push(tier);
            this.addEl(tier.left.el);
            this.addEl(tier.right.el);

            prev = tier;
        }
    }

    createTier(prev, i) {
        const tierPortion = i / this.numTiers;
        const size = prev ? prev.size * 0.9 : this.size;

        const tier = {
            anchor: {
                x: 200,
                y: (prev ? prev.anchor.y + size : 0),
            },
            size: size,
            left: {
                el: null,
            },
            right: {
                el: null,
            },
        };

        tier.left.el = document.createElement('img');
        tier.left.el.src = 'images/seaweed/leaf1.png';
        tier.left.el.width = tier.size;
        tier.left.el.height = tier.size;

        tier.left.el.style.zIndex = this.zIndex;
        tier.left.el.style.position = 'absolute';
        tier.left.el.style.left = `${tier.anchor.x - tier.size}px`;
        tier.left.el.style.top = `${this.tank.clientHeight - tier.anchor.y - tier.size}px`;

        tier.right.el = document.createElement('img');
        tier.right.el.src = 'images/seaweed/leaf1.png';
        tier.right.el.width = tier.size;
        tier.right.el.height = tier.size;

        tier.right.el.style.zIndex = this.zIndex;
        tier.right.el.style.position = 'absolute';
        tier.right.el.style.left = `${tier.anchor.x}px`;
        tier.right.el.style.top = `${this.tank.clientHeight - tier.anchor.y - tier.size}px`;
        tier.right.el.style.transform = `scaleX(-1)`;

        return tier;
    }

    update(time) {

    }
}