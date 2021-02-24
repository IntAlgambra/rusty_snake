/* tslint:disable */
/* eslint-disable */
/**
*/
export class Game {
  free(): void;
/**
* @param {number} x
* @param {number} y
* @returns {Game}
*/
  static new(x: number, y: number): Game;
/**
*/
  turn_snake_up(): void;
/**
*/
  turn_snake_left(): void;
/**
*/
  turn_snake_right(): void;
/**
*/
  turn_snake_down(): void;
/**
*/
  tick(): void;
/**
* @returns {number}
*/
  pointer_to_snake(): number;
/**
* @returns {number}
*/
  snake_data_len(): number;
/**
* @returns {number}
*/
  apple_x(): number;
/**
* @returns {number}
*/
  apple_y(): number;
/**
* @returns {number}
*/
  head_direction(): number;
/**
* @returns {number}
*/
  tail_direction(): number;
/**
* @returns {boolean}
*/
  is_growing(): boolean;
/**
* @returns {number}
*/
  head_x(): number;
/**
* @returns {number}
*/
  head_y(): number;
/**
* @returns {number}
*/
  tail_x(): number;
/**
* @returns {number}
*/
  tail_y(): number;
/**
* @returns {boolean}
*/
  is_stopped(): boolean;
/**
* @returns {number}
*/
  score(): number;
}
