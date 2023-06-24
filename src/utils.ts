export function getTypeOf(value: any): string {
	return Object.prototype.toString
		.call(value)
		.split(' ')[1]
		.replace(/\]/g, '')
		.toLowerCase();
}
