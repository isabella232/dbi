var path = require ('path'),
	webpack = require ('webpack');

var PRODUCTION = JSON.parse(process.env.PRODUCTION || "0");

module.exports = {
	entry: './ui/App.js',
	output: {
		filename: './www/main.js',
	},
	devtool: "source-map",
	plugins: PRODUCTION ? [
		new webpack.optimize.UglifyJsPlugin({minimize: true})
	] : [],
	module: {
		loaders: [{
			test: /\.jsx$/,
			loader: 'jsx-loader?insertPragma=React.DOM&harmony'
		}, {
			test: /\.js$/,
			loader: 'babel-loader',
			include: path.join(__dirname, 'ui'),
			exclude: /node_modules/,
			query: {
				presets: ['es2015', 'react']
		  }
		}, {
			test: /\.css$/,
			loaders: ['style', 'css?modules&importLoaders=1', 'cssnext'],
			include: path.join(__dirname, 'ui')
		}]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	}
}
