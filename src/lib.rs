mod utils;

use wasm_bindgen::prelude::*;
use js_sys::Math;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

pub struct Apple {
    x: u32,
    y: u32
}

impl Apple {
    pub fn new(x: u32, y: u32) -> Apple {
        Apple {
            x,
            y
        }
    }
    pub fn get_x(&self) -> u32 {
        self.x
    }
    pub fn get_y(&self) -> u32 {
        self.y
    }
}

#[derive(Copy, Clone)]
pub enum Direction {
    Up,
    Down,
    Right,
    Left
}

pub struct Snake {
    body: Vec<(u32, u32)>,
    direction: Direction,
    is_growing: bool
}

impl Snake {
    pub fn new(x: u32, y: u32) -> Snake {
        Snake {
            body: vec![(x, y)],
            direction: Direction::Up,
            is_growing: false
        }
    }
    pub fn poiner(&self) -> *const (u32, u32) {
        self.body.as_ptr()
    }
    pub fn len(&self) -> usize {
        self.body.len()
    }
    pub fn turn_right(&mut self) {
        self.direction = Direction::Right;
    }
    pub fn turn_left(&mut self) {
        self.direction = Direction::Left;
    }
    pub fn turn_up(&mut self) {
        self.direction = Direction::Up;
    }
    pub fn turn_down(&mut self) {
        self.direction = Direction::Down;
    }
    pub fn move_snake(&mut self, &grow: &bool) {
        let (head_x, head_y) = self.body[0];
        match self.direction {
            Direction::Up => {
                self.body.insert(0, (head_x, head_y+1))
            }
            Direction::Down => {
                self.body.insert(0, (head_x, head_y-1))
            }
            Direction::Left => {
                self.body.insert(0, (head_x-1, head_y))
            }
            Direction::Right => {
                self.body.insert(0, (head_x+1, head_y))
            }
        }
        if !grow {
            self.body.pop();
            self.is_growing = false;
        } else {
            self.is_growing = true;
        }
    }
    pub fn head_pos(&self) -> (u32, u32) {
        (self.body[0].0, self.body[0].1)
    }
}

#[wasm_bindgen]
pub struct Game {
    width: u32,
    height: u32,
    snake: Snake,
    apple: Apple,
    turn: Direction,
    score: u32,
    stopped: bool
}

#[wasm_bindgen]
impl Game {
    pub fn new(x: u32, y: u32) -> Game {
        let snake_x = (Math::random() * x as f64).floor() as u32;
        let snake_y = (Math::random() * y as f64).floor() as u32;
        let apple_x = (Math::random() * x as f64).floor() as u32;
        let apple_y = (Math::random() * y as f64).floor() as u32;
        Game {
            width: x,
            height: y,
            snake: Snake::new(snake_x, snake_y),
            apple: Apple::new(apple_x, apple_y),
            turn: Direction::Up,
            score: 0,
            stopped: false
        }
    }
    pub fn turn_snake_up(&mut self) {
        self.turn = Direction::Up;
    }
    pub fn turn_snake_left(&mut self) {
        self.turn = Direction::Left;
    }
    pub fn turn_snake_right(&mut self) {
        self.turn = Direction::Right;
    }
    pub fn turn_snake_down(&mut self) {
        self.turn = Direction::Down;
    }
    pub fn tick(&mut self) {
        if self.stopped {
            return ();
        }
        if self.check_collision() {
            self.stopped = true;
            return ();
        }
        let (head_x, head_y) = self.snake.head_pos();
        let grow = (self.apple.get_x(), self.apple.get_y()) == (head_x, head_y);
        self.snake.move_snake(&grow);
        self.snake.direction = self.turn;
        let apple_x = (Math::random() * self.width as f64).floor() as u32;
        let apple_y = (Math::random() * self.height as f64).floor() as u32;
        if grow {
            self.score += 1;
            self.apple = Apple::new(apple_x, apple_y);
        }
    }
    pub fn pointer_to_snake(&self) -> *const (u32, u32) {
        self.snake.poiner()
    }
    pub fn snake_data_len(&self) -> usize {
        self.snake.len() * 2
    }
    pub fn apple_x(&self) -> u32 {
        self.apple.get_x()
    }
    pub fn apple_y(&self) -> u32 {
        self.apple.get_y()
    }
    pub fn head_direction(&self) -> u32 {
        match self.snake.direction {
            Direction::Up => 0,
            Direction::Right => 1,
            Direction::Down => 2,
            Direction::Left => 3
        }
    }
    pub fn tail_direction(&self) -> u32 {
        if self.snake.body.len() == 1 {
            return self.head_direction();
        }
        let (tail_x, tail_y) = self.snake.body[self.snake.len()-1];
        let (pre_tail_x, pre_tail_y) = self.snake.body[self.snake.len()-2];
        let x_diff: i32 = pre_tail_x as i32 - tail_x as i32;
        let y_diff: i32 = pre_tail_y as i32 - tail_y as i32;
        match (x_diff, y_diff) {
            (0, 1) => 0,
            (1, 0) => 1,
            (0, -1) => 2,
            (-1, 0) => 3,
            _ => 5 
        }
    }
    pub fn is_growing(&self) -> bool {
        self.snake.is_growing
    }
    pub fn head_x(&self) -> u32 {
        self.snake.head_pos().0
    }
    pub fn head_y(&self) -> u32 {
        self.snake.head_pos().1
    }
    pub fn tail_x(&self) -> u32 {
        self.snake.body[self.snake.len() - 1].0
    }
    pub fn tail_y(&self) -> u32 {
        self.snake.body[self.snake.len() - 1].1
    }
    pub fn is_stopped(&self) -> bool {
        self.stopped
    }
    pub fn score(&self) -> u32 {
        self.score
    }
}

impl Game {
    fn check_collision(&self) -> bool {
        let (snake_x, snake_y) = self.snake.head_pos();
        self.snake.body[1..].contains(&(snake_x, snake_y))
        || snake_x >= self.width
        || snake_y >= self.height
    }
}

