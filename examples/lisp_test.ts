import { assertEquals } from "@std/assert/equals";
import { list } from "./lisp.ts";

Deno.test(function lispTest() {
  assertEquals(list(""), {
    success: false,
    error: { type: "string-mismatch", expected: "(" },
  });
  assertEquals(list("()"), {
    success: true,
    value: [],
    rem: "",
  });
  assertEquals(list("(hello)"), {
    success: true,
    value: ["hello"],
    rem: "",
  });
  assertEquals(list("(hello world)"), {
    success: true,
    value: ["hello", "world"],
    rem: "",
  });
  assertEquals(list("((hello))"), {
    success: true,
    value: [["hello"]],
    rem: "",
  });
});
