import mongoose from "mongoose";

export default function toDecimal(num: number) {
  return mongoose.Types.Decimal128.fromString(num.toString());
}

export function addDecimals(num1: mongoose.Types.Decimal128, num2: mongoose.Types.Decimal128): mongoose.Types.Decimal128 {
  const a: number = parseFloat(num1.toString()) * 100;
  const b: number = parseFloat(num2.toString()) * 100;
  const sum: number = (a + b) / 100;

  return toDecimal(sum);
}

export function subtractDecimals(num1: mongoose.Types.Decimal128, num2: mongoose.Types.Decimal128): mongoose.Types.Decimal128 {
  const a: number = parseFloat(num1.toString()) * 100;
  const b: number = parseFloat(num2.toString()) * 100;
  const sum: number = (a - b) / 100;

  return toDecimal(sum);
}

export function multiplyDecimals(num1: mongoose.Types.Decimal128, num2: mongoose.Types.Decimal128): mongoose.Types.Decimal128 {
  const a: number = parseFloat(num1.toString()) * 100;
  const b: number = parseFloat(num2.toString()) * 100;
  const sum: number = (a * b) / 100;

  return toDecimal(sum);
}

export function divideDecimals(num1: mongoose.Types.Decimal128, num2: mongoose.Types.Decimal128): mongoose.Types.Decimal128 {
  const a: number = parseFloat(num1.toString()) * 100;
  const b: number = parseFloat(num2.toString()) * 100;
  const sum: number = (a / b) / 100;

  return toDecimal(sum);
}
