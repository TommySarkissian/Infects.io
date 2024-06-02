// Empty constructor for the Util class, all functions will be static.
function Util() {
  throw new Error('Util should not be instantiated!');
}

// Split properties of an object into getters and setters.
Util.splitProperties = function (object, propertyNames, propertyFrom) {
  for (var i = 0; i < propertyNames.length; ++i) {
    (function (j) {
      Object.defineProperty(object, propertyNames[j], {
        enumerable: true,
        configurable: true,
        get: function () {
          return this[propertyFrom][j];
        },
        set: function (property) {
          this[propertyFrom][j] = property;
        }
      });
    })(i);
  }
};

// Implements class inheritance.
Util.extend = function (child, parent) {
  child.prototype = Object.create(parent);
  child.prototype.parent = parent.prototype;
};

// Binds a function to a context.
Util.bind = function (context, method) {
  return function () {
    return method.apply(context, arguments);
  }
};

// Returns the sign of a number.
Util.getSign = function (x) {
  if (x > 0) {
    return 1;
  } else if (x < 0) {
    return -1;
  }
  return 0;
};

// Linearly scales a number from one range to another.
Util.linearScale = function (x, a1, a2, b1, b2) {
  return ((x - a1) * (b2 - b1) / (a2 - a1)) + b1;
};

// Returns the sum of all elements in an array.
Util.sum = function (array) {
  return array.reduce((total, value) => total + value);
}

// Returns the Manhattan Distance between two points.
Util.getManhattanDistance = function (p1, p2) {
  if (p1.length != p2.length) {
    throw new Error(`Cannot compute distance between ${p1} and ${p2}`);
  }
  return Util.sum(p1.map((value, index) => {
    return Math.abs(value - p2[index]);
  }));
};

// Returns the squared Euclidean distance between two points.
Util.getEuclideanDistance2 = function (p1, p2) {
  if (p1.length != p2.length) {
    throw new Error(`Cannot compute distance between ${p1} and ${p2}`);
  }
  return Util.sum(p1.map((value, index) => {
    return (value - p2[index]) * (value - p2[index]);
  }));
};

// Returns the true Euclidean distance between two points.
Util.getEuclideanDistance = function (p1, p2) {
  return Math.sqrt(Util.getEuclideanDistance2(p1, p2));
};

// Checks if a value is within a specified range.
Util.inBound = function (val, min, max) {
  if (min > max) {
    return val >= max && val <= min;
  }
  return val >= min && val <= max;
};

// Bounds a value to a specified range.
Util.bound = function (val, min, max) {
  if (min > max) {
    return Math.min(Math.max(val, max), min);
  }
  return Math.min(Math.max(val, min), max);
};

// Returns a random floating-point number between min and max.
Util.randRange = function (min, max) {
  if (min >= max) {
    var swap = min;
    min = max;
    max = swap;
  }
  return (Math.random() * (max - min)) + min;
};

// Returns a random integer between min and max.
Util.randRangeInt = function (min, max) {
  if (min >= max) {
    var swap = min;
    min = max;
    max = swap;
  }
  return Math.floor(Math.random() * (max - min)) + min;
};

// Returns a random element from an array.
Util.choiceArray = function (array) {
  return array[Util.randRangeInt(0, array.length)];
};

if (typeof module === 'object') {
  module.exports = Util;
} else {
  window.Util = Util;
}
