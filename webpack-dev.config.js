const commonConfig = require('./webpack.config');

module.exports = {
	...commonConfig,
	mode: 'development',
	devtool: 'inline-source-map',
	watch: true,
	watchOptions: {
		aggregateTimeout: 500,
		ignored: ['/node_modules/']
	}
};
