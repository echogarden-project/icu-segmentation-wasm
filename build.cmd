CALL ..\..\external\emsdk\emsdk_env.bat

emcc -s ALLOW_MEMORY_GROWTH=1 -s USE_ICU=1 -s EXPORTED_FUNCTIONS="['_malloc', '_free', '_loadInternalICUData', '_loadExternalICUData', '_createCharacterBreakIterator', '_createWordBreakIterator', '_createLineBreakIterator', '_createSentenceBreakIterator', '_getFirstBoundary', '_getNextBoundary', '_destroyBreakIterator']" -s EXPORTED_RUNTIME_METHODS="[]" -s MODULARIZE=1 -s EXPORT_ES6=1 -s EXPORT_NAME="ICUSegmentation" -D INCLUDE_ICU_DATA -O3 -o wasm/icu-segmentation.js lib/icu-segmentation.cpp
