const path = require('path');

module.exports = {
	entry: {
		index: './src/gpt.ts',
		gpt: './src/gpt.ts'
	},
	output: {
		path: path.resolve(__dirname, 'gpt'),
		filename: '[name].js',
		clean: true,
		assetModuleFilename: '[name].[ext]'
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [
					{
						loader: 'ts-loader'
					}
				]
			},
			{
				test: /\.env$/,
				type: 'asset/resource'
			}
		]
	},
	target: 'node'
};
