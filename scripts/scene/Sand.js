import Drawable from "./Drawable.js";
import Horizon from "./Horizon.js";

export default class Sand extends Drawable {
    static layers = [{
        color: '#C6A353',
        height: 1.0,
        zIndex: 5,
    }, {
        color: '#DDC486',
        height: 0.7,
        zIndex: 45,
    }, {
        color: '#F5E6B9',
        height: 0.4,
        zIndex: 85,
    }]

    constructor() { super() }

    onAddToTank() {
        for(const layer of Sand.layers) {
            const divEl = document.createElement('div');
    
            divEl.style.backgroundColor = layer.color;
            divEl.style.width = `${this.tank.size.x}px`;

            const height = layer.height * Horizon.height;
            divEl.style.height = `${height}px`;
    
            divEl.style.position = 'absolute';
            divEl.style.left = '0px';
            divEl.style.top = `${this.tank.size.y - layer.height * Horizon.height}px`;
            divEl.style.zIndex = layer.zIndex;
    
            this.addEl(divEl);
        }
    }

    resize() { // TODO also respect resize-y
        for(const divEl of this.els) {
            divEl.style.width = `${this.tank.size.x}px`;
        }
    }
}