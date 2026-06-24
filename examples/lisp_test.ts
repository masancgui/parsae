import { assertEquals } from "@std/assert/equals";
import { parser } from "./lisp.ts";

Deno.test(function lispTest() {
  assertEquals(parser(""), {
    success: false,
    error: { type: "string-mismatch", expected: "(" },
  });
  assertEquals(parser("()"), {
    success: true,
    value: [],
    rem: "",
  });
  assertEquals(parser("()x"), {
    success: false,
    error: { type: "expected-eof" },
  });
  assertEquals(parser("(hello)"), {
    success: true,
    value: ["hello"],
    rem: "",
  });
  assertEquals(parser("(hello world)"), {
    success: true,
    value: ["hello", "world"],
    rem: "",
  });
  assertEquals(parser("((hello))"), {
    success: true,
    value: [["hello"]],
    rem: "",
  });
});
