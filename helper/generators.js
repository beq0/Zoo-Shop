class Generators {
    constructor() {

    }

    * columnGenerator(max) {
        for(let index = 2; index <= max; index++) {
            yield `${index}`;
        }
    }
}

module.exports.Generators = Generators;