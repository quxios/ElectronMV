// Test file of using some babel transformations
//
// Note: When requiring, this file is already wrapped
// in it's own scope, so Test class will not be
// added to the global space
// If you need to create a global add it to the
// window or global property; ex: global.Test = Test;

class Test {
  static arrA = [0, 1, 2];
  static arrB = [...Test.arrA, 3, 4];
  static f1(x=1) {
    console.log(`x param is ${x}`);
  }
  static f2(arg1, ...rest) {
    console.log(arg1, ...rest);
  }
}

console.log(Test.arrA, Test.arrB);
Test.f1();
Test.f1(12);
Test.f2('arg1', [1, 2, 3]);
