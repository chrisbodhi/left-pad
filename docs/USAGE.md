## Usage

```ts
import leftPad from 'left-pad'

leftPad('foo', 5)
// => "  foo"

leftPad('foobar', 6)
// => "foobar"

leftPad(1, 2, '0')
// => "01"

leftPad(17, 5, 0)
// => "00017"
```

**NOTE:** The third argument should be a single `char`. However the module doesn't throw an error if you supply more than one `char`s.

**NOTE:** Characters having code points outside of [BMP plane](https://en.wikipedia.org/wiki/Plane_(Unicode)#Basic_Multilingual_Plane) are considered two distinct characters.
