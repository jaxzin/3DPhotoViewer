module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        curl: {
            'tmp/holoplay.zip': 'https://s3.amazonaws.com/static-files.lookingglassfactory.com/ThreeJSLibrary/HoloPlay.zip'
        },
        unzip: {
            'tmp/holoplay': 'tmp/holoplay.zip'
        },
        copy: {
            holoplay: {
                files: [
                    {expand: true, flatten: true, src: 'tmp/holoplay/HoloPlay/holoplay.js', dest: 'lkg-viewer/js/deps/holoplay/'}
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
            },
            "holoplay-gamepad": {
                options: {
                    minified: false,
                    unminified: false,
                    include: {
                        js: {
                            'holoplay-gamepad/lib/**/*.js': 'holoplay-gamepad/',
                            'uupaa.gamepad.js/lib/**/*.js': 'uupaa.gamepad.js/'
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