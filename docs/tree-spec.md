# Terraform AST Specification (TFTree)

Specification for Terraform AST structure.

## SurroundingText

Text surrounding nodes that are not "code" (i.e whitespace, comments) are
tracked by the `surroundingText` property which exists on all nodes.

This property is an object that have either or both of two pairs of properties:

```
interface SurroundingInnerText <: SurroundingText {
  leadingInnerText: string;
  trailingInnerText: string;
}

interface SurroundingOuterText <: SurroundingText {
  leadingOuterText: string;
  trailingOuterText: string;
}

type SurroundingText = SurroundingInnerText & SurroundingOuterText;
```

Surrounding text strings are made up of tokens, which can be parsed if needed.

Each node specification contains a section denoting the surrounding text
structure to indicate where in code each surrounding text property is attributed
to.

Note that when displaying this structure, spaces to the sides of surrounding
text structure are decorative, and should be considered as being parsed as part
of that surrounding text unless otherwise noted.

This is also representative of the fact that the start of the majority of
surrounding text is denoted by a Token, most commonly a space or newline.
