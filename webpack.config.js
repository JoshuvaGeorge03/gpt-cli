const path = require('path');
const BannerPlugin = require('webpack').BannerPlugin;

module.exports = {
	entry: {
		index: './src/gpt.ts',
		gpt: './src/gpt.ts'
	},
	output: {
		path: path.resolve(__dirname, 'gpt'),
		filename: (pathData) =>
			pathData.chunk.name === 'gpt' ? 'gpt' : '[name].js',
		clean: true,
		assetModuleFilename: '[name][ext]'
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
	target: 'node',
	plugins: [
		new BannerPlugin({
			banner: '#! /usr/bin/env node',
			raw: true
		})
	],
	resolve: {
		extensions: ['.ts', '...']
	}
};
