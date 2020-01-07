class AddFunction extends Function {
    constructor() {
        super("...args", "return this.__self__.__call__(...args)");
        let self = this.bind(this);
        this.__self__ = self;
        if (!isNaN(arguments[0])) {
            self.sum = arguments[0];
        } else self.sum = 0;
        return self;
    }

    __call__() {
        for (let i = 0; i < arguments.length; i++) {
            this.sum += arguments[i];
        }
        return new AddFunction(this.sum);
    }

    toString() {
        return this.sum;
    }
}

function fancySum() {
    let sum = 0;
    for (let i = 0; i < arguments.length; i++) {
        sum += arguments[i];
    }
    return new AddFunction(sum);
}
