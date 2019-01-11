
module.exports = {
    entry: {
        react: "./storefront/react",
        app: "./storefront/index",
    },
    output: {
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ["react", "env"]
                }
            }
        ]
    }
};