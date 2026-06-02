function makeCounter() {
  // your code here
  // it should have increment, decrement, getCount
    let count = 0;

    return {
    increment() {
        count++;
    },
    decrement() {
        count--;
    },
    getCount() {
        return count;
    }
  }
}

const counter = makeCounter()
counter.increment()
counter.increment()
counter.decrement()
console.log(counter.getCount()) // should print 1