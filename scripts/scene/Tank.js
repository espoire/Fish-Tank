import Fish from "./Fish.js";
import Bubble from "./Bubble.js";
import Sand from "./Sand.js";
import { randInt } from "../util/Random.js";
import { now } from "../util/Time.js";
import Seaweed from "./Seaweed.js";

export default class Tank {
    static fishDensity = 15 / (600 * 1000); // Z fish on a XxY viewport
    static seaweedDensity = 5 / 600; // Z seaweeds on an X-wide viewport

    constructor(el) {
        this.el = el || document.body;
        this.el.size = {
            x: this.el.clientWidth,
            y: this.el.clientHeight,
        };

        this.elements = {
            fishes: [],
            bubbles: [],
            sand: new Sand(),
            seaweeds: [],
        }

        const area = this.el.clientWidth * this.el.clientHeight;
        const numFish = Math.max(Tank.fishDensity * area, 3);

        for(let i = 0; i < numFish; i++) {
            const fish = new Fish();
            fish.addToTank(this.el);
            this.elements.fishes.push(fish);
        }

        const numSeaweed = Math.max(this.el.clientWidth * Tank.seaweedDensity, 2);

        for(let i = 0; i < numSeaweed; i++) {
            const seaweed = new Seaweed();
            seaweed.addToTank(this.el);
            this.elements.seaweeds.push(seaweed);
        }

        this.elements.sand.addToTank(this.el);

        window.addEventListener('resize', this.onResize.bind(this));
        window.setInterval(this.update.bind(this), 1000);
    }

    update() {
        const time = now();

        for(const key in this.elements) {
            const value = this.elements[key];
            if(!value) continue;

            if(Array.isArray(value)) {
                for(let i = 0; i < value.length; i++) {
                    const subelement = value[i];
                    if(!subelement) continue;

                    subelement.update(time);
                    if(! subelement.isInTank()) value.splice(i--, 1);
                }
            } else {
                value.update(time);
                if(! value.isInTank()) value = null;
            }
        }
    
        this.addBubbles(); // TODO refactor into BubblesManager
    }

    onResize() {
        this.el.size = {
            x: this.el.clientWidth,
            y: this.el.clientHeight,
        };

        for(const key in this.elements) {
            const value = this.elements[key];
            if(!value) continue;
            
            if(Array.isArray(value)) {
                for(const subelement of value) {
                    subelement.resize();
                }
            } else {
                value.resize();
            }
        }
    }

    addBubbles() {
        const numNewBubbles = randInt(0, 2); // TODO scale to container width
    
        for (let i = 0; i < numNewBubbles; i++) {
            const bubble = new Bubble();
            bubble.addToTank(this.el);
            this.elements.bubbles.push(bubble);
        }
    }
}