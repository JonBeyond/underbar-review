(function() {
  'use strict';

  window._ = {};

  // Returns whatever value is passed as the argument.
  _.identity = function(val) {
    return val;
  };

  // Return an array of the first n elements of an array. If n is undefined,
  // return just the first element.
  _.first = function(array, n) {
    return n === undefined ? array[0] : array.slice(0, n);
  };

  // Like first, but for the last elements. If n is undefined, return just the
  // last element.
  _.last = function(array, n) {
    if (n === 0) { 
      return [];
    }
    return n === undefined ? array[array.length - 1] : array.slice(-n);
  };

  // Call iterator(value, key, collection) for each element of collection.
  // Accepts both arrays and objects.

  _.each = function(collection, iterator) {
    if (Array.isArray(collection)) {
      for (let i = 0; i < collection.length; i++) {
        iterator (collection[i], i, collection);
      }
    } else if (typeof collection == 'object' && typeof collection !== null) {
      for (let key in collection) {
        iterator(collection[key], key, collection);
      }
    }
  };

  // Returns the index at which value can be found in the array, or -1 if value
  // is not present in the array.
  _.indexOf = function(array, target) {
    var result = -1;

    _.each(array, function(item, index) {
      if (item === target && result === -1) {
        result = index;
      }
    });

    return result;
  };

  // Return all elements of an array that pass a truth test.
  _.filter = function(collection, test) {
    let filteredCollection = [];
    _.each(collection, function(item, index) {
      if (test(collection[index]) === true) {
        filteredCollection.push(item);
      }
    });
    return filteredCollection;
  };

  // Return all elements of an array that don't pass a truth test.
  _.reject = function(collection, test) {
    return _.filter(collection, function(item){ //the function inside of filter takes a single item
      if (test(item) === true) return false;
      else return true;
    })
  };

  // Produce a duplicate-free version of the array.
  _.uniq = function(array, isSorted, iterator) {
    let newArray = [];
    
    if (iterator) {
      let arrayTransform = _.map(array,iterator);
      let transformedAdditions = [];
      for (let i = 0; i < array.length; i++) {
        if (!transformedAdditions.includes(arrayTransform[i])) {
          newArray.push(array[i]);
          transformedAdditions.push(arrayTransform[i]);
        }
      }
    } else {
      for (let i = 0; i < array.length; i++) {
        if (!newArray.includes(array[i])) {
          newArray.push(array[i]);
        }
      } 
    }
    return newArray; 
  };


  // Return the results of applying an iterator to each element.
  _.map = function(collection, iterator) {
    let mapped = [];
    for (let i = 0; i < collection.length; i++) {
      mapped.push(iterator(collection[i]));
    }
    return mapped;
  };

  // Takes an array of objects and returns and array of the values of
  // a certain property in it. E.g. take an array of people and return
  // an array of just their ages
  _.pluck = function(collection, key) {
    return _.map(collection, function(item) {
      return item[key];
    });
  };

  // Reduces an array or object to a single value by repetitively calling
  // iterator(accumulator, item) for each item. accumulator should be
  // the return value of the previous iterator call.
  //  
  // You can pass in a starting value for the accumulator as the third argument
  // to reduce. If no starting value is passed, the first element is used as
  // the accumulator, and is never passed to the iterator. In other words, in
  // the case where a starting value is not passed, the iterator is not invoked
  // until the second element, with the first element as its second argument.

  _.reduce = function(collection, iterator, accumulator) {
    let index = 0;
    if (Array.isArray(collection)) {
      if (accumulator === undefined) {
        accumulator = collection[0];
        index++;
      }
      for (let i = index; i < collection.length; i++) {
        accumulator = iterator(accumulator, collection[i], i, collection);
      }
    } else {  //assume no edge cases of non-collection (will return an error)
      for (let key in collection){
        if (accumulator === undefined){
          accumulator = collection[key]
        } else {
          accumulator = iterator(accumulator, collection[key], key, collection);
        }
      }

    }
    return accumulator;
  };

  // Determine if the array or object contains a given value (using `===`).
  _.contains = function(collection, target) {
    return _.reduce(collection, function(wasFound, item) {
      if (wasFound) {
        return true;
      }
      return item === target;
    }, false);
  };


  // Determine whether all of the elements match a truth test.
  _.every = function(collection, iterator, acc) {
    acc = acc || true;
    if (!iterator) {
      return _.reduce(collection, function(accumulator, value){
        if (!_.identity(value)) accumulator = !acc;
        return accumulator;
      }, true);;
    } else {
      return _.reduce(collection, function(accumulator, value){ //the function inside of reduce takes a single value
        if (!iterator(value)) accumulator = !acc;
        return accumulator;
      },acc); //start with true and change to false if we find a single failure
    }
  };

  // Determine whether any of the elements pass a truth test. If no iterator is
  // provided, provide a default one
  _.some = function(collection, iterator) {
    // TIP: There's a very clever way to re-use every() here.
    if (!iterator) iterator = _.identity;

    return _.reduce(collection, function(accumulator, value){
      if (iterator(value)) accumulator = true;
      return accumulator;
    }, false);
    
  };


  /**
   * OBJECTS
   * =======
   *
   * In this section, we'll look at a couple of helpers for merging objects.
   */

  // Extend a given object with all the properties of the passed in
  // object(s).
  // Overwrites existing properties.
  _.extend = function(obj) {
    //we need to access all of the arguments starting at arguments[1], and
    // then use a for...in loop to copy every property.  We should go in order
    // of the passed objs, and then return obj with the alterations.
    //  NOTE: there is no non-mutate clause here. Obj is not returned (?)
    for (let i = 1; i < arguments.length; i++) {//may need to alter the loop conditional
      for (let key in arguments[i]){
        obj[key] = arguments[i][key];
      }
    }
    return obj;
  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj

  _.defaults = function(obj) {
    for (let i = 0; i < arguments.length; i++){
      for (let key in arguments[i]){
        if (!obj.hasOwnProperty(key)) {
          obj[key] = arguments[i][key];
        }
      }
    }
    return obj;
  };


  /**
   * FUNCTIONS
   * =========
   *
   * Now we're getting into function decorators, which take in any function
   * and return out a new version of the function that works somewhat differently
   */

  // Return a function that can be called at most one time. Subsequent calls
  // should return the previously returned value.
  _.once = function(func) {
    // TIP: These variables are stored in a "closure scope" (worth researching),
    // so that they'll remain available to the newly-generated function every
    // time it's called.
    var alreadyCalled = false;
    var result;

    // TIP: We'll return a new function that delegates to the old one, but only
    // if it hasn't been called before.
    return function() {
      if (!alreadyCalled) {
        // TIP: .apply(this, arguments) is the standard way to pass on all of the
        // infromation from one function call to another.
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      // The new function always returns the originally computed result.
      return result;
    };
  };

  // Memorize an expensive function's results by storing them. You may assume
  // that the function only takes primitives as arguments.
  // memoize could be renamed to oncePerUniqueArgumentList; memoize does the
  // same thing as once, but based on many sets of unique arguments.
  //
  // _.memoize should return a function that, when called, will check if it has
  // already computed the result for the given argument and return that value
  // instead if possible.
  _.memoize = function(func) {
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  //
  // The arguments for the original function are passed after the wait
  // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
  // call someFunction('a', 'b') after 500ms
  _.delay = function(func, wait) {
    setTimeout(...arguments);
  };


  /**
   * ADVANCED COLLECTION OPERATIONS
   * ==============================
   */

  // Randomizes the order of an array's contents.
  //
  // TIP: This function's test suite will ask that you not modify the original
  // input array. For a tip on how to make a copy of an array, see:
  // http://mdn.io/Array.prototype.slice
  _.shuffle = function(array) {
    let shuffledArray = [];
    let arrayCopy = array.slice();

    for (let i = arrayCopy.length; i > 0; i--) {
      let sliceIndex = Math.round(Math.random() * arrayCopy.length - 1);
      shuffledArray.push(arrayCopy.splice(sliceIndex, 1)[0]);
    }
    return shuffledArray;
  };


  /**
   * ADVANCED
   * =================
   *
   * Note: This is the end of the pre-course curriculum. Feel free to continue,
   * but nothing beyond here is required.
   */

  // Calls the method named by functionOrKey on each value in the list.
  // Note: You will need to learn a bit about .apply to complete this.
  _.invoke = function(collection, functionOrKey, args) {
  };

  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the name
  // of that string. For example, _.sortBy(people, 'name') should sort
  // an array of people by their name.
  _.sortBy = function(collection, iterator) {
  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  //
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
  _.zip = function() {
  };

  // Takes a multidimensional array and converts it to a one-dimensional array.
  // The new array should contain all elements of the multidimensional array.
  //
  // Hint: Use Array.isArray to check if something is an array
  _.flatten = function(nestedArray, result) {
  };

  // Takes an arbitrary number of arrays and produces an array that contains
  // every item shared between all the passed-in arrays.
  _.intersection = function() {
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.  See the Underbar readme for extra details
  // on this function.
  //
  // Note: This is difficult! It may take a while to implement.
  _.throttle = function(func, wait) {
  };
}());
