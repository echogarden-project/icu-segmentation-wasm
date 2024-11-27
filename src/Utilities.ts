export function roundToDigits(val: number, digits = 3) {
	const multiplier = 10 ** digits

	return Math.round(val * multiplier) / multiplier
}
