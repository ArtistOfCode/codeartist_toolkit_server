const path = require('path')
const { exec } = require('pkg')

class PkgWebpackPlugin {
    apply(compiler) {
        compiler.hooks.afterEmit.tap('PkgWebpackPlugin', (compilation) => {
            // pkg --targets=node14.18.1-win-x64 ./build/app.js --output ./build/win/toolkit_server.exe
            exec(['--target', 'node14.18.1-win-x64',
                path.join(process.cwd(), '/build/app.js'),
                '--output', path.join(process.cwd(), '/build/win/toolkit_server.exe')])
        });
    }
}

module.exports = PkgWebpackPlugin;