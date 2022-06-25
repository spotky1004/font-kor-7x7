import StringExpression from "./StringExpression.js";

export type ExpressionValueType = "message" | "expression";
const variableNameRegexp = /^[A-z][A-z0-9]{0,9}$/;

export default function parseExpression(str: string, variables: Record<string,any>={}): [number, ExpressionValueType] {
  if (typeof str === "undefined") return [NaN, "message"];
  const [expressionStrExp, ...varialbesStrExp] = str.split("\n");
  const expression = new StringExpression(expressionStrExp);
  let value: any;
  let type: ExpressionValueType;
  if (expression.isVaild) {
    for (let i = 0; i < varialbesStrExp.length; i++) {
      const [variableName, variableStrExp] = varialbesStrExp[i].replace(/[ \n\t]/g, "").split("=");
      if (!variableNameRegexp.test(variableName)) continue;
      const [result, ] = parseExpression(variableStrExp, variables);
      variables[variableName] = result;
    }
    value = expression.eval(variables);
    type = "expression";
  } else {
    value = parseInt(str);
    type = "message";
  }
  return [Number(value), type];
}