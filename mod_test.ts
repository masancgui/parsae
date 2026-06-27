import { assertEquals } from "@std/assert";
import {
  alt,
  any,
  between,
  eof,
  lazy,
  left,
  many0,
  many1,
  map,
  not,
  opt,
  right,
  sat,
  sep,
  seq,
  str,
  success,
} from "parsae";

Deno.test(function successTest() {
  const parser = success(123);
  assertEquals(parser("true", 0), {
    success: true,
    value: 123,
    nextPos: 0,
  });
});

Deno.test(function strTest() {
  const parser = str("true");
  assertEquals(parser("true", 0), {
    success: true,
    value: "true",
    nextPos: 4,
  });
  assertEquals(parser("false", 0), {
    success: false,
    pos: 0,
    expected: "true",
  });
});

Deno.test(function anyTest() {
  assertEquals(any("x", 0), {
    success: true,
    value: "x",
    nextPos: 1,
  });
  assertEquals(any("", 0), {
    success: false,
    pos: 0,
  });
});

Deno.test(function eofTest() {
  assertEquals(eof("x", 0), {
    success: false,
    pos: 0,
  });
  assertEquals(eof("", 0), {
    success: true,
    value: undefined,
    nextPos: 0,
  });
});

Deno.test(function satTest() {
  const parser = sat((char) => "0" <= char && char <= "9");
  assertEquals(parser("0", 0), {
    success: true,
    value: "0",
    nextPos: 1,
  });
  assertEquals(parser("x", 0), {
    success: false,
    pos: 0,
  });
});

Deno.test(function notTest() {
  const parser = not(sat((char) => "0" <= char && char <= "9"));
  assertEquals(parser("0", 0), {
    success: false,
    pos: 0,
  });
  assertEquals(parser("x", 0), {
    success: true,
    value: undefined,
    nextPos: 0,
  });
});

Deno.test(function seqTest() {
  const parser = seq(str("("), str(")"));
  assertEquals(parser("()", 0), {
    success: true,
    value: ["(", ")"],
    nextPos: 2,
  });
  assertEquals(parser("(", 0), {
    success: false,
    pos: 1,
    expected: ")",
  });
  assertEquals(parser("x", 0), {
    success: false,
    pos: 0,
    expected: "(",
  });
});

Deno.test(function altTest() {
  const parser = alt(str("true"), str("false"));
  assertEquals(parser("true", 0), {
    success: true,
    value: "true",
    nextPos: 4,
  });
  assertEquals(parser("false", 0), {
    success: true,
    value: "false",
    nextPos: 5,
  });
  assertEquals(parser("let", 0), {
    success: false,
    pos: 0,
    expected: "false",
  });
});

Deno.test(function mapTest() {
  const parser = map(str("123"), (s) => parseInt(s));
  assertEquals(parser("123", 0), {
    success: true,
    value: 123,
    nextPos: 3,
  });
  assertEquals(parser("let", 0), {
    success: false,
    pos: 0,
    expected: "123",
  });
});

Deno.test(function optTest() {
  const parser = opt(str("x"));
  assertEquals(parser("x", 0), {
    success: true,
    value: "x",
    nextPos: 1,
  });
  assertEquals(parser("", 0), {
    success: true,
    value: undefined,
    nextPos: 0,
  });
});

Deno.test(function many0Test() {
  const parser = many0(str(";"));
  assertEquals(parser("x", 0), {
    success: true,
    value: [],
    nextPos: 0,
  });
  assertEquals(parser(";;", 0), {
    success: true,
    value: [";", ";"],
    nextPos: 2,
  });
});

Deno.test(function many1Test() {
  const parser = many1(str(";"));
  assertEquals(parser("x", 0), {
    success: false,
    pos: 0,
    expected: ";",
  });
  assertEquals(parser(";;", 0), {
    success: true,
    value: [";", ";"],
    nextPos: 2,
  });
});

Deno.test(function lazyTest() {
  const parser = lazy(() => any);
  assertEquals(parser("x", 0), {
    success: true,
    value: "x",
    nextPos: 1,
  });
});

Deno.test(function leftTest() {
  const parser = left(str("("), str(")"));
  assertEquals(parser("()", 0), {
    success: true,
    value: "(",
    nextPos: 2,
  });
});

Deno.test(function rightTest() {
  const parser = right(str("("), str(")"));
  assertEquals(parser("()", 0), {
    success: true,
    value: ")",
    nextPos: 2,
  });
});

Deno.test(function betweenTest() {
  const parser = between(str("("), str("x"), str(")"));
  assertEquals(parser("(x)", 0), {
    success: true,
    value: "x",
    nextPos: 3,
  });
});

Deno.test(function sepTest() {
  const parser = sep(str("x"), str(";"));
  assertEquals(parser("", 0), {
    success: true,
    value: [],
    nextPos: 0,
  });
  assertEquals(parser("x", 0), {
    success: true,
    value: ["x"],
    nextPos: 1,
  });
  assertEquals(parser("x;", 0), {
    success: true,
    value: ["x"],
    nextPos: 1,
  });
  assertEquals(parser("x;x", 0), {
    success: true,
    value: ["x", "x"],
    nextPos: 3,
  });
});
