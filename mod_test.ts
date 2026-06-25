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
  right,
  sat,
  sep,
  seq,
  str,
  success,
} from "parsae";

Deno.test(function successTest() {
  const parser = success(123);
  assertEquals(parser("true"), {
    success: true,
    value: 123,
    rem: "true",
  });
});

Deno.test(function strTest() {
  const parser = str("true");
  assertEquals(parser("true"), {
    success: true,
    value: "true",
    rem: "",
  });
  assertEquals(parser("false"), {
    success: false,
    expected: "true",
  });
});

Deno.test(function anyTest() {
  assertEquals(any("x"), {
    success: true,
    value: "x",
    rem: "",
  });
  assertEquals(any(""), {
    success: false,
  });
});

Deno.test(function eofTest() {
  assertEquals(eof("x"), {
    success: false,
  });
  assertEquals(eof(""), {
    success: true,
    value: undefined,
    rem: "",
  });
});

Deno.test(function satTest() {
  const parser = sat((char) => "0" <= char && char <= "9");
  assertEquals(parser("0"), {
    success: true,
    value: "0",
    rem: "",
  });
  assertEquals(parser("x"), {
    success: false,
  });
});

Deno.test(function notTest() {
  const parser = not(sat((char) => "0" <= char && char <= "9"));
  assertEquals(parser("0"), {
    success: false,
  });
  assertEquals(parser("x"), {
    success: true,
    value: undefined,
    rem: "x",
  });
});

Deno.test(function seqTest() {
  const parser = seq(str("("), str(")"));
  assertEquals(parser("()"), {
    success: true,
    value: ["(", ")"],
    rem: "",
  });
  assertEquals(parser("("), {
    success: false,
    expected: ")",
  });
  assertEquals(parser("x"), {
    success: false,
    expected: "(",
  });
});

Deno.test(function altTest() {
  const parser = alt(str("true"), str("false"));
  assertEquals(parser("true"), {
    success: true,
    value: "true",
    rem: "",
  });
  assertEquals(parser("false"), {
    success: true,
    value: "false",
    rem: "",
  });
  assertEquals(parser("let"), {
    success: false,
    expected: "false",
  });
});

Deno.test(function mapTest() {
  const parser = map(str("123"), (s) => parseInt(s));
  assertEquals(parser("123"), {
    success: true,
    value: 123,
    rem: "",
  });
  assertEquals(parser("let"), {
    success: false,
    expected: "123",
  });
});

Deno.test(function many0Test() {
  const parser = many0(str(";"));
  assertEquals(parser("x"), {
    success: true,
    value: [],
    rem: "x",
  });
  assertEquals(parser(";;"), {
    success: true,
    value: [";", ";"],
    rem: "",
  });
});

Deno.test(function many1Test() {
  const parser = many1(str(";"));
  assertEquals(parser("x"), {
    success: false,
    expected: ";",
  });
  assertEquals(parser(";;"), {
    success: true,
    value: [";", ";"],
    rem: "",
  });
});

Deno.test(function lazyTest() {
  const parser = lazy(() => any);
  assertEquals(parser("x"), {
    success: true,
    value: "x",
    rem: "",
  });
});

Deno.test(function leftTest() {
  const parser = left(str("("), str(")"));
  assertEquals(parser("()"), {
    success: true,
    value: "(",
    rem: "",
  });
});

Deno.test(function rightTest() {
  const parser = right(str("("), str(")"));
  assertEquals(parser("()"), {
    success: true,
    value: ")",
    rem: "",
  });
});

Deno.test(function betweenTest() {
  const parser = between(str("("), str("x"), str(")"));
  assertEquals(parser("(x)"), {
    success: true,
    value: "x",
    rem: "",
  });
});

Deno.test(function sepTest() {
  const parser = sep(str("x"), str(";"));
  assertEquals(parser(""), {
    success: true,
    value: [],
    rem: "",
  });
  assertEquals(parser("x"), {
    success: true,
    value: ["x"],
    rem: "",
  });
  assertEquals(parser("x;"), {
    success: true,
    value: ["x"],
    rem: ";",
  });
  assertEquals(parser("x;x"), {
    success: true,
    value: ["x", "x"],
    rem: "",
  });
});
