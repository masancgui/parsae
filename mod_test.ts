import { assertEquals } from "@std/assert";
import {
  alt,
  any,
  between,
  lazy,
  left,
  many0,
  many1,
  map,
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
    error: { type: "string-mismatch", expected: "true" },
  });
});

Deno.test(function anyTest() {
  const parser = any();
  assertEquals(parser("x"), {
    success: true,
    value: "x",
    rem: "",
  });
  assertEquals(parser(""), {
    success: false,
    error: { type: "empty-input" },
  });
});

Deno.test(function satTest() {
  {
    const parser = sat(any(), (t) => "0" <= t && t <= "9");
    assertEquals(parser("0"), {
      success: true,
      value: "0",
      rem: "",
    });
    assertEquals(parser("x"), {
      success: false,
      error: { type: "failed-predicate" },
    });
  }
  {
    const parser = sat(str("true"), () => true);
    assertEquals(parser("false"), {
      success: false,
      error: { type: "string-mismatch", expected: "true" },
    });
  }
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
    error: { type: "string-mismatch", expected: ")" },
  });
  assertEquals(parser("x"), {
    success: false,
    error: { type: "string-mismatch", expected: "(" },
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
    error: { type: "string-mismatch", expected: "false" },
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
    error: { type: "string-mismatch", expected: "123" },
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
    error: { type: "string-mismatch", expected: ";" },
  });
  assertEquals(parser(";;"), {
    success: true,
    value: [";", ";"],
    rem: "",
  });
});

Deno.test(function lazyTest() {
  const parser = lazy(() => any());
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
