# Web Hex Dump

A small web app that takes an input file of any type and reveals its actual byte data as hex digits and ascii.

---

Takes the File, view it as a Blob, pass into FileReader API, view as ArrayBuffer, then view as Uint8Array, then view
those ints [0,255] as hex digits and ascii.
