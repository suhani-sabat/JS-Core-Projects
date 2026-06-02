// for (var i = 0; i < 3; i++) {
//   setTimeout(() => console.log(i), 100)
// }


function once(fn) {
  // your code here
  // fn should only execute the first time
  // after that it does nothing
    let called = false;
    return function() {
        if (!called) {
            called = true;
            fn();
        }
    }
}

const sayHello = once(() => console.log("Hello!"))
sayHello() 
sayHello() 
sayHello()