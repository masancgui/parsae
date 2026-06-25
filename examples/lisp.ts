import {
  alt,
  between,
  eof,
  lazy,
  left,
  many0,
  many1,
  map,
  type Parser,
  sat,
  sep,
  str,
} from "parsae";

export type Expr = string | Expr[];

const ws = many0(sat((char) => /\s/.test(char)));
const atomChar = sat((char) => !/\s/.test(char) && !"()".includes(char));

const atom: Parser<Expr> = map(many1(atomChar), (arr) => arr.join(""));
const expr: Parser<Expr> = alt(atom, lazy(() => list));

const list = between(str("("), sep(expr, ws), str(")"));
export const parser = left(list, eof);
