var path = require ('path'),
	webpack = require ('webpack')//,
	//ExtractTextPlugin = require("extract-text-webpack-plugin");

var PRODUCTION = JSON.parse(process.env.PRODUCTION || "0");

module.exports = {
	entry: {
		App: './ui/App',
	},
	output: {
		filename: './www/[name].js',
		chunkFilename: "./www/[id].js"
	},
	devtool: "source-map",
	plugins: PRODUCTION ? [
		new webpack.optimize.UglifyJsPlugin({minimize: true}),
		//new ExtractTextPlugin("./www/[name].css")
	] : [
		//new ExtractTextPlugin("./www/[name].css")
	],
	module: {
		loaders: [{
//			test: /\.jsx$/,
//			loader: 'jsx-loader?insertPragma=React.DOM&harmony'
//		}, {
			test: /\.jsx$/,
			loader: 'babel-loader',
			include: path.join(__dirname, 'ui'),
			exclude: /node_modules/,
			query: {
				presets: ['es2015', 'react']
		  }

		}, {
			test: /\.css$/,
			//loader: ExtractTextPlugin.extract("style-loader", "css-loader"),
			//loaders: ['style', 'css?modules&importLoaders=1', 'cssnext'],
			loader: "style-loader!css-loader",
			exclude: /node_modules/,
			include: path.join(__dirname, 'ui')
		//}, {
			// Optionally extract less files
			// or any other compile-to-css language
			//test: /\.less$/,
			//loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
		}]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
}
