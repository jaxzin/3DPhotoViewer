module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        copydeps: {
            holoplay: {
                options: {
                    minified: false,
                    unminified: false,
                    include: {
                        js: {
                            'holoplay/dist/*.js': 'holoplay/',
                            'holoplay/node_modules/three/build/*.js': 'three/build/',
                            'holoplay/node_modules/three/examples/jsm/loaders/GLTFLoader.js': 'three/examples/jsm/loaders/'
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
                dest: "dist/3DPhotoViewer-<%= pkg.version %>.zip",
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
    grunt.registerTask('install', ['copydeps']);
    grunt.registerTask('package', ['install','zip']);

};