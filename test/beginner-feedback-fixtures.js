// Real CPython 3.12 tracebacks with the Pyodide wrapper frames prepended.
export const FIXTURES = {
  nameHello: {
    code: "print(Hello)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1, in <module>\nNameError: name 'Hello' is not defined",
  },
  nameAlice: {
    code: "name = Alice\nprint(name)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1, in <module>\nNameError: name 'Alice' is not defined. Did you mean: 'slice'?",
  },
  typeConcat: {
    code: "name = \"Alice\"\nage = 25\nprint(name + \" is \" + age)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 3, in <module>\nTypeError: can only concatenate str (not \"int\") to str",
  },
  typeConcatFloat: {
    code: "print(\"a\" + 2.5)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1, in <module>\nTypeError: can only concatenate str (not \"float\") to str",
  },
  typeIntStr: {
    code: "print(5 + \"a\")\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1, in <module>\nTypeError: unsupported operand type(s) for +: 'int' and 'str'",
  },
  typeIntStrFloat: {
    code: "print(2.5 + \"a\")\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1, in <module>\nTypeError: unsupported operand type(s) for +: 'float' and 'str'",
  },
  noColon: {
    code: "score = 85\nif score >= 70\n    print(\"pass\")\nelse:\n    print(\"fail\")\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 2\n    if score >= 70\n                  ^\nSyntaxError: expected ':'",
  },
  goBang: {
    code: "print(\"Ready?\")\nprint(Go!)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 2\n    print(Go!)\n            ^\nSyntaxError: invalid syntax",
  },
  helloWorldBang: {
    code: "print(Hello, World!)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1\n    print(Hello, World!)\n                      ^\nSyntaxError: invalid syntax",
  },
  typo: {
    code: "name = \"x\"\nprint(nme)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 2, in <module>\nNameError: name 'nme' is not defined. Did you mean: 'name'?",
  },
  typoCase: {
    code: "name = \"x\"\nprint(Name)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 2, in <module>\nNameError: name 'Name' is not defined. Did you mean: 'name'?",
  },
  undefinedVar: {
    code: "y = 1 + total\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1, in <module>\nNameError: name 'total' is not defined",
  },
  useBeforeSet: {
    code: "print(score)\nscore = 5\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1, in <module>\nNameError: name 'score' is not defined",
  },
  arithOperand: {
    code: "print(total + 1)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1, in <module>\nNameError: name 'total' is not defined",
  },
  concatOperand: {
    code: "print(\"Hello, \" + name)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1, in <module>\nNameError: name 'name' is not defined",
  },
  raisedSymbol: {
    code: "raise NameError(\"name '[' is not defined\")\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1, in <module>\nNameError: name '[' is not defined",
  },
  unterminated: {
    code: "print(\"Hello)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1\n    print(\"Hello)\n          ^\nSyntaxError: unterminated string literal (detected at line 1)",
  },
  paren: {
    code: "print(\"Hello\"\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1\n    print(\"Hello\"\n         ^\nSyntaxError: '(' was never closed",
  },
  bracket: {
    code: "items = [1, 2\nprint(items)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1\n    items = [1, 2\n            ^\nSyntaxError: '[' was never closed",
  },
  brace: {
    code: "d = {\"a\": 1\nprint(d)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1\n    d = {\"a\": 1\n        ^\nSyntaxError: '{' was never closed",
  },
  expectedIndent: {
    code: "if True:\nprint(\"x\")\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 2\n    print(\"x\")\n    ^^^^^\nIndentationError: expected an indented block after 'if' statement on line 1",
  },
  unexpectedIndent: {
    code: "print(\"a\")\n    print(\"b\")\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 2\n    print(\"b\")\nIndentationError: unexpected indent",
  },
  unindent: {
    code: "if True:\n        print(\"a\")\n    print(\"b\")\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 3\n    print(\"b\")\n              ^\nIndentationError: unindent does not match any outer indentation level",
  },
  intLiteral: {
    code: "n = int(\"abc\")\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1, in <module>\nValueError: invalid literal for int() with base 10: 'abc'",
  },
  zero: {
    code: "print(1)\nprint(5 / 0)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 2, in <module>\nZeroDivisionError: division by zero",
  },
  index: {
    code: "items = [1, 2]\nprint(items[5])\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 2, in <module>\nIndexError: list index out of range",
  },
  key: {
    code: "d = {\"a\": 1}\nprint(d[\"k\"])\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 2, in <module>\nKeyError: 'k'",
  },
  inFunction: {
    code: "def f():\n    return 1 / 0\nprint(f())\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 3, in <module>\n  File \"<exec>\", line 2, in f\nZeroDivisionError: division by zero",
  },
  unquotedSam: {
    code: "name = Sam\nprint(\"Hello, \" + name)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1, in <module>\nNameError: name 'Sam' is not defined",
  },
  unquotedJane: {
    code: "name = Jane\nprint(name)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1, in <module>\nNameError: name 'Jane' is not defined",
  },
  unquotedCat: {
    code: "pet = Cat\nprint(pet)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1, in <module>\nNameError: name 'Cat' is not defined",
  },
  unquotedMay: {
    code: "day = May\nprint(day)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1, in <module>\nNameError: name 'May' is not defined",
  },
  unquotedHi: {
    code: "x = Hi\nprint(x)\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1, in <module>\nNameError: name 'Hi' is not defined",
  },
  wrongCaseTotal: {
    code: "total = 10\nprint(\"Total: \" + str(Total))\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 2, in <module>\nNameError: name 'Total' is not defined. Did you mean: 'total'?",
  },
  other: {
    code: "x = 5\nx.foo()\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 2, in <module>\nAttributeError: 'int' object has no attribute 'foo'",
  },
  genericSyntax: {
    code: "x = = 5\n",
    errorText: "Traceback (most recent call last):\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 574, in eval_code\n    .run(globals, locals)\n         ^^^^^^^^^^^^^^^^\n  File \"/lib/python312.zip/_pyodide/_base.py\", line 396, in run\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"<exec>\", line 1\n    x = = 5\n        ^\nSyntaxError: invalid syntax",
  },
};
