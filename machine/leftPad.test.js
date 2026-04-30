import leftPad from "@chrisbodhi/left-pad";
import { expect, test } from "bun:test";
import fc from "fast-check";

test("edge cases", function () {
  expect(leftPad("foobar", 6)).toBe("foobar");
  expect(leftPad("foobar", 5)).toBe("foobar");
  expect(leftPad("foobar", -1)).toBe("foobar");
  expect(leftPad("foobar", 6, "1")).toBe("foobar");
  expect(leftPad("foobar", 5, "1")).toBe("foobar");
  expect(leftPad("foobar", -1, "1")).toBe("foobar");
  expect(leftPad("foobar", 8, "")).toBe("  foobar");
  expect(leftPad("foobar", 8, false)).toBe("  foobar");
  expect(leftPad("foobar", 8, 0)).toBe("00foobar");
  expect(leftPad(0, 3, 1)).toBe("110");
  expect(leftPad(true, 7)).toBe("   true");
  expect(leftPad("", 2)).toBe("  ");
});

test("spaces for ch", function () {
  // default to space if not specified
  expect(leftPad("foo", 2)).toBe("foo");
  expect(leftPad("foo", 3)).toBe("foo");
  expect(leftPad("foo", 4)).toBe(" foo");
  expect(leftPad("foo", 5)).toBe("  foo");
  expect(leftPad("foo", 12)).toBe("         foo");
  expect(leftPad("foo", 13)).toBe("          foo");
  // explicit space param
  expect(leftPad("foo", 2, " ")).toBe("foo");
  expect(leftPad("foo", 3, " ")).toBe("foo");
  expect(leftPad("foo", 4, " ")).toBe(" foo");
  expect(leftPad("foo", 5, " ")).toBe("  foo");
  expect(leftPad("foo", 12, " ")).toBe("         foo");
  expect(leftPad("foo", 13, " ")).toBe("          foo");
});

test("non spaces for ch", function () {
  expect(leftPad(1, 2, 0)).toBe("01");
  expect(leftPad(1, 2, "-")).toBe("-1");
  expect(leftPad("foo", 4, "*")).toBe("*foo");
  expect(leftPad("foo", 5, "*")).toBe("**foo");
  expect(leftPad("foo", 6, "*")).toBe("***foo");
  expect(leftPad("foo", 7, "*")).toBe("****foo");
  expect(leftPad("foo", 103, "*")).toBe(
    "****************************************************************************************************foo",
  );
});

var runProperty = function (name, checkFn) {
  var prop = fc.property(fc.string(), fc.nat(1000), fc.string({ minLength: 1, maxLength: 1 }), checkFn);
  var result = fc.check(prop);
  var message = "";
  if (result.failed) {
    message =
      'Property "' +
      name +
      '" failed on counterexample ' +
      JSON.stringify(result.counterexample) +
      " (seed: " +
      result.seed +
      ")";
  }
  expect(message).toBe("");
};

test("properties", function () {
  runProperty("starts by ch", function (str, len, ch) {
    var beg = leftPad(str, len, ch).substr(0, len - str.length);
    for (var idx = 0; idx != beg.length; ++idx)
      if (beg[idx] !== ch) return false;
    return true;
  });
  runProperty("ends by str", function (str, len, ch) {
    var out = leftPad(str, len, ch);
    for (var idx = 0; idx != str.length; ++idx)
      if (str[str.length - idx - 1] !== out[out.length - idx - 1]) return false;
    return true;
  });
  runProperty(
    "len char long if padded (unchanged otherwise)",
    function (str, len, ch) {
      var out = leftPad(str, len, ch);
      return str.length < len ? out.length === len : str === out;
    },
  );
  runProperty("no ch equivalent to space", function (str, len) {
    return leftPad(str, len) === leftPad(str, len, " ");
  });
});
