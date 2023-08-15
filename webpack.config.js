const path = require('path');
const nodeExternals = require('webpack-node-externals');


module.exports = {
    mode: "production",
    entry: './src/index.ts',  // 入口文件
    target: 'node', // 重要，确保Webpack编译Node.js代码而不是浏览器代码
    externals: [nodeExternals()],
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'streamline.js',
        library:  {
          name: 'streamline',
          type: 'umd'
        },
        libraryTarget: 'umd',
        clean: true,
        // libraryTarget: 'commonjs2',
        globalObject: 'this'

    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            webpack: false,
        },
    }
};
