import * as wasm from './snakewasm_bg.wasm';

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }
/**
*/
export class Game {

    static __wrap(ptr) {
        const obj = Object.create(Game.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_game_free(ptr);
    }
    /**
    * @param {number} x
    * @param {number} y
    * @returns {Game}
    */
    static new(x, y) {
        var ret = wasm.game_new(x, y);
        return Game.__wrap(ret);
    }
    /**
    */
    turn_snake_up() {
        wasm.game_turn_snake_up(this.ptr);
    }
    /**
    */
    turn_snake_left() {
        wasm.game_turn_snake_left(this.ptr);
    }
    /**
    */
    turn_snake_right() {
        wasm.game_turn_snake_right(this.ptr);
    }
    /**
    */
    turn_snake_down() {
        wasm.game_turn_snake_down(this.ptr);
    }
    /**
    */
    tick() {
        wasm.game_tick(this.ptr);
    }
    /**
    * @returns {number}
    */
    pointer_to_snake() {
        var ret = wasm.game_pointer_to_snake(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    snake_data_len() {
        var ret = wasm.game_snake_data_len(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    apple_x() {
        var ret = wasm.game_apple_x(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    apple_y() {
        var ret = wasm.game_apple_y(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    head_direction() {
        var ret = wasm.game_head_direction(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    tail_direction() {
        var ret = wasm.game_tail_direction(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {boolean}
    */
    is_growing() {
        var ret = wasm.game_is_growing(this.ptr);
        return ret !== 0;
    }
    /**
    * @returns {number}
    */
    head_x() {
        var ret = wasm.game_head_x(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    head_y() {
        var ret = wasm.game_head_y(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    tail_x() {
        var ret = wasm.game_tail_x(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    tail_y() {
        var ret = wasm.game_tail_y(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {boolean}
    */
    is_stopped() {
        var ret = wasm.game_is_stopped(this.ptr);
        return ret !== 0;
    }
    /**
    * @returns {number}
    */
    score() {
        var ret = wasm.game_score(this.ptr);
        return ret >>> 0;
    }
}

export const __wbg_random_eb1fab8e1db2d9d1 = typeof Math.random == 'function' ? Math.random : notDefined('Math.random');

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

