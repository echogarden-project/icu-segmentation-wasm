#include <stdio.h>
#include <unicode/ubrk.h>
#include <unicode/udata.h>

#ifdef INCLUDE_ICU_DATA
#include "icudt68l_dat.c"

// Load internal ICU data
extern "C" int loadInternalICUData() {
	UErrorCode errorCode = U_ZERO_ERROR;

	udata_setCommonData((void*)icudt68l_dat.bytes, &errorCode);

	if (U_FAILURE(errorCode)) {
		// Handle the error (e.g., print error message)
		fprintf(stderr, "ICU Data Error: %s\n", u_errorName(errorCode));
	}

	return errorCode;
}

#else

// Load internal ICU data
extern "C" int loadInternalICUData() {
	fprintf(stderr, "Error: ICU Data has not been included in this build.");

	return -1;
}
#endif

// Load external ICU data
extern "C" int loadExternalICUData(uint8_t* data) {
	UErrorCode errorCode = U_ZERO_ERROR;

	udata_setCommonData((void*)data, &errorCode);

	if (U_FAILURE(errorCode)) {
		// Handle the error (e.g., print error message)
		fprintf(stderr, "ICU Data Error: %s\n", u_errorName(errorCode));
	}

	return errorCode;
}

// Create a new break iterator.
UBreakIterator* createBreakIterator(UBreakIteratorType type, const UChar* text, int32_t textLength, const char* language) {
	UErrorCode statusCode;
	UBreakIterator* iterator = ubrk_open(type, language, text, textLength, &statusCode);

	if (U_FAILURE(statusCode)) {
		fprintf(stderr, "Error opening break iterator: %s\n", u_errorName(statusCode));

		return nullptr;
	}

	return iterator;
}

// Create a new character break iterator
extern "C" UBreakIterator* createCharacterBreakIterator(const UChar* text, int32_t textLength, const char* language) {
	return createBreakIterator(UBRK_CHARACTER, text, textLength, language);
}

// Create a new word break iterator
extern "C" UBreakIterator* createWordBreakIterator(const UChar* text, int32_t textLength, const char* language) {
	return createBreakIterator(UBRK_WORD, text, textLength, language);
}

// Create a new line break iterator
extern "C" UBreakIterator* createLineBreakIterator(const UChar* text, int32_t textLength, const char* language) {
	return createBreakIterator(UBRK_LINE, text, textLength, language);
}

// Create a new sentence break iterator
extern "C" UBreakIterator* createSentenceBreakIterator(const UChar* text, int32_t textLength, const char* language) {
	return createBreakIterator(UBRK_SENTENCE, text, textLength, language);
}

// Get the first boundary position
extern "C" int32_t getFirstBoundary(UBreakIterator* iterator) {
	return ubrk_first(iterator);
}

// Get the next boundary position
extern "C" int32_t getNextBoundary(UBreakIterator* iterator) {
	return ubrk_next(iterator);
}

// Destroy word break iterator
extern "C" void destroyBreakIterator(UBreakIterator* iterator) {
	ubrk_close(iterator);
}
