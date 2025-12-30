import canonical from "./canonical.js";

export var mechanics = {};

class Mechanic {
  constructor(name) {
    this.name = name;
    this.canon = canonical(this.name);
    mechanics[this.canon] = this;
    Object.freeze(this);
  }
}

new Mechanic("Art");
new Mechanic("Audio Editing");
new Mechanic("Biology / Ecology");
new Mechanic("Board Games");
new Mechanic("Chemistry");
new Mechanic("Chess");
new Mechanic("Code");
new Mechanic("Crafts");
new Mechanic("Cryptics");
new Mechanic("Film / TV");
new Mechanic("Food");
new Mechanic("Geography");
new Mechanic("Grunt Work");
new Mechanic("History / PoliSci");
new Mechanic("Id Tasks");
new Mechanic("Image Editing / Steganography");
new Mechanic("Linguistics");
new Mechanic("Literature");
new Mechanic("Logic");
new Mechanic("Math");
new Mechanic("Medicine / Physiology");
new Mechanic("Memes / Misc. Pop Culture");
new Mechanic("MIT Knowledge");
new Mechanic("MIT Student");
new Mechanic("Music Theory");
new Mechanic("Onsite");
new Mechanic("Physics");
new Mechanic("Research Tasks");
new Mechanic("Sports");
new Mechanic("Submission Task");
new Mechanic("Video Games");
new Mechanic("Weeb");

Object.freeze(mechanics);

export var IsMechanic = Match.Where((x) => mechanics[x] != null);
