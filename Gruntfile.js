module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        curl: {
            'tmp/holoplay.zip': 'https://s3.amazonaws.com/static-files.lookingglassfactory.com/ThreeJSLibrary/HoloPlay.zip',
            'tmp/GamePad.js.zip': 'https://github.com/jaxzin/GamePad.js/archive/add-holoplay.zip',
            'lkg-viewer/js/deps/events/eventemitter.js': 'https://gist.githubusercontent.com/liamcurry/5818048/raw/b453a6967a0ce386d7b0b57e71405086686b00dd/eventemitter.js'
        },
        unzip: {
            'tmp/holoplay': 'tmp/holoplay.zip',
            'tmp/GamePad': 'tmp/GamePad.js.zip'
        },
        copy: {
            holoplay: {
                files: [
                    {expand: true, flatten: true, src: 'tmp/holoplay/HoloPlay/holoplay.js', dest: 'lkg-viewer/js/deps/holoplay/'}
                ]
            },
            gamepad: {
                files: [
                    {expand: true, flatten: true, src: 'tmp/GamePad/GamePad.js-add-holoplay/lib/*', dest: 'lkg-viewer/js/deps/GamePad/'}
                ]
            }
        },
        copydeps: {
            three: {
                options: {
                    minified: false,
                    unminified: false,
                    include: {
                        js: {
                            'three/build/**/*.js': 'three/',
                            'three/examples/js/loaders/GLTFLoader.js': 'three/loaders/'
                        }
                    }
                },
                pkg: 'package.json',
                dest: {
                    js: 'lkg-viewer/js/deps/'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-copy-deps');

    // Combine all actions into a single task
    grunt.registerTask('install', ['curl', 'unzip', 'copy', 'copydeps']);

};