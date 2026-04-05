/**
 * Generates a random order ID following the pattern: VVLO-6AWB2D
 * Pattern: 'VVLO-' + digit + 3 uppercase letters/digits + digit + uppercase letter
 * Example: VVLO-6AWB2D
 */
export function generateRandomOrderId(): string {
	const prefix = 'VLO-'
	const randomDigit = () => Math.floor(Math.random() * 10).toString()
	const randomChar = () => String.fromCharCode(65 + Math.floor(Math.random() * 26))
	const randomAlphaNum = () => {
		// 50% chance for digit or uppercase letter
		return Math.random() < 0.5 ? randomDigit() : randomChar()
	}
	let id = prefix
	id += randomDigit()
	for (let i = 0; i < 3; i++) {
		id += randomAlphaNum()
	}
	id += randomDigit()
	id += randomChar()
	return id
}
