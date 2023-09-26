const USE_GLOBAL_CACHE = true;

class Cache {
  constructor(maxSize) {
    this.cache = {};
    this.keys = [];
    this.maxSize = maxSize;
  }
  get(key) {
    if (this.cache.hasOwnProperty(key)) {
      this.keys.splice(this.keys.indexOf(key), 1);
      this.keys.push(key);
      return this.cache[key];
    }
    return null;
  }
  set(key, value) {
    if (this.keys.length >= this.maxSize) {
      const oldestKey = this.keys.shift();
      delete this.cache[oldestKey];
    }
    this.cache[key] = value;
    this.keys.push(key);
  }
}

const GLOBAL_CACHE = new Cache(256);

export const interpret = (node, environment, isFunctionPure = false) => {
  switch (node.kind) {
    case "Let":
      return interpret(
        node.next,
        {
          ...environment,
          [node.name.text]: interpret(node.value, environment, isFunctionPure),
        },
        isFunctionPure
      );
    case "Var":
      return environment[node.text];
    case "Str":
    case "Int":
    case "Bool":
      return node.value;
    case "Tuple":
      return new Tuple(
        interpret(node.first, environment, isFunctionPure),
        interpret(node.second, environment, isFunctionPure)
      );
    case "Function":
      return function (args) {
        return function (environment) {
          const scopedEnvironment = { ...environment };
          node.parameters.forEach((parameter, index) => {
            scopedEnvironment[parameter.text] = args[index];
          });
          return interpret(node.value, scopedEnvironment, isFunctionPure);
        };
      };
    case "Call":
      if (!USE_GLOBAL_CACHE || !isFunctionPure) {
        const callee = interpret(node.callee, environment, isFunctionPure);
        if (node.callee.kind === "Var") {
          return callee(
            node.arguments.map((arg) =>
              interpret(arg, environment, isFunctionPure)
            )
          )(environment);
        }
      }
      if (node.callee.kind === "Var" && node.arguments.length > 0) {
        const cacheId = `${node.callee.text}_${node.arguments
          .map((arg) => interpret(arg, environment, isFunctionPure))
          .join("_")}`;
        if (!GLOBAL_CACHE.get(cacheId)) {
          const callee = interpret(node.callee, environment, isFunctionPure);
          GLOBAL_CACHE.set(
            cacheId,
            callee(
              node.arguments.map((arg) =>
                interpret(arg, environment, isFunctionPure)
              )
            )(environment)
          );
        }
        return GLOBAL_CACHE.get(cacheId);
      } else {
        const callee = interpret(node.callee, environment, isFunctionPure);
      }
    case "Binary":
      const lhs = interpret(node.lhs, environment, isFunctionPure);
      const rhs = interpret(node.rhs, environment, isFunctionPure);
      return handleOperation(node.op, lhs, rhs);
    case "If":
      if (interpret(node.condition, environment, isFunctionPure)) {
        return interpret(node.then, environment, isFunctionPure);
      } else {
        return interpret(node.otherwise, environment, isFunctionPure);
      }
    case "Print":
      return print(interpret(node.value, environment, isFunctionPure));
    default:
      throw new Error(`Unknown node kind: ${node.kind}`);
  }
};

class Tuple {
  constructor(first, second) {
    this.first = first;
    this.second = second;
  }
  toString() {
    return `(${this.first}, ${this.second})`;
  }
}

const handleOperation = (op, lhs, rhs) => {
  switch (op) {
    case "Add":
      return lhs + rhs;
    case "Sub":
      return lhs - rhs;
    case "Mul":
      return lhs * rhs;
    case "Div":
      return lhs / rhs;
    case "Eq":
      return lhs === rhs;
    case "Neq":
      return lhs !== rhs;
    case "Gt":
      return lhs > rhs;
    case "Gte":
      return lhs >= rhs;
    case "Lt":
      return lhs < rhs;
    case "Lte":
      return lhs <= rhs;
    case "And":
      return lhs && rhs;
    case "Or":
      return lhs || rhs;
    case "Rem":
      return lhs % rhs;
    default:
      throw new Error(`Unknown operation: ${op}`);
  }
};

const print = (value) => {
  console.log(`${value}`);
  return value;
};
