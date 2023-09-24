export const interpret = (node, environment) => {
  switch (node.kind) {
    case "Let":
      return interpret(node.next, {
        ...environment,
        [node.name.text]: interpret(node.value, environment),
      });
    case "Var":
      return environment[node.text];
    case "Str":
    case "Int":
    case "Bool":
      return node.value;
    case "Tuple":
      return new Tuple(
        interpret(node.first, environment),
        interpret(node.second, environment)
      );
    case "Function":
      return function (args) {
        return function (environment) {
          const scopedEnvironment = { ...environment };
          node.parameters.forEach((parameter, index) => {
            scopedEnvironment[parameter.text] = args[index];
          });
          return interpret(node.value, scopedEnvironment);
        };
      };
    case "Call":
      const callee = interpret(node.callee, environment);
      if (node.callee.kind === "Var" && typeof callee === "function") {
        return callee(node.arguments.map((arg) => interpret(arg, environment)))(
          environment
        );
      }
    case "Binary":
      const lhs = interpret(node.lhs, environment);
      const rhs = interpret(node.rhs, environment);
      return handleOperation(node.op, lhs, rhs);
    case "If":
      if (interpret(node.condition, environment)) {
        return interpret(node.then, environment);
      } else {
        return interpret(node.otherwise, environment);
      }
    case "Print":
      return print(interpret(node.value, environment));
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
