module.exports = {
    entry: {
        //login: './src/login.js',
        index: './src/index.js',
        //dashboard: './src/dashboard.js',
        //instance: './src/instance.js',
        //volume: './src/volume.js',
        //resourcerequest: './src/resourcerequest.js',
    },
    output: {
        path: __dirname + '/public/js/',
        filename: '[name]_bundle.js'
    },

    devServer: {
        inline: true,
        port: 7777,
        contentBase: __dirname + '/public/'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['es2015','react','stage-0']
                }
            }
        ]
    }
};
