class HoloPlayGamePad extends EventEmitter {

    constructor() {
        super();
        GamePad.VERBOSE = true;


        this.pad = new GamePad(function connect(player) {
            console.log("connected. player: " + player);
        });
    }

    tick() {
        if (this.pad.connected) {
            this.pad.input();
            let gamepad = this.pad.getDevice("HoloPlay");
            if (gamepad != null) {
                this._handleButtonEvents(gamepad.values, gamepad.diffs);
            }
        }
    }

    _handleButtonEvents(values,  // @arg Uint8Array - current values
                       diffs) { // @arg Uint8Array - diff values
        // logic for how these inputs translate to an event
        //   if values[MY_BUTTON] --> onButtonPressed
        //   if values[MY_BUTTON] && diffs[MY_BUTTON] --> onButtonDown
        //   if !values[MY_BUTTON] && diffs[MY_BUTTON] --> onButtonUp

        // Left Events
        if (diffs[GAMEPAD_KEY_A]) {
            if(values[GAMEPAD_KEY_A]) {
                this.emit('buttonDown', 'LEFT');
                this.emit('leftDown');
            } else {
                this.emit('buttonUp', 'LEFT');
                this.emit('leftUp');
            }
        } else if (values[GAMEPAD_KEY_A]) {
            this.emit('buttonPressed', 'LEFT');
            this.emit('leftPressed');
        }

        // Right Events
        if (diffs[GAMEPAD_KEY_Y]) {
            if(values[GAMEPAD_KEY_Y]) {
                this.emit('buttonDown', 'RIGHT');
                this.emit('rightDown');
            } else {
                this.emit('buttonUp', 'RIGHT');
                this.emit('rightUp');
            }
        } else if (values[GAMEPAD_KEY_Y]) {
            this.emit('buttonPressed', 'RIGHT');
            this.emit('rightPressed');
        }

        if (diffs[GAMEPAD_KEY_B]) {
            if(values[GAMEPAD_KEY_B]) {
                this.emit('buttonDown', 'SQUARE');
                this.emit('squareDown');
            } else {
                this.emit('buttonUp', 'SQUARE');
                this.emit('squareUp');
            }
        } else if (values[GAMEPAD_KEY_B]) {
            this.emit('buttonPressed', 'SQUARE');
            this.emit('squarePressed');
        }

        if (diffs[GAMEPAD_KEY_X]) {
            if(values[GAMEPAD_KEY_X]) {
                this.emit('buttonDown', 'CIRCLE');
                this.emit('circleDown');
            } else {
                this.emit('buttonUp', 'CIRCLE');
                this.emit('circleUp');
            }
        } else if (values[GAMEPAD_KEY_X]) {
            this.emit('buttonPressed', 'CIRCLE');
            this.emit('circlePressed');
        }
    }
}