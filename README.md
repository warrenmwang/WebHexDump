# Web Hex Dump

A small web app that takes an input file of any type and reveals its actual byte data as hex digits and ASCII.
Specifically, the `ISO-8859-2` or `Latin-2` standard, which appears to be one of the extended ASCII standards.
I didn't even know there were multiple variants of the extended ASCII. Well, I just chose an encoding to view
the data where we translate 1 byte of data into 1 character, even if it is non-printable.

Tables of what each [0,255] value maps to which char can be seen [here](https://www.ASCII-code.com/ISO-8859-2) for example.

## Process

Takes the File, then views it as a Blob, passes into FileReader API, views as ArrayBuffer, then views as Uint8Array, then views
those ints [0,255] as hex digits and as ASCII chars via TextDecoder using the `ISO-8859-2` decoding/encoding standard.
