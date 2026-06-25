import { assertEquals } from "@std/assert/equals";
import { parser } from "./lisp.ts";

Deno.test(function lispTest() {
  assertEquals(parser("", 0), {
    success: false,
    pos: 0,
    expected: "(",
  });
  assertEquals(parser("()", 0), {
    success: true,
    value: [],
    nextPos: 2,
  });
  assertEquals(parser("()x", 0), {
    success: false,
    pos: 2,
  });
  assertEquals(parser("(hello)", 0), {
    success: true,
    value: ["hello"],
    nextPos: 7,
  });
  assertEquals(parser("(hello world)", 0), {
    success: true,
    value: ["hello", "world"],
    nextPos: 13,
  });
  assertEquals(parser("((hello))", 0), {
    success: true,
    value: [["hello"]],
    nextPos: 9,
  });
});
