# ICU Segmentation (WebAssembly port)

Provides natural language segmentation based on the [ICU (International Components for
    Unicode) C++ library](https://icu.unicode.org/), ported to WebAssembly.

* **Character segmentation** finds the boundaries between grapheme clusters, which may be longer than a single Unicode codepoint, taking into account various linguistic properties
* **Word segmentation** finds boundaries between words, based on rulesets. It also supports more challenging languages like Chinese, Japanese, Thai and Khmer, which require specialized lexicons to determine the boundaries
* **Line break boundary detection** finds potential locations where a line break can be added, for the purpose of word-wrapping
* **Sentence segmentation** finds sentence boundaries based on rulesets and language-specific lexicons
* Supports all recent JavaScript runtimes (Node.js and browsers)

## Installation

```
npm install @echogarden/icu-segmentation-wasm
```

**Note**: package size is about 27 MB uncompressed (11 MB gzipped), due to the size of the ICU data bundled into the WebAssembly binary.

## Usage

### Split operations

Return an array of strings representing the parts.

```ts
import * as ICUSegmantation from '@echogarden/icu-segmentation-wasm'

await ICUSegmantation.initialize()

const str = 'Hello World! How are you doing today?'

console.log(ICUSegmantation.splitToCharacters(str))
// Outputs: [
//   'H','e','l','l','o',' ','W','o','r','l','d','!',' ','H','o','w',' ','a','r','e',' ',
//   'y','o', 'u',' ','d','o','i','n','g',' ','t','o','d','a','y','?'
// ]

console.log(ICUSegmantation.splitToWords(str))
// Outputs: [
//	'Hello', ' ', 'World', '!', ' ', 'How', ' ', 'are', ' ',
//  'you', ' ', 'doing', ' ', 'today', '?'
// ]

console.log(ICUSegmantation.splitToSentences(str, 'en'))
// Outputs: [
//   'Hello World! ',
//   'How are you doing today?'
// ]
```

### Iterator operations

Provides an iterator for sequence of boundary indexes.

They return a JavaScript iterator that can be consumed by a `for..of` loop:
```ts
createCharacterBreakIterator(text, lanaguge?)
createWordBreakIterator(text, lanaguge?)
createLineBreakIterator(text, lanaguge?)
createSentenceBreakIterator(text, lanaguge?)
```

Example usage of an iterator:

```ts
const text = 'Привет, мир! Как у тебя дела сегодня?'

for (const boundaryIndex of createSentenceBreakIterator(text, 'ru')) {
	console.log(boundaryIndex)
}

// Outputs:
// 0
// 13
// 37
```

## License

MIT
