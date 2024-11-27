import { wrapEmscriptenModuleHeap } from 'wasm-heap-manager'

export function splitToCharacters(text: string, language: string = '') {
	return splitBreaks('character', text, language)
}

export function splitToWords(text: string, language: string = '') {
	return splitBreaks('word', text, language)
}

export function splitToSentences(text: string, language: string = '') {
	return splitBreaks('sentence', text, language)
}

export function createCharacterBreakIterator(text: string, language: string = '') {
	errorIfNotInitialized()

	return createBreakIterator('character', text, language)
}

export function createWordBreakIterator(text: string, language: string = '') {
	errorIfNotInitialized()

	return createBreakIterator('word', text, language)
}

export function createLineBreakIterator(text: string, language: string = '') {
	errorIfNotInitialized()

	return createBreakIterator('line', text, language)
}

export function createSentenceBreakIterator(text: string, language: string = '') {
	errorIfNotInitialized()

	return createBreakIterator('sentence', text, language)
}

function splitBreaks(iteratorKind: BreakIteratorKind, text: string, language: string) {
	const breakIterator = createBreakIterator(iteratorKind, text, language)

	const parts: string[] = []

	let lastBoundaryIndex: number | undefined

	for (const boundaryIndex of breakIterator) {
		if (lastBoundaryIndex !== undefined) {
			parts.push(text.substring(lastBoundaryIndex, boundaryIndex))
		}

		lastBoundaryIndex = boundaryIndex
	}

	return parts
}

function* createBreakIterator(kind: BreakIteratorKind, text: string, language: string) {
	const manager = wrapEmscriptenModuleHeap(wasmModule)

	let ssLocaleTag = `${language}@ss=standard`

	const strRef = manager.allocNullTerminatedUtf16String(text)
	const ssLocaleTagRef = manager.allocNullTerminatedAsciiString(ssLocaleTag)

	let iteratorAddress: number

	if (kind === 'character') {
		iteratorAddress = wasmModule._createCharacterBreakIterator(strRef.address, strRef.encodedElementCount, ssLocaleTagRef.address)
	} else if (kind === 'word') {
		iteratorAddress = wasmModule._createWordBreakIterator(strRef.address, strRef.encodedElementCount, ssLocaleTagRef.address)
	} else if (kind === 'line') {
		iteratorAddress = wasmModule._createLineBreakIterator(strRef.address, strRef.encodedElementCount, ssLocaleTagRef.address)
	} else if (kind === 'sentence') {
		iteratorAddress = wasmModule._createSentenceBreakIterator(strRef.address, strRef.encodedElementCount, ssLocaleTagRef.address)
	} else {
		throw new TypeError(`Unsupported iterator kind: '${kind}'`)
	}

	let firstIteration = true

	while (true) {
		let boundaryOffset: number

		if (firstIteration) {
			boundaryOffset = wasmModule._getFirstBoundary(iteratorAddress)

			firstIteration = false
		} else {
			boundaryOffset = wasmModule._getNextBoundary(iteratorAddress)
		}

		if (boundaryOffset === -1) {
			break
		}

		yield boundaryOffset
	}

	wasmModule._destroyBreakIterator(iteratorAddress)

	strRef.free()
	ssLocaleTagRef.free()
}

function errorIfNotInitialized() {
	if (!wasmModule) {
		throw new Error(`WASM module has not been initialized`)
	}
}

export async function initialize() {
	await getWasmModule()
}

let wasmModule: any

async function getWasmModule() {
	if (wasmModule) {
		return wasmModule
	}

	const { default: initializer } = await import('../wasm/icu-segmentation.js')

	wasmModule = await initializer()

	wasmModule._loadInternalICUData()

	return wasmModule
}

type BreakIteratorKind = 'character' | 'word' | 'line' | 'sentence'
