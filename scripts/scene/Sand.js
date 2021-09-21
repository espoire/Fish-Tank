import Drawable from "./Drawable.js";

export default class Sand extends Drawable {
    static layers = [{
        color: '#C6A353',
        height: 100,
        zIndex: 5,
    }, {
        color: '#DDC486',
        height: 70,
        zIndex: 45,
    }, {
        color: '#F5E6B9',
        height: 40,
        zIndex: 85,
    }]

    constructor() { super() }

    onAddToTank() {
        for(const layer of Sand.layers) {
            const divEl = document.createElement('div');
    
            divEl.style.backgroundColor = layer.color;
            divEl.style.width = `${this.tank.clientWidth}px`;
            divEl.style.height = `${layer.height}px`;
    
            divEl.style.position = 'absolute';
            divEl.style.left = '0px';
            divEl.style.top = `${this.tank.clientHeight - layer.height}px`;
            divEl.style.zIndex = layer.zIndex;
    
            this.addEl(divEl);
        }
    }

    resize() {
        for(const divEl of this.els) {
            divEl.style.width = `${this.tank.clientWidth}px`;
        }
    }
}