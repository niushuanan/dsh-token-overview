var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/is-any-array@2.0.1/node_modules/is-any-array/lib/index.js
var require_lib = __commonJS({
  "node_modules/.pnpm/is-any-array@2.0.1/node_modules/is-any-array/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isAnyArray = void 0;
    var toString = Object.prototype.toString;
    function isAnyArray(value) {
      const tag = toString.call(value);
      return tag.endsWith("Array]") && !tag.includes("Big");
    }
    exports.isAnyArray = isAnyArray;
  }
});

// node_modules/.pnpm/ml-array-mode@1.1.5/node_modules/ml-array-mode/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/.pnpm/ml-array-mode@1.1.5/node_modules/ml-array-mode/lib/index.js"(exports, module) {
    "use strict";
    var isAnyArray = require_lib();
    function mode(input) {
      if (!isAnyArray.isAnyArray(input)) {
        throw new TypeError("input must be an array");
      }
      if (input.length === 0) {
        throw new TypeError("input must not be empty");
      }
      let maxValue = 0;
      let maxCount = 0;
      let count = 0;
      let counts = {};
      for (let i = 0; i < input.length; ++i) {
        let element = input[i];
        count = counts[element];
        if (count) {
          counts[element]++;
          count++;
        } else {
          counts[element] = count = 1;
        }
        if (count > maxCount) {
          maxCount = count;
          maxValue = input[i];
        }
      }
      return maxValue;
    }
    module.exports = mode;
  }
});

// node_modules/.pnpm/ml-matrix@6.15.0/node_modules/ml-matrix/matrix.js
var require_matrix = __commonJS({
  "node_modules/.pnpm/ml-matrix@6.15.0/node_modules/ml-matrix/matrix.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var toString = Object.prototype.toString;
    function isAnyArray(value) {
      const tag = toString.call(value);
      return tag.endsWith("Array]") && !tag.includes("Big");
    }
    function max(input, options = {}) {
      if (!isAnyArray(input)) {
        throw new TypeError("input must be an array");
      }
      if (input.length === 0) {
        throw new TypeError("input must not be empty");
      }
      const { fromIndex = 0, toIndex = input.length } = options;
      if (fromIndex < 0 || fromIndex >= input.length || !Number.isInteger(fromIndex)) {
        throw new Error("fromIndex must be a positive integer smaller than length");
      }
      if (toIndex <= fromIndex || toIndex > input.length || !Number.isInteger(toIndex)) {
        throw new Error("toIndex must be an integer greater than fromIndex and at most equal to length");
      }
      let maxValue = input[fromIndex];
      for (let i = fromIndex + 1; i < toIndex; i++) {
        if (input[i] > maxValue)
          maxValue = input[i];
      }
      return maxValue;
    }
    function min(input, options = {}) {
      if (!isAnyArray(input)) {
        throw new TypeError("input must be an array");
      }
      if (input.length === 0) {
        throw new TypeError("input must not be empty");
      }
      const { fromIndex = 0, toIndex = input.length } = options;
      if (fromIndex < 0 || fromIndex >= input.length || !Number.isInteger(fromIndex)) {
        throw new Error("fromIndex must be a positive integer smaller than length");
      }
      if (toIndex <= fromIndex || toIndex > input.length || !Number.isInteger(toIndex)) {
        throw new Error("toIndex must be an integer greater than fromIndex and at most equal to length");
      }
      let minValue = input[fromIndex];
      for (let i = fromIndex + 1; i < toIndex; i++) {
        if (input[i] < minValue)
          minValue = input[i];
      }
      return minValue;
    }
    function rescale(input, options = {}) {
      if (!isAnyArray(input)) {
        throw new TypeError("input must be an array");
      } else if (input.length === 0) {
        throw new TypeError("input must not be empty");
      }
      let output;
      if (options.output !== void 0) {
        if (!isAnyArray(options.output)) {
          throw new TypeError("output option must be an array if specified");
        }
        output = options.output;
      } else {
        output = new Array(input.length);
      }
      const currentMin = min(input);
      const currentMax = max(input);
      if (currentMin === currentMax) {
        throw new RangeError("minimum and maximum input values are equal. Cannot rescale a constant array");
      }
      const { min: minValue = options.autoMinMax ? currentMin : 0, max: maxValue = options.autoMinMax ? currentMax : 1 } = options;
      if (minValue >= maxValue) {
        throw new RangeError("min option must be smaller than max option");
      }
      const factor = (maxValue - minValue) / (currentMax - currentMin);
      for (let i = 0; i < input.length; i++) {
        output[i] = (input[i] - currentMin) * factor + minValue;
      }
      return output;
    }
    var indent = " ".repeat(2);
    var indentData = " ".repeat(4);
    function inspectMatrix() {
      return inspectMatrixWithOptions(this);
    }
    function inspectMatrixWithOptions(matrix, options = {}) {
      const {
        maxRows = 15,
        maxColumns = 10,
        maxNumSize = 8,
        padMinus = "auto"
      } = options;
      return `${matrix.constructor.name} {
${indent}[
${indentData}${inspectData(matrix, maxRows, maxColumns, maxNumSize, padMinus)}
${indent}]
${indent}rows: ${matrix.rows}
${indent}columns: ${matrix.columns}
}`;
    }
    function inspectData(matrix, maxRows, maxColumns, maxNumSize, padMinus) {
      const { rows, columns } = matrix;
      const maxI = Math.min(rows, maxRows);
      const maxJ = Math.min(columns, maxColumns);
      const result = [];
      if (padMinus === "auto") {
        padMinus = false;
        loop: for (let i = 0; i < maxI; i++) {
          for (let j = 0; j < maxJ; j++) {
            if (matrix.get(i, j) < 0) {
              padMinus = true;
              break loop;
            }
          }
        }
      }
      for (let i = 0; i < maxI; i++) {
        let line = [];
        for (let j = 0; j < maxJ; j++) {
          line.push(formatNumber(matrix.get(i, j), maxNumSize, padMinus));
        }
        result.push(`${line.join(" ")}`);
      }
      if (maxJ !== columns) {
        result[result.length - 1] += ` ... ${columns - maxColumns} more columns`;
      }
      if (maxI !== rows) {
        result.push(`... ${rows - maxRows} more rows`);
      }
      return result.join(`
${indentData}`);
    }
    function formatNumber(num, maxNumSize, padMinus) {
      return (num >= 0 && padMinus ? ` ${formatNumber2(num, maxNumSize - 1)}` : formatNumber2(num, maxNumSize)).padEnd(maxNumSize);
    }
    function formatNumber2(num, len) {
      let str = num.toString();
      if (str.length <= len) return str;
      let fix = num.toFixed(len);
      if (fix.length > len) {
        fix = num.toFixed(Math.max(0, len - (fix.length - len)));
      }
      if (fix.length <= len && !fix.startsWith("0.000") && !fix.startsWith("-0.000")) {
        return fix;
      }
      let exp = num.toExponential(len);
      if (exp.length > len) {
        exp = num.toExponential(Math.max(0, len - (exp.length - len)));
      }
      return exp.slice(0);
    }
    function installMathOperations(AbstractMatrix2, Matrix2) {
      AbstractMatrix2.prototype.add = function add(value) {
        if (typeof value === "number") return this.addS(value);
        return this.addM(value);
      };
      AbstractMatrix2.prototype.addS = function addS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) + value);
          }
        }
        return this;
      };
      AbstractMatrix2.prototype.addM = function addM(matrix) {
        matrix = Matrix2.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError("Matrices dimensions must be equal");
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) + matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix2.add = function add(matrix, value) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.add(value);
      };
      AbstractMatrix2.prototype.sub = function sub(value) {
        if (typeof value === "number") return this.subS(value);
        return this.subM(value);
      };
      AbstractMatrix2.prototype.subS = function subS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) - value);
          }
        }
        return this;
      };
      AbstractMatrix2.prototype.subM = function subM(matrix) {
        matrix = Matrix2.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError("Matrices dimensions must be equal");
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) - matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix2.sub = function sub(matrix, value) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.sub(value);
      };
      AbstractMatrix2.prototype.subtract = AbstractMatrix2.prototype.sub;
      AbstractMatrix2.prototype.subtractS = AbstractMatrix2.prototype.subS;
      AbstractMatrix2.prototype.subtractM = AbstractMatrix2.prototype.subM;
      AbstractMatrix2.subtract = AbstractMatrix2.sub;
      AbstractMatrix2.prototype.mul = function mul(value) {
        if (typeof value === "number") return this.mulS(value);
        return this.mulM(value);
      };
      AbstractMatrix2.prototype.mulS = function mulS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) * value);
          }
        }
        return this;
      };
      AbstractMatrix2.prototype.mulM = function mulM(matrix) {
        matrix = Matrix2.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError("Matrices dimensions must be equal");
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) * matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix2.mul = function mul(matrix, value) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.mul(value);
      };
      AbstractMatrix2.prototype.multiply = AbstractMatrix2.prototype.mul;
      AbstractMatrix2.prototype.multiplyS = AbstractMatrix2.prototype.mulS;
      AbstractMatrix2.prototype.multiplyM = AbstractMatrix2.prototype.mulM;
      AbstractMatrix2.multiply = AbstractMatrix2.mul;
      AbstractMatrix2.prototype.div = function div(value) {
        if (typeof value === "number") return this.divS(value);
        return this.divM(value);
      };
      AbstractMatrix2.prototype.divS = function divS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) / value);
          }
        }
        return this;
      };
      AbstractMatrix2.prototype.divM = function divM(matrix) {
        matrix = Matrix2.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError("Matrices dimensions must be equal");
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) / matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix2.div = function div(matrix, value) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.div(value);
      };
      AbstractMatrix2.prototype.divide = AbstractMatrix2.prototype.div;
      AbstractMatrix2.prototype.divideS = AbstractMatrix2.prototype.divS;
      AbstractMatrix2.prototype.divideM = AbstractMatrix2.prototype.divM;
      AbstractMatrix2.divide = AbstractMatrix2.div;
      AbstractMatrix2.prototype.mod = function mod(value) {
        if (typeof value === "number") return this.modS(value);
        return this.modM(value);
      };
      AbstractMatrix2.prototype.modS = function modS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) % value);
          }
        }
        return this;
      };
      AbstractMatrix2.prototype.modM = function modM(matrix) {
        matrix = Matrix2.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError("Matrices dimensions must be equal");
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) % matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix2.mod = function mod(matrix, value) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.mod(value);
      };
      AbstractMatrix2.prototype.modulus = AbstractMatrix2.prototype.mod;
      AbstractMatrix2.prototype.modulusS = AbstractMatrix2.prototype.modS;
      AbstractMatrix2.prototype.modulusM = AbstractMatrix2.prototype.modM;
      AbstractMatrix2.modulus = AbstractMatrix2.mod;
      AbstractMatrix2.prototype.and = function and(value) {
        if (typeof value === "number") return this.andS(value);
        return this.andM(value);
      };
      AbstractMatrix2.prototype.andS = function andS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) & value);
          }
        }
        return this;
      };
      AbstractMatrix2.prototype.andM = function andM(matrix) {
        matrix = Matrix2.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError("Matrices dimensions must be equal");
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) & matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix2.and = function and(matrix, value) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.and(value);
      };
      AbstractMatrix2.prototype.or = function or(value) {
        if (typeof value === "number") return this.orS(value);
        return this.orM(value);
      };
      AbstractMatrix2.prototype.orS = function orS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) | value);
          }
        }
        return this;
      };
      AbstractMatrix2.prototype.orM = function orM(matrix) {
        matrix = Matrix2.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError("Matrices dimensions must be equal");
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) | matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix2.or = function or(matrix, value) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.or(value);
      };
      AbstractMatrix2.prototype.xor = function xor(value) {
        if (typeof value === "number") return this.xorS(value);
        return this.xorM(value);
      };
      AbstractMatrix2.prototype.xorS = function xorS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) ^ value);
          }
        }
        return this;
      };
      AbstractMatrix2.prototype.xorM = function xorM(matrix) {
        matrix = Matrix2.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError("Matrices dimensions must be equal");
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) ^ matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix2.xor = function xor(matrix, value) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.xor(value);
      };
      AbstractMatrix2.prototype.leftShift = function leftShift(value) {
        if (typeof value === "number") return this.leftShiftS(value);
        return this.leftShiftM(value);
      };
      AbstractMatrix2.prototype.leftShiftS = function leftShiftS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) << value);
          }
        }
        return this;
      };
      AbstractMatrix2.prototype.leftShiftM = function leftShiftM(matrix) {
        matrix = Matrix2.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError("Matrices dimensions must be equal");
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) << matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix2.leftShift = function leftShift(matrix, value) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.leftShift(value);
      };
      AbstractMatrix2.prototype.signPropagatingRightShift = function signPropagatingRightShift(value) {
        if (typeof value === "number") return this.signPropagatingRightShiftS(value);
        return this.signPropagatingRightShiftM(value);
      };
      AbstractMatrix2.prototype.signPropagatingRightShiftS = function signPropagatingRightShiftS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) >> value);
          }
        }
        return this;
      };
      AbstractMatrix2.prototype.signPropagatingRightShiftM = function signPropagatingRightShiftM(matrix) {
        matrix = Matrix2.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError("Matrices dimensions must be equal");
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) >> matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix2.signPropagatingRightShift = function signPropagatingRightShift(matrix, value) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.signPropagatingRightShift(value);
      };
      AbstractMatrix2.prototype.rightShift = function rightShift(value) {
        if (typeof value === "number") return this.rightShiftS(value);
        return this.rightShiftM(value);
      };
      AbstractMatrix2.prototype.rightShiftS = function rightShiftS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) >>> value);
          }
        }
        return this;
      };
      AbstractMatrix2.prototype.rightShiftM = function rightShiftM(matrix) {
        matrix = Matrix2.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError("Matrices dimensions must be equal");
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) >>> matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix2.rightShift = function rightShift(matrix, value) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.rightShift(value);
      };
      AbstractMatrix2.prototype.zeroFillRightShift = AbstractMatrix2.prototype.rightShift;
      AbstractMatrix2.prototype.zeroFillRightShiftS = AbstractMatrix2.prototype.rightShiftS;
      AbstractMatrix2.prototype.zeroFillRightShiftM = AbstractMatrix2.prototype.rightShiftM;
      AbstractMatrix2.zeroFillRightShift = AbstractMatrix2.rightShift;
      AbstractMatrix2.prototype.not = function not() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, ~this.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix2.not = function not(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.not();
      };
      AbstractMatrix2.prototype.abs = function abs() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.abs(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.abs = function abs(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.abs();
      };
      AbstractMatrix2.prototype.acos = function acos() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.acos(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.acos = function acos(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.acos();
      };
      AbstractMatrix2.prototype.acosh = function acosh() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.acosh(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.acosh = function acosh(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.acosh();
      };
      AbstractMatrix2.prototype.asin = function asin() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.asin(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.asin = function asin(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.asin();
      };
      AbstractMatrix2.prototype.asinh = function asinh() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.asinh(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.asinh = function asinh(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.asinh();
      };
      AbstractMatrix2.prototype.atan = function atan() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.atan(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.atan = function atan(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.atan();
      };
      AbstractMatrix2.prototype.atanh = function atanh() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.atanh(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.atanh = function atanh(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.atanh();
      };
      AbstractMatrix2.prototype.cbrt = function cbrt() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.cbrt(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.cbrt = function cbrt(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.cbrt();
      };
      AbstractMatrix2.prototype.ceil = function ceil() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.ceil(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.ceil = function ceil(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.ceil();
      };
      AbstractMatrix2.prototype.clz32 = function clz32() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.clz32(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.clz32 = function clz32(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.clz32();
      };
      AbstractMatrix2.prototype.cos = function cos() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.cos(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.cos = function cos(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.cos();
      };
      AbstractMatrix2.prototype.cosh = function cosh() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.cosh(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.cosh = function cosh(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.cosh();
      };
      AbstractMatrix2.prototype.exp = function exp() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.exp(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.exp = function exp(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.exp();
      };
      AbstractMatrix2.prototype.expm1 = function expm1() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.expm1(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.expm1 = function expm1(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.expm1();
      };
      AbstractMatrix2.prototype.floor = function floor() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.floor(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.floor = function floor(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.floor();
      };
      AbstractMatrix2.prototype.fround = function fround() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.fround(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.fround = function fround(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.fround();
      };
      AbstractMatrix2.prototype.log = function log() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.log(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.log = function log(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.log();
      };
      AbstractMatrix2.prototype.log1p = function log1p() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.log1p(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.log1p = function log1p(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.log1p();
      };
      AbstractMatrix2.prototype.log10 = function log10() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.log10(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.log10 = function log10(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.log10();
      };
      AbstractMatrix2.prototype.log2 = function log2() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.log2(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.log2 = function log2(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.log2();
      };
      AbstractMatrix2.prototype.round = function round() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.round(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.round = function round(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.round();
      };
      AbstractMatrix2.prototype.sign = function sign() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.sign(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.sign = function sign(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.sign();
      };
      AbstractMatrix2.prototype.sin = function sin() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.sin(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.sin = function sin(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.sin();
      };
      AbstractMatrix2.prototype.sinh = function sinh() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.sinh(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.sinh = function sinh(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.sinh();
      };
      AbstractMatrix2.prototype.sqrt = function sqrt() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.sqrt(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.sqrt = function sqrt(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.sqrt();
      };
      AbstractMatrix2.prototype.tan = function tan() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.tan(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.tan = function tan(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.tan();
      };
      AbstractMatrix2.prototype.tanh = function tanh() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.tanh(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.tanh = function tanh(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.tanh();
      };
      AbstractMatrix2.prototype.trunc = function trunc() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.trunc(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix2.trunc = function trunc(matrix) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.trunc();
      };
      AbstractMatrix2.pow = function pow(matrix, arg0) {
        const newMatrix = new Matrix2(matrix);
        return newMatrix.pow(arg0);
      };
      AbstractMatrix2.prototype.pow = function pow(value) {
        if (typeof value === "number") return this.powS(value);
        return this.powM(value);
      };
      AbstractMatrix2.prototype.powS = function powS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) ** value);
          }
        }
        return this;
      };
      AbstractMatrix2.prototype.powM = function powM(matrix) {
        matrix = Matrix2.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError("Matrices dimensions must be equal");
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) ** matrix.get(i, j));
          }
        }
        return this;
      };
    }
    function checkRowIndex(matrix, index, outer) {
      let max2 = outer ? matrix.rows : matrix.rows - 1;
      if (index < 0 || index > max2) {
        throw new RangeError("Row index out of range");
      }
    }
    function checkColumnIndex(matrix, index, outer) {
      let max2 = outer ? matrix.columns : matrix.columns - 1;
      if (index < 0 || index > max2) {
        throw new RangeError("Column index out of range");
      }
    }
    function checkRowVector(matrix, vector) {
      if (vector.to1DArray) {
        vector = vector.to1DArray();
      }
      if (vector.length !== matrix.columns) {
        throw new RangeError(
          "vector size must be the same as the number of columns"
        );
      }
      return vector;
    }
    function checkColumnVector(matrix, vector) {
      if (vector.to1DArray) {
        vector = vector.to1DArray();
      }
      if (vector.length !== matrix.rows) {
        throw new RangeError("vector size must be the same as the number of rows");
      }
      return vector;
    }
    function checkRowIndices(matrix, rowIndices) {
      if (!isAnyArray(rowIndices)) {
        throw new TypeError("row indices must be an array");
      }
      for (let i = 0; i < rowIndices.length; i++) {
        if (rowIndices[i] < 0 || rowIndices[i] >= matrix.rows) {
          throw new RangeError("row indices are out of range");
        }
      }
    }
    function checkColumnIndices(matrix, columnIndices) {
      if (!isAnyArray(columnIndices)) {
        throw new TypeError("column indices must be an array");
      }
      for (let i = 0; i < columnIndices.length; i++) {
        if (columnIndices[i] < 0 || columnIndices[i] >= matrix.columns) {
          throw new RangeError("column indices are out of range");
        }
      }
    }
    function checkRange(matrix, startRow, endRow, startColumn, endColumn) {
      if (arguments.length !== 5) {
        throw new RangeError("expected 4 arguments");
      }
      checkNumber("startRow", startRow);
      checkNumber("endRow", endRow);
      checkNumber("startColumn", startColumn);
      checkNumber("endColumn", endColumn);
      if (startRow > endRow || startColumn > endColumn || startRow < 0 || startRow >= matrix.rows || endRow < 0 || endRow >= matrix.rows || startColumn < 0 || startColumn >= matrix.columns || endColumn < 0 || endColumn >= matrix.columns) {
        throw new RangeError("Submatrix indices are out of range");
      }
    }
    function newArray(length, value = 0) {
      let array = [];
      for (let i = 0; i < length; i++) {
        array.push(value);
      }
      return array;
    }
    function checkNumber(name, value) {
      if (typeof value !== "number") {
        throw new TypeError(`${name} must be a number`);
      }
    }
    function checkNonEmpty(matrix) {
      if (matrix.isEmpty()) {
        throw new Error("Empty matrix has no elements to index");
      }
    }
    function sumByRow(matrix) {
      let sum2 = newArray(matrix.rows);
      for (let i = 0; i < matrix.rows; ++i) {
        for (let j = 0; j < matrix.columns; ++j) {
          sum2[i] += matrix.get(i, j);
        }
      }
      return sum2;
    }
    function sumByColumn(matrix) {
      let sum2 = newArray(matrix.columns);
      for (let i = 0; i < matrix.rows; ++i) {
        for (let j = 0; j < matrix.columns; ++j) {
          sum2[j] += matrix.get(i, j);
        }
      }
      return sum2;
    }
    function sumAll(matrix) {
      let v = 0;
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          v += matrix.get(i, j);
        }
      }
      return v;
    }
    function productByRow(matrix) {
      let sum2 = newArray(matrix.rows, 1);
      for (let i = 0; i < matrix.rows; ++i) {
        for (let j = 0; j < matrix.columns; ++j) {
          sum2[i] *= matrix.get(i, j);
        }
      }
      return sum2;
    }
    function productByColumn(matrix) {
      let sum2 = newArray(matrix.columns, 1);
      for (let i = 0; i < matrix.rows; ++i) {
        for (let j = 0; j < matrix.columns; ++j) {
          sum2[j] *= matrix.get(i, j);
        }
      }
      return sum2;
    }
    function productAll(matrix) {
      let v = 1;
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          v *= matrix.get(i, j);
        }
      }
      return v;
    }
    function varianceByRow(matrix, unbiased, mean2) {
      const rows = matrix.rows;
      const cols = matrix.columns;
      const variance = [];
      for (let i = 0; i < rows; i++) {
        let sum1 = 0;
        let sum2 = 0;
        let x = 0;
        for (let j = 0; j < cols; j++) {
          x = matrix.get(i, j) - mean2[i];
          sum1 += x;
          sum2 += x * x;
        }
        if (unbiased) {
          variance.push((sum2 - sum1 * sum1 / cols) / (cols - 1));
        } else {
          variance.push((sum2 - sum1 * sum1 / cols) / cols);
        }
      }
      return variance;
    }
    function varianceByColumn(matrix, unbiased, mean2) {
      const rows = matrix.rows;
      const cols = matrix.columns;
      const variance = [];
      for (let j = 0; j < cols; j++) {
        let sum1 = 0;
        let sum2 = 0;
        let x = 0;
        for (let i = 0; i < rows; i++) {
          x = matrix.get(i, j) - mean2[j];
          sum1 += x;
          sum2 += x * x;
        }
        if (unbiased) {
          variance.push((sum2 - sum1 * sum1 / rows) / (rows - 1));
        } else {
          variance.push((sum2 - sum1 * sum1 / rows) / rows);
        }
      }
      return variance;
    }
    function varianceAll(matrix, unbiased, mean2) {
      const rows = matrix.rows;
      const cols = matrix.columns;
      const size = rows * cols;
      let sum1 = 0;
      let sum2 = 0;
      let x = 0;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          x = matrix.get(i, j) - mean2;
          sum1 += x;
          sum2 += x * x;
        }
      }
      if (unbiased) {
        return (sum2 - sum1 * sum1 / size) / (size - 1);
      } else {
        return (sum2 - sum1 * sum1 / size) / size;
      }
    }
    function centerByRow(matrix, mean2) {
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          matrix.set(i, j, matrix.get(i, j) - mean2[i]);
        }
      }
    }
    function centerByColumn(matrix, mean2) {
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          matrix.set(i, j, matrix.get(i, j) - mean2[j]);
        }
      }
    }
    function centerAll(matrix, mean2) {
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          matrix.set(i, j, matrix.get(i, j) - mean2);
        }
      }
    }
    function getScaleByRow(matrix) {
      const scale = [];
      for (let i = 0; i < matrix.rows; i++) {
        let sum2 = 0;
        for (let j = 0; j < matrix.columns; j++) {
          sum2 += matrix.get(i, j) ** 2 / (matrix.columns - 1);
        }
        scale.push(Math.sqrt(sum2));
      }
      return scale;
    }
    function scaleByRow(matrix, scale) {
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          matrix.set(i, j, matrix.get(i, j) / scale[i]);
        }
      }
    }
    function getScaleByColumn(matrix) {
      const scale = [];
      for (let j = 0; j < matrix.columns; j++) {
        let sum2 = 0;
        for (let i = 0; i < matrix.rows; i++) {
          sum2 += matrix.get(i, j) ** 2 / (matrix.rows - 1);
        }
        scale.push(Math.sqrt(sum2));
      }
      return scale;
    }
    function scaleByColumn(matrix, scale) {
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          matrix.set(i, j, matrix.get(i, j) / scale[j]);
        }
      }
    }
    function getScaleAll(matrix) {
      const divider = matrix.size - 1;
      let sum2 = 0;
      for (let j = 0; j < matrix.columns; j++) {
        for (let i = 0; i < matrix.rows; i++) {
          sum2 += matrix.get(i, j) ** 2 / divider;
        }
      }
      return Math.sqrt(sum2);
    }
    function scaleAll(matrix, scale) {
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          matrix.set(i, j, matrix.get(i, j) / scale);
        }
      }
    }
    var AbstractMatrix = class _AbstractMatrix {
      static from1DArray(newRows, newColumns, newData) {
        let length = newRows * newColumns;
        if (length !== newData.length) {
          throw new RangeError("data length does not match given dimensions");
        }
        let newMatrix = new Matrix(newRows, newColumns);
        for (let row = 0; row < newRows; row++) {
          for (let column = 0; column < newColumns; column++) {
            newMatrix.set(row, column, newData[row * newColumns + column]);
          }
        }
        return newMatrix;
      }
      static rowVector(newData) {
        let vector = new Matrix(1, newData.length);
        for (let i = 0; i < newData.length; i++) {
          vector.set(0, i, newData[i]);
        }
        return vector;
      }
      static columnVector(newData) {
        let vector = new Matrix(newData.length, 1);
        for (let i = 0; i < newData.length; i++) {
          vector.set(i, 0, newData[i]);
        }
        return vector;
      }
      static zeros(rows, columns) {
        return new Matrix(rows, columns);
      }
      static ones(rows, columns) {
        return new Matrix(rows, columns).fill(1);
      }
      static rand(rows, columns, options = {}) {
        if (typeof options !== "object") {
          throw new TypeError("options must be an object");
        }
        const { random = Math.random } = options;
        let matrix = new Matrix(rows, columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            matrix.set(i, j, random());
          }
        }
        return matrix;
      }
      static randInt(rows, columns, options = {}) {
        if (typeof options !== "object") {
          throw new TypeError("options must be an object");
        }
        const { min: min2 = 0, max: max2 = 1e3, random = Math.random } = options;
        if (!Number.isInteger(min2)) throw new TypeError("min must be an integer");
        if (!Number.isInteger(max2)) throw new TypeError("max must be an integer");
        if (min2 >= max2) throw new RangeError("min must be smaller than max");
        let interval = max2 - min2;
        let matrix = new Matrix(rows, columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            let value = min2 + Math.round(random() * interval);
            matrix.set(i, j, value);
          }
        }
        return matrix;
      }
      static eye(rows, columns, value) {
        if (columns === void 0) columns = rows;
        if (value === void 0) value = 1;
        let min2 = Math.min(rows, columns);
        let matrix = this.zeros(rows, columns);
        for (let i = 0; i < min2; i++) {
          matrix.set(i, i, value);
        }
        return matrix;
      }
      static diag(data, rows, columns) {
        let l = data.length;
        if (rows === void 0) rows = l;
        if (columns === void 0) columns = rows;
        let min2 = Math.min(l, rows, columns);
        let matrix = this.zeros(rows, columns);
        for (let i = 0; i < min2; i++) {
          matrix.set(i, i, data[i]);
        }
        return matrix;
      }
      static min(matrix1, matrix2) {
        matrix1 = this.checkMatrix(matrix1);
        matrix2 = this.checkMatrix(matrix2);
        let rows = matrix1.rows;
        let columns = matrix1.columns;
        let result = new Matrix(rows, columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            result.set(i, j, Math.min(matrix1.get(i, j), matrix2.get(i, j)));
          }
        }
        return result;
      }
      static max(matrix1, matrix2) {
        matrix1 = this.checkMatrix(matrix1);
        matrix2 = this.checkMatrix(matrix2);
        let rows = matrix1.rows;
        let columns = matrix1.columns;
        let result = new this(rows, columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            result.set(i, j, Math.max(matrix1.get(i, j), matrix2.get(i, j)));
          }
        }
        return result;
      }
      static checkMatrix(value) {
        return _AbstractMatrix.isMatrix(value) ? value : new Matrix(value);
      }
      static isMatrix(value) {
        return value != null && value.klass === "Matrix";
      }
      get size() {
        return this.rows * this.columns;
      }
      apply(callback) {
        if (typeof callback !== "function") {
          throw new TypeError("callback must be a function");
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            callback.call(this, i, j);
          }
        }
        return this;
      }
      applyAlongAxis(callback, by) {
        if (typeof callback !== "function") {
          throw new TypeError("callback must be a function");
        }
        const result = [];
        switch (by) {
          case "row": {
            for (let i = 0; i < this.rows; i++) {
              result.push(callback.call(this, this.getRow(i), i));
            }
            break;
          }
          case "column": {
            for (let i = 0; i < this.columns; i++) {
              result.push(callback.call(this, this.getColumn(i), i));
            }
            break;
          }
          default:
            throw new Error(`invalid option: ${by}`);
        }
        return result;
      }
      to1DArray() {
        let array = [];
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            array.push(this.get(i, j));
          }
        }
        return array;
      }
      to2DArray() {
        let copy = [];
        for (let i = 0; i < this.rows; i++) {
          copy.push([]);
          for (let j = 0; j < this.columns; j++) {
            copy[i].push(this.get(i, j));
          }
        }
        return copy;
      }
      toJSON() {
        return this.to2DArray();
      }
      isRowVector() {
        return this.rows === 1;
      }
      isColumnVector() {
        return this.columns === 1;
      }
      isVector() {
        return this.rows === 1 || this.columns === 1;
      }
      isSquare() {
        return this.rows === this.columns;
      }
      isEmpty() {
        return this.rows === 0 || this.columns === 0;
      }
      isSymmetric() {
        if (this.isSquare()) {
          for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j <= i; j++) {
              if (this.get(i, j) !== this.get(j, i)) {
                return false;
              }
            }
          }
          return true;
        }
        return false;
      }
      isDistance() {
        if (!this.isSymmetric()) return false;
        for (let i = 0; i < this.rows; i++) {
          if (this.get(i, i) !== 0) return false;
        }
        return true;
      }
      isEchelonForm() {
        let i = 0;
        let j = 0;
        let previousColumn = -1;
        let isEchelonForm = true;
        let checked = false;
        while (i < this.rows && isEchelonForm) {
          j = 0;
          checked = false;
          while (j < this.columns && checked === false) {
            if (this.get(i, j) === 0) {
              j++;
            } else if (this.get(i, j) === 1 && j > previousColumn) {
              checked = true;
              previousColumn = j;
            } else {
              isEchelonForm = false;
              checked = true;
            }
          }
          i++;
        }
        return isEchelonForm;
      }
      isReducedEchelonForm() {
        let i = 0;
        let j = 0;
        let previousColumn = -1;
        let isReducedEchelonForm = true;
        let checked = false;
        while (i < this.rows && isReducedEchelonForm) {
          j = 0;
          checked = false;
          while (j < this.columns && checked === false) {
            if (this.get(i, j) === 0) {
              j++;
            } else if (this.get(i, j) === 1 && j > previousColumn) {
              checked = true;
              previousColumn = j;
            } else {
              isReducedEchelonForm = false;
              checked = true;
            }
          }
          for (let k = j + 1; k < this.rows; k++) {
            if (this.get(i, k) !== 0) {
              isReducedEchelonForm = false;
            }
          }
          i++;
        }
        return isReducedEchelonForm;
      }
      echelonForm() {
        let result = this.clone();
        let h = 0;
        let k = 0;
        while (h < result.rows && k < result.columns) {
          let iMax = h;
          for (let i = h; i < result.rows; i++) {
            if (result.get(i, k) > result.get(iMax, k)) {
              iMax = i;
            }
          }
          if (result.get(iMax, k) === 0) {
            k++;
          } else {
            result.swapRows(h, iMax);
            let tmp = result.get(h, k);
            for (let j = k; j < result.columns; j++) {
              result.set(h, j, result.get(h, j) / tmp);
            }
            for (let i = h + 1; i < result.rows; i++) {
              let factor = result.get(i, k) / result.get(h, k);
              result.set(i, k, 0);
              for (let j = k + 1; j < result.columns; j++) {
                result.set(i, j, result.get(i, j) - result.get(h, j) * factor);
              }
            }
            h++;
            k++;
          }
        }
        return result;
      }
      reducedEchelonForm() {
        let result = this.echelonForm();
        let m = result.columns;
        let n = result.rows;
        let h = n - 1;
        while (h >= 0) {
          if (result.maxRow(h) === 0) {
            h--;
          } else {
            let p = 0;
            let pivot = false;
            while (p < n && pivot === false) {
              if (result.get(h, p) === 1) {
                pivot = true;
              } else {
                p++;
              }
            }
            for (let i = 0; i < h; i++) {
              let factor = result.get(i, p);
              for (let j = p; j < m; j++) {
                let tmp = result.get(i, j) - factor * result.get(h, j);
                result.set(i, j, tmp);
              }
            }
            h--;
          }
        }
        return result;
      }
      set() {
        throw new Error("set method is unimplemented");
      }
      get() {
        throw new Error("get method is unimplemented");
      }
      repeat(options = {}) {
        if (typeof options !== "object") {
          throw new TypeError("options must be an object");
        }
        const { rows = 1, columns = 1 } = options;
        if (!Number.isInteger(rows) || rows <= 0) {
          throw new TypeError("rows must be a positive integer");
        }
        if (!Number.isInteger(columns) || columns <= 0) {
          throw new TypeError("columns must be a positive integer");
        }
        let matrix = new Matrix(this.rows * rows, this.columns * columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            matrix.setSubMatrix(this, this.rows * i, this.columns * j);
          }
        }
        return matrix;
      }
      fill(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, value);
          }
        }
        return this;
      }
      neg() {
        return this.mulS(-1);
      }
      getRow(index) {
        checkRowIndex(this, index);
        let row = [];
        for (let i = 0; i < this.columns; i++) {
          row.push(this.get(index, i));
        }
        return row;
      }
      getRowVector(index) {
        return Matrix.rowVector(this.getRow(index));
      }
      setRow(index, array) {
        checkRowIndex(this, index);
        array = checkRowVector(this, array);
        for (let i = 0; i < this.columns; i++) {
          this.set(index, i, array[i]);
        }
        return this;
      }
      swapRows(row1, row2) {
        checkRowIndex(this, row1);
        checkRowIndex(this, row2);
        for (let i = 0; i < this.columns; i++) {
          let temp = this.get(row1, i);
          this.set(row1, i, this.get(row2, i));
          this.set(row2, i, temp);
        }
        return this;
      }
      getColumn(index) {
        checkColumnIndex(this, index);
        let column = [];
        for (let i = 0; i < this.rows; i++) {
          column.push(this.get(i, index));
        }
        return column;
      }
      getColumnVector(index) {
        return Matrix.columnVector(this.getColumn(index));
      }
      setColumn(index, array) {
        checkColumnIndex(this, index);
        array = checkColumnVector(this, array);
        for (let i = 0; i < this.rows; i++) {
          this.set(i, index, array[i]);
        }
        return this;
      }
      swapColumns(column1, column2) {
        checkColumnIndex(this, column1);
        checkColumnIndex(this, column2);
        for (let i = 0; i < this.rows; i++) {
          let temp = this.get(i, column1);
          this.set(i, column1, this.get(i, column2));
          this.set(i, column2, temp);
        }
        return this;
      }
      addRowVector(vector) {
        vector = checkRowVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) + vector[j]);
          }
        }
        return this;
      }
      subRowVector(vector) {
        vector = checkRowVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) - vector[j]);
          }
        }
        return this;
      }
      mulRowVector(vector) {
        vector = checkRowVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) * vector[j]);
          }
        }
        return this;
      }
      divRowVector(vector) {
        vector = checkRowVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) / vector[j]);
          }
        }
        return this;
      }
      addColumnVector(vector) {
        vector = checkColumnVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) + vector[i]);
          }
        }
        return this;
      }
      subColumnVector(vector) {
        vector = checkColumnVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) - vector[i]);
          }
        }
        return this;
      }
      mulColumnVector(vector) {
        vector = checkColumnVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) * vector[i]);
          }
        }
        return this;
      }
      divColumnVector(vector) {
        vector = checkColumnVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) / vector[i]);
          }
        }
        return this;
      }
      mulRow(index, value) {
        checkRowIndex(this, index);
        for (let i = 0; i < this.columns; i++) {
          this.set(index, i, this.get(index, i) * value);
        }
        return this;
      }
      mulColumn(index, value) {
        checkColumnIndex(this, index);
        for (let i = 0; i < this.rows; i++) {
          this.set(i, index, this.get(i, index) * value);
        }
        return this;
      }
      max(by) {
        if (this.isEmpty()) {
          return NaN;
        }
        switch (by) {
          case "row": {
            const max2 = new Array(this.rows).fill(Number.NEGATIVE_INFINITY);
            for (let row = 0; row < this.rows; row++) {
              for (let column = 0; column < this.columns; column++) {
                if (this.get(row, column) > max2[row]) {
                  max2[row] = this.get(row, column);
                }
              }
            }
            return max2;
          }
          case "column": {
            const max2 = new Array(this.columns).fill(Number.NEGATIVE_INFINITY);
            for (let row = 0; row < this.rows; row++) {
              for (let column = 0; column < this.columns; column++) {
                if (this.get(row, column) > max2[column]) {
                  max2[column] = this.get(row, column);
                }
              }
            }
            return max2;
          }
          case void 0: {
            let max2 = this.get(0, 0);
            for (let row = 0; row < this.rows; row++) {
              for (let column = 0; column < this.columns; column++) {
                if (this.get(row, column) > max2) {
                  max2 = this.get(row, column);
                }
              }
            }
            return max2;
          }
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }
      maxIndex() {
        checkNonEmpty(this);
        let v = this.get(0, 0);
        let idx = [0, 0];
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            if (this.get(i, j) > v) {
              v = this.get(i, j);
              idx[0] = i;
              idx[1] = j;
            }
          }
        }
        return idx;
      }
      min(by) {
        if (this.isEmpty()) {
          return NaN;
        }
        switch (by) {
          case "row": {
            const min2 = new Array(this.rows).fill(Number.POSITIVE_INFINITY);
            for (let row = 0; row < this.rows; row++) {
              for (let column = 0; column < this.columns; column++) {
                if (this.get(row, column) < min2[row]) {
                  min2[row] = this.get(row, column);
                }
              }
            }
            return min2;
          }
          case "column": {
            const min2 = new Array(this.columns).fill(Number.POSITIVE_INFINITY);
            for (let row = 0; row < this.rows; row++) {
              for (let column = 0; column < this.columns; column++) {
                if (this.get(row, column) < min2[column]) {
                  min2[column] = this.get(row, column);
                }
              }
            }
            return min2;
          }
          case void 0: {
            let min2 = this.get(0, 0);
            for (let row = 0; row < this.rows; row++) {
              for (let column = 0; column < this.columns; column++) {
                if (this.get(row, column) < min2) {
                  min2 = this.get(row, column);
                }
              }
            }
            return min2;
          }
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }
      minIndex() {
        checkNonEmpty(this);
        let v = this.get(0, 0);
        let idx = [0, 0];
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            if (this.get(i, j) < v) {
              v = this.get(i, j);
              idx[0] = i;
              idx[1] = j;
            }
          }
        }
        return idx;
      }
      maxRow(row) {
        checkRowIndex(this, row);
        if (this.isEmpty()) {
          return NaN;
        }
        let v = this.get(row, 0);
        for (let i = 1; i < this.columns; i++) {
          if (this.get(row, i) > v) {
            v = this.get(row, i);
          }
        }
        return v;
      }
      maxRowIndex(row) {
        checkRowIndex(this, row);
        checkNonEmpty(this);
        let v = this.get(row, 0);
        let idx = [row, 0];
        for (let i = 1; i < this.columns; i++) {
          if (this.get(row, i) > v) {
            v = this.get(row, i);
            idx[1] = i;
          }
        }
        return idx;
      }
      minRow(row) {
        checkRowIndex(this, row);
        if (this.isEmpty()) {
          return NaN;
        }
        let v = this.get(row, 0);
        for (let i = 1; i < this.columns; i++) {
          if (this.get(row, i) < v) {
            v = this.get(row, i);
          }
        }
        return v;
      }
      minRowIndex(row) {
        checkRowIndex(this, row);
        checkNonEmpty(this);
        let v = this.get(row, 0);
        let idx = [row, 0];
        for (let i = 1; i < this.columns; i++) {
          if (this.get(row, i) < v) {
            v = this.get(row, i);
            idx[1] = i;
          }
        }
        return idx;
      }
      maxColumn(column) {
        checkColumnIndex(this, column);
        if (this.isEmpty()) {
          return NaN;
        }
        let v = this.get(0, column);
        for (let i = 1; i < this.rows; i++) {
          if (this.get(i, column) > v) {
            v = this.get(i, column);
          }
        }
        return v;
      }
      maxColumnIndex(column) {
        checkColumnIndex(this, column);
        checkNonEmpty(this);
        let v = this.get(0, column);
        let idx = [0, column];
        for (let i = 1; i < this.rows; i++) {
          if (this.get(i, column) > v) {
            v = this.get(i, column);
            idx[0] = i;
          }
        }
        return idx;
      }
      minColumn(column) {
        checkColumnIndex(this, column);
        if (this.isEmpty()) {
          return NaN;
        }
        let v = this.get(0, column);
        for (let i = 1; i < this.rows; i++) {
          if (this.get(i, column) < v) {
            v = this.get(i, column);
          }
        }
        return v;
      }
      minColumnIndex(column) {
        checkColumnIndex(this, column);
        checkNonEmpty(this);
        let v = this.get(0, column);
        let idx = [0, column];
        for (let i = 1; i < this.rows; i++) {
          if (this.get(i, column) < v) {
            v = this.get(i, column);
            idx[0] = i;
          }
        }
        return idx;
      }
      diag() {
        let min2 = Math.min(this.rows, this.columns);
        let diag = [];
        for (let i = 0; i < min2; i++) {
          diag.push(this.get(i, i));
        }
        return diag;
      }
      norm(type = "frobenius") {
        switch (type) {
          case "max":
            return this.max();
          case "frobenius":
            return Math.sqrt(this.dot(this));
          default:
            throw new RangeError(`unknown norm type: ${type}`);
        }
      }
      cumulativeSum() {
        let sum2 = 0;
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            sum2 += this.get(i, j);
            this.set(i, j, sum2);
          }
        }
        return this;
      }
      dot(vector2) {
        if (_AbstractMatrix.isMatrix(vector2)) vector2 = vector2.to1DArray();
        let vector1 = this.to1DArray();
        if (vector1.length !== vector2.length) {
          throw new RangeError("vectors do not have the same size");
        }
        let dot = 0;
        for (let i = 0; i < vector1.length; i++) {
          dot += vector1[i] * vector2[i];
        }
        return dot;
      }
      mmul(other) {
        other = Matrix.checkMatrix(other);
        let m = this.rows;
        let n = this.columns;
        let p = other.columns;
        let result = new Matrix(m, p);
        let Bcolj = new Float64Array(n);
        for (let j = 0; j < p; j++) {
          for (let k = 0; k < n; k++) {
            Bcolj[k] = other.get(k, j);
          }
          for (let i = 0; i < m; i++) {
            let s = 0;
            for (let k = 0; k < n; k++) {
              s += this.get(i, k) * Bcolj[k];
            }
            result.set(i, j, s);
          }
        }
        return result;
      }
      gram() {
        const rows = this.rows;
        const n = this.columns;
        const gramData = new Float64Array(n * n);
        for (let r = 0; r < rows; r++) {
          for (let i = 0; i < n; i++) {
            const value = this.get(r, i);
            if (value === 0) continue;
            const offset = i * n;
            for (let j = i; j < n; j++) {
              gramData[offset + j] += value * this.get(r, j);
            }
          }
        }
        const result = new Matrix(n, n);
        for (let i = 0; i < n; i++) {
          const offset = i * n;
          for (let j = i; j < n; j++) {
            const value = gramData[offset + j];
            result.set(i, j, value);
            result.set(j, i, value);
          }
        }
        return result;
      }
      transposeMultiply(other) {
        other = Matrix.checkMatrix(other);
        if (this.rows !== other.rows) {
          throw new RangeError(
            "the number of rows of the two matrices must be equal"
          );
        }
        const n = this.columns;
        const p = other.columns;
        const result = new Matrix(n, p);
        const otherRow = new Float64Array(p);
        for (let r = 0; r < this.rows; r++) {
          for (let j = 0; j < p; j++) {
            otherRow[j] = other.get(r, j);
          }
          for (let i = 0; i < n; i++) {
            const value = this.get(r, i);
            if (value === 0) continue;
            const resultRow = result.data[i];
            for (let j = 0; j < p; j++) {
              resultRow[j] += value * otherRow[j];
            }
          }
        }
        return result;
      }
      mmulByTranspose(scale) {
        let m = this.rows;
        let n = this.columns;
        if (scale !== void 0 && scale.length !== n) {
          throw new RangeError("scale must have one value per column");
        }
        let result = new Matrix(m, m);
        let rowj = new Float64Array(n);
        for (let j = 0; j < m; j++) {
          if (scale === void 0) {
            for (let k = 0; k < n; k++) {
              rowj[k] = this.get(j, k);
            }
          } else {
            for (let k = 0; k < n; k++) {
              rowj[k] = scale[k] * this.get(j, k);
            }
          }
          for (let i = j; i < m; i++) {
            let s = 0;
            for (let k = 0; k < n; k++) {
              s += this.get(i, k) * rowj[k];
            }
            result.set(i, j, s);
            result.set(j, i, s);
          }
        }
        return result;
      }
      mpow(scalar) {
        if (!this.isSquare()) {
          throw new RangeError("Matrix must be square");
        }
        if (!Number.isInteger(scalar) || scalar < 0) {
          throw new RangeError("Exponent must be a non-negative integer");
        }
        let result = Matrix.eye(this.rows);
        let bb = this;
        for (let e = scalar; e >= 1; e /= 2) {
          if ((e & 1) !== 0) {
            result = result.mmul(bb);
          }
          bb = bb.mmul(bb);
        }
        return result;
      }
      strassen2x2(other) {
        other = Matrix.checkMatrix(other);
        let result = new Matrix(2, 2);
        const a11 = this.get(0, 0);
        const b11 = other.get(0, 0);
        const a12 = this.get(0, 1);
        const b12 = other.get(0, 1);
        const a21 = this.get(1, 0);
        const b21 = other.get(1, 0);
        const a22 = this.get(1, 1);
        const b22 = other.get(1, 1);
        const m1 = (a11 + a22) * (b11 + b22);
        const m2 = (a21 + a22) * b11;
        const m3 = a11 * (b12 - b22);
        const m4 = a22 * (b21 - b11);
        const m5 = (a11 + a12) * b22;
        const m6 = (a21 - a11) * (b11 + b12);
        const m7 = (a12 - a22) * (b21 + b22);
        const c00 = m1 + m4 - m5 + m7;
        const c01 = m3 + m5;
        const c10 = m2 + m4;
        const c11 = m1 - m2 + m3 + m6;
        result.set(0, 0, c00);
        result.set(0, 1, c01);
        result.set(1, 0, c10);
        result.set(1, 1, c11);
        return result;
      }
      strassen3x3(other) {
        other = Matrix.checkMatrix(other);
        let result = new Matrix(3, 3);
        const a00 = this.get(0, 0);
        const a01 = this.get(0, 1);
        const a02 = this.get(0, 2);
        const a10 = this.get(1, 0);
        const a11 = this.get(1, 1);
        const a12 = this.get(1, 2);
        const a20 = this.get(2, 0);
        const a21 = this.get(2, 1);
        const a22 = this.get(2, 2);
        const b00 = other.get(0, 0);
        const b01 = other.get(0, 1);
        const b02 = other.get(0, 2);
        const b10 = other.get(1, 0);
        const b11 = other.get(1, 1);
        const b12 = other.get(1, 2);
        const b20 = other.get(2, 0);
        const b21 = other.get(2, 1);
        const b22 = other.get(2, 2);
        const m1 = (a00 + a01 + a02 - a10 - a11 - a21 - a22) * b11;
        const m2 = (a00 - a10) * (-b01 + b11);
        const m3 = a11 * (-b00 + b01 + b10 - b11 - b12 - b20 + b22);
        const m4 = (-a00 + a10 + a11) * (b00 - b01 + b11);
        const m5 = (a10 + a11) * (-b00 + b01);
        const m6 = a00 * b00;
        const m7 = (-a00 + a20 + a21) * (b00 - b02 + b12);
        const m8 = (-a00 + a20) * (b02 - b12);
        const m9 = (a20 + a21) * (-b00 + b02);
        const m10 = (a00 + a01 + a02 - a11 - a12 - a20 - a21) * b12;
        const m11 = a21 * (-b00 + b02 + b10 - b11 - b12 - b20 + b21);
        const m12 = (-a02 + a21 + a22) * (b11 + b20 - b21);
        const m13 = (a02 - a22) * (b11 - b21);
        const m14 = a02 * b20;
        const m15 = (a21 + a22) * (-b20 + b21);
        const m16 = (-a02 + a11 + a12) * (b12 + b20 - b22);
        const m17 = (a02 - a12) * (b12 - b22);
        const m18 = (a11 + a12) * (-b20 + b22);
        const m19 = a01 * b10;
        const m20 = a12 * b21;
        const m21 = a10 * b02;
        const m22 = a20 * b01;
        const m23 = a22 * b22;
        const c00 = m6 + m14 + m19;
        const c01 = m1 + m4 + m5 + m6 + m12 + m14 + m15;
        const c02 = m6 + m7 + m9 + m10 + m14 + m16 + m18;
        const c10 = m2 + m3 + m4 + m6 + m14 + m16 + m17;
        const c11 = m2 + m4 + m5 + m6 + m20;
        const c12 = m14 + m16 + m17 + m18 + m21;
        const c20 = m6 + m7 + m8 + m11 + m12 + m13 + m14;
        const c21 = m12 + m13 + m14 + m15 + m22;
        const c22 = m6 + m7 + m8 + m9 + m23;
        result.set(0, 0, c00);
        result.set(0, 1, c01);
        result.set(0, 2, c02);
        result.set(1, 0, c10);
        result.set(1, 1, c11);
        result.set(1, 2, c12);
        result.set(2, 0, c20);
        result.set(2, 1, c21);
        result.set(2, 2, c22);
        return result;
      }
      mmulStrassen(y) {
        y = Matrix.checkMatrix(y);
        let x = this.clone();
        let r1 = x.rows;
        let c1 = x.columns;
        let r2 = y.rows;
        let c2 = y.columns;
        if (c1 !== r2) {
          console.warn(
            `Multiplying ${r1} x ${c1} and ${r2} x ${c2} matrix: dimensions do not match.`
          );
        }
        function embed(mat, rows, cols) {
          let r3 = mat.rows;
          let c3 = mat.columns;
          if (r3 === rows && c3 === cols) {
            return mat;
          } else {
            let resultat = _AbstractMatrix.zeros(rows, cols);
            resultat = resultat.setSubMatrix(mat, 0, 0);
            return resultat;
          }
        }
        let r = Math.max(r1, r2);
        let c = Math.max(c1, c2);
        x = embed(x, r, c);
        y = embed(y, r, c);
        function blockMult(a, b, rows, cols) {
          if (rows <= 512 || cols <= 512) {
            return a.mmul(b);
          }
          if (rows % 2 === 1 && cols % 2 === 1) {
            a = embed(a, rows + 1, cols + 1);
            b = embed(b, rows + 1, cols + 1);
          } else if (rows % 2 === 1) {
            a = embed(a, rows + 1, cols);
            b = embed(b, rows + 1, cols);
          } else if (cols % 2 === 1) {
            a = embed(a, rows, cols + 1);
            b = embed(b, rows, cols + 1);
          }
          let halfRows = parseInt(a.rows / 2, 10);
          let halfCols = parseInt(a.columns / 2, 10);
          let a11 = a.subMatrix(0, halfRows - 1, 0, halfCols - 1);
          let b11 = b.subMatrix(0, halfRows - 1, 0, halfCols - 1);
          let a12 = a.subMatrix(0, halfRows - 1, halfCols, a.columns - 1);
          let b12 = b.subMatrix(0, halfRows - 1, halfCols, b.columns - 1);
          let a21 = a.subMatrix(halfRows, a.rows - 1, 0, halfCols - 1);
          let b21 = b.subMatrix(halfRows, b.rows - 1, 0, halfCols - 1);
          let a22 = a.subMatrix(halfRows, a.rows - 1, halfCols, a.columns - 1);
          let b22 = b.subMatrix(halfRows, b.rows - 1, halfCols, b.columns - 1);
          let m1 = blockMult(
            _AbstractMatrix.add(a11, a22),
            _AbstractMatrix.add(b11, b22),
            halfRows,
            halfCols
          );
          let m2 = blockMult(_AbstractMatrix.add(a21, a22), b11, halfRows, halfCols);
          let m3 = blockMult(a11, _AbstractMatrix.sub(b12, b22), halfRows, halfCols);
          let m4 = blockMult(a22, _AbstractMatrix.sub(b21, b11), halfRows, halfCols);
          let m5 = blockMult(_AbstractMatrix.add(a11, a12), b22, halfRows, halfCols);
          let m6 = blockMult(
            _AbstractMatrix.sub(a21, a11),
            _AbstractMatrix.add(b11, b12),
            halfRows,
            halfCols
          );
          let m7 = blockMult(
            _AbstractMatrix.sub(a12, a22),
            _AbstractMatrix.add(b21, b22),
            halfRows,
            halfCols
          );
          let c11 = _AbstractMatrix.add(m1, m4);
          c11.sub(m5);
          c11.add(m7);
          let c12 = _AbstractMatrix.add(m3, m5);
          let c21 = _AbstractMatrix.add(m2, m4);
          let c22 = _AbstractMatrix.sub(m1, m2);
          c22.add(m3);
          c22.add(m6);
          let result = _AbstractMatrix.zeros(2 * c11.rows, 2 * c11.columns);
          result = result.setSubMatrix(c11, 0, 0);
          result = result.setSubMatrix(c12, c11.rows, 0);
          result = result.setSubMatrix(c21, 0, c11.columns);
          result = result.setSubMatrix(c22, c11.rows, c11.columns);
          return result.subMatrix(0, rows - 1, 0, cols - 1);
        }
        return blockMult(x, y, r, c);
      }
      scaleRows(options = {}) {
        if (typeof options !== "object") {
          throw new TypeError("options must be an object");
        }
        const { min: min2 = 0, max: max2 = 1 } = options;
        if (!Number.isFinite(min2)) throw new TypeError("min must be a number");
        if (!Number.isFinite(max2)) throw new TypeError("max must be a number");
        if (min2 >= max2) throw new RangeError("min must be smaller than max");
        let newMatrix = new Matrix(this.rows, this.columns);
        for (let i = 0; i < this.rows; i++) {
          const row = this.getRow(i);
          if (row.length > 0) {
            rescale(row, { min: min2, max: max2, output: row });
          }
          newMatrix.setRow(i, row);
        }
        return newMatrix;
      }
      scaleColumns(options = {}) {
        if (typeof options !== "object") {
          throw new TypeError("options must be an object");
        }
        const { min: min2 = 0, max: max2 = 1 } = options;
        if (!Number.isFinite(min2)) throw new TypeError("min must be a number");
        if (!Number.isFinite(max2)) throw new TypeError("max must be a number");
        if (min2 >= max2) throw new RangeError("min must be smaller than max");
        let newMatrix = new Matrix(this.rows, this.columns);
        for (let i = 0; i < this.columns; i++) {
          const column = this.getColumn(i);
          if (column.length) {
            rescale(column, {
              min: min2,
              max: max2,
              output: column
            });
          }
          newMatrix.setColumn(i, column);
        }
        return newMatrix;
      }
      flipRows() {
        const middle = Math.ceil(this.columns / 2);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < middle; j++) {
            let first = this.get(i, j);
            let last = this.get(i, this.columns - 1 - j);
            this.set(i, j, last);
            this.set(i, this.columns - 1 - j, first);
          }
        }
        return this;
      }
      flipColumns() {
        const middle = Math.ceil(this.rows / 2);
        for (let j = 0; j < this.columns; j++) {
          for (let i = 0; i < middle; i++) {
            let first = this.get(i, j);
            let last = this.get(this.rows - 1 - i, j);
            this.set(i, j, last);
            this.set(this.rows - 1 - i, j, first);
          }
        }
        return this;
      }
      kroneckerProduct(other) {
        other = Matrix.checkMatrix(other);
        let m = this.rows;
        let n = this.columns;
        let p = other.rows;
        let q = other.columns;
        let result = new Matrix(m * p, n * q);
        for (let i = 0; i < m; i++) {
          for (let j = 0; j < n; j++) {
            for (let k = 0; k < p; k++) {
              for (let l = 0; l < q; l++) {
                result.set(p * i + k, q * j + l, this.get(i, j) * other.get(k, l));
              }
            }
          }
        }
        return result;
      }
      kroneckerSum(other) {
        other = Matrix.checkMatrix(other);
        if (!this.isSquare() || !other.isSquare()) {
          throw new Error("Kronecker Sum needs two Square Matrices");
        }
        let m = this.rows;
        let n = other.rows;
        let AxI = this.kroneckerProduct(Matrix.eye(n, n));
        let IxB = Matrix.eye(m, m).kroneckerProduct(other);
        return AxI.add(IxB);
      }
      transpose() {
        let result = new Matrix(this.columns, this.rows);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            result.set(j, i, this.get(i, j));
          }
        }
        return result;
      }
      sortRows(compareFunction = compareNumbers) {
        for (let i = 0; i < this.rows; i++) {
          this.setRow(i, this.getRow(i).sort(compareFunction));
        }
        return this;
      }
      sortColumns(compareFunction = compareNumbers) {
        for (let i = 0; i < this.columns; i++) {
          this.setColumn(i, this.getColumn(i).sort(compareFunction));
        }
        return this;
      }
      subMatrix(startRow, endRow, startColumn, endColumn) {
        checkRange(this, startRow, endRow, startColumn, endColumn);
        let newMatrix = new Matrix(
          endRow - startRow + 1,
          endColumn - startColumn + 1
        );
        for (let i = startRow; i <= endRow; i++) {
          for (let j = startColumn; j <= endColumn; j++) {
            newMatrix.set(i - startRow, j - startColumn, this.get(i, j));
          }
        }
        return newMatrix;
      }
      subMatrixRow(indices, startColumn, endColumn) {
        if (startColumn === void 0) startColumn = 0;
        if (endColumn === void 0) endColumn = this.columns - 1;
        if (startColumn > endColumn || startColumn < 0 || startColumn >= this.columns || endColumn < 0 || endColumn >= this.columns) {
          throw new RangeError("Argument out of range");
        }
        let newMatrix = new Matrix(indices.length, endColumn - startColumn + 1);
        for (let i = 0; i < indices.length; i++) {
          for (let j = startColumn; j <= endColumn; j++) {
            if (indices[i] < 0 || indices[i] >= this.rows) {
              throw new RangeError(`Row index out of range: ${indices[i]}`);
            }
            newMatrix.set(i, j - startColumn, this.get(indices[i], j));
          }
        }
        return newMatrix;
      }
      subMatrixColumn(indices, startRow, endRow) {
        if (startRow === void 0) startRow = 0;
        if (endRow === void 0) endRow = this.rows - 1;
        if (startRow > endRow || startRow < 0 || startRow >= this.rows || endRow < 0 || endRow >= this.rows) {
          throw new RangeError("Argument out of range");
        }
        let newMatrix = new Matrix(endRow - startRow + 1, indices.length);
        for (let i = 0; i < indices.length; i++) {
          for (let j = startRow; j <= endRow; j++) {
            if (indices[i] < 0 || indices[i] >= this.columns) {
              throw new RangeError(`Column index out of range: ${indices[i]}`);
            }
            newMatrix.set(j - startRow, i, this.get(j, indices[i]));
          }
        }
        return newMatrix;
      }
      setSubMatrix(matrix, startRow, startColumn) {
        matrix = Matrix.checkMatrix(matrix);
        if (matrix.isEmpty()) {
          return this;
        }
        let endRow = startRow + matrix.rows - 1;
        let endColumn = startColumn + matrix.columns - 1;
        checkRange(this, startRow, endRow, startColumn, endColumn);
        for (let i = 0; i < matrix.rows; i++) {
          for (let j = 0; j < matrix.columns; j++) {
            this.set(startRow + i, startColumn + j, matrix.get(i, j));
          }
        }
        return this;
      }
      concat(other, by = "row") {
        other = Matrix.checkMatrix(other);
        switch (by) {
          case "row": {
            if (this.columns !== other.columns) {
              throw new RangeError(
                "both matrices must have the same number of columns"
              );
            }
            const result = new Matrix(this.rows + other.rows, this.columns);
            result.setSubMatrix(this, 0, 0);
            result.setSubMatrix(other, this.rows, 0);
            return result;
          }
          case "column": {
            if (this.rows !== other.rows) {
              throw new RangeError(
                "both matrices must have the same number of rows"
              );
            }
            const result = new Matrix(this.rows, this.columns + other.columns);
            result.setSubMatrix(this, 0, 0);
            result.setSubMatrix(other, 0, this.columns);
            return result;
          }
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }
      selection(rowIndices, columnIndices) {
        checkRowIndices(this, rowIndices);
        checkColumnIndices(this, columnIndices);
        let newMatrix = new Matrix(rowIndices.length, columnIndices.length);
        for (let i = 0; i < rowIndices.length; i++) {
          let rowIndex = rowIndices[i];
          for (let j = 0; j < columnIndices.length; j++) {
            let columnIndex = columnIndices[j];
            newMatrix.set(i, j, this.get(rowIndex, columnIndex));
          }
        }
        return newMatrix;
      }
      trace() {
        let min2 = Math.min(this.rows, this.columns);
        let trace = 0;
        for (let i = 0; i < min2; i++) {
          trace += this.get(i, i);
        }
        return trace;
      }
      clone() {
        return this.constructor.copy(this, new Matrix(this.rows, this.columns));
      }
      /**
       * @template {AbstractMatrix} M
       * @param {AbstractMatrix} from
       * @param {M} to
       * @return {M}
       */
      static copy(from, to) {
        for (const [row, column, value] of from.entries()) {
          to.set(row, column, value);
        }
        return to;
      }
      sum(by) {
        switch (by) {
          case "row":
            return sumByRow(this);
          case "column":
            return sumByColumn(this);
          case void 0:
            return sumAll(this);
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }
      product(by) {
        switch (by) {
          case "row":
            return productByRow(this);
          case "column":
            return productByColumn(this);
          case void 0:
            return productAll(this);
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }
      mean(by) {
        const sum2 = this.sum(by);
        switch (by) {
          case "row": {
            for (let i = 0; i < this.rows; i++) {
              sum2[i] /= this.columns;
            }
            return sum2;
          }
          case "column": {
            for (let i = 0; i < this.columns; i++) {
              sum2[i] /= this.rows;
            }
            return sum2;
          }
          case void 0:
            return sum2 / this.size;
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }
      variance(by, options = {}) {
        if (typeof by === "object") {
          options = by;
          by = void 0;
        }
        if (typeof options !== "object") {
          throw new TypeError("options must be an object");
        }
        const { unbiased = true, mean: mean2 = this.mean(by) } = options;
        if (typeof unbiased !== "boolean") {
          throw new TypeError("unbiased must be a boolean");
        }
        switch (by) {
          case "row": {
            if (!isAnyArray(mean2)) {
              throw new TypeError("mean must be an array");
            }
            return varianceByRow(this, unbiased, mean2);
          }
          case "column": {
            if (!isAnyArray(mean2)) {
              throw new TypeError("mean must be an array");
            }
            return varianceByColumn(this, unbiased, mean2);
          }
          case void 0: {
            if (typeof mean2 !== "number") {
              throw new TypeError("mean must be a number");
            }
            return varianceAll(this, unbiased, mean2);
          }
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }
      standardDeviation(by, options) {
        if (typeof by === "object") {
          options = by;
          by = void 0;
        }
        const variance = this.variance(by, options);
        if (by === void 0) {
          return Math.sqrt(variance);
        } else {
          for (let i = 0; i < variance.length; i++) {
            variance[i] = Math.sqrt(variance[i]);
          }
          return variance;
        }
      }
      center(by, options = {}) {
        if (typeof by === "object") {
          options = by;
          by = void 0;
        }
        if (typeof options !== "object") {
          throw new TypeError("options must be an object");
        }
        const { center = this.mean(by) } = options;
        switch (by) {
          case "row": {
            if (!isAnyArray(center)) {
              throw new TypeError("center must be an array");
            }
            centerByRow(this, center);
            return this;
          }
          case "column": {
            if (!isAnyArray(center)) {
              throw new TypeError("center must be an array");
            }
            centerByColumn(this, center);
            return this;
          }
          case void 0: {
            if (typeof center !== "number") {
              throw new TypeError("center must be a number");
            }
            centerAll(this, center);
            return this;
          }
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }
      scale(by, options = {}) {
        if (typeof by === "object") {
          options = by;
          by = void 0;
        }
        if (typeof options !== "object") {
          throw new TypeError("options must be an object");
        }
        let scale = options.scale;
        switch (by) {
          case "row": {
            if (scale === void 0) {
              scale = getScaleByRow(this);
            } else if (!isAnyArray(scale)) {
              throw new TypeError("scale must be an array");
            }
            scaleByRow(this, scale);
            return this;
          }
          case "column": {
            if (scale === void 0) {
              scale = getScaleByColumn(this);
            } else if (!isAnyArray(scale)) {
              throw new TypeError("scale must be an array");
            }
            scaleByColumn(this, scale);
            return this;
          }
          case void 0: {
            if (scale === void 0) {
              scale = getScaleAll(this);
            } else if (typeof scale !== "number") {
              throw new TypeError("scale must be a number");
            }
            scaleAll(this, scale);
            return this;
          }
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }
      toString(options) {
        return inspectMatrixWithOptions(this, options);
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      /**
       * iterator from left to right, from top to bottom
       * yield [row, column, value]
       * @returns {Generator<[number, number, number], void, void>}
       */
      *entries() {
        for (let row = 0; row < this.rows; row++) {
          for (let col = 0; col < this.columns; col++) {
            yield [row, col, this.get(row, col)];
          }
        }
      }
      /**
       * iterator from left to right, from top to bottom
       * yield value
       * @returns {Generator<number, void, void>}
       */
      *values() {
        for (let row = 0; row < this.rows; row++) {
          for (let col = 0; col < this.columns; col++) {
            yield this.get(row, col);
          }
        }
      }
    };
    AbstractMatrix.prototype.klass = "Matrix";
    if (typeof Symbol !== "undefined") {
      AbstractMatrix.prototype[/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")] = inspectMatrix;
    }
    function compareNumbers(a, b) {
      return a - b;
    }
    function isArrayOfNumbers(array) {
      return array.every((element) => {
        return typeof element === "number";
      });
    }
    AbstractMatrix.random = AbstractMatrix.rand;
    AbstractMatrix.randomInt = AbstractMatrix.randInt;
    AbstractMatrix.diagonal = AbstractMatrix.diag;
    AbstractMatrix.prototype.diagonal = AbstractMatrix.prototype.diag;
    AbstractMatrix.identity = AbstractMatrix.eye;
    AbstractMatrix.prototype.negate = AbstractMatrix.prototype.neg;
    AbstractMatrix.prototype.tensorProduct = AbstractMatrix.prototype.kroneckerProduct;
    var Matrix = class _Matrix extends AbstractMatrix {
      /**
       * @type {Float64Array[]}
       */
      data;
      /**
       * Init an empty matrix
       * @param {number} nRows
       * @param {number} nColumns
       */
      #initData(nRows, nColumns) {
        this.data = [];
        if (Number.isInteger(nColumns) && nColumns >= 0) {
          for (let i = 0; i < nRows; i++) {
            this.data.push(new Float64Array(nColumns));
          }
        } else {
          throw new TypeError("nColumns must be a positive integer");
        }
        this.rows = nRows;
        this.columns = nColumns;
      }
      constructor(nRows, nColumns) {
        super();
        if (_Matrix.isMatrix(nRows)) {
          this.#initData(nRows.rows, nRows.columns);
          _Matrix.copy(nRows, this);
        } else if (Number.isInteger(nRows) && nRows >= 0) {
          this.#initData(nRows, nColumns);
        } else if (isAnyArray(nRows)) {
          const arrayData = nRows;
          nRows = arrayData.length;
          nColumns = nRows ? arrayData[0].length : 0;
          if (typeof nColumns !== "number") {
            throw new TypeError(
              "Data must be a 2D array with at least one element"
            );
          }
          this.data = [];
          for (let i = 0; i < nRows; i++) {
            if (arrayData[i].length !== nColumns) {
              throw new RangeError("Inconsistent array dimensions");
            }
            if (!isArrayOfNumbers(arrayData[i])) {
              throw new TypeError("Input data contains non-numeric values");
            }
            this.data.push(Float64Array.from(arrayData[i]));
          }
          this.rows = nRows;
          this.columns = nColumns;
        } else {
          throw new TypeError(
            "First argument must be a positive number or an array"
          );
        }
      }
      set(rowIndex, columnIndex, value) {
        this.data[rowIndex][columnIndex] = value;
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.data[rowIndex][columnIndex];
      }
      removeRow(index) {
        checkRowIndex(this, index);
        this.data.splice(index, 1);
        this.rows -= 1;
        return this;
      }
      addRow(index, array) {
        if (array === void 0) {
          array = index;
          index = this.rows;
        }
        checkRowIndex(this, index, true);
        array = Float64Array.from(checkRowVector(this, array));
        this.data.splice(index, 0, array);
        this.rows += 1;
        return this;
      }
      removeColumn(index) {
        checkColumnIndex(this, index);
        for (let i = 0; i < this.rows; i++) {
          const newRow = new Float64Array(this.columns - 1);
          for (let j = 0; j < index; j++) {
            newRow[j] = this.data[i][j];
          }
          for (let j = index + 1; j < this.columns; j++) {
            newRow[j - 1] = this.data[i][j];
          }
          this.data[i] = newRow;
        }
        this.columns -= 1;
        return this;
      }
      addColumn(index, array) {
        if (typeof array === "undefined") {
          array = index;
          index = this.columns;
        }
        checkColumnIndex(this, index, true);
        array = checkColumnVector(this, array);
        for (let i = 0; i < this.rows; i++) {
          const newRow = new Float64Array(this.columns + 1);
          let j = 0;
          for (; j < index; j++) {
            newRow[j] = this.data[i][j];
          }
          newRow[j++] = array[i];
          for (; j < this.columns + 1; j++) {
            newRow[j] = this.data[i][j - 1];
          }
          this.data[i] = newRow;
        }
        this.columns += 1;
        return this;
      }
    };
    installMathOperations(AbstractMatrix, Matrix);
    var SymmetricMatrix = class _SymmetricMatrix extends AbstractMatrix {
      /** @type {Matrix} */
      #matrix;
      get size() {
        return this.#matrix.size;
      }
      get rows() {
        return this.#matrix.rows;
      }
      get columns() {
        return this.#matrix.columns;
      }
      get diagonalSize() {
        return this.rows;
      }
      /**
       * not the same as matrix.isSymmetric()
       * Here is to check if it's instanceof SymmetricMatrix without bundling issues
       *
       * @param value
       * @returns {boolean}
       */
      static isSymmetricMatrix(value) {
        return Matrix.isMatrix(value) && value.klassType === "SymmetricMatrix";
      }
      /**
       * @param diagonalSize
       * @return {SymmetricMatrix}
       */
      static zeros(diagonalSize) {
        return new this(diagonalSize);
      }
      /**
       * @param diagonalSize
       * @return {SymmetricMatrix}
       */
      static ones(diagonalSize) {
        return new this(diagonalSize).fill(1);
      }
      /**
       * @param {number | AbstractMatrix | ArrayLike<ArrayLike<number>>} diagonalSize
       * @return {this}
       */
      constructor(diagonalSize) {
        super();
        if (Matrix.isMatrix(diagonalSize)) {
          if (!diagonalSize.isSymmetric()) {
            throw new TypeError("not symmetric data");
          }
          this.#matrix = Matrix.copy(
            diagonalSize,
            new Matrix(diagonalSize.rows, diagonalSize.rows)
          );
        } else if (Number.isInteger(diagonalSize) && diagonalSize >= 0) {
          this.#matrix = new Matrix(diagonalSize, diagonalSize);
        } else {
          this.#matrix = new Matrix(diagonalSize);
          if (!this.isSymmetric()) {
            throw new TypeError("not symmetric data");
          }
        }
      }
      clone() {
        const matrix = new _SymmetricMatrix(this.diagonalSize);
        for (const [row, col, value] of this.upperRightEntries()) {
          matrix.set(row, col, value);
        }
        return matrix;
      }
      toMatrix() {
        return new Matrix(this);
      }
      get(rowIndex, columnIndex) {
        return this.#matrix.get(rowIndex, columnIndex);
      }
      set(rowIndex, columnIndex, value) {
        this.#matrix.set(rowIndex, columnIndex, value);
        this.#matrix.set(columnIndex, rowIndex, value);
        return this;
      }
      removeCross(index) {
        this.#matrix.removeRow(index);
        this.#matrix.removeColumn(index);
        return this;
      }
      addCross(index, array) {
        if (array === void 0) {
          array = index;
          index = this.diagonalSize;
        }
        const row = array.slice();
        row.splice(index, 1);
        this.#matrix.addRow(index, row);
        this.#matrix.addColumn(index, array);
        return this;
      }
      /**
       * @param {Mask[]} mask
       */
      applyMask(mask) {
        if (mask.length !== this.diagonalSize) {
          throw new RangeError("Mask size do not match with matrix size");
        }
        const sidesToRemove = [];
        for (const [index, passthroughs] of mask.entries()) {
          if (passthroughs) continue;
          sidesToRemove.push(index);
        }
        sidesToRemove.reverse();
        for (const sideIndex of sidesToRemove) {
          this.removeCross(sideIndex);
        }
        return this;
      }
      /**
       * Compact format upper-right corner of matrix
       * iterate from left to right, from top to bottom.
       *
       * ```
       *   A B C D
       * A 1 2 3 4
       * B 2 5 6 7
       * C 3 6 8 9
       * D 4 7 9 10
       * ```
       *
       * will return compact 1D array `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`
       *
       * length is S(i=0, n=sideSize) => 10 for a 4 sideSized matrix
       *
       * @returns {number[]}
       */
      toCompact() {
        const { diagonalSize } = this;
        const compact = new Array(diagonalSize * (diagonalSize + 1) / 2);
        for (let col = 0, row = 0, index = 0; index < compact.length; index++) {
          compact[index] = this.get(row, col);
          if (++col >= diagonalSize) col = ++row;
        }
        return compact;
      }
      /**
       * @param {number[]} compact
       * @return {SymmetricMatrix}
       */
      static fromCompact(compact) {
        const compactSize = compact.length;
        const diagonalSize = (Math.sqrt(8 * compactSize + 1) - 1) / 2;
        if (!Number.isInteger(diagonalSize)) {
          throw new TypeError(
            `This array is not a compact representation of a Symmetric Matrix, ${JSON.stringify(
              compact
            )}`
          );
        }
        const matrix = new _SymmetricMatrix(diagonalSize);
        for (let col = 0, row = 0, index = 0; index < compactSize; index++) {
          matrix.set(col, row, compact[index]);
          if (++col >= diagonalSize) col = ++row;
        }
        return matrix;
      }
      /**
       * half iterator upper-right-corner from left to right, from top to bottom
       * yield [row, column, value]
       *
       * @returns {Generator<[number, number, number], void, void>}
       */
      *upperRightEntries() {
        for (let row = 0, col = 0; row < this.diagonalSize; void 0) {
          const value = this.get(row, col);
          yield [row, col, value];
          if (++col >= this.diagonalSize) col = ++row;
        }
      }
      /**
       * half iterator upper-right-corner from left to right, from top to bottom
       * yield value
       *
       * @returns {Generator<[number, number, number], void, void>}
       */
      *upperRightValues() {
        for (let row = 0, col = 0; row < this.diagonalSize; void 0) {
          const value = this.get(row, col);
          yield value;
          if (++col >= this.diagonalSize) col = ++row;
        }
      }
    };
    SymmetricMatrix.prototype.klassType = "SymmetricMatrix";
    var DistanceMatrix = class _DistanceMatrix extends SymmetricMatrix {
      /**
       * not the same as matrix.isSymmetric()
       * Here is to check if it's instanceof SymmetricMatrix without bundling issues
       *
       * @param value
       * @returns {boolean}
       */
      static isDistanceMatrix(value) {
        return SymmetricMatrix.isSymmetricMatrix(value) && value.klassSubType === "DistanceMatrix";
      }
      constructor(sideSize) {
        super(sideSize);
        if (!this.isDistance()) {
          throw new TypeError("Provided arguments do no produce a distance matrix");
        }
      }
      set(rowIndex, columnIndex, value) {
        if (rowIndex === columnIndex) value = 0;
        return super.set(rowIndex, columnIndex, value);
      }
      addCross(index, array) {
        if (array === void 0) {
          array = index;
          index = this.diagonalSize;
        }
        array = array.slice();
        array[index] = 0;
        return super.addCross(index, array);
      }
      toSymmetricMatrix() {
        return new SymmetricMatrix(this);
      }
      clone() {
        const matrix = new _DistanceMatrix(this.diagonalSize);
        for (const [row, col, value] of this.upperRightEntries()) {
          if (row === col) continue;
          matrix.set(row, col, value);
        }
        return matrix;
      }
      /**
       * Compact format upper-right corner of matrix
       * no diagonal (only zeros)
       * iterable from left to right, from top to bottom.
       *
       * ```
       *   A B C D
       * A 0 1 2 3
       * B 1 0 4 5
       * C 2 4 0 6
       * D 3 5 6 0
       * ```
       *
       * will return compact 1D array `[1, 2, 3, 4, 5, 6]`
       *
       * length is S(i=0, n=sideSize-1) => 6 for a 4 side sized matrix
       *
       * @returns {number[]}
       */
      toCompact() {
        const { diagonalSize } = this;
        const compactLength = (diagonalSize - 1) * diagonalSize / 2;
        const compact = new Array(compactLength);
        for (let col = 1, row = 0, index = 0; index < compact.length; index++) {
          compact[index] = this.get(row, col);
          if (++col >= diagonalSize) col = ++row + 1;
        }
        return compact;
      }
      /**
       * @param {number[]} compact
       */
      static fromCompact(compact) {
        const compactSize = compact.length;
        if (compactSize === 0) {
          return new this(0);
        }
        const diagonalSize = (Math.sqrt(8 * compactSize + 1) + 1) / 2;
        if (!Number.isInteger(diagonalSize)) {
          throw new TypeError(
            `This array is not a compact representation of a DistanceMatrix, ${JSON.stringify(
              compact
            )}`
          );
        }
        const matrix = new this(diagonalSize);
        for (let col = 1, row = 0, index = 0; index < compactSize; index++) {
          matrix.set(col, row, compact[index]);
          if (++col >= diagonalSize) col = ++row + 1;
        }
        return matrix;
      }
    };
    DistanceMatrix.prototype.klassSubType = "DistanceMatrix";
    var BaseView = class extends AbstractMatrix {
      constructor(matrix, rows, columns) {
        super();
        this.matrix = matrix;
        this.rows = rows;
        this.columns = columns;
      }
    };
    var MatrixColumnView = class extends BaseView {
      constructor(matrix, column) {
        checkColumnIndex(matrix, column);
        super(matrix, matrix.rows, 1);
        this.column = column;
      }
      set(rowIndex, columnIndex, value) {
        this.matrix.set(rowIndex, this.column, value);
        return this;
      }
      get(rowIndex) {
        return this.matrix.get(rowIndex, this.column);
      }
    };
    var MatrixColumnSelectionView = class extends BaseView {
      constructor(matrix, columnIndices) {
        checkColumnIndices(matrix, columnIndices);
        super(matrix, matrix.rows, columnIndices.length);
        this.columnIndices = columnIndices;
      }
      set(rowIndex, columnIndex, value) {
        this.matrix.set(rowIndex, this.columnIndices[columnIndex], value);
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.matrix.get(rowIndex, this.columnIndices[columnIndex]);
      }
    };
    var MatrixFlipColumnView = class extends BaseView {
      constructor(matrix) {
        super(matrix, matrix.rows, matrix.columns);
      }
      set(rowIndex, columnIndex, value) {
        this.matrix.set(rowIndex, this.columns - columnIndex - 1, value);
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.matrix.get(rowIndex, this.columns - columnIndex - 1);
      }
    };
    var MatrixFlipRowView = class extends BaseView {
      constructor(matrix) {
        super(matrix, matrix.rows, matrix.columns);
      }
      set(rowIndex, columnIndex, value) {
        this.matrix.set(this.rows - rowIndex - 1, columnIndex, value);
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.matrix.get(this.rows - rowIndex - 1, columnIndex);
      }
    };
    var MatrixRowView = class extends BaseView {
      constructor(matrix, row) {
        checkRowIndex(matrix, row);
        super(matrix, 1, matrix.columns);
        this.row = row;
      }
      set(rowIndex, columnIndex, value) {
        this.matrix.set(this.row, columnIndex, value);
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.matrix.get(this.row, columnIndex);
      }
    };
    var MatrixRowSelectionView = class extends BaseView {
      constructor(matrix, rowIndices) {
        checkRowIndices(matrix, rowIndices);
        super(matrix, rowIndices.length, matrix.columns);
        this.rowIndices = rowIndices;
      }
      set(rowIndex, columnIndex, value) {
        this.matrix.set(this.rowIndices[rowIndex], columnIndex, value);
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.matrix.get(this.rowIndices[rowIndex], columnIndex);
      }
    };
    var MatrixSelectionView = class extends BaseView {
      constructor(matrix, rowIndices, columnIndices) {
        checkRowIndices(matrix, rowIndices);
        checkColumnIndices(matrix, columnIndices);
        super(matrix, rowIndices.length, columnIndices.length);
        this.rowIndices = rowIndices;
        this.columnIndices = columnIndices;
      }
      set(rowIndex, columnIndex, value) {
        this.matrix.set(
          this.rowIndices[rowIndex],
          this.columnIndices[columnIndex],
          value
        );
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.matrix.get(
          this.rowIndices[rowIndex],
          this.columnIndices[columnIndex]
        );
      }
    };
    var MatrixSubView = class extends BaseView {
      constructor(matrix, startRow, endRow, startColumn, endColumn) {
        checkRange(matrix, startRow, endRow, startColumn, endColumn);
        super(matrix, endRow - startRow + 1, endColumn - startColumn + 1);
        this.startRow = startRow;
        this.startColumn = startColumn;
      }
      set(rowIndex, columnIndex, value) {
        this.matrix.set(
          this.startRow + rowIndex,
          this.startColumn + columnIndex,
          value
        );
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.matrix.get(
          this.startRow + rowIndex,
          this.startColumn + columnIndex
        );
      }
    };
    var MatrixTransposeView = class extends BaseView {
      constructor(matrix) {
        super(matrix, matrix.columns, matrix.rows);
      }
      set(rowIndex, columnIndex, value) {
        this.matrix.set(columnIndex, rowIndex, value);
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.matrix.get(columnIndex, rowIndex);
      }
    };
    var WrapperMatrix1D = class extends AbstractMatrix {
      constructor(data, options = {}) {
        const { rows = 1 } = options;
        if (data.length % rows !== 0) {
          throw new Error("the data length is not divisible by the number of rows");
        }
        super();
        this.rows = rows;
        this.columns = data.length / rows;
        this.data = data;
      }
      set(rowIndex, columnIndex, value) {
        let index = this._calculateIndex(rowIndex, columnIndex);
        this.data[index] = value;
        return this;
      }
      get(rowIndex, columnIndex) {
        let index = this._calculateIndex(rowIndex, columnIndex);
        return this.data[index];
      }
      _calculateIndex(row, column) {
        return row * this.columns + column;
      }
    };
    var WrapperMatrix2D = class extends AbstractMatrix {
      constructor(data) {
        super();
        this.data = data;
        this.rows = data.length;
        this.columns = data[0].length;
      }
      set(rowIndex, columnIndex, value) {
        this.data[rowIndex][columnIndex] = value;
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.data[rowIndex][columnIndex];
      }
    };
    function wrap(array, options) {
      if (isAnyArray(array)) {
        if (array[0] && isAnyArray(array[0])) {
          return new WrapperMatrix2D(array);
        } else {
          return new WrapperMatrix1D(array, options);
        }
      } else {
        throw new Error("the argument is not an array");
      }
    }
    var LuDecomposition = class {
      constructor(matrix) {
        matrix = WrapperMatrix2D.checkMatrix(matrix);
        let lu = matrix.clone();
        let rows = lu.rows;
        let columns = lu.columns;
        let pivotVector = new Float64Array(rows);
        let pivotSign = 1;
        let i, j, k, p, s, t, v;
        let LUcolj, kmax;
        for (i = 0; i < rows; i++) {
          pivotVector[i] = i;
        }
        LUcolj = new Float64Array(rows);
        for (j = 0; j < columns; j++) {
          for (i = 0; i < rows; i++) {
            LUcolj[i] = lu.get(i, j);
          }
          for (i = 0; i < rows; i++) {
            kmax = Math.min(i, j);
            s = 0;
            for (k = 0; k < kmax; k++) {
              s += lu.get(i, k) * LUcolj[k];
            }
            LUcolj[i] -= s;
            lu.set(i, j, LUcolj[i]);
          }
          p = j;
          for (i = j + 1; i < rows; i++) {
            if (Math.abs(LUcolj[i]) > Math.abs(LUcolj[p])) {
              p = i;
            }
          }
          if (p !== j) {
            for (k = 0; k < columns; k++) {
              t = lu.get(p, k);
              lu.set(p, k, lu.get(j, k));
              lu.set(j, k, t);
            }
            v = pivotVector[p];
            pivotVector[p] = pivotVector[j];
            pivotVector[j] = v;
            pivotSign = -pivotSign;
          }
          if (j < rows && lu.get(j, j) !== 0) {
            for (i = j + 1; i < rows; i++) {
              lu.set(i, j, lu.get(i, j) / lu.get(j, j));
            }
          }
        }
        this.LU = lu;
        this.pivotVector = pivotVector;
        this.pivotSign = pivotSign;
      }
      isSingular() {
        let data = this.LU;
        let col = data.columns;
        for (let j = 0; j < col; j++) {
          if (data.get(j, j) === 0) {
            return true;
          }
        }
        return false;
      }
      solve(value) {
        value = Matrix.checkMatrix(value);
        let lu = this.LU;
        let rows = lu.rows;
        if (rows !== value.rows) {
          throw new Error("Invalid matrix dimensions");
        }
        if (this.isSingular()) {
          throw new Error("LU matrix is singular");
        }
        let count = value.columns;
        let X = value.subMatrixRow(this.pivotVector, 0, count - 1);
        let columns = lu.columns;
        let i, j, k;
        for (k = 0; k < columns; k++) {
          for (i = k + 1; i < columns; i++) {
            for (j = 0; j < count; j++) {
              X.set(i, j, X.get(i, j) - X.get(k, j) * lu.get(i, k));
            }
          }
        }
        for (k = columns - 1; k >= 0; k--) {
          for (j = 0; j < count; j++) {
            X.set(k, j, X.get(k, j) / lu.get(k, k));
          }
          for (i = 0; i < k; i++) {
            for (j = 0; j < count; j++) {
              X.set(i, j, X.get(i, j) - X.get(k, j) * lu.get(i, k));
            }
          }
        }
        return X;
      }
      get determinant() {
        let data = this.LU;
        if (!data.isSquare()) {
          throw new Error("Matrix must be square");
        }
        let determinant2 = this.pivotSign;
        let col = data.columns;
        for (let j = 0; j < col; j++) {
          determinant2 *= data.get(j, j);
        }
        return determinant2;
      }
      get lowerTriangularMatrix() {
        let data = this.LU;
        let rows = data.rows;
        let columns = data.columns;
        let X = new Matrix(rows, columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            if (i > j) {
              X.set(i, j, data.get(i, j));
            } else if (i === j) {
              X.set(i, j, 1);
            } else {
              X.set(i, j, 0);
            }
          }
        }
        return X;
      }
      get upperTriangularMatrix() {
        let data = this.LU;
        let rows = data.rows;
        let columns = data.columns;
        let X = new Matrix(rows, columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            if (i <= j) {
              X.set(i, j, data.get(i, j));
            } else {
              X.set(i, j, 0);
            }
          }
        }
        return X;
      }
      get pivotPermutationVector() {
        return Array.from(this.pivotVector);
      }
    };
    function transposeSquareInPlace(matrix) {
      const data = matrix.data;
      const n = matrix.rows;
      for (let i = 0; i < n; i++) {
        const rowI = data[i];
        for (let j = i + 1; j < n; j++) {
          const tmp = rowI[j];
          rowI[j] = data[j][i];
          data[j][i] = tmp;
        }
      }
      return matrix;
    }
    function hypotenuse(a, b) {
      let r = 0;
      if (Math.abs(a) > Math.abs(b)) {
        r = b / a;
        return Math.abs(a) * Math.sqrt(1 + r * r);
      }
      if (b !== 0) {
        r = a / b;
        return Math.abs(b) * Math.sqrt(1 + r * r);
      }
      return 0;
    }
    var QrDecomposition = class {
      constructor(value) {
        value = WrapperMatrix2D.checkMatrix(value);
        let qr = value.clone();
        let m = value.rows;
        let n = value.columns;
        let rdiag = new Float64Array(n);
        let i, j, k, s;
        for (k = 0; k < n; k++) {
          let nrm = 0;
          for (i = k; i < m; i++) {
            nrm = hypotenuse(nrm, qr.get(i, k));
          }
          if (nrm !== 0) {
            if (qr.get(k, k) < 0) {
              nrm = -nrm;
            }
            for (i = k; i < m; i++) {
              qr.set(i, k, qr.get(i, k) / nrm);
            }
            qr.set(k, k, qr.get(k, k) + 1);
            for (j = k + 1; j < n; j++) {
              s = 0;
              for (i = k; i < m; i++) {
                s += qr.get(i, k) * qr.get(i, j);
              }
              s = -s / qr.get(k, k);
              for (i = k; i < m; i++) {
                qr.set(i, j, qr.get(i, j) + s * qr.get(i, k));
              }
            }
          }
          rdiag[k] = -nrm;
        }
        this.QR = qr;
        this.Rdiag = rdiag;
      }
      solve(value) {
        value = Matrix.checkMatrix(value);
        let qr = this.QR;
        let m = qr.rows;
        if (value.rows !== m) {
          throw new Error("Matrix row dimensions must agree");
        }
        if (!this.isFullRank()) {
          throw new Error("Matrix is rank deficient");
        }
        let count = value.columns;
        let X = value.clone();
        let n = qr.columns;
        let i, j, k, s;
        for (k = 0; k < n; k++) {
          for (j = 0; j < count; j++) {
            s = 0;
            for (i = k; i < m; i++) {
              s += qr.get(i, k) * X.get(i, j);
            }
            s = -s / qr.get(k, k);
            for (i = k; i < m; i++) {
              X.set(i, j, X.get(i, j) + s * qr.get(i, k));
            }
          }
        }
        for (k = n - 1; k >= 0; k--) {
          for (j = 0; j < count; j++) {
            X.set(k, j, X.get(k, j) / this.Rdiag[k]);
          }
          for (i = 0; i < k; i++) {
            for (j = 0; j < count; j++) {
              X.set(i, j, X.get(i, j) - X.get(k, j) * qr.get(i, k));
            }
          }
        }
        return X.subMatrix(0, n - 1, 0, count - 1);
      }
      isFullRank() {
        let columns = this.QR.columns;
        for (let i = 0; i < columns; i++) {
          if (this.Rdiag[i] === 0) {
            return false;
          }
        }
        return true;
      }
      get upperTriangularMatrix() {
        let qr = this.QR;
        let n = qr.columns;
        let X = new Matrix(n, n);
        let i, j;
        for (i = 0; i < n; i++) {
          for (j = 0; j < n; j++) {
            if (i < j) {
              X.set(i, j, qr.get(i, j));
            } else if (i === j) {
              X.set(i, j, this.Rdiag[i]);
            } else {
              X.set(i, j, 0);
            }
          }
        }
        return X;
      }
      get orthogonalMatrix() {
        let qr = this.QR;
        let rows = qr.rows;
        let columns = qr.columns;
        let X = new Matrix(rows, columns);
        let i, j, k, s;
        for (k = columns - 1; k >= 0; k--) {
          for (i = 0; i < rows; i++) {
            X.set(i, k, 0);
          }
          X.set(k, k, 1);
          for (j = k; j < columns; j++) {
            if (qr.get(k, k) !== 0) {
              s = 0;
              for (i = k; i < rows; i++) {
                s += qr.get(i, k) * X.get(i, j);
              }
              s = -s / qr.get(k, k);
              for (i = k; i < rows; i++) {
                X.set(i, j, X.get(i, j) + s * qr.get(i, k));
              }
            }
          }
        }
        return X;
      }
    };
    var SingularValueDecomposition = class {
      constructor(value, options = {}) {
        value = WrapperMatrix2D.checkMatrix(value);
        if (value.isEmpty()) {
          throw new Error("Matrix must be non-empty");
        }
        let m = value.rows;
        let n = value.columns;
        const {
          computeLeftSingularVectors = true,
          computeRightSingularVectors = true,
          autoTranspose = false
        } = options;
        let wantu = Boolean(computeLeftSingularVectors);
        let wantv = Boolean(computeRightSingularVectors);
        let swapped = false;
        let at;
        if (m < n) {
          if (!autoTranspose) {
            console.warn(
              "Computing SVD on a matrix with more columns than rows. Consider enabling autoTranspose"
            );
            at = value.transpose();
          } else {
            at = value.clone();
            m = value.columns;
            n = value.rows;
            swapped = true;
            let aux = wantu;
            wantu = wantv;
            wantv = aux;
          }
        } else {
          at = value.transpose();
        }
        let nu = Math.min(m, n);
        let ni = Math.min(m + 1, n);
        let s = new Float64Array(ni);
        let U = new Matrix(nu, m);
        let V = new Matrix(n, n);
        let e = new Float64Array(n);
        let work = new Float64Array(m);
        let si = new Float64Array(ni);
        for (let i = 0; i < ni; i++) si[i] = i;
        let nct = Math.min(m - 1, n);
        let nrt = Math.max(0, Math.min(n - 2, m));
        let mrc = Math.max(nct, nrt);
        for (let k = 0; k < mrc; k++) {
          if (k < nct) {
            s[k] = 0;
            for (let i = k; i < m; i++) {
              s[k] = hypotenuse(s[k], at.get(k, i));
            }
            if (s[k] !== 0) {
              if (at.get(k, k) < 0) {
                s[k] = -s[k];
              }
              for (let i = k; i < m; i++) {
                at.set(k, i, at.get(k, i) / s[k]);
              }
              at.set(k, k, at.get(k, k) + 1);
            }
            s[k] = -s[k];
          }
          for (let j = k + 1; j < n; j++) {
            if (k < nct && s[k] !== 0) {
              let t = 0;
              for (let i = k; i < m; i++) {
                t += at.get(k, i) * at.get(j, i);
              }
              t = -t / at.get(k, k);
              for (let i = k; i < m; i++) {
                at.set(j, i, at.get(j, i) + t * at.get(k, i));
              }
            }
            e[j] = at.get(j, k);
          }
          if (wantu && k < nct) {
            for (let i = k; i < m; i++) {
              U.set(k, i, at.get(k, i));
            }
          }
          if (k < nrt) {
            e[k] = 0;
            for (let i = k + 1; i < n; i++) {
              e[k] = hypotenuse(e[k], e[i]);
            }
            if (e[k] !== 0) {
              if (e[k + 1] < 0) {
                e[k] = 0 - e[k];
              }
              for (let i = k + 1; i < n; i++) {
                e[i] /= e[k];
              }
              e[k + 1] += 1;
            }
            e[k] = -e[k];
            if (k + 1 < m && e[k] !== 0) {
              for (let i = k + 1; i < m; i++) {
                work[i] = 0;
              }
              for (let i = k + 1; i < m; i++) {
                for (let j = k + 1; j < n; j++) {
                  work[i] += e[j] * at.get(j, i);
                }
              }
              for (let j = k + 1; j < n; j++) {
                let t = -e[j] / e[k + 1];
                for (let i = k + 1; i < m; i++) {
                  at.set(j, i, at.get(j, i) + t * work[i]);
                }
              }
            }
            if (wantv) {
              for (let i = k + 1; i < n; i++) {
                V.set(k, i, e[i]);
              }
            }
          }
        }
        let p = Math.min(n, m + 1);
        if (nct < n) {
          s[nct] = at.get(nct, nct);
        }
        if (m < p) {
          s[p - 1] = 0;
        }
        if (nrt + 1 < p) {
          e[nrt] = at.get(p - 1, nrt);
        }
        e[p - 1] = 0;
        if (wantu) {
          for (let j = nct; j < nu; j++) {
            for (let i = 0; i < m; i++) {
              U.set(j, i, 0);
            }
            U.set(j, j, 1);
          }
          for (let k = nct - 1; k >= 0; k--) {
            if (s[k] !== 0) {
              for (let j = k + 1; j < nu; j++) {
                let t = 0;
                for (let i = k; i < m; i++) {
                  t += U.get(k, i) * U.get(j, i);
                }
                t = -t / U.get(k, k);
                for (let i = k; i < m; i++) {
                  U.set(j, i, U.get(j, i) + t * U.get(k, i));
                }
              }
              for (let i = k; i < m; i++) {
                U.set(k, i, -U.get(k, i));
              }
              U.set(k, k, 1 + U.get(k, k));
              for (let i = 0; i < k - 1; i++) {
                U.set(k, i, 0);
              }
            } else {
              for (let i = 0; i < m; i++) {
                U.set(k, i, 0);
              }
              U.set(k, k, 1);
            }
          }
        }
        if (wantv) {
          for (let k = n - 1; k >= 0; k--) {
            if (k < nrt && e[k] !== 0) {
              for (let j = k + 1; j < n; j++) {
                let t = 0;
                for (let i = k + 1; i < n; i++) {
                  t += V.get(k, i) * V.get(j, i);
                }
                t = -t / V.get(k, k + 1);
                for (let i = k + 1; i < n; i++) {
                  V.set(j, i, V.get(j, i) + t * V.get(k, i));
                }
              }
            }
            for (let i = 0; i < n; i++) {
              V.set(k, i, 0);
            }
            V.set(k, k, 1);
          }
        }
        let pp = p - 1;
        let eps = Number.EPSILON;
        while (p > 0) {
          let k, kase;
          for (k = p - 2; k >= -1; k--) {
            if (k === -1) {
              break;
            }
            const alpha = Number.MIN_VALUE + eps * Math.abs(s[k] + Math.abs(s[k + 1]));
            if (Math.abs(e[k]) <= alpha || Number.isNaN(e[k])) {
              e[k] = 0;
              break;
            }
          }
          if (k === p - 2) {
            kase = 4;
          } else {
            let ks;
            for (ks = p - 1; ks >= k; ks--) {
              if (ks === k) {
                break;
              }
              let t = (ks !== p ? Math.abs(e[ks]) : 0) + (ks !== k + 1 ? Math.abs(e[ks - 1]) : 0);
              if (Math.abs(s[ks]) <= eps * t) {
                s[ks] = 0;
                break;
              }
            }
            if (ks === k) {
              kase = 3;
            } else if (ks === p - 1) {
              kase = 1;
            } else {
              kase = 2;
              k = ks;
            }
          }
          k++;
          switch (kase) {
            case 1: {
              let f = e[p - 2];
              e[p - 2] = 0;
              for (let j = p - 2; j >= k; j--) {
                let t = hypotenuse(s[j], f);
                let cs = s[j] / t;
                let sn = f / t;
                s[j] = t;
                if (j !== k) {
                  f = -sn * e[j - 1];
                  e[j - 1] = cs * e[j - 1];
                }
                if (wantv) {
                  for (let i = 0; i < n; i++) {
                    t = cs * V.get(j, i) + sn * V.get(p - 1, i);
                    V.set(p - 1, i, -sn * V.get(j, i) + cs * V.get(p - 1, i));
                    V.set(j, i, t);
                  }
                }
              }
              break;
            }
            case 2: {
              let f = e[k - 1];
              e[k - 1] = 0;
              for (let j = k; j < p; j++) {
                let t = hypotenuse(s[j], f);
                let cs = s[j] / t;
                let sn = f / t;
                s[j] = t;
                f = -sn * e[j];
                e[j] = cs * e[j];
                if (wantu) {
                  for (let i = 0; i < m; i++) {
                    t = cs * U.get(j, i) + sn * U.get(k - 1, i);
                    U.set(k - 1, i, -sn * U.get(j, i) + cs * U.get(k - 1, i));
                    U.set(j, i, t);
                  }
                }
              }
              break;
            }
            case 3: {
              const scale = Math.max(
                Math.abs(s[p - 1]),
                Math.abs(s[p - 2]),
                Math.abs(e[p - 2]),
                Math.abs(s[k]),
                Math.abs(e[k])
              );
              const sp = s[p - 1] / scale;
              const spm1 = s[p - 2] / scale;
              const epm1 = e[p - 2] / scale;
              const sk = s[k] / scale;
              const ek = e[k] / scale;
              const b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2;
              const c = sp * epm1 * (sp * epm1);
              let shift = 0;
              if (b !== 0 || c !== 0) {
                if (b < 0) {
                  shift = 0 - Math.sqrt(b * b + c);
                } else {
                  shift = Math.sqrt(b * b + c);
                }
                shift = c / (b + shift);
              }
              let f = (sk + sp) * (sk - sp) + shift;
              let g = sk * ek;
              for (let j = k; j < p - 1; j++) {
                let t = hypotenuse(f, g);
                if (t === 0) t = Number.MIN_VALUE;
                let cs = f / t;
                let sn = g / t;
                if (j !== k) {
                  e[j - 1] = t;
                }
                f = cs * s[j] + sn * e[j];
                e[j] = cs * e[j] - sn * s[j];
                g = sn * s[j + 1];
                s[j + 1] = cs * s[j + 1];
                if (wantv) {
                  for (let i = 0; i < n; i++) {
                    t = cs * V.get(j, i) + sn * V.get(j + 1, i);
                    V.set(j + 1, i, -sn * V.get(j, i) + cs * V.get(j + 1, i));
                    V.set(j, i, t);
                  }
                }
                t = hypotenuse(f, g);
                if (t === 0) t = Number.MIN_VALUE;
                cs = f / t;
                sn = g / t;
                s[j] = t;
                f = cs * e[j] + sn * s[j + 1];
                s[j + 1] = -sn * e[j] + cs * s[j + 1];
                g = sn * e[j + 1];
                e[j + 1] = cs * e[j + 1];
                if (wantu && j < m - 1) {
                  for (let i = 0; i < m; i++) {
                    t = cs * U.get(j, i) + sn * U.get(j + 1, i);
                    U.set(j + 1, i, -sn * U.get(j, i) + cs * U.get(j + 1, i));
                    U.set(j, i, t);
                  }
                }
              }
              e[p - 2] = f;
              break;
            }
            case 4: {
              if (s[k] <= 0) {
                s[k] = s[k] < 0 ? -s[k] : 0;
                if (wantv) {
                  for (let i = 0; i <= pp; i++) {
                    V.set(k, i, -V.get(k, i));
                  }
                }
              }
              while (k < pp) {
                if (s[k] >= s[k + 1]) {
                  break;
                }
                let t = s[k];
                s[k] = s[k + 1];
                s[k + 1] = t;
                if (wantv && k < n - 1) {
                  for (let i = 0; i < n; i++) {
                    t = V.get(k + 1, i);
                    V.set(k + 1, i, V.get(k, i));
                    V.set(k, i, t);
                  }
                }
                if (wantu && k < m - 1) {
                  for (let i = 0; i < m; i++) {
                    t = U.get(k + 1, i);
                    U.set(k + 1, i, U.get(k, i));
                    U.set(k, i, t);
                  }
                }
                k++;
              }
              p--;
              break;
            }
          }
        }
        U = U.isSquare() ? transposeSquareInPlace(U) : U.transpose();
        V = transposeSquareInPlace(V);
        if (swapped) {
          let tmp = V;
          V = U;
          U = tmp;
        }
        this.m = m;
        this.n = n;
        this.s = s;
        this.U = U;
        this.V = V;
      }
      solve(value) {
        let Y = value;
        let e = this.threshold;
        let scols = this.s.length;
        let Ls = Matrix.zeros(scols, scols);
        for (let i = 0; i < scols; i++) {
          if (Math.abs(this.s[i]) <= e) {
            Ls.set(i, i, 0);
          } else {
            Ls.set(i, i, 1 / this.s[i]);
          }
        }
        let U = this.U;
        let V = this.rightSingularVectors;
        let VL = V.mmul(Ls);
        let vrows = V.rows;
        let urows = U.rows;
        let VLU = Matrix.zeros(vrows, urows);
        for (let i = 0; i < vrows; i++) {
          for (let j = 0; j < urows; j++) {
            let sum2 = 0;
            for (let k = 0; k < scols; k++) {
              sum2 += VL.get(i, k) * U.get(j, k);
            }
            VLU.set(i, j, sum2);
          }
        }
        return VLU.mmul(Y);
      }
      solveForDiagonal(value) {
        return this.solve(Matrix.diag(value));
      }
      inverse() {
        let V = this.V;
        let e = this.threshold;
        let vrows = V.rows;
        let vcols = V.columns;
        let X = new Matrix(vrows, this.s.length);
        for (let i = 0; i < vrows; i++) {
          for (let j = 0; j < vcols; j++) {
            if (Math.abs(this.s[j]) > e) {
              X.set(i, j, V.get(i, j) / this.s[j]);
            }
          }
        }
        let U = this.U;
        let urows = U.rows;
        let ucols = U.columns;
        let Y = new Matrix(vrows, urows);
        for (let i = 0; i < vrows; i++) {
          for (let j = 0; j < urows; j++) {
            let sum2 = 0;
            for (let k = 0; k < ucols; k++) {
              sum2 += X.get(i, k) * U.get(j, k);
            }
            Y.set(i, j, sum2);
          }
        }
        return Y;
      }
      get condition() {
        return this.s[0] / this.s[Math.min(this.m, this.n) - 1];
      }
      get norm2() {
        return this.s[0];
      }
      get rank() {
        let tol = Math.max(this.m, this.n) * this.s[0] * Number.EPSILON;
        let r = 0;
        let s = this.s;
        for (let i = 0, ii = s.length; i < ii; i++) {
          if (s[i] > tol) {
            r++;
          }
        }
        return r;
      }
      get diagonal() {
        return Array.from(this.s);
      }
      get threshold() {
        return Number.EPSILON / 2 * Math.max(this.m, this.n) * this.s[0];
      }
      get leftSingularVectors() {
        return this.U;
      }
      get rightSingularVectors() {
        return this.V;
      }
      get diagonalMatrix() {
        return Matrix.diag(this.s);
      }
    };
    function inverse(matrix, useSVD = false) {
      matrix = WrapperMatrix2D.checkMatrix(matrix);
      if (useSVD) {
        return new SingularValueDecomposition(matrix).inverse();
      } else {
        return solve(matrix, Matrix.eye(matrix.rows));
      }
    }
    function solve(leftHandSide, rightHandSide, useSVD = false) {
      leftHandSide = WrapperMatrix2D.checkMatrix(leftHandSide);
      rightHandSide = WrapperMatrix2D.checkMatrix(rightHandSide);
      if (useSVD) {
        return new SingularValueDecomposition(leftHandSide).solve(rightHandSide);
      } else {
        return leftHandSide.isSquare() ? new LuDecomposition(leftHandSide).solve(rightHandSide) : new QrDecomposition(leftHandSide).solve(rightHandSide);
      }
    }
    function determinant(matrix) {
      matrix = Matrix.checkMatrix(matrix);
      if (matrix.isSquare()) {
        if (matrix.columns === 0) {
          return 1;
        }
        let a, b, c, d;
        if (matrix.columns === 2) {
          a = matrix.get(0, 0);
          b = matrix.get(0, 1);
          c = matrix.get(1, 0);
          d = matrix.get(1, 1);
          return a * d - b * c;
        } else if (matrix.columns === 3) {
          let subMatrix0, subMatrix1, subMatrix2;
          subMatrix0 = new MatrixSelectionView(matrix, [1, 2], [1, 2]);
          subMatrix1 = new MatrixSelectionView(matrix, [1, 2], [0, 2]);
          subMatrix2 = new MatrixSelectionView(matrix, [1, 2], [0, 1]);
          a = matrix.get(0, 0);
          b = matrix.get(0, 1);
          c = matrix.get(0, 2);
          return a * determinant(subMatrix0) - b * determinant(subMatrix1) + c * determinant(subMatrix2);
        } else {
          return new LuDecomposition(matrix).determinant;
        }
      } else {
        throw Error("determinant can only be calculated for a square matrix");
      }
    }
    function xrange(n, exception) {
      let range = [];
      for (let i = 0; i < n; i++) {
        if (i !== exception) {
          range.push(i);
        }
      }
      return range;
    }
    function dependenciesOneRow(error, matrix, index, thresholdValue = 1e-9, thresholdError = 1e-9) {
      if (error > thresholdError) {
        return new Array(matrix.rows + 1).fill(0);
      } else {
        let returnArray = matrix.addRow(index, [0]);
        for (let i = 0; i < returnArray.rows; i++) {
          if (Math.abs(returnArray.get(i, 0)) < thresholdValue) {
            returnArray.set(i, 0, 0);
          }
        }
        return returnArray.to1DArray();
      }
    }
    function linearDependencies(matrix, options = {}) {
      const { thresholdValue = 1e-9, thresholdError = 1e-9 } = options;
      matrix = Matrix.checkMatrix(matrix);
      let n = matrix.rows;
      let results = new Matrix(n, n);
      for (let i = 0; i < n; i++) {
        let b = Matrix.columnVector(matrix.getRow(i));
        let Abis = matrix.subMatrixRow(xrange(n, i)).transpose();
        let svd = new SingularValueDecomposition(Abis);
        let x = svd.solve(b);
        let scale = Matrix.abs(b).max() || 1;
        let error = Matrix.sub(b, Abis.mmul(x)).abs().max() / scale;
        results.setRow(
          i,
          dependenciesOneRow(error, x, i, thresholdValue, thresholdError)
        );
      }
      return results;
    }
    function pseudoInverse(matrix, threshold = Number.EPSILON) {
      matrix = Matrix.checkMatrix(matrix);
      if (matrix.isEmpty()) {
        return matrix.transpose();
      }
      let svdSolution = new SingularValueDecomposition(matrix, { autoTranspose: true });
      let U = svdSolution.leftSingularVectors;
      let V = svdSolution.rightSingularVectors;
      let s = svdSolution.diagonal;
      const cutoff = threshold * Math.max(matrix.rows, matrix.columns) * s[0];
      for (let i = 0; i < s.length; i++) {
        if (Math.abs(s[i]) > cutoff) {
          s[i] = 1 / s[i];
        } else {
          s[i] = 0;
        }
      }
      return V.mmul(Matrix.diag(s).mmul(U.transpose()));
    }
    function covariance(xMatrix, yMatrix = xMatrix, options = {}) {
      xMatrix = new Matrix(xMatrix);
      let yIsSame = false;
      if (typeof yMatrix === "object" && !Matrix.isMatrix(yMatrix) && !isAnyArray(yMatrix)) {
        options = yMatrix;
        yMatrix = xMatrix;
        yIsSame = true;
      } else {
        yMatrix = new Matrix(yMatrix);
      }
      if (xMatrix.rows !== yMatrix.rows) {
        throw new TypeError("Both matrices must have the same number of rows");
      }
      const { center = true } = options;
      if (center) {
        xMatrix = xMatrix.center("column");
        if (!yIsSame) {
          yMatrix = yMatrix.center("column");
        }
      }
      const cov = xMatrix.transposeMultiply(yMatrix);
      for (let i = 0; i < cov.rows; i++) {
        for (let j = 0; j < cov.columns; j++) {
          cov.set(i, j, cov.get(i, j) * (1 / (xMatrix.rows - 1)));
        }
      }
      return cov;
    }
    function correlation(xMatrix, yMatrix = xMatrix, options = {}) {
      xMatrix = new Matrix(xMatrix);
      let yIsSame = false;
      if (typeof yMatrix === "object" && !Matrix.isMatrix(yMatrix) && !isAnyArray(yMatrix)) {
        options = yMatrix;
        yMatrix = xMatrix;
        yIsSame = true;
      } else {
        yMatrix = new Matrix(yMatrix);
      }
      if (xMatrix.rows !== yMatrix.rows) {
        throw new TypeError("Both matrices must have the same number of rows");
      }
      const { center = true, scale = true } = options;
      if (center) {
        xMatrix.center("column");
        if (!yIsSame) {
          yMatrix.center("column");
        }
      }
      if (scale) {
        xMatrix.scale("column");
        if (!yIsSame) {
          yMatrix.scale("column");
        }
      }
      const sdx = xMatrix.standardDeviation("column", { unbiased: true });
      const sdy = yIsSame ? sdx : yMatrix.standardDeviation("column", { unbiased: true });
      const corr = xMatrix.transposeMultiply(yMatrix);
      for (let i = 0; i < corr.rows; i++) {
        for (let j = 0; j < corr.columns; j++) {
          corr.set(
            i,
            j,
            corr.get(i, j) * (1 / (sdx[i] * sdy[j])) * (1 / (xMatrix.rows - 1))
          );
        }
      }
      return corr;
    }
    var EigenvalueDecomposition = class {
      constructor(matrix, options = {}) {
        const { assumeSymmetric = false } = options;
        matrix = WrapperMatrix2D.checkMatrix(matrix);
        if (!matrix.isSquare()) {
          throw new Error("Matrix is not a square matrix");
        }
        if (matrix.isEmpty()) {
          throw new Error("Matrix must be non-empty");
        }
        let n = matrix.columns;
        let V = new Matrix(n, n);
        let d = new Float64Array(n);
        let e = new Float64Array(n);
        let value = matrix;
        let i, j;
        let isSymmetric = false;
        if (assumeSymmetric) {
          isSymmetric = true;
        } else {
          isSymmetric = matrix.isSymmetric();
        }
        if (isSymmetric) {
          for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
              V.set(j, i, value.get(i, j));
            }
          }
          tred2(n, e, d, V);
          tql2(n, e, d, V);
          transposeSquareInPlace(V);
        } else {
          let H = new Matrix(n, n);
          let ort = new Float64Array(n);
          for (j = 0; j < n; j++) {
            for (i = 0; i < n; i++) {
              H.set(i, j, value.get(i, j));
            }
          }
          orthes(n, H, ort, V);
          hqr2(n, e, d, V, H);
        }
        this.n = n;
        this.e = e;
        this.d = d;
        this.V = V;
      }
      get realEigenvalues() {
        return Array.from(this.d);
      }
      get imaginaryEigenvalues() {
        return Array.from(this.e);
      }
      get eigenvectorMatrix() {
        return this.V;
      }
      get diagonalMatrix() {
        let n = this.n;
        let e = this.e;
        let d = this.d;
        let X = new Matrix(n, n);
        let i, j;
        for (i = 0; i < n; i++) {
          for (j = 0; j < n; j++) {
            X.set(i, j, 0);
          }
          X.set(i, i, d[i]);
          if (e[i] > 0) {
            X.set(i, i + 1, e[i]);
          } else if (e[i] < 0) {
            X.set(i, i - 1, e[i]);
          }
        }
        return X;
      }
    };
    function tred2(n, e, d, V) {
      let f, g, h, i, j, k, hh, scale;
      for (j = 0; j < n; j++) {
        d[j] = V.get(j, n - 1);
      }
      for (i = n - 1; i > 0; i--) {
        scale = 0;
        h = 0;
        for (k = 0; k < i; k++) {
          scale = scale + Math.abs(d[k]);
        }
        if (scale === 0) {
          e[i] = d[i - 1];
          for (j = 0; j < i; j++) {
            d[j] = V.get(j, i - 1);
            V.set(j, i, 0);
            V.set(i, j, 0);
          }
        } else {
          for (k = 0; k < i; k++) {
            d[k] /= scale;
            h += d[k] * d[k];
          }
          f = d[i - 1];
          g = Math.sqrt(h);
          if (f > 0) {
            g = -g;
          }
          e[i] = scale * g;
          h = h - f * g;
          d[i - 1] = f - g;
          for (j = 0; j < i; j++) {
            e[j] = 0;
          }
          for (j = 0; j < i; j++) {
            f = d[j];
            V.set(i, j, f);
            g = e[j] + V.get(j, j) * f;
            for (k = j + 1; k <= i - 1; k++) {
              g += V.get(j, k) * d[k];
              e[k] += V.get(j, k) * f;
            }
            e[j] = g;
          }
          f = 0;
          for (j = 0; j < i; j++) {
            e[j] /= h;
            f += e[j] * d[j];
          }
          hh = f / (h + h);
          for (j = 0; j < i; j++) {
            e[j] -= hh * d[j];
          }
          for (j = 0; j < i; j++) {
            f = d[j];
            g = e[j];
            for (k = j; k <= i - 1; k++) {
              V.set(j, k, V.get(j, k) - (f * e[k] + g * d[k]));
            }
            d[j] = V.get(j, i - 1);
            V.set(j, i, 0);
          }
        }
        d[i] = h;
      }
      for (i = 0; i < n - 1; i++) {
        V.set(i, n - 1, V.get(i, i));
        V.set(i, i, 1);
        h = d[i + 1];
        if (h !== 0) {
          for (k = 0; k <= i; k++) {
            d[k] = V.get(i + 1, k) / h;
          }
          for (j = 0; j <= i; j++) {
            g = 0;
            for (k = 0; k <= i; k++) {
              g += V.get(i + 1, k) * V.get(j, k);
            }
            for (k = 0; k <= i; k++) {
              V.set(j, k, V.get(j, k) - g * d[k]);
            }
          }
        }
        for (k = 0; k <= i; k++) {
          V.set(i + 1, k, 0);
        }
      }
      for (j = 0; j < n; j++) {
        d[j] = V.get(j, n - 1);
        V.set(j, n - 1, 0);
      }
      V.set(n - 1, n - 1, 1);
      e[0] = 0;
    }
    function tql2(n, e, d, V) {
      let g, h, i, j, k, l, m, p, r, dl1, c, c2, c3, el1, s, s2;
      for (i = 1; i < n; i++) {
        e[i - 1] = e[i];
      }
      e[n - 1] = 0;
      let f = 0;
      let tst1 = 0;
      let eps = Number.EPSILON;
      for (l = 0; l < n; l++) {
        tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
        m = l;
        while (m < n) {
          if (Math.abs(e[m]) <= eps * tst1) {
            break;
          }
          m++;
        }
        if (m > l) {
          do {
            g = d[l];
            p = (d[l + 1] - g) / (2 * e[l]);
            r = hypotenuse(p, 1);
            if (p < 0) {
              r = -r;
            }
            d[l] = e[l] / (p + r);
            d[l + 1] = e[l] * (p + r);
            dl1 = d[l + 1];
            h = g - d[l];
            for (i = l + 2; i < n; i++) {
              d[i] -= h;
            }
            f = f + h;
            p = d[m];
            c = 1;
            c2 = c;
            c3 = c;
            el1 = e[l + 1];
            s = 0;
            s2 = 0;
            for (i = m - 1; i >= l; i--) {
              c3 = c2;
              c2 = c;
              s2 = s;
              g = c * e[i];
              h = c * p;
              r = hypotenuse(p, e[i]);
              e[i + 1] = s * r;
              s = e[i] / r;
              c = p / r;
              p = c * d[i] - s * g;
              d[i + 1] = h + s * (c * g + s * d[i]);
              for (k = 0; k < n; k++) {
                h = V.get(i + 1, k);
                V.set(i + 1, k, s * V.get(i, k) + c * h);
                V.set(i, k, c * V.get(i, k) - s * h);
              }
            }
            p = -s * s2 * c3 * el1 * e[l] / dl1;
            e[l] = s * p;
            d[l] = c * p;
          } while (Math.abs(e[l]) > eps * tst1);
        }
        d[l] = d[l] + f;
        e[l] = 0;
      }
      for (i = 0; i < n - 1; i++) {
        k = i;
        p = d[i];
        for (j = i + 1; j < n; j++) {
          if (d[j] < p) {
            k = j;
            p = d[j];
          }
        }
        if (k !== i) {
          d[k] = d[i];
          d[i] = p;
          for (j = 0; j < n; j++) {
            p = V.get(i, j);
            V.set(i, j, V.get(k, j));
            V.set(k, j, p);
          }
        }
      }
    }
    function orthes(n, H, ort, V) {
      let low = 0;
      let high = n - 1;
      let f, g, h, i, j, m;
      let scale;
      for (m = low + 1; m <= high - 1; m++) {
        scale = 0;
        for (i = m; i <= high; i++) {
          scale = scale + Math.abs(H.get(i, m - 1));
        }
        if (scale !== 0) {
          h = 0;
          for (i = high; i >= m; i--) {
            ort[i] = H.get(i, m - 1) / scale;
            h += ort[i] * ort[i];
          }
          g = Math.sqrt(h);
          if (ort[m] > 0) {
            g = -g;
          }
          h = h - ort[m] * g;
          ort[m] = ort[m] - g;
          for (j = m; j < n; j++) {
            f = 0;
            for (i = high; i >= m; i--) {
              f += ort[i] * H.get(i, j);
            }
            f = f / h;
            for (i = m; i <= high; i++) {
              H.set(i, j, H.get(i, j) - f * ort[i]);
            }
          }
          for (i = 0; i <= high; i++) {
            f = 0;
            for (j = high; j >= m; j--) {
              f += ort[j] * H.get(i, j);
            }
            f = f / h;
            for (j = m; j <= high; j++) {
              H.set(i, j, H.get(i, j) - f * ort[j]);
            }
          }
          ort[m] = scale * ort[m];
          H.set(m, m - 1, scale * g);
        }
      }
      for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
          V.set(i, j, i === j ? 1 : 0);
        }
      }
      for (m = high - 1; m >= low + 1; m--) {
        if (H.get(m, m - 1) !== 0) {
          for (i = m + 1; i <= high; i++) {
            ort[i] = H.get(i, m - 1);
          }
          for (j = m; j <= high; j++) {
            g = 0;
            for (i = m; i <= high; i++) {
              g += ort[i] * V.get(i, j);
            }
            g = g / ort[m] / H.get(m, m - 1);
            for (i = m; i <= high; i++) {
              V.set(i, j, V.get(i, j) + g * ort[i]);
            }
          }
        }
      }
    }
    function hqr2(nn, e, d, V, H) {
      let n = nn - 1;
      let low = 0;
      let high = nn - 1;
      let eps = Number.EPSILON;
      let exshift = 0;
      let norm = 0;
      let p = 0;
      let q = 0;
      let r = 0;
      let s = 0;
      let z = 0;
      let iter = 0;
      let i, j, k, l, m, t, w, x, y;
      let ra, sa, vr, vi;
      let notlast, cdivres;
      for (i = 0; i < nn; i++) {
        if (i < low || i > high) {
          d[i] = H.get(i, i);
          e[i] = 0;
        }
        for (j = Math.max(i - 1, 0); j < nn; j++) {
          norm = norm + Math.abs(H.get(i, j));
        }
      }
      while (n >= low) {
        l = n;
        while (l > low) {
          s = Math.abs(H.get(l - 1, l - 1)) + Math.abs(H.get(l, l));
          if (s === 0) {
            s = norm;
          }
          if (Math.abs(H.get(l, l - 1)) < eps * s) {
            break;
          }
          l--;
        }
        if (l === n) {
          H.set(n, n, H.get(n, n) + exshift);
          d[n] = H.get(n, n);
          e[n] = 0;
          n--;
          iter = 0;
        } else if (l === n - 1) {
          w = H.get(n, n - 1) * H.get(n - 1, n);
          p = (H.get(n - 1, n - 1) - H.get(n, n)) / 2;
          q = p * p + w;
          z = Math.sqrt(Math.abs(q));
          H.set(n, n, H.get(n, n) + exshift);
          H.set(n - 1, n - 1, H.get(n - 1, n - 1) + exshift);
          x = H.get(n, n);
          if (q >= 0) {
            z = p >= 0 ? p + z : p - z;
            d[n - 1] = x + z;
            d[n] = d[n - 1];
            if (z !== 0) {
              d[n] = x - w / z;
            }
            e[n - 1] = 0;
            e[n] = 0;
            x = H.get(n, n - 1);
            s = Math.abs(x) + Math.abs(z);
            p = x / s;
            q = z / s;
            r = Math.sqrt(p * p + q * q);
            p = p / r;
            q = q / r;
            for (j = n - 1; j < nn; j++) {
              z = H.get(n - 1, j);
              H.set(n - 1, j, q * z + p * H.get(n, j));
              H.set(n, j, q * H.get(n, j) - p * z);
            }
            for (i = 0; i <= n; i++) {
              z = H.get(i, n - 1);
              H.set(i, n - 1, q * z + p * H.get(i, n));
              H.set(i, n, q * H.get(i, n) - p * z);
            }
            for (i = low; i <= high; i++) {
              z = V.get(i, n - 1);
              V.set(i, n - 1, q * z + p * V.get(i, n));
              V.set(i, n, q * V.get(i, n) - p * z);
            }
          } else {
            d[n - 1] = x + p;
            d[n] = x + p;
            e[n - 1] = z;
            e[n] = -z;
          }
          n = n - 2;
          iter = 0;
        } else {
          x = H.get(n, n);
          y = 0;
          w = 0;
          if (l < n) {
            y = H.get(n - 1, n - 1);
            w = H.get(n, n - 1) * H.get(n - 1, n);
          }
          if (iter === 10) {
            exshift += x;
            for (i = low; i <= n; i++) {
              H.set(i, i, H.get(i, i) - x);
            }
            s = Math.abs(H.get(n, n - 1)) + Math.abs(H.get(n - 1, n - 2));
            x = y = 0.75 * s;
            w = -0.4375 * s * s;
          }
          if (iter === 30) {
            s = (y - x) / 2;
            s = s * s + w;
            if (s > 0) {
              s = Math.sqrt(s);
              if (y < x) {
                s = -s;
              }
              s = x - w / ((y - x) / 2 + s);
              for (i = low; i <= n; i++) {
                H.set(i, i, H.get(i, i) - s);
              }
              exshift += s;
              x = y = w = 0.964;
            }
          }
          iter = iter + 1;
          m = n - 2;
          while (m >= l) {
            z = H.get(m, m);
            r = x - z;
            s = y - z;
            p = (r * s - w) / H.get(m + 1, m) + H.get(m, m + 1);
            q = H.get(m + 1, m + 1) - z - r - s;
            r = H.get(m + 2, m + 1);
            s = Math.abs(p) + Math.abs(q) + Math.abs(r);
            p = p / s;
            q = q / s;
            r = r / s;
            if (m === l) {
              break;
            }
            if (Math.abs(H.get(m, m - 1)) * (Math.abs(q) + Math.abs(r)) < eps * (Math.abs(p) * (Math.abs(H.get(m - 1, m - 1)) + Math.abs(z) + Math.abs(H.get(m + 1, m + 1))))) {
              break;
            }
            m--;
          }
          for (i = m + 2; i <= n; i++) {
            H.set(i, i - 2, 0);
            if (i > m + 2) {
              H.set(i, i - 3, 0);
            }
          }
          for (k = m; k <= n - 1; k++) {
            notlast = k !== n - 1;
            if (k !== m) {
              p = H.get(k, k - 1);
              q = H.get(k + 1, k - 1);
              r = notlast ? H.get(k + 2, k - 1) : 0;
              x = Math.abs(p) + Math.abs(q) + Math.abs(r);
              if (x !== 0) {
                p = p / x;
                q = q / x;
                r = r / x;
              }
            }
            if (x === 0) {
              break;
            }
            s = Math.sqrt(p * p + q * q + r * r);
            if (p < 0) {
              s = -s;
            }
            if (s !== 0) {
              if (k !== m) {
                H.set(k, k - 1, -s * x);
              } else if (l !== m) {
                H.set(k, k - 1, -H.get(k, k - 1));
              }
              p = p + s;
              x = p / s;
              y = q / s;
              z = r / s;
              q = q / p;
              r = r / p;
              for (j = k; j < nn; j++) {
                p = H.get(k, j) + q * H.get(k + 1, j);
                if (notlast) {
                  p = p + r * H.get(k + 2, j);
                  H.set(k + 2, j, H.get(k + 2, j) - p * z);
                }
                H.set(k, j, H.get(k, j) - p * x);
                H.set(k + 1, j, H.get(k + 1, j) - p * y);
              }
              for (i = 0; i <= Math.min(n, k + 3); i++) {
                p = x * H.get(i, k) + y * H.get(i, k + 1);
                if (notlast) {
                  p = p + z * H.get(i, k + 2);
                  H.set(i, k + 2, H.get(i, k + 2) - p * r);
                }
                H.set(i, k, H.get(i, k) - p);
                H.set(i, k + 1, H.get(i, k + 1) - p * q);
              }
              for (i = low; i <= high; i++) {
                p = x * V.get(i, k) + y * V.get(i, k + 1);
                if (notlast) {
                  p = p + z * V.get(i, k + 2);
                  V.set(i, k + 2, V.get(i, k + 2) - p * r);
                }
                V.set(i, k, V.get(i, k) - p);
                V.set(i, k + 1, V.get(i, k + 1) - p * q);
              }
            }
          }
        }
      }
      if (norm === 0) {
        return;
      }
      for (n = nn - 1; n >= 0; n--) {
        p = d[n];
        q = e[n];
        if (q === 0) {
          l = n;
          H.set(n, n, 1);
          for (i = n - 1; i >= 0; i--) {
            w = H.get(i, i) - p;
            r = 0;
            for (j = l; j <= n; j++) {
              r = r + H.get(i, j) * H.get(j, n);
            }
            if (e[i] < 0) {
              z = w;
              s = r;
            } else {
              l = i;
              if (e[i] === 0) {
                H.set(i, n, w !== 0 ? -r / w : -r / (eps * norm));
              } else {
                x = H.get(i, i + 1);
                y = H.get(i + 1, i);
                q = (d[i] - p) * (d[i] - p) + e[i] * e[i];
                t = (x * s - z * r) / q;
                H.set(i, n, t);
                H.set(
                  i + 1,
                  n,
                  Math.abs(x) > Math.abs(z) ? (-r - w * t) / x : (-s - y * t) / z
                );
              }
              t = Math.abs(H.get(i, n));
              if (eps * t * t > 1) {
                for (j = i; j <= n; j++) {
                  H.set(j, n, H.get(j, n) / t);
                }
              }
            }
          }
        } else if (q < 0) {
          l = n - 1;
          if (Math.abs(H.get(n, n - 1)) > Math.abs(H.get(n - 1, n))) {
            H.set(n - 1, n - 1, q / H.get(n, n - 1));
            H.set(n - 1, n, -(H.get(n, n) - p) / H.get(n, n - 1));
          } else {
            cdivres = cdiv(0, -H.get(n - 1, n), H.get(n - 1, n - 1) - p, q);
            H.set(n - 1, n - 1, cdivres[0]);
            H.set(n - 1, n, cdivres[1]);
          }
          H.set(n, n - 1, 0);
          H.set(n, n, 1);
          for (i = n - 2; i >= 0; i--) {
            ra = 0;
            sa = 0;
            for (j = l; j <= n; j++) {
              ra = ra + H.get(i, j) * H.get(j, n - 1);
              sa = sa + H.get(i, j) * H.get(j, n);
            }
            w = H.get(i, i) - p;
            if (e[i] < 0) {
              z = w;
              r = ra;
              s = sa;
            } else {
              l = i;
              if (e[i] === 0) {
                cdivres = cdiv(-ra, -sa, w, q);
                H.set(i, n - 1, cdivres[0]);
                H.set(i, n, cdivres[1]);
              } else {
                x = H.get(i, i + 1);
                y = H.get(i + 1, i);
                vr = (d[i] - p) * (d[i] - p) + e[i] * e[i] - q * q;
                vi = (d[i] - p) * 2 * q;
                if (vr === 0 && vi === 0) {
                  vr = eps * norm * (Math.abs(w) + Math.abs(q) + Math.abs(x) + Math.abs(y) + Math.abs(z));
                }
                cdivres = cdiv(
                  x * r - z * ra + q * sa,
                  x * s - z * sa - q * ra,
                  vr,
                  vi
                );
                H.set(i, n - 1, cdivres[0]);
                H.set(i, n, cdivres[1]);
                if (Math.abs(x) > Math.abs(z) + Math.abs(q)) {
                  H.set(
                    i + 1,
                    n - 1,
                    (-ra - w * H.get(i, n - 1) + q * H.get(i, n)) / x
                  );
                  H.set(
                    i + 1,
                    n,
                    (-sa - w * H.get(i, n) - q * H.get(i, n - 1)) / x
                  );
                } else {
                  cdivres = cdiv(
                    -r - y * H.get(i, n - 1),
                    -s - y * H.get(i, n),
                    z,
                    q
                  );
                  H.set(i + 1, n - 1, cdivres[0]);
                  H.set(i + 1, n, cdivres[1]);
                }
              }
              t = Math.max(Math.abs(H.get(i, n - 1)), Math.abs(H.get(i, n)));
              if (eps * t * t > 1) {
                for (j = i; j <= n; j++) {
                  H.set(j, n - 1, H.get(j, n - 1) / t);
                  H.set(j, n, H.get(j, n) / t);
                }
              }
            }
          }
        }
      }
      for (i = 0; i < nn; i++) {
        if (i < low || i > high) {
          for (j = i; j < nn; j++) {
            V.set(i, j, H.get(i, j));
          }
        }
      }
      for (j = nn - 1; j >= low; j--) {
        for (i = low; i <= high; i++) {
          z = 0;
          for (k = low; k <= Math.min(j, high); k++) {
            z = z + V.get(i, k) * H.get(k, j);
          }
          V.set(i, j, z);
        }
      }
    }
    function cdiv(xr, xi, yr, yi) {
      let r, d;
      if (Math.abs(yr) > Math.abs(yi)) {
        r = yi / yr;
        d = yr + r * yi;
        return [(xr + r * xi) / d, (xi - r * xr) / d];
      } else {
        r = yr / yi;
        d = yi + r * yr;
        return [(r * xr + xi) / d, (r * xi - xr) / d];
      }
    }
    var CholeskyDecomposition = class {
      constructor(value) {
        value = WrapperMatrix2D.checkMatrix(value);
        if (!value.isSymmetric()) {
          throw new Error("Matrix is not symmetric");
        }
        let a = value;
        let dimension = a.rows;
        let l = new Matrix(dimension, dimension);
        let positiveDefinite = true;
        let i, j, k;
        for (j = 0; j < dimension; j++) {
          let d = 0;
          for (k = 0; k < j; k++) {
            let s = 0;
            for (i = 0; i < k; i++) {
              s += l.get(k, i) * l.get(j, i);
            }
            s = (a.get(j, k) - s) / l.get(k, k);
            l.set(j, k, s);
            d = d + s * s;
          }
          d = a.get(j, j) - d;
          positiveDefinite &&= d > 0;
          l.set(j, j, Math.sqrt(Math.max(d, 0)));
          for (k = j + 1; k < dimension; k++) {
            l.set(j, k, 0);
          }
        }
        this.L = l;
        this.positiveDefinite = positiveDefinite;
      }
      isPositiveDefinite() {
        return this.positiveDefinite;
      }
      solve(value) {
        value = WrapperMatrix2D.checkMatrix(value);
        let l = this.L;
        let dimension = l.rows;
        if (value.rows !== dimension) {
          throw new Error("Matrix dimensions do not match");
        }
        if (this.isPositiveDefinite() === false) {
          throw new Error("Matrix is not positive definite");
        }
        let count = value.columns;
        let B = value.clone();
        let i, j, k;
        for (k = 0; k < dimension; k++) {
          for (j = 0; j < count; j++) {
            for (i = 0; i < k; i++) {
              B.set(k, j, B.get(k, j) - B.get(i, j) * l.get(k, i));
            }
            B.set(k, j, B.get(k, j) / l.get(k, k));
          }
        }
        for (k = dimension - 1; k >= 0; k--) {
          for (j = 0; j < count; j++) {
            for (i = k + 1; i < dimension; i++) {
              B.set(k, j, B.get(k, j) - B.get(i, j) * l.get(i, k));
            }
            B.set(k, j, B.get(k, j) / l.get(k, k));
          }
        }
        return B;
      }
      get lowerTriangularMatrix() {
        return this.L;
      }
    };
    var nipals = class {
      constructor(X, options = {}) {
        X = WrapperMatrix2D.checkMatrix(X);
        let { Y } = options;
        const {
          scaleScores = false,
          maxIterations = 1e3,
          terminationCriteria = 1e-10
        } = options;
        let u;
        if (Y) {
          if (isAnyArray(Y) && typeof Y[0] === "number") {
            Y = Matrix.columnVector(Y);
          } else {
            Y = WrapperMatrix2D.checkMatrix(Y);
          }
          if (Y.rows !== X.rows) {
            throw new Error("Y should have the same number of rows as X");
          }
          u = Y.getColumnVector(0);
        } else {
          u = X.getColumnVector(0);
        }
        let diff = 1;
        let t, q, w, tOld;
        for (let counter = 0; counter < maxIterations && diff > terminationCriteria; counter++) {
          w = X.transpose().mmul(u).div(u.transpose().mmul(u).get(0, 0));
          w = w.div(w.norm());
          t = X.mmul(w).div(w.transpose().mmul(w).get(0, 0));
          if (counter > 0) {
            diff = t.clone().sub(tOld).pow(2).sum();
          }
          tOld = t.clone();
          if (Y) {
            q = Y.transpose().mmul(t).div(t.transpose().mmul(t).get(0, 0));
            q = q.div(q.norm());
            u = Y.mmul(q).div(q.transpose().mmul(q).get(0, 0));
          } else {
            u = t;
          }
        }
        if (Y) {
          let p = X.transpose().mmul(t).div(t.transpose().mmul(t).get(0, 0));
          p = p.div(p.norm());
          let xResidual = X.clone().sub(t.clone().mmul(p.transpose()));
          let residual = u.transpose().mmul(t).div(t.transpose().mmul(t).get(0, 0));
          let yResidual = Y.clone().sub(
            t.clone().mulS(residual.get(0, 0)).mmul(q.transpose())
          );
          this.t = t;
          this.p = p.transpose();
          this.w = w.transpose();
          this.q = q;
          this.u = u;
          this.s = t.transpose().mmul(t);
          this.xResidual = xResidual;
          this.yResidual = yResidual;
          this.betas = residual;
        } else {
          this.w = w.transpose();
          this.s = t.transpose().mmul(t).sqrt();
          if (scaleScores) {
            this.t = t.clone().div(this.s.get(0, 0));
          } else {
            this.t = t;
          }
          this.xResidual = X.sub(t.mmul(w.transpose()));
        }
      }
    };
    exports.AbstractMatrix = AbstractMatrix;
    exports.CHO = CholeskyDecomposition;
    exports.CholeskyDecomposition = CholeskyDecomposition;
    exports.DistanceMatrix = DistanceMatrix;
    exports.EVD = EigenvalueDecomposition;
    exports.EigenvalueDecomposition = EigenvalueDecomposition;
    exports.LU = LuDecomposition;
    exports.LuDecomposition = LuDecomposition;
    exports.Matrix = Matrix;
    exports.MatrixColumnSelectionView = MatrixColumnSelectionView;
    exports.MatrixColumnView = MatrixColumnView;
    exports.MatrixFlipColumnView = MatrixFlipColumnView;
    exports.MatrixFlipRowView = MatrixFlipRowView;
    exports.MatrixRowSelectionView = MatrixRowSelectionView;
    exports.MatrixRowView = MatrixRowView;
    exports.MatrixSelectionView = MatrixSelectionView;
    exports.MatrixSubView = MatrixSubView;
    exports.MatrixTransposeView = MatrixTransposeView;
    exports.NIPALS = nipals;
    exports.Nipals = nipals;
    exports.QR = QrDecomposition;
    exports.QrDecomposition = QrDecomposition;
    exports.SVD = SingularValueDecomposition;
    exports.SingularValueDecomposition = SingularValueDecomposition;
    exports.SymmetricMatrix = SymmetricMatrix;
    exports.WrapperMatrix1D = WrapperMatrix1D;
    exports.WrapperMatrix2D = WrapperMatrix2D;
    exports.correlation = correlation;
    exports.covariance = covariance;
    exports.default = Matrix;
    exports.determinant = determinant;
    exports.inverse = inverse;
    exports.linearDependencies = linearDependencies;
    exports.pseudoInverse = pseudoInverse;
    exports.solve = solve;
    exports.wrap = wrap;
  }
});

// node_modules/.pnpm/ml-array-sum@1.1.6/node_modules/ml-array-sum/lib/index.js
var require_lib3 = __commonJS({
  "node_modules/.pnpm/ml-array-sum@1.1.6/node_modules/ml-array-sum/lib/index.js"(exports, module) {
    "use strict";
    var isAnyArray = require_lib();
    function sum2(input) {
      if (!isAnyArray.isAnyArray(input)) {
        throw new TypeError("input must be an array");
      }
      if (input.length === 0) {
        throw new TypeError("input must not be empty");
      }
      let sumValue = 0;
      for (let i = 0; i < input.length; i++) {
        sumValue += input[i];
      }
      return sumValue;
    }
    module.exports = sum2;
  }
});

// node_modules/.pnpm/ml-array-mean@1.1.6/node_modules/ml-array-mean/lib/index.js
var require_lib4 = __commonJS({
  "node_modules/.pnpm/ml-array-mean@1.1.6/node_modules/ml-array-mean/lib/index.js"(exports, module) {
    "use strict";
    var sum2 = require_lib3();
    function _interopDefaultLegacy(e) {
      return e && typeof e === "object" && "default" in e ? e : { "default": e };
    }
    var sum__default = /* @__PURE__ */ _interopDefaultLegacy(sum2);
    function mean2(input) {
      return sum__default["default"](input) / input.length;
    }
    module.exports = mean2;
  }
});

// node_modules/.pnpm/ml-cart@2.1.1/node_modules/ml-cart/cart.js
var require_cart = __commonJS({
  "node_modules/.pnpm/ml-cart@2.1.1/node_modules/ml-cart/cart.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mlMatrix = require_matrix();
    var meanArray = require_lib4();
    function _interopDefaultLegacy(e) {
      return e && typeof e === "object" && "default" in e ? e : { "default": e };
    }
    var meanArray__default = /* @__PURE__ */ _interopDefaultLegacy(meanArray);
    function toDiscreteDistribution(array, numberOfClasses) {
      let counts = new Array(numberOfClasses).fill(0);
      for (let i = 0; i < array.length; ++i) {
        counts[array[i]] += 1 / array.length;
      }
      return mlMatrix.Matrix.rowVector(counts);
    }
    function giniImpurity(array) {
      if (array.length === 0) {
        return 0;
      }
      let probabilities = toDiscreteDistribution(
        array,
        getNumberOfClasses(array)
      ).getRow(0);
      let sum2 = 0;
      for (let i = 0; i < probabilities.length; ++i) {
        sum2 += probabilities[i] * probabilities[i];
      }
      return 1 - sum2;
    }
    function getNumberOfClasses(array) {
      return array.filter((val, i, arr) => {
        return arr.indexOf(val) === i;
      }).map((val) => val + 1).reduce((a, b) => Math.max(a, b));
    }
    function giniGain(array, splitted) {
      let splitsImpurity = 0;
      let splits = ["greater", "lesser"];
      for (let i = 0; i < splits.length; ++i) {
        let currentSplit = splitted[splits[i]];
        splitsImpurity += giniImpurity(currentSplit) * currentSplit.length / array.length;
      }
      return giniImpurity(array) - splitsImpurity;
    }
    function squaredError(array) {
      let l = array.length;
      if (l === 0) {
        return 0;
      }
      let m = meanArray__default["default"](array);
      let error = 0;
      for (let i = 0; i < l; ++i) {
        let currentElement = array[i];
        error += (currentElement - m) * (currentElement - m);
      }
      return error;
    }
    function regressionError(array, splitted) {
      let error = 0;
      let splits = ["greater", "lesser"];
      for (let i = 0; i < splits.length; ++i) {
        let currentSplit = splitted[splits[i]];
        error += squaredError(currentSplit);
      }
      return error;
    }
    function matrixSplitter(X, y, column, value) {
      let lesserX = [];
      let greaterX = [];
      let lesserY = [];
      let greaterY = [];
      for (let i = 0; i < X.rows; ++i) {
        if (X.get(i, column) < value) {
          lesserX.push(X.getRow(i));
          lesserY.push(y[i]);
        } else {
          greaterX.push(X.getRow(i));
          greaterY.push(y[i]);
        }
      }
      return {
        greaterX,
        greaterY,
        lesserX,
        lesserY
      };
    }
    function mean2(a, b) {
      return (a + b) / 2;
    }
    function zip(a, b) {
      if (a.length !== b.length) {
        throw new TypeError(
          `Error on zip: the size of a: ${a.length} is different from b: ${b.length}`
        );
      }
      let ret = new Array(a.length);
      for (let i = 0; i < a.length; ++i) {
        ret[i] = [a[i], b[i]];
      }
      return ret;
    }
    var gainFunctions = {
      gini: giniGain,
      regression: regressionError
    };
    var splitFunctions = {
      mean: mean2
    };
    var TreeNode = class _TreeNode {
      /**
       * @private
       * Constructor for a tree node given the options received on the main classes (DecisionTreeClassifier, DecisionTreeRegression)
       * @param {object|TreeNode} options for loading
       * @constructor
       */
      constructor(options) {
        this.kind = options.kind;
        this.gainFunction = options.gainFunction;
        this.splitFunction = options.splitFunction;
        this.minNumSamples = options.minNumSamples;
        this.maxDepth = options.maxDepth;
        this.gainThreshold = options.gainThreshold || 0;
      }
      /**
       * @private
       * Function that retrieve the best feature to make the split.
       * @param {Matrix} XTranspose - Training set transposed
       * @param {Array} y - labels or values (depending of the decision tree)
       * @return {object} - return tree values, the best gain, column and the split value.
       */
      bestSplit(XTranspose, y) {
        let bestGain = this.kind === "classifier" ? -Infinity : Infinity;
        let check = this.kind === "classifier" ? (a, b) => a > b : (a, b) => a < b;
        let maxColumn;
        let maxValue;
        let numberSamples;
        for (let i = 0; i < XTranspose.rows; ++i) {
          let currentFeature = XTranspose.getRow(i);
          let splitValues = this.featureSplit(currentFeature, y);
          for (let j = 0; j < splitValues.length; ++j) {
            let currentSplitVal = splitValues[j];
            let splitted = this.split(currentFeature, y, currentSplitVal);
            let gain = gainFunctions[this.gainFunction](y, splitted);
            if (check(gain, bestGain)) {
              maxColumn = i;
              maxValue = currentSplitVal;
              bestGain = gain;
              numberSamples = currentFeature.length;
            }
          }
        }
        return {
          maxGain: bestGain,
          maxColumn,
          maxValue,
          numberSamples
        };
      }
      /**
       * @private
       * Makes the split of the training labels or values from the training set feature given a split value.
       * @param {Array} x - Training set feature
       * @param {Array} y - Training set value or label
       * @param {number} splitValue
       * @return {object}
       */
      split(x, y, splitValue) {
        let lesser = [];
        let greater = [];
        for (let i = 0; i < x.length; ++i) {
          if (x[i] < splitValue) {
            lesser.push(y[i]);
          } else {
            greater.push(y[i]);
          }
        }
        return {
          greater,
          lesser
        };
      }
      /**
       * @private
       * Calculates the possible points to split over the tree given a training set feature and corresponding labels or values.
       * @param {Array} x - Training set feature
       * @param {Array} y - Training set value or label
       * @return {Array} possible split values.
       */
      featureSplit(x, y) {
        let splitValues = [];
        let arr = zip(x, y);
        arr.sort((a, b) => {
          return a[0] - b[0];
        });
        for (let i = 1; i < arr.length; ++i) {
          if (arr[i - 1][1] !== arr[i][1]) {
            splitValues.push(
              splitFunctions[this.splitFunction](arr[i - 1][0], arr[i][0])
            );
          }
        }
        return splitValues;
      }
      /**
       * @private
       * Calculate the predictions of a leaf tree node given the training labels or values
       * @param {Array} y
       */
      calculatePrediction(y) {
        if (this.kind === "classifier") {
          this.distribution = toDiscreteDistribution(
            y,
            getNumberOfClasses(y)
          );
          if (this.distribution.columns === 0) {
            throw new TypeError("Error on calculate the prediction");
          }
        } else {
          this.distribution = meanArray__default["default"](y);
        }
      }
      /**
       * @private
       * Train a node given the training set and labels, because it trains recursively, it also receive
       * the current depth of the node, parent gain to avoid infinite recursion and boolean value to check if
       * the training set is transposed.
       * @param {Matrix} X - Training set (could be transposed or not given transposed).
       * @param {Array} y - Training labels or values.
       * @param {number} currentDepth - Current depth of the node.
       * @param {number} parentGain - parent node gain or error.
       */
      train(X, y, currentDepth, parentGain) {
        if (X.rows <= this.minNumSamples) {
          this.calculatePrediction(y);
          return;
        }
        if (parentGain === void 0) parentGain = 0;
        let XTranspose = X.transpose();
        let split = this.bestSplit(XTranspose, y);
        this.splitValue = split.maxValue;
        this.splitColumn = split.maxColumn;
        this.gain = split.maxGain;
        this.numberSamples = split.numberSamples;
        let splittedMatrix = matrixSplitter(
          X,
          y,
          this.splitColumn,
          this.splitValue
        );
        if (currentDepth < this.maxDepth && this.gain > this.gainThreshold && this.gain !== parentGain && splittedMatrix.lesserX.length > 0 && splittedMatrix.greaterX.length > 0) {
          this.left = new _TreeNode(this);
          this.right = new _TreeNode(this);
          let lesserX = new mlMatrix.Matrix(splittedMatrix.lesserX);
          let greaterX = new mlMatrix.Matrix(splittedMatrix.greaterX);
          this.left.train(
            lesserX,
            splittedMatrix.lesserY,
            currentDepth + 1,
            this.gain
          );
          this.right.train(
            greaterX,
            splittedMatrix.greaterY,
            currentDepth + 1,
            this.gain
          );
        } else {
          this.calculatePrediction(y);
        }
      }
      /**
       * @private
       * Calculates the prediction of a given element.
       * @param {Array} row
       * @return {number|Array} prediction
       *          * if a node is a classifier returns an array of probabilities of each class.
       *          * if a node is for regression returns a number with the prediction.
       */
      classify(row) {
        if (this.right && this.left) {
          if (row[this.splitColumn] < this.splitValue) {
            return this.left.classify(row);
          } else {
            return this.right.classify(row);
          }
        }
        return this.distribution;
      }
      /**
       * @private
       * Set the parameter of the current node and their children.
       * @param {object} node - parameters of the current node and the children.
       */
      setNodeParameters(node) {
        if (node.distribution !== void 0) {
          this.distribution = node.distribution.constructor === Array ? new mlMatrix.Matrix(node.distribution) : node.distribution;
        } else {
          this.distribution = void 0;
          this.splitValue = node.splitValue;
          this.splitColumn = node.splitColumn;
          this.gain = node.gain;
          this.left = new _TreeNode(this);
          this.right = new _TreeNode(this);
          if (node.left !== {}) {
            this.left.setNodeParameters(node.left);
          }
          if (node.right !== {}) {
            this.right.setNodeParameters(node.right);
          }
        }
      }
    };
    var defaultOptions$1 = {
      gainFunction: "gini",
      splitFunction: "mean",
      minNumSamples: 3,
      maxDepth: Infinity,
      gainThreshold: 0.01
    };
    var DecisionTreeClassifier = class _DecisionTreeClassifier {
      /**
       * Create new Decision Tree Classifier with CART implementation with the given options
       * @param {object} options
       * @param {string} [options.gainFunction="gini"] - gain function to get the best split, "gini" the only one supported.
       * @param {string} [options.splitFunction="mean"] - given two integers from a split feature, get the value to split, "mean" the only one supported.
       * @param {number} [options.minNumSamples=3] - minimum number of samples to create a leaf node to decide a class.
       * @param {number} [options.maxDepth=Infinity] - Max depth of the tree.
       * @param {object} model - for load purposes.
       * @constructor
       */
      constructor(options, model) {
        if (options === true) {
          this.options = model.options;
          this.root = new TreeNode(model.options);
          this.root.setNodeParameters(model.root);
        } else {
          this.options = Object.assign({}, defaultOptions$1, options);
          this.options.kind = "classifier";
        }
      }
      /**
       * Train the decision tree with the given training set and labels.
       * @param {Matrix|MatrixTransposeView|Array} trainingSet
       * @param {Array} trainingLabels
       */
      train(trainingSet, trainingLabels) {
        this.root = new TreeNode(this.options);
        trainingSet = mlMatrix.Matrix.checkMatrix(trainingSet);
        this.root.train(trainingSet, trainingLabels, 0, null);
      }
      /**
       * Predicts the output given the matrix to predict.
       * @param {Matrix|MatrixTransposeView|Array} toPredict
       * @return {Array} predictions
       */
      predict(toPredict) {
        toPredict = mlMatrix.Matrix.checkMatrix(toPredict);
        let predictions = new Array(toPredict.rows);
        for (let i = 0; i < toPredict.rows; ++i) {
          predictions[i] = this.root.classify(toPredict.getRow(i)).maxRowIndex(0)[1];
        }
        return predictions;
      }
      /**
       * Export the current model to JSON.
       * @return {object} - Current model.
       */
      toJSON() {
        return {
          options: this.options,
          root: this.root,
          name: "DTClassifier"
        };
      }
      /**
       * Load a Decision tree classifier with the given model.
       * @param {object} model
       * @return {DecisionTreeClassifier}
       */
      static load(model) {
        if (model.name !== "DTClassifier") {
          throw new RangeError(`Invalid model: ${model.name}`);
        }
        return new _DecisionTreeClassifier(true, model);
      }
    };
    var defaultOptions = {
      gainFunction: "regression",
      splitFunction: "mean",
      minNumSamples: 3,
      maxDepth: Infinity
    };
    var DecisionTreeRegression = class _DecisionTreeRegression {
      /**
       * Create new Decision Tree Regression with CART implementation with the given options.
       * @param {object} options
       * @param {string} [options.gainFunction="regression"] - gain function to get the best split, "regression" the only one supported.
       * @param {string} [options.splitFunction="mean"] - given two integers from a split feature, get the value to split, "mean" the only one supported.
       * @param {number} [options.minNumSamples=3] - minimum number of samples to create a leaf node to decide a class.
       * @param {number} [options.maxDepth=Infinity] - Max depth of the tree.
       * @param {object} model - for load purposes.
       */
      constructor(options, model) {
        if (options === true) {
          this.options = model.options;
          this.root = new TreeNode(model.options);
          this.root.setNodeParameters(model.root);
        } else {
          this.options = Object.assign({}, defaultOptions, options);
          this.options.kind = "regression";
        }
      }
      /**
       * Train the decision tree with the given training set and values.
       * @param {Matrix|MatrixTransposeView|Array} trainingSet
       * @param {Array} trainingValues
       */
      train(trainingSet, trainingValues) {
        this.root = new TreeNode(this.options);
        if (typeof trainingSet[0] !== "undefined" && trainingSet[0].length === void 0) {
          trainingSet = mlMatrix.Matrix.columnVector(trainingSet);
        } else {
          trainingSet = mlMatrix.Matrix.checkMatrix(trainingSet);
        }
        this.root.train(trainingSet, trainingValues, 0);
      }
      /**
       * Predicts the values given the matrix to predict.
       * @param {Matrix|MatrixTransposeView|Array} toPredict
       * @return {Array} predictions
       */
      predict(toPredict) {
        if (typeof toPredict[0] !== "undefined" && toPredict[0].length === void 0) {
          toPredict = mlMatrix.Matrix.columnVector(toPredict);
        }
        toPredict = mlMatrix.Matrix.checkMatrix(toPredict);
        let predictions = new Array(toPredict.rows);
        for (let i = 0; i < toPredict.rows; ++i) {
          predictions[i] = this.root.classify(toPredict.getRow(i));
        }
        return predictions;
      }
      /**
       * Export the current model to JSON.
       * @return {object} - Current model.
       */
      toJSON() {
        return {
          options: this.options,
          root: this.root,
          name: "DTRegression"
        };
      }
      /**
       * Load a Decision tree regression with the given model.
       * @param {object} model
       * @return {DecisionTreeRegression}
       */
      static load(model) {
        if (model.name !== "DTRegression") {
          throw new RangeError(`Invalid model:${model.name}`);
        }
        return new _DecisionTreeRegression(true, model);
      }
    };
    exports.DecisionTreeClassifier = DecisionTreeClassifier;
    exports.DecisionTreeRegression = DecisionTreeRegression;
  }
});

// node_modules/.pnpm/random-js@2.1.0/node_modules/random-js/dist/random-js.umd.js
var require_random_js_umd = __commonJS({
  "node_modules/.pnpm/random-js@2.1.0/node_modules/random-js/dist/random-js.umd.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = global || self, factory(global.Random = {}));
    })(exports, function(exports2) {
      "use strict";
      var SMALLEST_UNSAFE_INTEGER = 9007199254740992;
      var LARGEST_SAFE_INTEGER = SMALLEST_UNSAFE_INTEGER - 1;
      var UINT32_MAX = -1 >>> 0;
      var UINT32_SIZE = UINT32_MAX + 1;
      var INT32_SIZE = UINT32_SIZE / 2;
      var INT32_MAX = INT32_SIZE - 1;
      var UINT21_SIZE = 1 << 21;
      var UINT21_MAX = UINT21_SIZE - 1;
      function int32(engine) {
        return engine.next() | 0;
      }
      function add(distribution, addend) {
        if (addend === 0) {
          return distribution;
        } else {
          return function(engine) {
            return distribution(engine) + addend;
          };
        }
      }
      function int53(engine) {
        var high = engine.next() | 0;
        var low = engine.next() >>> 0;
        return (high & UINT21_MAX) * UINT32_SIZE + low + (high & UINT21_SIZE ? -SMALLEST_UNSAFE_INTEGER : 0);
      }
      function int53Full(engine) {
        while (true) {
          var high = engine.next() | 0;
          if (high & 4194304) {
            if ((high & 8388607) === 4194304 && (engine.next() | 0) === 0) {
              return SMALLEST_UNSAFE_INTEGER;
            }
          } else {
            var low = engine.next() >>> 0;
            return (high & UINT21_MAX) * UINT32_SIZE + low + (high & UINT21_SIZE ? -SMALLEST_UNSAFE_INTEGER : 0);
          }
        }
      }
      function uint32(engine) {
        return engine.next() >>> 0;
      }
      function uint53(engine) {
        var high = engine.next() & UINT21_MAX;
        var low = engine.next() >>> 0;
        return high * UINT32_SIZE + low;
      }
      function uint53Full(engine) {
        while (true) {
          var high = engine.next() | 0;
          if (high & UINT21_SIZE) {
            if ((high & UINT21_MAX) === 0 && (engine.next() | 0) === 0) {
              return SMALLEST_UNSAFE_INTEGER;
            }
          } else {
            var low = engine.next() >>> 0;
            return (high & UINT21_MAX) * UINT32_SIZE + low;
          }
        }
      }
      function isPowerOfTwoMinusOne(value) {
        return (value + 1 & value) === 0;
      }
      function bitmask(masking) {
        return function(engine) {
          return engine.next() & masking;
        };
      }
      function downscaleToLoopCheckedRange(range) {
        var extendedRange = range + 1;
        var maximum = extendedRange * Math.floor(UINT32_SIZE / extendedRange);
        return function(engine) {
          var value = 0;
          do {
            value = engine.next() >>> 0;
          } while (value >= maximum);
          return value % extendedRange;
        };
      }
      function downscaleToRange(range) {
        if (isPowerOfTwoMinusOne(range)) {
          return bitmask(range);
        } else {
          return downscaleToLoopCheckedRange(range);
        }
      }
      function isEvenlyDivisibleByMaxInt32(value) {
        return (value | 0) === 0;
      }
      function upscaleWithHighMasking(masking) {
        return function(engine) {
          var high = engine.next() & masking;
          var low = engine.next() >>> 0;
          return high * UINT32_SIZE + low;
        };
      }
      function upscaleToLoopCheckedRange(extendedRange) {
        var maximum = extendedRange * Math.floor(SMALLEST_UNSAFE_INTEGER / extendedRange);
        return function(engine) {
          var ret = 0;
          do {
            var high = engine.next() & UINT21_MAX;
            var low = engine.next() >>> 0;
            ret = high * UINT32_SIZE + low;
          } while (ret >= maximum);
          return ret % extendedRange;
        };
      }
      function upscaleWithinU53(range) {
        var extendedRange = range + 1;
        if (isEvenlyDivisibleByMaxInt32(extendedRange)) {
          var highRange = (extendedRange / UINT32_SIZE | 0) - 1;
          if (isPowerOfTwoMinusOne(highRange)) {
            return upscaleWithHighMasking(highRange);
          }
        }
        return upscaleToLoopCheckedRange(extendedRange);
      }
      function upscaleWithinI53AndLoopCheck(min, max) {
        return function(engine) {
          var ret = 0;
          do {
            var high = engine.next() | 0;
            var low = engine.next() >>> 0;
            ret = (high & UINT21_MAX) * UINT32_SIZE + low + (high & UINT21_SIZE ? -SMALLEST_UNSAFE_INTEGER : 0);
          } while (ret < min || ret > max);
          return ret;
        };
      }
      function integer(min, max) {
        min = Math.floor(min);
        max = Math.floor(max);
        if (min < -SMALLEST_UNSAFE_INTEGER || !isFinite(min)) {
          throw new RangeError("Expected min to be at least " + -SMALLEST_UNSAFE_INTEGER);
        } else if (max > SMALLEST_UNSAFE_INTEGER || !isFinite(max)) {
          throw new RangeError("Expected max to be at most " + SMALLEST_UNSAFE_INTEGER);
        }
        var range = max - min;
        if (range <= 0 || !isFinite(range)) {
          return function() {
            return min;
          };
        } else if (range === UINT32_MAX) {
          if (min === 0) {
            return uint32;
          } else {
            return add(int32, min + INT32_SIZE);
          }
        } else if (range < UINT32_MAX) {
          return add(downscaleToRange(range), min);
        } else if (range === LARGEST_SAFE_INTEGER) {
          return add(uint53, min);
        } else if (range < LARGEST_SAFE_INTEGER) {
          return add(upscaleWithinU53(range), min);
        } else if (max - 1 - min === LARGEST_SAFE_INTEGER) {
          return add(uint53Full, min);
        } else if (min === -SMALLEST_UNSAFE_INTEGER && max === SMALLEST_UNSAFE_INTEGER) {
          return int53Full;
        } else if (min === -SMALLEST_UNSAFE_INTEGER && max === LARGEST_SAFE_INTEGER) {
          return int53;
        } else if (min === -LARGEST_SAFE_INTEGER && max === SMALLEST_UNSAFE_INTEGER) {
          return add(int53, 1);
        } else if (max === SMALLEST_UNSAFE_INTEGER) {
          return add(upscaleWithinI53AndLoopCheck(min - 1, max - 1), 1);
        } else {
          return upscaleWithinI53AndLoopCheck(min, max);
        }
      }
      function isLeastBitTrue(engine) {
        return (engine.next() & 1) === 1;
      }
      function lessThan(distribution, value) {
        return function(engine) {
          return distribution(engine) < value;
        };
      }
      function probability(percentage) {
        if (percentage <= 0) {
          return function() {
            return false;
          };
        } else if (percentage >= 1) {
          return function() {
            return true;
          };
        } else {
          var scaled = percentage * UINT32_SIZE;
          if (scaled % 1 === 0) {
            return lessThan(int32, scaled - INT32_SIZE | 0);
          } else {
            return lessThan(uint53, Math.round(percentage * SMALLEST_UNSAFE_INTEGER));
          }
        }
      }
      function bool(numerator, denominator) {
        if (denominator == null) {
          if (numerator == null) {
            return isLeastBitTrue;
          }
          return probability(numerator);
        } else {
          if (numerator <= 0) {
            return function() {
              return false;
            };
          } else if (numerator >= denominator) {
            return function() {
              return true;
            };
          }
          return lessThan(integer(0, denominator - 1), numerator);
        }
      }
      function date(start, end) {
        var distribution = integer(+start, +end);
        return function(engine) {
          return new Date(distribution(engine));
        };
      }
      function die(sideCount) {
        return integer(1, sideCount);
      }
      function dice(sideCount, dieCount) {
        var distribution = die(sideCount);
        return function(engine) {
          var result = [];
          for (var i = 0; i < dieCount; ++i) {
            result.push(distribution(engine));
          }
          return result;
        };
      }
      var DEFAULT_STRING_POOL = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
      function string(pool) {
        if (pool === void 0) {
          pool = DEFAULT_STRING_POOL;
        }
        var poolLength = pool.length;
        if (!poolLength) {
          throw new Error("Expected pool not to be an empty string");
        }
        var distribution = integer(0, poolLength - 1);
        return function(engine, length) {
          var result = "";
          for (var i = 0; i < length; ++i) {
            var j = distribution(engine);
            result += pool.charAt(j);
          }
          return result;
        };
      }
      var LOWER_HEX_POOL = "0123456789abcdef";
      var lowerHex = string(LOWER_HEX_POOL);
      var upperHex = string(LOWER_HEX_POOL.toUpperCase());
      function hex(uppercase) {
        if (uppercase) {
          return upperHex;
        } else {
          return lowerHex;
        }
      }
      function convertSliceArgument(value, length) {
        if (value < 0) {
          return Math.max(value + length, 0);
        } else {
          return Math.min(value, length);
        }
      }
      function toInteger(value) {
        var num = +value;
        if (num < 0) {
          return Math.ceil(num);
        } else {
          return Math.floor(num);
        }
      }
      function pick(engine, source, begin, end) {
        var length = source.length;
        if (length === 0) {
          throw new RangeError("Cannot pick from an empty array");
        }
        var start = begin == null ? 0 : convertSliceArgument(toInteger(begin), length);
        var finish = end === void 0 ? length : convertSliceArgument(toInteger(end), length);
        if (start >= finish) {
          throw new RangeError("Cannot pick between bounds " + start + " and " + finish);
        }
        var distribution = integer(start, finish - 1);
        return source[distribution(engine)];
      }
      function multiply(distribution, multiplier) {
        if (multiplier === 1) {
          return distribution;
        } else if (multiplier === 0) {
          return function() {
            return 0;
          };
        } else {
          return function(engine) {
            return distribution(engine) * multiplier;
          };
        }
      }
      function realZeroToOneExclusive(engine) {
        return uint53(engine) / SMALLEST_UNSAFE_INTEGER;
      }
      function realZeroToOneInclusive(engine) {
        return uint53Full(engine) / SMALLEST_UNSAFE_INTEGER;
      }
      function real(min, max, inclusive) {
        if (inclusive === void 0) {
          inclusive = false;
        }
        if (!isFinite(min)) {
          throw new RangeError("Expected min to be a finite number");
        } else if (!isFinite(max)) {
          throw new RangeError("Expected max to be a finite number");
        }
        return add(multiply(inclusive ? realZeroToOneInclusive : realZeroToOneExclusive, max - min), min);
      }
      var sliceArray = Array.prototype.slice;
      function shuffle(engine, array, downTo) {
        if (downTo === void 0) {
          downTo = 0;
        }
        var length = array.length;
        if (length) {
          for (var i = length - 1 >>> 0; i > downTo; --i) {
            var distribution = integer(0, i);
            var j = distribution(engine);
            if (i !== j) {
              var tmp = array[i];
              array[i] = array[j];
              array[j] = tmp;
            }
          }
        }
        return array;
      }
      function sample(engine, population, sampleSize) {
        if (sampleSize < 0 || sampleSize > population.length || !isFinite(sampleSize)) {
          throw new RangeError("Expected sampleSize to be within 0 and the length of the population");
        }
        if (sampleSize === 0) {
          return [];
        }
        var clone = sliceArray.call(population);
        var length = clone.length;
        if (length === sampleSize) {
          return shuffle(engine, clone, 0);
        }
        var tailLength = length - sampleSize;
        return shuffle(engine, clone, tailLength - 1).slice(tailLength);
      }
      var stringRepeat = (function() {
        try {
          if ("x".repeat(3) === "xxx") {
            return function(pattern, count) {
              return pattern.repeat(count);
            };
          }
        } catch (_) {
        }
        return function(pattern, count) {
          var result = "";
          while (count > 0) {
            if (count & 1) {
              result += pattern;
            }
            count >>= 1;
            pattern += pattern;
          }
          return result;
        };
      })();
      function zeroPad(text, zeroCount) {
        return stringRepeat("0", zeroCount - text.length) + text;
      }
      function uuid4(engine) {
        var a = engine.next() >>> 0;
        var b = engine.next() | 0;
        var c = engine.next() | 0;
        var d = engine.next() >>> 0;
        return zeroPad(a.toString(16), 8) + "-" + zeroPad((b & 65535).toString(16), 4) + "-" + zeroPad((b >> 4 & 4095 | 16384).toString(16), 4) + "-" + zeroPad((c & 16383 | 32768).toString(16), 4) + "-" + zeroPad((c >> 4 & 65535).toString(16), 4) + zeroPad(d.toString(16), 8);
      }
      var nativeMath = {
        next: function() {
          return Math.random() * UINT32_SIZE | 0;
        }
      };
      var Random = (
        /** @class */
        (function() {
          function Random2(engine) {
            if (engine === void 0) {
              engine = nativeMath;
            }
            this.engine = engine;
          }
          Random2.prototype.int32 = function() {
            return int32(this.engine);
          };
          Random2.prototype.uint32 = function() {
            return uint32(this.engine);
          };
          Random2.prototype.uint53 = function() {
            return uint53(this.engine);
          };
          Random2.prototype.uint53Full = function() {
            return uint53Full(this.engine);
          };
          Random2.prototype.int53 = function() {
            return int53(this.engine);
          };
          Random2.prototype.int53Full = function() {
            return int53Full(this.engine);
          };
          Random2.prototype.integer = function(min, max) {
            return integer(min, max)(this.engine);
          };
          Random2.prototype.realZeroToOneInclusive = function() {
            return realZeroToOneInclusive(this.engine);
          };
          Random2.prototype.realZeroToOneExclusive = function() {
            return realZeroToOneExclusive(this.engine);
          };
          Random2.prototype.real = function(min, max, inclusive) {
            if (inclusive === void 0) {
              inclusive = false;
            }
            return real(min, max, inclusive)(this.engine);
          };
          Random2.prototype.bool = function(numerator, denominator) {
            return bool(numerator, denominator)(this.engine);
          };
          Random2.prototype.pick = function(source, begin, end) {
            return pick(this.engine, source, begin, end);
          };
          Random2.prototype.shuffle = function(array) {
            return shuffle(this.engine, array);
          };
          Random2.prototype.sample = function(population, sampleSize) {
            return sample(this.engine, population, sampleSize);
          };
          Random2.prototype.die = function(sideCount) {
            return die(sideCount)(this.engine);
          };
          Random2.prototype.dice = function(sideCount, dieCount) {
            return dice(sideCount, dieCount)(this.engine);
          };
          Random2.prototype.uuid4 = function() {
            return uuid4(this.engine);
          };
          Random2.prototype.string = function(length, pool) {
            return string(pool)(this.engine, length);
          };
          Random2.prototype.hex = function(length, uppercase) {
            return hex(uppercase)(this.engine, length);
          };
          Random2.prototype.date = function(start, end) {
            return date(start, end)(this.engine);
          };
          return Random2;
        })()
      );
      var I32Array = (function() {
        try {
          var buffer = new ArrayBuffer(4);
          var view = new Int32Array(buffer);
          view[0] = INT32_SIZE;
          if (view[0] === -INT32_SIZE) {
            return Int32Array;
          }
        } catch (_) {
        }
        return Array;
      })();
      var data = null;
      var COUNT = 128;
      var index = COUNT;
      var browserCrypto = {
        next: function() {
          if (index >= COUNT) {
            if (data === null) {
              data = new I32Array(COUNT);
            }
            crypto.getRandomValues(data);
            index = 0;
          }
          return data[index++] | 0;
        }
      };
      function createEntropy(engine, length) {
        if (engine === void 0) {
          engine = nativeMath;
        }
        if (length === void 0) {
          length = 16;
        }
        var array = [];
        array.push((/* @__PURE__ */ new Date()).getTime() | 0);
        for (var i = 1; i < length; ++i) {
          array[i] = engine.next() | 0;
        }
        return array;
      }
      var imul = (function() {
        try {
          if (Math.imul(UINT32_MAX, 5) === -5) {
            return Math.imul;
          }
        } catch (_) {
        }
        var UINT16_MAX = 65535;
        return function(a, b) {
          var ah = a >>> 16 & UINT16_MAX;
          var al = a & UINT16_MAX;
          var bh = b >>> 16 & UINT16_MAX;
          var bl = b & UINT16_MAX;
          return al * bl + (ah * bl + al * bh << 16 >>> 0) | 0;
        };
      })();
      var ARRAY_SIZE = 624;
      var ARRAY_MAX = ARRAY_SIZE - 1;
      var M = 397;
      var ARRAY_SIZE_MINUS_M = ARRAY_SIZE - M;
      var A = 2567483615;
      var MersenneTwister19937 = (
        /** @class */
        (function() {
          function MersenneTwister199372() {
            this.data = new I32Array(ARRAY_SIZE);
            this.index = 0;
            this.uses = 0;
          }
          MersenneTwister199372.seed = function(initial) {
            return new MersenneTwister199372().seed(initial);
          };
          MersenneTwister199372.seedWithArray = function(source) {
            return new MersenneTwister199372().seedWithArray(source);
          };
          MersenneTwister199372.autoSeed = function() {
            return MersenneTwister199372.seedWithArray(createEntropy());
          };
          MersenneTwister199372.prototype.next = function() {
            if ((this.index | 0) >= ARRAY_SIZE) {
              refreshData(this.data);
              this.index = 0;
            }
            var value = this.data[this.index];
            this.index = this.index + 1 | 0;
            this.uses += 1;
            return temper(value) | 0;
          };
          MersenneTwister199372.prototype.getUseCount = function() {
            return this.uses;
          };
          MersenneTwister199372.prototype.discard = function(count) {
            if (count <= 0) {
              return this;
            }
            this.uses += count;
            if ((this.index | 0) >= ARRAY_SIZE) {
              refreshData(this.data);
              this.index = 0;
            }
            while (count + this.index > ARRAY_SIZE) {
              count -= ARRAY_SIZE - this.index;
              refreshData(this.data);
              this.index = 0;
            }
            this.index = this.index + count | 0;
            return this;
          };
          MersenneTwister199372.prototype.seed = function(initial) {
            var previous = 0;
            this.data[0] = previous = initial | 0;
            for (var i = 1; i < ARRAY_SIZE; i = i + 1 | 0) {
              this.data[i] = previous = imul(previous ^ previous >>> 30, 1812433253) + i | 0;
            }
            this.index = ARRAY_SIZE;
            this.uses = 0;
            return this;
          };
          MersenneTwister199372.prototype.seedWithArray = function(source) {
            this.seed(19650218);
            seedWithArray(this.data, source);
            return this;
          };
          return MersenneTwister199372;
        })()
      );
      function refreshData(data2) {
        var k = 0;
        var tmp = 0;
        for (; (k | 0) < ARRAY_SIZE_MINUS_M; k = k + 1 | 0) {
          tmp = data2[k] & INT32_SIZE | data2[k + 1 | 0] & INT32_MAX;
          data2[k] = data2[k + M | 0] ^ tmp >>> 1 ^ (tmp & 1 ? A : 0);
        }
        for (; (k | 0) < ARRAY_MAX; k = k + 1 | 0) {
          tmp = data2[k] & INT32_SIZE | data2[k + 1 | 0] & INT32_MAX;
          data2[k] = data2[k - ARRAY_SIZE_MINUS_M | 0] ^ tmp >>> 1 ^ (tmp & 1 ? A : 0);
        }
        tmp = data2[ARRAY_MAX] & INT32_SIZE | data2[0] & INT32_MAX;
        data2[ARRAY_MAX] = data2[M - 1] ^ tmp >>> 1 ^ (tmp & 1 ? A : 0);
      }
      function temper(value) {
        value ^= value >>> 11;
        value ^= value << 7 & 2636928640;
        value ^= value << 15 & 4022730752;
        return value ^ value >>> 18;
      }
      function seedWithArray(data2, source) {
        var i = 1;
        var j = 0;
        var sourceLength = source.length;
        var k = Math.max(sourceLength, ARRAY_SIZE) | 0;
        var previous = data2[0] | 0;
        for (; (k | 0) > 0; --k) {
          data2[i] = previous = (data2[i] ^ imul(previous ^ previous >>> 30, 1664525)) + (source[j] | 0) + (j | 0) | 0;
          i = i + 1 | 0;
          ++j;
          if ((i | 0) > ARRAY_MAX) {
            data2[0] = data2[ARRAY_MAX];
            i = 1;
          }
          if (j >= sourceLength) {
            j = 0;
          }
        }
        for (k = ARRAY_MAX; (k | 0) > 0; --k) {
          data2[i] = previous = (data2[i] ^ imul(previous ^ previous >>> 30, 1566083941)) - i | 0;
          i = i + 1 | 0;
          if ((i | 0) > ARRAY_MAX) {
            data2[0] = data2[ARRAY_MAX];
            i = 1;
          }
        }
        data2[0] = INT32_SIZE;
      }
      var data$1 = null;
      var COUNT$1 = 128;
      var index$1 = COUNT$1;
      var nodeCrypto = {
        next: function() {
          if (index$1 >= COUNT$1) {
            data$1 = new Int32Array(new Int8Array(__require("crypto").randomBytes(4 * COUNT$1)).buffer);
            index$1 = 0;
          }
          return data$1[index$1++] | 0;
        }
      };
      function picker(source, begin, end) {
        var clone = sliceArray.call(source, begin, end);
        if (clone.length === 0) {
          throw new RangeError("Cannot pick from a source with no items");
        }
        var distribution = integer(0, clone.length - 1);
        return function(engine) {
          return clone[distribution(engine)];
        };
      }
      exports2.Random = Random;
      exports2.browserCrypto = browserCrypto;
      exports2.nativeMath = nativeMath;
      exports2.MersenneTwister19937 = MersenneTwister19937;
      exports2.nodeCrypto = nodeCrypto;
      exports2.bool = bool;
      exports2.date = date;
      exports2.dice = dice;
      exports2.die = die;
      exports2.hex = hex;
      exports2.int32 = int32;
      exports2.int53 = int53;
      exports2.int53Full = int53Full;
      exports2.integer = integer;
      exports2.pick = pick;
      exports2.picker = picker;
      exports2.real = real;
      exports2.realZeroToOneExclusive = realZeroToOneExclusive;
      exports2.realZeroToOneInclusive = realZeroToOneInclusive;
      exports2.sample = sample;
      exports2.shuffle = shuffle;
      exports2.string = string;
      exports2.uint32 = uint32;
      exports2.uint53 = uint53;
      exports2.uint53Full = uint53Full;
      exports2.uuid4 = uuid4;
      exports2.createEntropy = createEntropy;
      Object.defineProperty(exports2, "__esModule", { value: true });
    });
  }
});

// node_modules/.pnpm/median-quickselect@1.0.1/node_modules/median-quickselect/lib/median-quickselect.min.js
var require_median_quickselect_min = __commonJS({
  "node_modules/.pnpm/median-quickselect@1.0.1/node_modules/median-quickselect/lib/median-quickselect.min.js"(exports, module) {
    (function() {
      function a(d) {
        for (var e = 0, f = d.length - 1, g = void 0, h = void 0, i = void 0, j = c(e, f); true; ) {
          if (f <= e) return d[j];
          if (f == e + 1) return d[e] > d[f] && b(d, e, f), d[j];
          for (g = c(e, f), d[g] > d[f] && b(d, g, f), d[e] > d[f] && b(d, e, f), d[g] > d[e] && b(d, g, e), b(d, g, e + 1), h = e + 1, i = f; true; ) {
            do
              h++;
            while (d[e] > d[h]);
            do
              i--;
            while (d[i] > d[e]);
            if (i < h) break;
            b(d, h, i);
          }
          b(d, e, i), i <= j && (e = h), i >= j && (f = i - 1);
        }
      }
      var b = function b2(d, e, f) {
        var _ref;
        return _ref = [d[f], d[e]], d[e] = _ref[0], d[f] = _ref[1], _ref;
      }, c = function c2(d, e) {
        return ~~((d + e) / 2);
      };
      "undefined" != typeof module && module.exports ? module.exports = a : window.median = a;
    })();
  }
});

// node_modules/.pnpm/ml-array-median@1.1.6/node_modules/ml-array-median/lib/index.js
var require_lib5 = __commonJS({
  "node_modules/.pnpm/ml-array-median@1.1.6/node_modules/ml-array-median/lib/index.js"(exports, module) {
    "use strict";
    var isAnyArray = require_lib();
    var quickSelectMedian = require_median_quickselect_min();
    function _interopDefaultLegacy(e) {
      return e && typeof e === "object" && "default" in e ? e : { "default": e };
    }
    var quickSelectMedian__default = /* @__PURE__ */ _interopDefaultLegacy(quickSelectMedian);
    function median(input) {
      if (!isAnyArray.isAnyArray(input)) {
        throw new TypeError("input must be an array");
      }
      if (input.length === 0) {
        throw new TypeError("input must not be empty");
      }
      return quickSelectMedian__default["default"](input.slice());
    }
    module.exports = median;
  }
});

// node_modules/.pnpm/ml-random-forest@2.1.0/node_modules/ml-random-forest/random-forest.js
var require_random_forest = __commonJS({
  "node_modules/.pnpm/ml-random-forest@2.1.0/node_modules/ml-random-forest/random-forest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var arrayMode = require_lib2();
    var mlCart = require_cart();
    var mlMatrix = require_matrix();
    var Random = require_random_js_umd();
    var arrayMean = require_lib4();
    var arrayMedian = require_lib5();
    function _interopDefaultLegacy(e) {
      return e && typeof e === "object" && "default" in e ? e : { "default": e };
    }
    function _interopNamespace(e) {
      if (e && e.__esModule) return e;
      var n = /* @__PURE__ */ Object.create(null);
      if (e) {
        Object.keys(e).forEach(function(k) {
          if (k !== "default") {
            var d = Object.getOwnPropertyDescriptor(e, k);
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: function() {
                return e[k];
              }
            });
          }
        });
      }
      n["default"] = e;
      return Object.freeze(n);
    }
    var arrayMode__default = /* @__PURE__ */ _interopDefaultLegacy(arrayMode);
    var Random__namespace = /* @__PURE__ */ _interopNamespace(Random);
    var arrayMean__default = /* @__PURE__ */ _interopDefaultLegacy(arrayMean);
    var arrayMedian__default = /* @__PURE__ */ _interopDefaultLegacy(arrayMedian);
    function checkFloat(n) {
      return n > 0 && n <= 1;
    }
    function isFloat(n) {
      return Number(n) === n && n % 1 !== 0;
    }
    function examplesBaggingWithReplacement(trainingSet, trainingValue, seed) {
      let engine;
      let distribution = Random__namespace.integer(0, trainingSet.rows - 1);
      if (seed === void 0) {
        engine = Random__namespace.MersenneTwister19937.autoSeed();
      } else if (Number.isInteger(seed)) {
        engine = Random__namespace.MersenneTwister19937.seed(seed);
      } else {
        throw new RangeError(
          `Expected seed must be undefined or integer not ${seed}`
        );
      }
      let Xr = new Array(trainingSet.rows);
      let yr = new Array(trainingSet.rows);
      let oob = new Array(trainingSet.rows).fill(0);
      let oobN = trainingSet.rows;
      for (let i = 0; i < trainingSet.rows; ++i) {
        let index = distribution(engine);
        Xr[i] = trainingSet.getRow(index);
        yr[i] = trainingValue[index];
        if (oob[index]++ === 0) {
          oobN--;
        }
      }
      let Xoob = new Array(oobN);
      let ioob = new Array(oobN);
      for (let i = trainingSet.rows - 1; i >= 0 && oobN > 0; --i) {
        if (oob[i] === 0) {
          Xoob[--oobN] = trainingSet.getRow(i);
          ioob[oobN] = i;
        }
      }
      return {
        X: new mlMatrix.Matrix(Xr),
        y: yr,
        Xoob: new mlMatrix.Matrix(Xoob),
        ioob,
        seed: engine.next()
      };
    }
    function featureBagging(trainingSet, n, replacement, seed) {
      if (trainingSet.columns < n) {
        throw new RangeError(
          "N should be less or equal to the number of columns of X"
        );
      }
      let distribution = Random__namespace.integer(0, trainingSet.columns - 1);
      let engine;
      if (seed === void 0) {
        engine = Random__namespace.MersenneTwister19937.autoSeed();
      } else if (Number.isInteger(seed)) {
        engine = Random__namespace.MersenneTwister19937.seed(seed);
      } else {
        throw new RangeError(
          `Expected seed must be undefined or integer not ${seed}`
        );
      }
      let toRet = new mlMatrix.Matrix(trainingSet.rows, n);
      let usedIndex;
      let index;
      if (replacement) {
        usedIndex = new Array(n);
        for (let i = 0; i < n; ++i) {
          index = distribution(engine);
          usedIndex[i] = index;
          toRet.setColumn(i, trainingSet.getColumn(index));
        }
      } else {
        usedIndex = /* @__PURE__ */ new Set();
        index = distribution(engine);
        for (let i = 0; i < n; ++i) {
          while (usedIndex.has(index)) {
            index = distribution(engine);
          }
          toRet.setColumn(i, trainingSet.getColumn(index));
          usedIndex.add(index);
        }
        usedIndex = Array.from(usedIndex);
      }
      return {
        X: toRet,
        usedIndex,
        seed: engine.next()
      };
    }
    var collectOOB = (oob, y, aggregate) => {
      const res = Array(y.length);
      for (let i = 0; i < y.length; i++) {
        const all = [];
        for (let j = 0; j < oob.length; j++) {
          const o = oob[j];
          if (o.index[0] === i) {
            all.push(o.predicted[0]);
            o.index = o.index.slice(1);
            o.predicted = o.predicted.slice(1);
          }
        }
        res[i] = { true: y[i], all, predicted: aggregate(all) };
      }
      return res;
    };
    var RandomForestBase = class {
      /**
       * Create a new base random forest for a classifier or regression model.
       * @constructor
       * @param {object} options
       * @param {number|String} [options.maxFeatures] - the number of features used on each estimator.
       *        * if is an integer it selects maxFeatures elements over the sample features.
       *        * if is a float between (0, 1), it takes the percentage of features.
       * @param {boolean} [options.replacement] - use replacement over the sample features.
       * @param {number} [options.seed] - seed for feature and samples selection, must be a 32-bit integer.
       * @param {number} [options.nEstimators] - number of estimator to use.
       * @param {object} [options.treeOptions] - options for the tree classifier, see [ml-cart]{@link https://mljs.github.io/decision-tree-cart/}
       * @param {boolean} [options.isClassifier] - boolean to check if is a classifier or regression model (used by subclasses).
       * @param {boolean} [options.useSampleBagging] - use bagging over training samples.
       * @param {boolean} [options.noOOB] - don't calculate Out-Of-Bag predictions.
       * @param {object} model - for load purposes.
       */
      constructor(options, model) {
        if (options === true) {
          this.replacement = model.replacement;
          this.maxFeatures = model.maxFeatures;
          this.nEstimators = model.nEstimators;
          this.treeOptions = model.treeOptions;
          this.isClassifier = model.isClassifier;
          this.seed = model.seed;
          this.n = model.n;
          this.indexes = model.indexes;
          this.useSampleBagging = model.useSampleBagging;
          this.noOOB = true;
          this.maxSamples = model.maxSamples;
          let Estimator = this.isClassifier ? mlCart.DecisionTreeClassifier : mlCart.DecisionTreeRegression;
          this.estimators = model.estimators.map((est) => Estimator.load(est));
        } else {
          this.replacement = options.replacement;
          this.maxFeatures = options.maxFeatures;
          this.nEstimators = options.nEstimators;
          this.treeOptions = options.treeOptions;
          this.isClassifier = options.isClassifier;
          this.seed = options.seed;
          this.useSampleBagging = options.useSampleBagging;
          this.noOOB = options.noOOB;
          this.maxSamples = options.maxSamples;
        }
      }
      /**
       * Train the decision tree with the given training set and labels.
       * @param {Matrix|Array} trainingSet
       * @param {Array} trainingValues
       */
      train(trainingSet, trainingValues) {
        let currentSeed = this.seed;
        trainingSet = mlMatrix.Matrix.checkMatrix(trainingSet);
        this.maxFeatures = this.maxFeatures || trainingSet.columns;
        this.numberFeatures = trainingSet.columns;
        this.numberSamples = trainingSet.rows;
        if (checkFloat(this.maxFeatures)) {
          this.n = Math.floor(trainingSet.columns * this.maxFeatures);
        } else if (Number.isInteger(this.maxFeatures)) {
          if (this.maxFeatures > trainingSet.columns) {
            throw new RangeError(
              `The maxFeatures parameter should be less than ${trainingSet.columns}`
            );
          } else {
            this.n = this.maxFeatures;
          }
        } else {
          throw new RangeError(
            `Cannot process the maxFeatures parameter ${this.maxFeatures}`
          );
        }
        if (this.maxSamples) {
          if (this.maxSamples < 0) {
            throw new RangeError(`Please choose a positive value for maxSamples`);
          } else {
            if (isFloat(this.maxSamples)) {
              if (this.maxSamples > 1) {
                throw new RangeError(
                  "Please choose either a float value between 0 and 1 or a positive integer for maxSamples"
                );
              } else {
                this.numberSamples = Math.floor(trainingSet.rows * this.maxSamples);
              }
            } else if (Number.isInteger(this.maxSamples)) {
              if (this.maxSamples > trainingSet.rows) {
                throw new RangeError(
                  `The maxSamples parameter should be less than ${trainingSet.rows}`
                );
              } else {
                this.numberSamples = this.maxSamples;
              }
            }
          }
        }
        if (this.maxSamples) {
          if (trainingSet.rows !== this.numberSamples) {
            let tmp = new mlMatrix.Matrix(this.numberSamples, trainingSet.columns);
            for (let j = 0; j < this.numberSamples; j++) {
              tmp.removeRow(0);
            }
            for (let i = 0; i < this.numberSamples; i++) {
              tmp.addRow(trainingSet.getRow(i));
            }
            trainingSet = tmp;
            trainingValues = trainingValues.slice(0, this.numberSamples);
          }
        }
        let Estimator;
        if (this.isClassifier) {
          Estimator = mlCart.DecisionTreeClassifier;
        } else {
          Estimator = mlCart.DecisionTreeRegression;
        }
        this.estimators = new Array(this.nEstimators);
        this.indexes = new Array(this.nEstimators);
        let oobResults = new Array(this.nEstimators);
        for (let i = 0; i < this.nEstimators; ++i) {
          let res = this.useSampleBagging ? examplesBaggingWithReplacement(
            trainingSet,
            trainingValues,
            currentSeed
          ) : {
            X: trainingSet,
            y: trainingValues,
            seed: currentSeed,
            Xoob: void 0,
            yoob: [],
            ioob: []
          };
          let X = res.X;
          let y = res.y;
          currentSeed = res.seed;
          let { Xoob, ioob } = res;
          res = featureBagging(X, this.n, this.replacement, currentSeed);
          X = res.X;
          currentSeed = res.seed;
          this.indexes[i] = res.usedIndex;
          this.estimators[i] = new Estimator(this.treeOptions);
          this.estimators[i].train(X, y);
          if (!this.noOOB && this.useSampleBagging) {
            let xoob = new mlMatrix.MatrixColumnSelectionView(Xoob, this.indexes[i]);
            oobResults[i] = {
              index: ioob,
              predicted: this.estimators[i].predict(xoob)
            };
          }
        }
        if (!this.noOOB && this.useSampleBagging && oobResults.length > 0) {
          this.oobResults = collectOOB(
            oobResults,
            trainingValues,
            this.selection.bind(this)
          );
        }
      }
      /**
       * Evaluate the feature importances for each tree in the ensemble
       * @return {Array} feature importances
       */
      featureImportance() {
        const trees = JSON.parse(JSON.stringify(this.estimators));
        const indexes = JSON.parse(JSON.stringify(this.indexes));
        let importance = [];
        function computeFeatureImportances(i, node) {
          if (!node || !("splitColumn" in node) || !(node.gain > 0)) return;
          let f = node.gain * node.numberSamples;
          if ("left" in node) {
            f -= (node.left.gain || 0) * (node.left.numberSamples || 0);
          }
          if ("right" in node) {
            f -= (node.right.gain || 0) * (node.right.numberSamples || 0);
          }
          importance[i][node.splitColumn] += f;
          if (node.left) {
            computeFeatureImportances(i, node.left);
          }
          if (node.right) {
            computeFeatureImportances(i, node.right);
          }
        }
        function normalizeImportances(i) {
          const s2 = importance[i].reduce((cum, v) => {
            return cum += v;
          }, 0);
          importance[i] = importance[i].map((v) => {
            return v / s2;
          });
        }
        for (let i = 0; i < trees.length; i++) {
          importance.push(new Array(this.numberFeatures).fill(0));
          computeFeatureImportances(i, trees[i].root);
          normalizeImportances(i);
        }
        let avgImportance = new Array(this.numberFeatures).fill(0);
        for (let i = 0; i < importance.length; i++) {
          for (let x = 0; x < this.numberFeatures; x++) {
            avgImportance[indexes[i][x]] += importance[i][x];
          }
        }
        const s = avgImportance.reduce((cum, v) => {
          return cum += v;
        }, 0);
        return avgImportance.map((v) => {
          return v / s;
        });
      }
      /**
       * Method that returns the way the algorithm generates the predictions, for example, in classification
       * you can return the mode of all predictions retrieved by the trees, or in case of regression you can
       * use the mean or the median.
       * @abstract
       * @param {Array} values - predictions of the estimators.
       * @return {number} prediction.
       */
      // eslint-disable-next-line no-unused-vars
      selection(values) {
        throw new Error("Abstract method 'selection' not implemented!");
      }
      /**
       * Predicts the output given the matrix to predict.
       * @param {Matrix|Array} toPredict
       * @return {Array} predictions
       */
      predict(toPredict) {
        const predictionValues = this.predictionValues(toPredict);
        let predictions = new Array(predictionValues.rows);
        for (let i = 0; i < predictionValues.rows; ++i) {
          predictions[i] = this.selection(predictionValues.getRow(i));
        }
        return predictions;
      }
      /**
       * Predicts the output given the matrix to predict.
       * @param {Matrix|Array} toPredict
       * @return {MatrixTransposeView} predictions of estimators
       */
      predictionValues(toPredict) {
        let predictionValues = new Array(this.nEstimators);
        toPredict = mlMatrix.Matrix.checkMatrix(toPredict);
        for (let i = 0; i < this.nEstimators; ++i) {
          let X = new mlMatrix.MatrixColumnSelectionView(toPredict, this.indexes[i]);
          predictionValues[i] = this.estimators[i].predict(X);
        }
        return predictionValues = new mlMatrix.MatrixTransposeView(
          new mlMatrix.WrapperMatrix2D(predictionValues)
        );
      }
      /**
       * Returns the Out-Of-Bag predictions.
       * @return {Array} predictions
       */
      predictOOB() {
        if (!this.oobResults || this.oobResults.length === 0) {
          throw new Error(
            "No Out-Of-Bag results found. Did you forgot to train first?"
          );
        }
        return this.oobResults.map((v) => v.predicted);
      }
      /**
       * Export the current model to JSON.
       * @return {object} - Current model.
       */
      toJSON() {
        return {
          indexes: this.indexes,
          n: this.n,
          replacement: this.replacement,
          maxFeatures: this.maxFeatures,
          nEstimators: this.nEstimators,
          treeOptions: this.treeOptions,
          isClassifier: this.isClassifier,
          seed: this.seed,
          estimators: this.estimators.map((est) => est.toJSON()),
          useSampleBagging: this.useSampleBagging
        };
      }
    };
    var defaultOptions$1 = {
      maxFeatures: 1,
      replacement: true,
      nEstimators: 50,
      seed: 42,
      useSampleBagging: true,
      noOOB: false
    };
    var RandomForestClassifier = class _RandomForestClassifier extends RandomForestBase {
      /**
       * Create a new base random forest for a classifier or regression model.
       * @constructor
       * @param {object} options
       * @param {number} [options.maxFeatures=1.0] - the number of features used on each estimator.
       *        * if is an integer it selects maxFeatures elements over the sample features.
       *        * if is a float between (0, 1), it takes the percentage of features.
       * @param {boolean} [options.replacement=true] - use replacement over the sample features.
       * @param {number} [options.seed=42] - seed for feature and samples selection, must be a 32-bit integer.
       * @param {number} [options.nEstimators=50] - number of estimator to use.
       * @param {object} [options.treeOptions={}] - options for the tree classifier, see [ml-cart]{@link https://mljs.github.io/decision-tree-cart/}
       * @param {boolean} [options.useSampleBagging=true] - use bagging over training samples.
       * @param {number} [options.maxSamples=null] - if null, then draw X.shape[0] samples. If int, then draw maxSamples samples. If float, then draw maxSamples * X.shape[0] samples. Thus, maxSamples should be in the interval (0.0, 1.0].
       * @param {object} model - for load purposes.
       */
      constructor(options, model) {
        if (options === true) {
          super(true, model.baseModel);
        } else {
          options = Object.assign({}, defaultOptions$1, options);
          options.isClassifier = true;
          super(options);
        }
      }
      /**
       * retrieve the prediction given the selection method.
       * @param {Array} values - predictions of the estimators.
       * @return {number} prediction
       */
      selection(values) {
        return arrayMode__default["default"](values);
      }
      /**
       * Export the current model to JSON.
       * @return {object} - Current model.
       */
      toJSON() {
        let baseModel = super.toJSON();
        return {
          baseModel,
          name: "RFClassifier"
        };
      }
      /**
       * Returns the confusion matrix
       * Make sure to run train first.
       * @return {object} - Current model.
       */
      getConfusionMatrix() {
        if (!this.oobResults) {
          throw new Error("No Out-Of-Bag results available.");
        }
        const labels = /* @__PURE__ */ new Set();
        const matrix = this.oobResults.reduce((p, v) => {
          labels.add(v.true);
          labels.add(v.predicted);
          const x = p[v.predicted] || {};
          x[v.true] = (x[v.true] || 0) + 1;
          p[v.predicted] = x;
          return p;
        }, {});
        const sortedLabels = [...labels].sort();
        return sortedLabels.map(
          (v) => sortedLabels.map((w) => (matrix[v] || {})[w] || 0)
        );
      }
      /**
       * Load a Decision tree classifier with the given model.
       * @param {object} model
       * @return {RandomForestClassifier}
       */
      static load(model) {
        if (model.name !== "RFClassifier") {
          throw new RangeError(`Invalid model: ${model.name}`);
        }
        return new _RandomForestClassifier(true, model);
      }
      /**
       * Predicts the probability of a label given the matrix to predict.
       * @param {Matrix|Array} toPredict
       * @param {number} label
       * @return {Array} predictions
       */
      predictProbability(toPredict, label) {
        const predictionValues = this.predictionValues(toPredict);
        let predictions = new Array(predictionValues.rows);
        for (let i = 0; i < predictionValues.rows; ++i) {
          const pvs = predictionValues.getRow(i);
          const l = pvs.length;
          const roundFactor = Math.pow(10, 6);
          predictions[i] = Math.round(
            pvs.reduce((p, v) => {
              if (v === label) {
                p += roundFactor / l;
              }
              return p;
            })
          ) / roundFactor;
        }
        return predictions;
      }
    };
    var selectionMethods = {
      mean: arrayMean__default["default"],
      median: arrayMedian__default["default"]
    };
    var defaultOptions = {
      maxFeatures: 1,
      replacement: false,
      nEstimators: 50,
      treeOptions: {},
      selectionMethod: "mean",
      seed: 42,
      useSampleBagging: true,
      noOOB: false
    };
    var RandomForestRegression2 = class _RandomForestRegression extends RandomForestBase {
      /**
       * Create a new base random forest for a classifier or regression model.
       * @constructor
       * @param {object} options
       * @param {number} [options.maxFeatures=1.0] - the number of features used on each estimator.
       *        * if is an integer it selects maxFeatures elements over the sample features.
       *        * if is a float between (0, 1), it takes the percentage of features.
       * @param {boolean} [options.replacement=true] - use replacement over the sample features.
       * @param {number} [options.seed=42] - seed for feature and samples selection, must be a 32-bit integer.
       * @param {number} [options.nEstimators=50] - number of estimator to use.
       * @param {object} [options.treeOptions={}] - options for the tree classifier, see [ml-cart]{@link https://mljs.github.io/decision-tree-cart/}
       * @param {string} [options.selectionMethod="mean"] - the way to calculate the prediction from estimators, "mean" and "median" are supported.
       * @param {boolean} [options.useSampleBagging=true] - use bagging over training samples.
       * @param {number} [options.maxSamples=null] - if null, then draw X.shape[0] samples. If int, then draw maxSamples samples. If float, then draw maxSamples * X.shape[0] samples. Thus, maxSamples should be in the interval (0.0, 1.0].
       * @param {object} model - for load purposes.
       */
      constructor(options, model) {
        if (options === true) {
          super(true, model.baseModel);
          this.selectionMethod = model.selectionMethod;
        } else {
          options = Object.assign({}, defaultOptions, options);
          if (!(options.selectionMethod === "mean" || options.selectionMethod === "median")) {
            throw new RangeError(
              `Unsupported selection method ${options.selectionMethod}`
            );
          }
          options.isClassifier = false;
          super(options);
          this.selectionMethod = options.selectionMethod;
        }
      }
      /**
       * retrieve the prediction given the selection method.
       * @param {Array} values - predictions of the estimators.
       * @return {number} prediction
       */
      selection(values) {
        return selectionMethods[this.selectionMethod](values);
      }
      /**
       * Export the current model to JSON.
       * @return {object} - Current model.
       */
      toJSON() {
        let baseModel = super.toJSON();
        return {
          baseModel,
          selectionMethod: this.selectionMethod,
          name: "RFRegression"
        };
      }
      /**
       * Load a Decision tree classifier with the given model.
       * @param {object} model
       * @return {RandomForestRegression}
       */
      static load(model) {
        if (model.name !== "RFRegression") {
          throw new RangeError(`Invalid model: ${model.name}`);
        }
        return new _RandomForestRegression(true, model);
      }
    };
    exports.RandomForestClassifier = RandomForestClassifier;
    exports.RandomForestRegression = RandomForestRegression2;
  }
});

// plugins/token-overview/src/forecast-forest.js
var import_ml_random_forest = __toESM(require_random_forest(), 1);

// plugins/token-overview/src/forecast-context.js
var sum = (values) => values.reduce((n, value) => n + value, 0);
var clamp = (value, low, high) => Math.max(low, Math.min(high, value));
var mean = (values) => values.length ? sum(values) / values.length : 0;
var age = (date, before) => (Date.parse(date) - Date.parse(before)) / 864e5;
var weekday = (date) => (/* @__PURE__ */ new Date(`${date}T12:00:00Z`)).getUTCDay();
var metric = (hours, name = "tokens") => sum(hours.map((row) => row[name] || 0));
var previousDate = (date, offset) => new Date(Date.parse(`${date}T00:00:00Z`) - offset * 864e5).toISOString().slice(0, 10);
function quantile(values, q) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(q * (sorted.length + 1)) - 1))];
}
function weightedMean(rows) {
  const weight = sum(rows.map((row) => row.weight));
  return weight > 0 ? sum(rows.map((row) => row.value * row.weight)) / weight : 0;
}
function dailyPrior(past, client, date) {
  const recent = past.filter((day) => age(date, day.date) <= 28 && day.totals[client]);
  return weightedMean(recent.map((day) => ({
    value: day.totals[client].tokens,
    weight: Math.exp(-age(date, day.date) / 10) * (weekday(date) === weekday(day.date) ? 2 : 1)
  })));
}
function observedHours(day, client, cut, live) {
  const hours = day?.hours[client] || Array.from({ length: 24 }, () => ({ tokens: 0, calls: null, cost: null, cacheTokens: null, outputTokens: null }));
  return hours.map((row, hour) => {
    const fraction = live ? Number(hour < cut) : clamp(cut - hour, 0, 1);
    return Object.fromEntries(Object.entries(row).map(([key, value]) => [key, value === null ? null : value * fraction]));
  });
}
function windowTokens(hours, start, end, cut) {
  return sum(hours.map((row, hour) => {
    const span = clamp(cut - hour, 0, 1);
    const overlap = Math.max(0, Math.min(hour + 1, cut, end) - Math.max(hour, start));
    return span > 0 ? row.tokens * overlap / span : 0;
  }));
}
function contextFor(days, client, date, cut, live = false) {
  const past = days.filter((day) => day.date < date && !day.estimated && day.totals[client]).slice(-84);
  const complete = past.filter((day) => day.complete[client] && age(date, day.date) <= 56);
  const observed = observedHours(days.find((day) => day.date === date), client, cut, live);
  const actual = metric(observed);
  const prior = dailyPrior(past, client, date);
  const baseScale = Math.max(1, quantile(past.slice(-28).map((day) => day.totals[client].tokens).filter((value) => value > 0), 0.5) || prior);
  const recent = complete.slice(-28);
  const profile = Array.from({ length: 24 }, (_, hour) => weightedMean(recent.map((day) => ({ value: day.hours[client][hour].tokens / Math.max(1, day.totals[client].tokens), weight: Math.exp(-age(date, day.date) / 14) }))));
  const fraction = sum(profile.map((value, hour) => value * clamp(cut - hour, 0, 1)));
  const activeHours = observed.filter((row) => row.tokens > 0).length;
  const support = (1 - Math.exp(-activeHours / 3)) * Math.min(1, fraction / 0.2);
  const ratio = fraction > 0 ? actual / Math.max(1, baseScale * fraction) : 1;
  const scale = baseScale * Math.exp(support * Math.log(clamp(ratio, 0.1, 20)));
  const last3 = windowTokens(observed, Math.max(0, cut - 3), cut, cut);
  const previous3 = windowTokens(observed, Math.max(0, cut - 6), Math.max(0, cut - 3), cut);
  let quiet = 0;
  for (let hour = Math.floor(cut); hour >= 0; hour--) {
    const span = clamp(cut - hour, 0, 1);
    if (span === 0) continue;
    if (observed[hour].tokens > 0) break;
    quiet += span;
  }
  return { past, complete, observed, actual, prior, baseScale, scale, profile, fraction, activeHours, cut, date, client, last3, previous3, quiet };
}
var normalized = (value, scale) => Math.log1p(Math.max(0, value) / Math.max(1, scale) * 24);
function horizonFeatures(context, hour) {
  const { observed, cut, date, client, scale, complete, past } = context;
  const recent = complete.slice(-7);
  const yesterday = complete.find((day) => day.date === previousDate(date, 1));
  const weekAgo = complete.find((day) => day.date === previousDate(date, 7));
  const calls = metric(observed, "calls");
  const tokens = context.actual;
  const details = observed.slice(0, Math.ceil(cut));
  const known = (name) => details.length > 0 && details.every((row) => row[name] !== null);
  const dayAngle = weekday(date) * Math.PI * 2 / 7;
  const targetAngle = hour * Math.PI * 2 / 24;
  return [
    cut / 24,
    (hour - cut) / 24,
    Math.sin(targetAngle),
    Math.cos(targetAngle),
    Math.sin(dayAngle),
    Math.cos(dayAngle),
    normalized(context.actual, scale),
    normalized(context.prior, scale),
    context.fraction,
    context.activeHours / Math.max(1, cut),
    context.quiet / 24,
    ...[1, 2, 3, 6].map((width) => normalized(windowTokens(observed, Math.max(0, cut - width), cut, cut) / Math.min(width, Math.max(0.05, cut)), scale)),
    ...[0, 1, 2, 3].map((block) => normalized(windowTokens(observed, Math.max(0, cut - (block + 1) * 3), Math.max(0, cut - block * 3), cut), scale)),
    normalized(yesterday?.hours[client][hour].tokens || 0, scale),
    Number(Boolean(yesterday)),
    normalized(weekAgo?.hours[client][hour].tokens || 0, scale),
    Number(Boolean(weekAgo)),
    normalized(mean(recent.map((day) => day.hours[client][hour].tokens)), scale),
    recent.length ? recent.filter((day) => day.hours[client][hour].tokens > 0).length / recent.length : 0,
    normalized(mean(past.slice(-7).map((day) => day.totals[client].tokens)), scale),
    known("calls") ? Math.log1p(calls / Math.max(1, cut)) : 0,
    Number(known("calls")),
    calls > 0 ? Math.log1p(tokens / calls) : 0,
    known("cacheTokens") && tokens > 0 ? metric(observed, "cacheTokens") / tokens : 0,
    Number(known("cacheTokens")),
    known("outputTokens") && tokens > 0 ? metric(observed, "outputTokens") / tokens : 0,
    Number(known("outputTokens"))
  ];
}

// plugins/token-overview/src/forecast-forest.js
var ORIGINS = [0, 3, 6, 8, 9, 12, 15, 16, 18, 20, 21, 23];
function fitHourlyForest(days, client, date) {
  const complete = days.filter((day) => day.date < date && age(date, day.date) <= 56 && !day.estimated && day.complete[client]);
  const positive = complete.filter((day) => day.totals[client]?.tokens > 0);
  if (positive.length < 3) return null;
  const trainingDays = complete.filter((day) => day.date >= positive[0].date).slice(-28);
  const x = [], y = [];
  for (const day of trainingDays) {
    for (const cut of ORIGINS) {
      const context = contextFor(days, client, day.date, cut);
      if (!context.past.some((before) => before.totals[client].tokens > 0)) continue;
      for (let hour = cut; hour < 24; hour++) {
        x.push(horizonFeatures(context, hour));
        y.push(day.hours[client][hour].tokens / context.scale);
      }
    }
  }
  if (!x.length) return null;
  const forest = new import_ml_random_forest.RandomForestRegression({
    nEstimators: 40,
    maxFeatures: 0.8,
    replacement: false,
    seed: 16102026,
    noOOB: true,
    treeOptions: { maxDepth: 7, minNumSamples: 8 }
  });
  forest.train(x, y);
  return { forest, days: trainingDays.length, positiveDays: positive.length, rows: x.length };
}
function forestHours(model, context) {
  if (!model || context.cut >= 24) return null;
  const first = Math.floor(context.cut);
  const targets = Array.from({ length: 24 - first }, (_, index) => index + first);
  const predictions = model.forest.predict(targets.map((hour) => horizonFeatures(context, hour)));
  return Array.from({ length: 24 }, (_, hour) => {
    if (hour < first) return 0;
    const full = Math.max(0, predictions[hour - first] * context.scale);
    return hour === first ? Math.max(0, full - context.observed[hour].tokens) : full;
  });
}
export {
  fitHourlyForest,
  forestHours
};
