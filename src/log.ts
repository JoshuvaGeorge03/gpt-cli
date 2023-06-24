export default function logger(message: any, uniqueSuffix = ''): void {
	console.log(`message:::${uniqueSuffix}`, message);
}
