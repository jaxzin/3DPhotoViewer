module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
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
                            'three/build/three.js': 'three/',
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
        },
        zip: {
            'chrome extension': {
                src: [
                    'images/**',
                    'lkg-viewer/**',
                    '*.html',
                    '*.js',
                    'manifest.json',
                    'LICENSE.txt',
                    '*.md'
                ],
                dest: "dist/Facebook3DPhotoViewer-<%= pkg.version %>.zip",
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 9
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
    grunt.registerTask('package', ['install','zip']);

};