export default class Drawable {
    constructor() {
        this.els = [];
    }

    addToTank(el) {
        this.removeFromTank();

        this.tank = el;
        this.onAddToTank();

        for(const el of this.els) {
            this.tank.appendChild(el);
        }
    }

    removeFromTank() {
        if(!this.isInTank()) return;

        for(const el of this.els) {
            this.tank.removeChild(el);
        }

        this.tank = null;
    }

    isInTank() {
        return !!(this.tank);
    }

    addEl(el) {
        this.els.push(el);
        if(this.isInTank()) this.tank.appendChild(el);
    }

    onAddToTank() {}
    update(time) {}
    resize() {}
}