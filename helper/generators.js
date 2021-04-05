class Generators {
    constructor() {

    }

    * columnGenerator(max) {
        for(let index = 3; index <= max; index++) {
            yield `${index}`;
        }
    }
}

module.exports.Generators = Generators;