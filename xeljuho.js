var unification = require('junify');
var _ = unification._;
var unify = unification.unify;
var $ = unification.variable;

function Gloss(verb, places) {
  this.verb = verb;
  this.places = places;
}

var en = {
  bacru: new Gloss('utters', ['utterer', 'utterance']),
  badna: new Gloss('is a banana', ['banana', 'species of banana']),
  badri: new Gloss('is sad', ['sorrowful one', 'source of sadness']),
  bajra: new Gloss('runs', ['runner', 'running surface', 'running limbs', 'gait']),
  bakfu: new Gloss('is a bundle', ['bundle', 'bundle contents', 'binding'])
};

function Predication(predicate, arguments) {
    this.predicate = predicate;
    this.arguments = arguments;
}

function Predicate(gloss) {
  this.gloss = gloss;
}

function Instance(gloss) {
  this.gloss = gloss;
}

function Frame() {
  this.knowledge = [];
  this.instances = [];
}

Frame.prototype.declare = function (predication) {
  this.knowledge.push(predication);
}

Frame.prototype.query = function (pattern) {
  var unifications = [];
  for (var i in this.knowledge) {
    var fact = this.knowledge[i];
    var match = unify(fact, pattern);
    if (match) {
      unifications.push(match);
    }
  }
  return unifications;
}

function that() {
  var args = Array.prototype.slice.call(arguments, 2);
  var subject = arguments[0];
  var predicate = arguments[1];
  args.unshift(subject);
  return new Predication(predicate, args);
}

var mi = new Instance('I');
var ti = new Instance('this');

var kAvndic = new Instance('Cavendish');
var latundan = new Instance('Latundan');

var badna = new Predicate('is a banana');

var ma = $('what', Instance);
var mo = $('does/is what', Predicate);

var zohe = unification._; // Type-specific instance
var cohe = unification._; // Type-specific predicate

var kb = new Frame();

console.log('(Something) is a banana of species Cavendish.');
kb.declare(that(zohe, badna, kAvndic));

console.log('(Something) is a banana of species Latundan.');
kb.declare(that(zohe, badna, latundan));

console.log('This is a banana (of some species).');
kb.declare(that(ti, badna, zohe));

console.log('I am a banana of species Cavendish.')
kb.declare(that(mi, badna, kAvndic)); // I am not, in fact, a Cavendish banana

console.log('What is a banana (of some species)?');
console.dir(kb.query(that(ma, badna, zohe)));

console.log('I do what (of something)?');
console.dir(kb.query(that(mi, mo, zohe)));

console.log('(Something) is a banana of species what?');
console.dir(kb.query(that(zohe, badna, ma)));

// These queries fail because they do not have all the places filled
console.log('What is a banana?');
console.dir(kb.query(that(ma, badna)));

console.log('I do what?');
console.dir(kb.query(that(mi, mo)));
