import mongoose from 'mongoose';
import Decimal from 'decimal.js';
import { customAlphabet } from 'nanoid';

export const alphabet =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const shortIdLength = 8; // for games, categories (any short data)
const idLength = 16; // for users
const longIdLength = 24; // for
const bigIdLength = 32; // for seeds, transactions, rounds, bets, wins (any huge data)

export const generateShortId = customAlphabet(alphabet, shortIdLength);
export const generateId = customAlphabet(alphabet, idLength);
export const generateLongId = customAlphabet(alphabet, longIdLength);
export const generateBigId = customAlphabet(alphabet, bigIdLength);

export const shortId = {
  type: String,
  unique: true,
  maxlength: shortIdLength,
  default: () => generateShortId(),
};

export const id = {
  type: String,
  unique: true,
  maxlength: idLength,
  default: () => generateId(),
};

export const longId = {
  type: String,
  unique: true,
  maxlength: longIdLength,
  default: () => generateLongId(),
};

export const bigId = {
  type: String,
  unique: true,
  maxlength: bigIdLength,
  default: () => generateBigId(),
};

export const stringType = function (options?) {
  return { type: String, maxLength: 256, trim: true, ...options };
};

export const decimalType = function (options?) {
  return {
    type: mongoose.Schema.Types.Decimal128,
    get: (value: mongoose.Schema.Types.Decimal128) =>
      value ? new Decimal(value.toString()) : value,
    transform: (value: mongoose.Schema.Types.Decimal128) =>
      value ? new Decimal(value.toString()) : value,
    ...options,
  };
};
