# Building the WebAssembly module

## Using the version of ICU bundled with Emscripten

Install and activate [latest Emscripten](https://emscripten.org/docs/getting_started/downloads.html).

Use `-s USE_ICU=1` to the command line:

(at the base directory of the project)
```
emcc -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_FUNCTIONS="['_malloc', '_free', '_loadInternalICUData', '_loadExternalICUData', '_createCharacterBreakIterator', '_createWordBreakIterator', '_createLineBreakIterator', '_createSentenceBreakIterator', '_getFirstBoundary', '_getNextBoundary', '_destroyBreakIterator']" -s EXPORTED_RUNTIME_METHODS="['HEAPU8']" -s MODULARIZE=1 -s EXPORT_ES6=1 -s -s USE_ICU=1 EXPORT_NAME="ICUSegmentation" -D INCLUDE_ICU_DATA -O3 -I lib/icu/include -o wasm/icu-segmentation.js lib/icu-segmentation.cpp
```

## Compiling the ICU library from source

Install and activate [latest Emscripten](https://emscripten.org/docs/getting_started/downloads.html).

Then download the ICU source code from [the GitHub release page](https://github.com/unicode-org/icu/releases), like `icu4c-77_1-src.zip`, and its corresponding data file, like `icu4c-77_1-data-bin-l.zip`.

Then create a `build` directory inside of it, and `cd build`

Then compile ICU with WebAssembly target with:
```
emconfigure ../configure --prefix=$(pwd)/install --enable-static --disable-shared --with-data-packaging=static --disable-tests --disable-samples --disable-tools --disable-extras CFLAGS="-O3 -std=c11" CXXFLAGS="-O3 -std=c++17"

emmake make -j 4

emmake make install
```

Then copy files `libicuuc.a` `libicudata.a`, `libicui18n.a` from `install/lib` directory to this project's `lib/icu/lib`, and copy the headers from `install/include` to this project's `lib/icu/include`.


The WebAssembly library is built with:

(at the base directory of the project)
```
emcc -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_FUNCTIONS="['_malloc', '_free', '_loadInternalICUData', '_loadExternalICUData', '_createCharacterBreakIterator', '_createWordBreakIterator', '_createLineBreakIterator', '_createSentenceBreakIterator', '_getFirstBoundary', '_getNextBoundary', '_destroyBreakIterator']" -s EXPORTED_RUNTIME_METHODS="['HEAPU8']" -s MODULARIZE=1 -s EXPORT_ES6=1 -s EXPORT_NAME="ICUSegmentation" -D INCLUDE_ICU_DATA -O3 -I lib/icu/include -o wasm/icu-segmentation.js lib/icu-segmentation.cpp lib/icu/lib/libicuuc.a lib/icu/lib/libicui18n.a lib/icu/lib/libicudata.a
```

## Preparing and updating the ICU data file

The code file `lib/icudt77l_dat.c` is generated using the `gencode` ICU tool, and the ICU data file, like `./gencode icudt77l.dat` (`l` suffix means little endian, and `b` means big endian - use little endian for WebAssembly).

The library source code (`icu-segmentation.cpp`) reference to that data may need to be updated from `icudt77l_dat` to the version used.
