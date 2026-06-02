// Without using class keyword, create a Dog
// that inherits from Animal using prototypes

function Animal(name) {
  this.name = name
}

Animal.prototype.speak = function() {
  console.log(this.name + " makes a sound")
}

function Dog(name, breed) {
  // your code — call Animal here
    Animal.call(this, name)
    this.breed = breed
}

// set up prototype chain here
Dog.prototype = Object.create(Animal.prototype)
Dog.prototype.constructor = Dog

Dog.prototype.bark = function() {
  console.log(this.name + " barks!")
}

const dog = new Dog("Bruno", "Labrador")
dog.speak() // Bruno makes a sound
dog.bark()  // Bruno barks!
console.log(dog instanceof Animal) // true