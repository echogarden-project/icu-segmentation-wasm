import * as ICUSegmantation from './Exports.js'
import { Timer } from './Timer.js'

const log = console.log

async function test() {
	const { readFile} = await import('fs/promises')
	const str = await readFile('test-data/Alice.txt', 'utf-8')

	const langauge = ''

	const timer = new Timer()

	await ICUSegmantation.initialize()

	timer.logAndRestart('Initialize')

	const words = ICUSegmantation.splitToWords('Hello  Mr. Smith. How are you doing today?', langauge)

	timer.logAndRestart('Process')

	log(JSON.stringify(words))

	const x = 0
}

let wasmInstance: any

export async function getWasmModule() {
	if (!wasmInstance) {
		const { default: initializer } = await import('../wasm/icu-segmentation.js')

		wasmInstance = await initializer()
	}

	return wasmInstance
}

test()
