const elements = Array.from(document.getElementsByClassName("board")[0].children);
const cells = [];
let term = 0;
let moves_queue = [];
let last_clicked = "";
const set_style = 'box-shadow: 0.1vmin 0.1vmin 0.6vmin rgb(110, 0, 228) inset, -0.1vmin -0.1vmin 0.6vmin rgb(110, 0, 228) inset';
const remove_style = 'box-shadow: 0vmin 0vmin 0vmin rgb(110, 0, 228) inset, 0vmin 0vmin 0vmin rgb(110, 0, 228) inset';

let is_black_king_moved = 0,
    is_black_left_rock_moved = 0,
    is_black_right_rock_moved = 0;
let is_white_king_moved = 0,
    is_white_left_rock_moved = 0,
    is_white_right_rock_moved = 0;
let black_double = "",
    white_double = "";

// Adding properties to Array prototype

Array.prototype.is_black_king_moved = 0;
Array.prototype.is_black_left_rock_moved = 0;
Array.prototype.is_black_right_rock_moved = 0;
Array.prototype.is_white_king_moved = 0;
Array.prototype.is_white_left_rock_moved = 0;
Array.prototype.is_white_right_rock_moved = 0;
Array.prototype.black_double = "";
Array.prototype.white_double = "";
Array.prototype.point = 0;
Array.prototype.black_king = "";
Array.prototype.white_king = "";
Array.prototype.peice = "";

//Global Varibles
const black_rock = document.getElementById("A1").children[0].children[0].getAttribute("src");
const black_knight = document.getElementById("A2").children[0].children[0].getAttribute("src");
const black_bishop = document.getElementById("A3").children[0].children[0].getAttribute("src");
const black_queen = document.getElementById("A4").children[0].children[0].getAttribute("src");
const black_king = document.getElementById("A5").children[0].children[0].getAttribute("src");
const black_pawn = document.getElementById("B1").children[0].children[0].getAttribute("src");
const white_rock = document.getElementById("H1").children[0].children[0].getAttribute("src");
const white_knight = document.getElementById("H2").children[0].children[0].getAttribute("src");
const white_bishop = document.getElementById("H3").children[0].children[0].getAttribute("src");
const white_queen = document.getElementById("H4").children[0].children[0].getAttribute("src");
const white_king = document.getElementById("H5").children[0].children[0].getAttribute("src");
const white_pawn = document.getElementById("G1").children[0].children[0].getAttribute("src");

function ai() {

    //Global Varibles
    const black_rock = "R";
    const black_knight = "N";
    const black_bishop = "B";
    const black_queen = "Q";
    const black_king = "K";
    const black_pawn = "P";
    const white_rock = "r";
    const white_knight = "n";
    const white_bishop = "b";
    const white_queen = "q";
    const white_king = "k";
    const white_pawn = "p";

    function get_position(id) {
        // console.log(id);
        let xy = [];
        xy[0] = id.charCodeAt(0) - 65;
        xy[1] = id.charCodeAt(1) - 49;
        return xy;
    }

    function peice_color(board, id) {
        let peice = get_peice(board, id);
        if (peice == null) return null;
        if (peice == black_bishop || peice == black_king || peice == black_knight || peice == black_queen || peice == black_rock || peice == black_pawn) {
            return "black";
        } else return "white";
    }

    function has_white_peice(board, id) {
        return (peice_color(board, id) == "white");
    }

    // Checks weather the cell has white peice or not
    function has_black_peice(board, id) {
        return (peice_color(board, id) == "black");
    }

    // elements.map((child) => {
    //     cells.push(child.getAttribute("id"));
    // });

    function get_peice(board, id) {
        let peice = board[get_position(id)[0]][get_position(id)[1]];
        if (peice == ".") {
            return null;
        }
        return peice;
    }

    function get_id(x, y) {
        let id = String.fromCharCode(65 + x, 49 + y);
        return id;
    }

    function get_black_king_id(board) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j] == 'K') {
                    return get_id(i, j);
                }
            }
        }
    }

    function get_white_king_id(board) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j] == 'k') {
                    return get_id(i, j);
                }
            }
        }
    }

    function remove_peice(board, id) {
        let x = get_position(id)[0],
            y = get_position(id)[1];
        let s = board[x];
        newString = "";
        for (let i = 0; i < 8; i++) {
            if (i == y) {
                newString += ".";
            } else newString += s[i];
        }
        board[x] = newString;
    }

    function set_peice(board, id, peice) {
        let x = get_position(id)[0],
            y = get_position(id)[1];
        let s = board[x];
        newString = "";
        for (let i = 0; i < 8; i++) {
            if (i == y) {
                newString += peice;
            } else newString += s[i];
        }
        board[x] = newString;
    }

    function get_black_pawn_moves(board, id) {
        let x = get_position(id)[0];
        let y = get_position(id)[1];
        let moves = [];
        if (x != 7 && get_peice(board, get_id(x + 1, y)) == null) {
            moves.push(get_id(x + 1, y));
            if (x == 1 && get_peice(board, get_id(x + 2, y)) == null) {
                moves.push(get_id(x + 2, y));
            }
        }
        if (y != 7 && x != 7) {
            let left = get_id(x + 1, y + 1);
            if (has_white_peice(board, left)) {
                moves.push(get_id(x + 1, y + 1));
            }
        }
        if (y != 0 && x != 7) {
            let right = get_id(x + 1, y - 1);
            if (has_white_peice(board, right)) {
                moves.push(get_id(x + 1, y - 1));
            }
        }
        if (y + 1 < 8 && board.white_double == get_id(x, y + 1)) {
            remove_peice(board, get_id(x, y));
            remove_peice(board, get_id(x, y + 1));
            if (is_check_to_black(board, get_black_king_id(board)).length > 0);
            else
                moves.push(get_id(x + 1, y + 1));
            set_peice(board, get_id(x, y), black_pawn);
            set_peice(board, get_id(x, y + 1), white_pawn);
        }
        if (y - 1 >= 0 && board.white_double == get_id(x, y - 1)) {
            remove_peice(board, get_id(x, y));
            remove_peice(board, get_id(x, y - 1));
            if (is_check_to_black(board, get_black_king_id(board)).length > 0);
            else
                moves.push(get_id(x + 1, y - 1));
            set_peice(board, get_id(x, y), black_pawn);
            set_peice(board, get_id(x, y - 1), white_pawn);
        }
        return moves;
    }

    function get_white_pawn_moves(board, id) {
        let x = get_position(id)[0];
        let y = get_position(id)[1];
        let moves = [];
        if (x != 0 && get_peice(board, get_id(x - 1, y)) == null) {
            moves.push(get_id(x - 1, y));
            if (x == 6 && get_peice(board, get_id(x - 2, y)) == null) {
                moves.push(get_id(x - 2, y));
            }
        }
        if (y != 0 && x != 0) {
            let left = get_id(x - 1, y - 1);
            if (has_black_peice(board, left)) {
                moves.push(get_id(x - 1, y - 1));
            }
        }
        if (y != 7 && x != 0) {
            let right = get_id(x - 1, y + 1);
            if (has_black_peice(board, right)) {
                moves.push(get_id(x - 1, y + 1));
            }
        }
        if (y + 1 < 8 && board.black_double == get_id(x, y + 1)) {
            remove_peice(board, get_id(x, y));
            remove_peice(board, get_id(x, y + 1));
            if (is_check_to_white(board, get_white_king_id(board)).length > 0);
            else
                moves.push(get_id(x - 1, y + 1));
            set_peice(board, get_id(x, y), white_pawn);
            set_peice(board, get_id(x, y + 1), black_pawn);
        }
        if (y - 1 >= 0 && board.black_double == get_id(x, y - 1)) {
            remove_peice(board, get_id(x, y));
            remove_peice(board, get_id(x, y - 1));
            if (is_check_to_white(board, get_white_king_id(board)).length > 0);
            else
                moves.push(get_id(x - 1, y - 1));
            set_peice(board, get_id(x, y), white_pawn);
            set_peice(board, get_id(x, y - 1), black_pawn);
        }
        return moves;
    }


    function get_white_knight_moves(board, id) {
        let x = get_position(id)[0],
            y = get_position(id)[1];
        let possible_moves = [
            [x + 2, y - 1],
            [x + 2, y + 1],
            [x - 2, y + 1],
            [x - 2, y - 1],
            [x + 1, y - 2],
            [x + 1, y + 2],
            [x - 1, y + 2],
            [x - 1, y - 2]
        ];
        let moves = [];
        possible_moves.map((xy) => {
            let x1 = xy[0],
                y1 = xy[1];
            if (x1 >= 0 && y1 >= 0 && x1 < 8 && y1 < 8 && !has_white_peice(board, get_id(x1, y1))) {
                moves.push(get_id(x1, y1));
            }
        });
        return moves;
    }

    function get_black_knight_moves(board, id) {
        let x = get_position(id)[0],
            y = get_position(id)[1];
        let possible_moves = [
            [x + 2, y - 1],
            [x + 2, y + 1],
            [x - 2, y + 1],
            [x - 2, y - 1],
            [x + 1, y - 2],
            [x + 1, y + 2],
            [x - 1, y + 2],
            [x - 1, y - 2]
        ];
        let moves = [];
        possible_moves.map((xy) => {
            let x1 = xy[0],
                y1 = xy[1];
            if (x1 >= 0 && y1 >= 0 && x1 < 8 && y1 < 8 && !has_black_peice(board, get_id(x1, y1))) {
                moves.push(get_id(x1, y1));
            }
        });
        return moves;
    }


    function get_black_bishop_moves(board, id) {
        let x = get_position(id)[0],
            y = get_position(id)[1];
        let possible_moves = [
            [x + 1, y + 1],
            [x - 1, y + 1],
            [x + 1, y - 1],
            [x - 1, y - 1]
        ];
        let moves = [];
        possible_moves.map((xy) => {
            let x1 = xy[0],
                y1 = xy[1];
            while (x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8) {
                if (has_black_peice(board, get_id(x1, y1))) {
                    break;
                } else if (has_white_peice(board, get_id(x1, y1))) {
                    moves.push(get_id(x1, y1));
                    break;
                } else {
                    moves.push(get_id(x1, y1));
                }
                if (x1 > x) {
                    x1++;
                } else {
                    x1--;
                }
                if (y1 > y) {
                    y1++;
                } else {
                    y1--;
                }
            }
        });
        return moves;
    }

    function get_white_bishop_moves(board, id) {
        let x = get_position(id)[0],
            y = get_position(id)[1];
        let possible_moves = [
            [x + 1, y + 1],
            [x - 1, y + 1],
            [x + 1, y - 1],
            [x - 1, y - 1]
        ];
        let moves = [];
        possible_moves.map((xy) => {
            let x1 = xy[0],
                y1 = xy[1];
            while (x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8) {
                if (has_white_peice(board, get_id(x1, y1))) {
                    break;
                } else if (has_black_peice(board, get_id(x1, y1))) {
                    moves.push(get_id(x1, y1));
                    break;
                } else {
                    moves.push(get_id(x1, y1));
                }
                if (x1 > x) {
                    x1++;
                } else {
                    x1--;
                }
                if (y1 > y) {
                    y1++;
                } else {
                    y1--;
                }
            }
        });
        return moves;
    }


    function get_white_rock_moves(board, id) {
        let x = get_position(id)[0],
            y = get_position(id)[1];
        let possible_moves = [
            [x + 1, y],
            [x - 1, y],
            [x, y + 1],
            [x, y - 1]
        ];
        let moves = [];
        possible_moves.map((xy) => {
            let x1 = xy[0],
                y1 = xy[1];
            while (x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8) {
                if (has_white_peice(board, get_id(x1, y1))) {
                    break;
                } else if (has_black_peice(board, get_id(x1, y1))) {
                    moves.push(get_id(x1, y1));
                    break;
                } else {
                    moves.push(get_id(x1, y1));
                }
                if (x1 > x) {
                    x1++;
                } else if (x1 < x) {
                    x1--;
                }
                if (y1 > y) {
                    y1++;
                } else if (y1 < y) {
                    y1--;
                }
            }
        });
        return moves;
    }

    function get_black_rock_moves(board, id) {
        let x = get_position(id)[0],
            y = get_position(id)[1];
        let possible_moves = [
            [x + 1, y],
            [x - 1, y],
            [x, y + 1],
            [x, y - 1]
        ];
        let moves = [];
        possible_moves.map((xy) => {
            let x1 = xy[0],
                y1 = xy[1];
            while (x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8) {
                if (has_black_peice(board, get_id(x1, y1))) {
                    break;
                } else if (has_white_peice(board, get_id(x1, y1))) {
                    moves.push(get_id(x1, y1));
                    break;
                } else {
                    moves.push(get_id(x1, y1));
                }
                if (x1 > x) {
                    x1++;
                } else if (x1 < x) {
                    x1--;
                }
                if (y1 > y) {
                    y1++;
                } else if (y1 < y) {
                    y1--;
                }
            }
        });
        return moves;
    }



    function get_black_queen_moves(board, id) {
        let moves1 = get_black_rock_moves(board, id);
        let moves2 = get_black_bishop_moves(board, id);
        let moves = [].concat(moves1, moves2);
        return moves;
    }

    function get_white_queen_moves(board, id) {
        let moves1 = get_white_rock_moves(board, id);
        let moves2 = get_white_bishop_moves(board, id);
        let moves = [].concat(moves1, moves2);
        return moves;
    }


    function get_white_king_moves(board, id) {
        let x = get_position(id)[0],
            y = get_position(id)[1];
        let possible_moves = [
            [x - 1, y - 1],
            [x - 1, y],
            [x - 1, y + 1],
            [x, y + 1],
            [x + 1, y + 1],
            [x + 1, y],
            [x + 1, y - 1],
            [x, y - 1]
        ];
        let moves = [];
        possible_moves.map((xy) => {
            let x1 = xy[0],
                y1 = xy[1];
            if (x1 >= 0 && y1 >= 0 && x1 < 8 && y1 < 8 && !has_white_peice(board, get_id(x1, y1))) {
                moves.push(get_id(x1, y1));
            }
        });
        return moves;
    }

    function get_black_king_moves(board, id) {
        let x = get_position(id)[0],
            y = get_position(id)[1];
        let possible_moves = [
            [x - 1, y - 1],
            [x - 1, y],
            [x - 1, y + 1],
            [x, y + 1],
            [x + 1, y + 1],
            [x + 1, y],
            [x + 1, y - 1],
            [x, y - 1]
        ];
        let moves = [];
        possible_moves.map((xy) => {
            let x1 = xy[0],
                y1 = xy[1];
            if (x1 >= 0 && y1 >= 0 && x1 < 8 && y1 < 8 && !has_black_peice(board, get_id(x1, y1))) {
                moves.push(get_id(x1, y1));
            }
        });
        return moves;
    }


    function is_check_to_white(board, id) {
        let moves = get_white_bishop_moves(board, id);
        let checked_cells = [];
        let x = get_position(id)[0],
            y = get_position(id)[1];
        moves.map((id1) => {
            let peice = get_peice(board,id1);
            if (has_black_peice(board, id1) && (peice == black_bishop || peice == black_queen)) {
                let temp = [];
                temp.peice = peice;
                let x1 = get_position(id1)[0],
                    y1 = get_position(id1)[1];
                while (x1 != x && y1 != y) {
                    temp.push(get_id(x1, y1));
                    if (x1 > x) {
                        x1--;
                    } else {
                        x1++;
                    }
                    if (y1 > y) {
                        y1--;
                    } else {
                        y1++;
                    }
                }
                checked_cells.push(temp);
            }
        });

        moves = get_white_rock_moves(board, id);
        moves.map((id1) => {
            let peice = get_peice(board,id1);
            if (has_black_peice(board, id1) && (get_peice(board, id1) == black_rock || get_peice(board, id1) == black_queen)) {
                let temp = [];
                temp.peice = peice;
                let x1 = get_position(id1)[0],
                    y1 = get_position(id1)[1];
                while (x1 != x || y1 != y) {
                    temp.push(get_id(x1, y1));
                    if (x1 > x) {
                        x1--;
                    } else if (x1 < x) {
                        x1++;
                    }
                    if (y1 > y) {
                        y1--;
                    } else if (y1 < y) {
                        y1++;
                    }
                }
                checked_cells.push(temp);
            }
        });

        moves = get_white_knight_moves(board, id);
        moves.map((id1) => {
            let temp = [id1];
            if (has_black_peice(board, id1) && (get_peice(board, id1) == black_knight)) {
                temp.peice = black_knight;
                checked_cells.push(temp);
            }
        });

        moves = get_white_king_moves(board, id);
        moves.map((id1) => {
            let temp = [id1];
            if (has_black_peice(board, id1) && (get_peice(board, id1) == black_king)) {
                temp.peice = black_king;
                checked_cells.push([id1]);
            }
        });

        if (x - 1 >= 0 && y + 1 < 8 && get_peice(board, get_id(x - 1, y + 1)) == black_pawn) {
            let temp = [get_id(x-1,y+1)];
            temp.peice = black_pawn;
            checked_cells.push(temp);
        }
        if (x - 1 >= 0 && y - 1 >= 0 && get_peice(board, get_id(x - 1, y - 1)) == black_pawn) {
            let temp = [get_id(x-1,y-1)];
            temp.peice = black_pawn;
            checked_cells.push(temp);
        }
        return checked_cells;
    }


    function is_check_to_black(board, id) {
        let moves = get_black_bishop_moves(board, id);
        let checked_cells = [];
        let x = get_position(id)[0],
            y = get_position(id)[1];
        moves.map((id1) => {
            let peice = get_peice(board,id1);
            if (has_white_peice(board, id1) && (peice == white_bishop || peice == white_queen)) {
                let temp = [];
                temp.peice = peice;
                let x1 = get_position(id1)[0],
                    y1 = get_position(id1)[1];
                while (x1 != x && y1 != y) {
                    temp.push(get_id(x1, y1));
                    if (x1 > x) {
                        x1--;
                    } else {
                        x1++;
                    }
                    if (y1 > y) {
                        y1--;
                    } else {
                        y1++;
                    }
                }
                checked_cells.push(temp);
            }
        });

        moves = get_black_rock_moves(board, id);
        moves.map((id1) => {
            let peice = get_peice(board,id1);
            if (has_white_peice(board, id1) && (get_peice(board, id1) == white_rock || get_peice(board, id1) == white_queen)) {
                let temp = [];
                temp.peice = peice;
                let x1 = get_position(id1)[0],
                    y1 = get_position(id1)[1];
                while (x1 != x || y1 != y) {
                    temp.push(get_id(x1, y1));
                    if (x1 > x) {
                        x1--;
                    } else if (x1 < x) {
                        x1++;
                    }
                    if (y1 > y) {
                        y1--;
                    } else if (y1 < y) {
                        y1++;
                    }
                }
                checked_cells.push(temp);
            }
        });

        moves = get_black_knight_moves(board, id);
        moves.map((id1) => {
            if (has_white_peice(board, id1) && (get_peice(board, id1) == white_knight)) {
                let temp = [id1];
                temp.peice = white_knight;
                checked_cells.push(temp);
            }
        });

        moves = get_black_king_moves(board, id);
        moves.map((id1) => {
            if (has_white_peice(board, id1) && (get_peice(board, id1) == white_king)) {
                let temp = [id1];
                temp.peice = white_king;
                checked_cells.push(temp);
            }
        });

        if (x + 1 < 8 && y + 1 < 8 && get_peice(board, get_id(x + 1, y + 1)) == white_pawn) {
            let temp = [get_id(x+1,y+1)];
            temp.peice = white_pawn;
            checked_cells.push(temp);
        }
        if (x + 1 < 8 && y - 1 >= 0 && get_peice(board, get_id(x + 1, y - 1)) == white_pawn) {
            let temp = [get_id(x+1,y-1)];
            temp.peice = white_pawn;
            checked_cells.push(temp);
        }
        return checked_cells;
    }

    function get_legal_moves(board, id, checked_cells) {
        let moves = [];
        let peice = get_peice(board, id);
        if (peice == null) {
            return;
        } else if (peice == black_pawn && checked_cells.length != 2) {
            let possible_moves = get_black_pawn_moves(board, id);
            if (checked_cells.length == 0) {
                moves = possible_moves;
            } else {
                moves = possible_moves.filter(value => checked_cells[0].includes(value));
            }
        } else if (peice == white_pawn && checked_cells.length != 2) {
            let possible_moves = get_white_pawn_moves(board, id);
            if (checked_cells.length == 0) {
                moves = possible_moves;
            } else {
                moves = possible_moves.filter(value => checked_cells[0].includes(value));
            }
        } else if (peice == white_knight && checked_cells.length != 2) {
            let possible_moves = get_white_knight_moves(board, id);
            if (checked_cells.length == 0) {
                moves = possible_moves;
            } else {
                moves = possible_moves.filter(value => checked_cells[0].includes(value));
            }
        } else if (peice == black_knight && checked_cells.length != 2) {
            let possible_moves = get_black_knight_moves(board, id);
            if (checked_cells.length == 0) {
                moves = possible_moves;
            } else {
                moves = possible_moves.filter(value => checked_cells[0].includes(value));
            }
        } else if (peice == white_bishop && checked_cells.length != 2) {
            let possible_moves = get_white_bishop_moves(board, id);
            if (checked_cells.length == 0) {
                moves = possible_moves;
            } else {
                moves = possible_moves.filter(value => checked_cells[0].includes(value));
            }
        } else if (peice == black_bishop && checked_cells.length != 2) {
            let possible_moves = get_black_bishop_moves(board, id);
            if (checked_cells.length == 0) {
                moves = possible_moves;
            } else {
                moves = possible_moves.filter(value => checked_cells[0].includes(value));
            }
        } else if (peice == black_rock && checked_cells.length != 2) {
            let possible_moves = get_black_rock_moves(board, id);
            if (checked_cells.length == 0) {
                moves = possible_moves;
            } else {
                moves = possible_moves.filter(value => checked_cells[0].includes(value));
            }
        } else if (peice == white_rock && checked_cells.length != 2) {
            let possible_moves = get_white_rock_moves(board, id);
            if (checked_cells.length == 0) {
                moves = possible_moves;
            } else {
                moves = possible_moves.filter(value => checked_cells[0].includes(value));
            }
        } else if (peice == black_queen && checked_cells.length != 2) {
            let possible_moves = get_black_queen_moves(board, id);
            if (checked_cells.length == 0) {
                moves = possible_moves;
            } else {
                moves = possible_moves.filter(value => checked_cells[0].includes(value));
            }
        } else if (peice == white_queen && checked_cells.length != 2) {
            let possible_moves = get_white_queen_moves(board, id);
            if (checked_cells.length == 0) {
                moves = possible_moves;
            } else {
                moves = possible_moves.filter(value => checked_cells[0].includes(value));
            }
        } else if (peice == black_king) {
            let checked_cells = get_black_king_moves(board, id);
            let safe_cells = [];
            remove_peice(board, id);
            checked_cells.map((id1) => {
                if (is_check_to_black(board, id1).length == 0) {
                    safe_cells.push(id1);
                }
            });
            set_peice(board, id, peice);
            if (board.is_black_king_moved == 0 && is_check_to_black(board, "A5").length == 0) {
                if (board.is_black_right_rock_moved == 0 && get_peice(board, "A6") == null && get_peice(board, "A7") == null && is_check_to_black(board, "A7").length == 0 && is_check_to_black(board, "A6").length == 0) {
                    safe_cells.push("A7");
                }
                if (board.is_black_left_rock_moved == 0 && get_peice(board, "A2") == null && get_peice(board, "A3") == null && get_peice(board, "A4") == null && is_check_to_black(board, "A2").length == 0 && is_check_to_black(board, "A3").length == 0 && is_check_to_black(board, "A4").length == 0) {
                    safe_cells.push("A3");
                }
            }
            moves = safe_cells;
        } else if (peice == white_king) {
            let checked_cells = get_white_king_moves(board, id);
            let safe_cells = [];
            remove_peice(board, id);
            checked_cells.map((id1) => {
                if (is_check_to_white(board, id1).length == 0) {
                    safe_cells.push(id1);
                }
            });
            set_peice(board, id, peice);

            if (board.is_white_king_moved == 0 && is_check_to_white(board, "H5").length == 0) {
                if (board.is_white_right_rock_moved == 0 && get_peice(board, "H6") == null && get_peice(board, "H7") == null && is_check_to_white(board, "H7").length == 0 && is_check_to_white(board, "H6").length == 0) {
                    safe_cells.push("H7");
                }
                if (board.is_white_left_rock_moved == 0 && get_peice(board, "H2") == null && get_peice(board, "H3") == null && get_peice(board, "H4") == null && is_check_to_white(board, "H2").length == 0 && is_check_to_white(board, "H3").length == 0 && is_check_to_white(board, "H4").length == 0) {
                    safe_cells.push("H3");
                }
            }
            moves = safe_cells;
        }
        return moves;
    }

    const points = {
        "Q":160,
        "q":160,
        "R":85,
        "r":85,
        "b":50,
        "B":50, 
        "n":40,
        "N":40,
        "P":10,
        "p":10,
        "K":1000,
        "k":1000
    }


    // Plays the peice at the legal positions
    function make_move(board, last_clicked, id, depth) {
        let peice = get_peice(board, last_clicked);
        let id_peice = get_peice(board, id);

        let newBoard = board.slice();
        newBoard.__proto__ = board;
        newBoard.point = 0;
        if (id_peice != null) {
            newBoard.point += points[id_peice];
        }
        let xy = get_position(id),
            x = xy[0],
            y = xy[1];
        if (id_peice == black_rock) {
            if (y == 0) {
                newBoard.is_black_left_rock_moved = 1;
            } else {
                newBoard.is_black_right_rock_moved = 1;
            }
        }

        if (id_peice == white_rock) {
            if (y == 0) {
                newBoard.is_white_left_rock_moved = 1;
            } else {
                newBoard.is_white_right_rock_moved = 1;
            }
        }

        if (peice == black_pawn) {
            if (x == 7) {
                peice = black_queen;
            }
            if (x - get_position(last_clicked)[0] == 2) {
                newBoard.black_double = id;
            }
            if ((y - get_position(last_clicked)[1]) != 0 && id_peice == null) {
                remove_peice(newBoard, get_id(x - 1, y));
            }
        } else {
            newBoard.black_double = "";
        }
        if (peice == white_pawn) {
            if (get_position(last_clicked)[0] - x == 2) {
                newBoard.white_double = id;
            }
            if ((y - get_position(last_clicked)[1]) != 0 && id_peice == null) {
                remove_peice(newBoard, get_id(x + 1, y));
            }
            if (x == 0) {
                peice = white_queen;
            }
        } else {
            newBoard.white_double = ""
        }

        let xlast = get_position(last_clicked)[0];
        let ylast = get_position(last_clicked)[1];


        if(peice == black_pawn){
            let left_up = get_peice(board,get_id(xlast-1,ylast-1));
            let right_up = get_peice(board,get_id(xlast-1,ylast+1));
            let right_down = get_id(xlast+1,ylast+1);
            let left_down = get_id(xlast+1,ylast-1);
            if(left_up == black_bishop || right_up == black_bishop){
                board.point += 0.3;
            }
            if(left_up == black_queen || right_up == black_queen){
                board.point += 0.3;
            }
            if((has_black_peice(board,right_down) || has_black_peice(board,left_down)) && get_peice(board,right_down)!=black_king && get_peice(board,left_down)!=black_king){
                board.point += 0.3;
            }
            if(x - xlast > 1){
                board.point += 0.15;
            }
            else if(x==7){
                board.point += 150;
            }
            else if(x==5){
                board.point+=1;
            }
            else if(x==4){
                board.point+=0.3
            }
        }
        if(peice == white_pawn){
            let left_up = get_id(xlast-1,ylast-1);
            let right_up = get_id(xlast-1,ylast+1);
            let right_down = get_peice(board,get_id(xlast+1,ylast+1));
            let left_down = get_peice(board,get_id(xlast+1,ylast-1));
            if(left_down == white_bishop || right_down == white_bishop){
                board.point += 0.3;
            }
            if(left_down == white_queen || right_down == white_queen){
                board.point += 0.3;
            }
            if((has_white_peice(board,right_up) || has_white_peice(board,left_up)) && get_peice(board,right_up)!=white_king && get_peice(board,left_up)!= white_king){
                board.point += 0.3;
            }
            if(xlast - x > 1){
                board.point += 0.15;
            }
            else if(x==0){
                board.point += 150;
            }
            else if(x==2){
                board.point+=1;
            }
            else if(x==3){
                board.point+=0.2
            }
            
        }

        if(peice == black_knight){
            let moves = get_black_knight_moves(board,last_clicked);
            board.point += moves.length/8;
        }

        if(peice == white_knight){
            let moves = get_white_knight_moves(board,last_clicked);
            board.point += moves.length/8;
        }

        set_peice(newBoard, id, peice);
        remove_peice(newBoard, last_clicked);

        if (has_white_peice(newBoard, id)) {
            let checked_cells = is_check_to_black(newBoard, newBoard.black_king);
            let moves_count = get_moves_count(newBoard, "black", checked_cells);
            if (moves_count == 0) {
                if (checked_cells.length > 0) {
                    newBoard.point = 10000;
                } else {
                    newBoard.point = 10;
                }
            }
        } else {
            let checked_cells = is_check_to_white(newBoard, newBoard.white_king);
            let moves_count = get_moves_count(newBoard, "white", checked_cells);
            if (moves_count == 0) {
                if (checked_cells.length > 0) {
                    newBoard.point = 10000;
                } else {
                    newBoard.point = 10;
                }
            }
        }

        if(depth == 1){
            let white = is_check_to_white(board,id);
            let black = is_check_to_black(board, id);
            let white_supports = white.map((arr)=>{
                return points[arr.peice];
            });
            let black_supports = black.map((arr)=>{
                return points[arr.peice];
            });
            white_supports.sort();
            black_supports.sort();
            white_supports.unshift(points[peice]);
            let maxPoints = 0;
            let currPoints = 0;
            let i = 0; 
            while(true){
                if(i<black_supports.length){
                    currPoints += white_supports[i];
                }
                else break;
                
                if(i+1<white_supports.length){
                    currPoints -= black_supports[i];
                }
                else {
                    maxPoints = Math.max(currPoints, maxPoints);
                    break;
                };
                maxPoints = Math.max(currPoints,maxPoints);
                i++;
            }
            newBoard.point -= maxPoints;
        }

        if (peice == black_rock) {
            if (last_clicked == "A1")
                newBoard.is_black_left_rock_moved = 1;
            else
                newBoard.is_black_right_rock_moved = 1;
        }
        if (peice == black_king) {
            newBoard.is_black_king_moved = 1;
            if (last_clicked == "A5" && id == "A7") {
                remove_peice(newBoard, "A8");
                set_peice(newBoard, "A6", black_rock);
            }
            if (last_clicked == "A5" && id == "A3") {
                remove_peice(newBoard, "A1");
                set_peice(newBoard, "A4", black_rock);
            }
            newBoard.black_king = id;
        }
        if (peice == white_rock) {
            if (last_clicked == "A1")
                newBoard.is_white_left_rock_moved = 1;
            else
                newBoard.is_white_right_rock_moved = 1;
        }
        if (peice == white_king) {
            newBoard.is_white_king_moved = 1;
            if (last_clicked == "H5" && id == "H7") {
                remove_peice(newBoard, "H8");
                set_peice(newBoard, "H6", white_rock);
            }
            if (last_clicked == "H5" && id == "H3") {
                remove_peice(newBoard, "H1");
                set_peice(newBoard, "H4", white_rock);
            }
            newBoard.white_king = id;
        }
        return newBoard;
    }


    function get_moves_count(board, id, checked_cells) {
        let count = 0;
        if (id == "black") {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (has_black_peice(board, get_id(i, j))) {
                        count += get_legal_moves(board, get_id(i, j), checked_cells).length;
                        if (count > 0) return count;
                    }
                }
            }
        } else if (id == "white") {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (has_white_peice(board, get_id(i, j))) {
                        count += get_legal_moves(board, get_id(i, j), checked_cells).length;
                        if (count > 0) return count;
                    }
                }
            }
        }
        return count;
    }

    function think_for_black(board, depth) {
        if (depth == 0) {
            return ["", "", 0];
        }
        let ans = ["", "", -10000];
        let steps = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let id = get_id(i, j);
                if (has_black_peice(board, id)) {
                    let p = get_peice(board, id);
                    remove_peice(board, id);
                    let checked_cells = is_check_to_black(board, board.black_king);
                    set_peice(board, id, p);
                    let moves = get_legal_moves(board, id, checked_cells);
                    steps+=moves.length;
                    if (moves.length > 0) {
                        moves.map(element => {
                            // console.log(id,element);
                            let newBoard = make_move(board, id, element,depth);
                            let blackPoint = think_for_white(newBoard, depth - 1)[2];
                            if (ans[2] < (newBoard.point - blackPoint)) {
                                ans[0] = id;
                                ans[1] = element;
                                ans[2] = newBoard.point - blackPoint;
                            }

                        });
                    }
                }
            }
        }
        if(steps==0){
            return ["","",0];
        }
        return ans;
    }
    
    function think_for_white(board, depth) {
        if (depth == 0) {
            return ["", "", 0];
        }
        let ans = ["", "", -10000];
        let steps = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let id = get_id(i, j);
                if (has_white_peice(board, id)) {
                    let p = get_peice(board, id);
                    remove_peice(board, id);
                    let checked_cells = is_check_to_white(board, board.white_king);
                    set_peice(board, id, p);
                    let moves = get_legal_moves(board, id, checked_cells);
                    steps+=moves.length;
                    moves.map(element => {
                        let newBoard = make_move(board, id, element,depth);
                        let whitePoint = think_for_black(newBoard, depth - 1)[2];
                        if (ans[2] < (newBoard.point - whitePoint)) {
                            ans[0] = id;
                            ans[1] = element;
                            ans[2] = newBoard.point - whitePoint;
                        }
                    });
                }
            }
        }
        if(steps == 0){
            return ["","",0]
        }
        return ans;
    }
    
    return (board,depth) => {
        return think_for_black(board,depth);
    }
}

const think = ai();

elements.map((child) => {
    cells.push(child.getAttribute("id"));
});


document.getElementsByClassName("undo")[0].addEventListener("click", () => {
    undo(1);
})


function remove_backgroud() {
    cells.map((id) => {
        get_bg(id).setAttribute("hidden", "hidden");
        document.getElementById(id).children[2].children[0].setAttribute("hidden", "hidden");
        document.getElementById(id).children[2].children[1].setAttribute("hidden", "hidden");
        document.getElementById(id).children[3].setAttribute("hidden", "hidden");
        let board = get_board();
    });
}

function get_id(x, y) {
    let id = String.fromCharCode(65 + x, 49 + y);
    return id;
}

// Returns position form id
function get_position(id) {
    let xy = [];
    xy[0] = id.charCodeAt(0) - 65;
    xy[1] = id.charCodeAt(1) - 49;
    return xy;
}

// Returns the peice at cell with particular id
function get_peice(id) {
    let peice = document.getElementById(id).children[0].children[0].getAttribute("src");
    return peice;
}

// Returns the color of the peice
function peice_color(id) {
    if (get_peice(id) == null) return null;
    let peice = get_peice(id);
    if (peice == black_bishop || peice == black_king || peice == black_knight || peice == black_queen || peice == black_rock || peice == black_pawn) {
        return "black";
    } else return "white";
}

// Checks weather the cell has white peice or not
function has_white_peice(id) {
    return (get_peice(id) != null && peice_color(id) == "white");
}

// Checks weather the cell has white peice or not
function has_black_peice(id) {
    return (get_peice(id) != null && peice_color(id) == "black");
}

// Returns array of legal moves of peice at cell with particular id
function get_legal_moves(id, checked_cells) {
    let x = get_position(id)[0];
    let y = get_position(id)[1];

    let moves = [];
    let peice = get_peice(id);
    if (peice == null) {
        return;
    } else if (peice == black_pawn && checked_cells.length != 2) {
        let possible_moves = get_black_pawn_moves(id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_pawn && checked_cells.length != 2) {
        let possible_moves = get_white_pawn_moves(id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_knight && checked_cells.length != 2) {
        let possible_moves = get_white_knight_moves(id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_knight && checked_cells.length != 2) {
        let possible_moves = get_black_knight_moves(id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_bishop && checked_cells.length != 2) {
        let possible_moves = get_white_bishop_moves(id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_bishop && checked_cells.length != 2) {
        let possible_moves = get_black_bishop_moves(id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_rock && checked_cells.length != 2) {
        let possible_moves = get_black_rock_moves(id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_rock && checked_cells.length != 2) {
        let possible_moves = get_white_rock_moves(id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_queen && checked_cells.length != 2) {
        let possible_moves = get_black_queen_moves(id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_queen && checked_cells.length != 2) {
        let possible_moves = get_white_queen_moves(id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_king) {
        let checked_cells = get_black_king_moves(id);
        let safe_cells = [];
        remove_peice(id);
        checked_cells.map((id1) => {
            if (is_check_to_black(id1).length == 0) {
                safe_cells.push(id1);
            }
        });
        set_peice(id, peice);
        if (is_black_king_moved == 0 && is_check_to_black("A5").length == 0) {
            if (is_black_right_rock_moved == 0 && get_peice("A6") == null && get_peice("A7") == null && is_check_to_black("A7").length == 0 && is_check_to_black("A6").length == 0) {
                safe_cells.push("A7");
            }
            if (is_black_left_rock_moved == 0 && get_peice("A2") == null && get_peice("A3") == null && get_peice("A4") == null && is_check_to_black("A2").length == 0 && is_check_to_black("A3").length == 0 && is_check_to_black("A4").length == 0) {
                safe_cells.push("A3");
            }
        }
        moves = safe_cells;
    } else if (peice == white_king) {
        let checked_cells = get_white_king_moves(id);
        let safe_cells = [];
        remove_peice(id);
        checked_cells.map((id1) => {
            if (is_check_to_white(id1).length == 0) {
                safe_cells.push(id1);
            }
        });
        set_peice(id, peice);

        if (is_white_king_moved == 0 && is_check_to_white("H5").length == 0) {
            if (is_white_right_rock_moved == 0 && get_peice("H6") == null && get_peice("H7") == null && is_check_to_white("H7").length == 0 && is_check_to_white("H6").length == 0) {
                safe_cells.push("H7");
            }
            if (is_white_left_rock_moved == 0 && get_peice("H2") == null && get_peice("H3") == null && get_peice("H4") == null && is_check_to_white("H2").length == 0 && is_check_to_white("H3").length == 0 && is_check_to_white("H4").length == 0) {
                safe_cells.push("H3");
            }
        }
        moves = safe_cells;
    }
    return moves;
}

// Returns total possible moves for either player at the time
function get_moves_count(id, checked_cells) {
    let count = 0;
    if (has_black_peice(id)) {
        cells.map((id1) => {
            if (has_black_peice(id1)) {
                count += get_legal_moves(id1, checked_cells).length;
            }
        });
    } else if (has_white_peice(id)) {
        cells.map((id1) => {
            if (has_white_peice(id1)) {
                count += get_legal_moves(id1, checked_cells).length;
            }
        })
    }
    return count;
}

// Shows Legal Moves of clicked peice
function show_moves(id) {

    let checked_cells;
    let is_show = document.getElementById("show_moves").checked;
    let peice = get_peice(id);
    if (has_black_peice(id)) {
        remove_peice(id);
        checked_cells = is_check_to_black(get_black_king_id());
        set_peice(id, peice);
    } else {
        remove_peice(id);
        checked_cells = is_check_to_white(get_white_king_id());
        set_peice(id, peice);
    }
    let moves = get_legal_moves(id, checked_cells);
    if (moves.length == 0) {
        document.getElementById(id).children[3].removeAttribute("hidden");
    }
    moves.map((id) => {
        if (get_peice(id) != null && is_show == false) {
            document.getElementById(id).children[2].children[1].removeAttribute("hidden");
        } else if (is_show == true) {
            let elements = Array.from(document.getElementsByClassName("circle"));
            elements.forEach(element => {
                element.style.display = "none";
            });
            get_bg(id).removeAttribute("hidden");
        } else {
            let elements = Array.from(document.getElementsByClassName("circle"));
            elements.forEach(element => {
                element.style.display = "";
            });
            get_bg(id).removeAttribute("hidden");
        }
    })
}

let Children = Array.from(document.getElementsByClassName("pawn_promotion")[0].children);
Children.forEach(el => {
    el.addEventListener("click", () => {
        let peice = el.children[0].getAttribute("src");
        let id;
        for (let i = 0; i < 8; i++) {
            if (get_peice(get_id(0, i)) == white_pawn) {
                id = get_id(0, i);
            }
            if (get_peice(get_id(7, i)) == white_pawn) {
                id = get_id(7, i);
            }
        }
        set_peice(id, peice);
        let element = document.querySelector(".layer");
        element.style.display = "none";
    });
});

function pawn_promotion(id) {
    let element = document.querySelector(".layer");
    if (get_position(id)[0] == 7) {
        element.children[0].children[0].children[0].setAttribute("src", black_queen);
        element.children[0].children[1].children[0].setAttribute("src", black_rock);
        element.children[0].children[2].children[0].setAttribute("src", black_knight);
        element.children[0].children[3].children[0].setAttribute("src", black_bishop);
    } else {
        element.children[0].children[0].children[0].setAttribute("src", white_queen);
        element.children[0].children[1].children[0].setAttribute("src", white_rock);
        element.children[0].children[2].children[0].setAttribute("src", white_knight);
        element.children[0].children[3].children[0].setAttribute("src", white_bishop);
    }
    element.style.display = "flex";
}

function undo(cnt) {
    if (moves_queue.length == 0) {
        return;
    }
    let last_moves = moves_queue[moves_queue.length - 1];
    set_peice(last_moves["2"][0], last_moves["2"][1]);
    if (last_moves["1"][1] != null) {
        set_peice(last_moves["1"][0], last_moves["1"][1]);
    } else {
        remove_peice(last_moves["1"][0]);
    }
    if (last_moves["3"] != null) {
        if (last_moves["3"][1] != null) {
            set_peice(last_moves["3"][0], last_moves["3"][1]);
        } else {
            remove_peice(last_moves["3"][0]);
        }
    }
    if (last_moves["4"] != null) {
        if (last_moves["4"][1] != null) {
            set_peice(last_moves["4"][0], last_moves["4"][1]);
        } else {
            remove_peice(last_moves["4"][0]);
        }
    }

    term = last_moves.term;
    is_black_king_moved = last_moves.is_black_king_moved;
    is_white_king_moved = last_moves.is_white_king_moved;
    is_black_left_rock_moved = last_moves.is_black_left_rock_moved;
    is_black_right_rock_moved = last_moves.is_black_right_rock_moved;
    is_white_left_rock_moved = last_moves.is_white_left_rock_moved;
    is_white_right_rock_moved = last_moves.is_white_right_rock_moved;
    black_double = last_moves.black_double;
    white_double = last_moves.white_double;
    document.getElementById(last_moves["1"][0]).children[0].setAttribute('style', 'box-shadow: 0vmin 0vmin 0vmin rgb(110, 0, 228) inset, 0vmin 0vmin 0vmin rgb(110, 0, 228) inset');
    document.getElementById(last_moves["2"][0]).children[0].setAttribute('style', 'box-shadow: 0vmin 0vmin 0vmin rgb(110, 0, 228) inset, 0vmin 0vmin 0vmin rgb(110, 0, 228) inset');
    moves_queue.pop();

    let len = moves_queue.length,
        last_move = moves_queue[len - 1];
    if (len) {
        document.getElementById(last_move["1"][0]).children[0].setAttribute('style', 'box-shadow: 0.1vmin 0.1vmin 0.6vmin rgb(110, 0, 228) inset, -0.1vmin -0.1vmin 0.6vmin rgb(110, 0, 228) inset');
        document.getElementById(last_move["2"][0]).children[0].setAttribute('style', 'box-shadow: 0.1vmin 0.1vmin 0.6vmin rgb(110, 0, 228) inset, -0.1vmin -0.1vmin 0.6vmin rgb(110, 0, 228) inset');
    }


    let element = document.querySelector(".layer");
    document.getElementById("check").setAttribute("hidden", "hidden");
    element.style.display = "none";
    remove_backgroud();
    if(cnt){
        cnt--;
        undo();
    }
}

async function make_animation(peice, last_clicked, id) {

    let promise = new Promise((resolve, reject) => {
        let xid = get_position(id)[0];
        let yid = get_position(id)[1];
        let xlast = get_position(last_clicked)[0];
        let ylast = get_position(last_clicked)[1];

        const fromLeft = 7 * -11.25 + 2 * ylast * 11.25;
        const fromTop = 7 * -11.25 + 2 * xlast * 11.25;
        const toLeft = fromLeft + 2 * (yid - ylast) * 11.25;
        const toTop = fromTop + 2 * (xid - xlast) * 11.25;

        let root = document.querySelector(":root");

        root.style.setProperty("--fromLeft", fromLeft + "vmin");
        root.style.setProperty("--fromTop", fromTop + "vmin");
        root.style.setProperty("--toLeft", toLeft + "vmin");
        root.style.setProperty("--toTop", toTop + "vmin");

        let p = document.getElementById("animation");
        p.children[0].setAttribute("src", peice);
        p.style.display = "block";
        p.style.animationPlayState = "running";

        setTimeout(() => {
            p.style.display = "none";
            setTimeout(() => {
                p.style.animationPlayState = "paused";
                resolve();
            }, 40);
            set_peice(id, peice);
        }, 440);
    })
    return promise;
}



// Plays the peice at the legal positions
async function make_move(id) {

    let peice = get_peice(last_clicked);
    let id_peice = get_peice(id);

    let saved_move = {
        "1": [id, id_peice],
        "2": [last_clicked, peice],
        "3": null,
        "4": null,
        term,
        is_black_king_moved,
        is_white_king_moved,
        is_black_left_rock_moved,
        is_black_right_rock_moved,
        is_white_left_rock_moved,
        is_white_right_rock_moved,
        black_double,
        white_double
    };
    let len = moves_queue.length,
        last_move = moves_queue[len - 1];

    if (peice == black_king) {
        if (get_position(last_clicked)[1] - get_position(id)[1] == -2) {
            saved_move["3"] = ["A8", black_rock],
                saved_move["4"] = ["A6", null]
        }
        if (get_position(last_clicked)[1] - get_position(id)[1] == 2) {
            saved_move["3"] = ["A1", black_rock],
                saved_move["4"] = ["A4", null]
        }
    }
    if (peice == white_king) {
        if (get_position(last_clicked)[1] - get_position(id)[1] == -2) {
            saved_move["3"] = ["H8", white_rock],
                saved_move["4"] = ["H6", null]
        }
        if (get_position(last_clicked)[1] - get_position(id)[1] == 2) {
            saved_move["3"] = ["H1", white_rock],
                saved_move["4"] = ["H4", null]
        }
    }
    if (peice == black_pawn) {
        if (id_peice == null && get_position(id)[1] - get_position(last_clicked)[1] != 0) {
            saved_move["3"] = [get_id(get_position(id)[0] - 1, get_position(id)[1]), white_pawn];
        }
    }
    if (peice == white_pawn) {
        if (id_peice == null && get_position(id)[1] - get_position(last_clicked)[1] != 0) {
            saved_move["3"] = [get_id(get_position(id)[0] + 1, get_position(id)[1]), black_pawn];
        }
    }
    moves_queue.push(saved_move);
    if (id_peice == black_rock) {
        if (get_position(id)[1] == 0) {
            is_black_left_rock_moved = 1;
        } else {
            is_black_right_rock_moved = 1;
        }
    }
    if (id_peice == white_rock) {
        if (get_position(id)[1] == 0) {
            is_white_left_rock_moved = 1;
        } else {
            is_white_right_rock_moved = 1;
        }
    }
    
    if(peice == black_pawn){
        if(get_position(id)[0]==7){
            peice = black_queen;
        }
    }
    remove_peice(last_clicked);
    await make_animation(peice, last_clicked, id);
    if (peice == black_pawn) {

        if (get_position(id)[0] - get_position(last_clicked)[0] == 2) {
            black_double = id;
        }
        if ((get_position(id)[1] - get_position(last_clicked)[1]) != 0 && id_peice == null) {
            let x = get_position(id)[0],
                y = get_position(id)[1];
            setTimeout(() => {
                remove_peice(get_id(x - 1, y));
            }, 30);
        }
    } else {
        black_double = "";
    }
        
    if (peice == white_pawn) {
        if (get_position(last_clicked)[0] - get_position(id)[0] == 2) {
            white_double = id;
        }
        if ((get_position(id)[1] - get_position(last_clicked)[1]) != 0 && id_peice == null) {
            let x = get_position(id)[0],
                y = get_position(id)[1];
            setTimeout(() => {
                remove_peice(get_id(x + 1, y));
            }, 30);
        }
        if (get_position(id)[0] == 0) {
            pawn_promotion(id);
        }
    } else {
        white_double = ""
    }

    if (has_white_peice(id)) {
        let checked_cells = is_check_to_black(get_black_king_id());
        let moves_count = get_moves_count(get_black_king_id(), checked_cells);
        if (moves_count == 0) {
            if (checked_cells.length > 0) {
                document.getElementById("check").children[0].innerHTML = "Check Mate";
            } else {
                document.getElementById("check").children[0].innerHTML = "Stale Mate";
            }
            document.getElementById("check").removeAttribute("hidden");
        } else if (checked_cells.length > 0) {
            document.getElementById("check").children[0].innerHTML = "Check";
            document.getElementById("check").removeAttribute("hidden");
            setTimeout(() => {
                document.getElementById("check").setAttribute("hidden", "hidden");
            }, 800);
        }
    } else {
        let checked_cells = is_check_to_white(get_white_king_id());
        let moves_count = get_moves_count(get_white_king_id(), checked_cells);
        if (moves_count == 0) {
            if (checked_cells.length > 0) {
                document.getElementById("check").children[0].innerHTML = "Check Mate";
            } else {
                document.getElementById("check").children[0].innerHTML = "Stale Mate";
            }
            document.getElementById("check").removeAttribute("hidden");
        } else if (checked_cells.length > 0) {
            document.getElementById("check").children[0].innerHTML = "Check";
            document.getElementById("check").removeAttribute("hidden");
            setTimeout(() => {
                document.getElementById("check").setAttribute("hidden", "hidden");
            }, 800);
        }
    }
    if (peice == black_rock) {
        if (last_clicked == "A1")
            is_black_left_rock_moved = 1;
        else
            is_black_right_rock_moved = 1;
    }
    if (peice == black_king) {
        is_black_king_moved = 1;
        if (last_clicked == "A5" && id == "A7") {
            remove_peice("A8");
            await make_animation(black_rock, "A8", "A6");
        }
        if (last_clicked == "A5" && id == "A3") {
            remove_peice("A1");
            await make_animation(black_rock, "A1", "A4");
        }
    }
    if (peice == white_rock) {
        if (last_clicked == "A1")
            is_white_left_rock_moved = 1;
        else
            is_white_right_rock_moved = 1;
    }
    if (peice == white_king) {
        is_white_king_moved = 1;
        if (last_clicked == "H5" && id == "H7") {
            remove_peice("H8");
            await make_animation(white_rock, "H8", "H6");
        }
        if (last_clicked == "H5" && id == "H3") {
            remove_peice("H1");
            await make_animation(white_rock, "H1", "H4");
        }
    }

    if (len) {
        document.getElementById(last_move["1"][0]).children[0].setAttribute('style', remove_style);
        document.getElementById(last_move["2"][0]).children[0].setAttribute('style', remove_style);
    }

    document.getElementById(last_clicked).children[0].setAttribute('style', set_style);
    document.getElementById(id).children[0].setAttribute('style', set_style);
    let loading = document.querySelector(".lds-spinner");
    setTimeout(() => {
        if(term==0){
            loading.style.display = "flex";
            setTimeout(() => {
                let board = get_board();
                board.is_black_king_moved = is_black_king_moved;
                board.is_white_king_moved = is_white_king_moved;
                board.is_black_left_rock_moved = is_black_left_rock_moved;
                board.is_black_right_rock_moved = is_white_right_rock_moved;
                board.black_king = get_black_king_id();
                board.white_king = get_white_king_id();
                board.black_double = black_double;
                board.white_double = white_double;  
                board.point = 0;
                term = 1;
                let moves = think(board,3);
                console.log(moves);
                last_clicked = moves[0];
                loading.style.display = "none";
                make_move(moves[1]);        
            }, 100);
        }
        else{
            term = 0;
        }
    }, 850);

}


function get_board() {
    let board = [];
    for (let i = 0; i < 8; i++) {
        let line = "";
        for (let j = 0; j < 8; j++) {
            let id = cells[8 * i + j];
            let peice = get_peice(id);
            switch (peice) {
                case black_rock:
                    line += "R";
                    break;
                case white_rock:
                    line += "r";
                    break;

                case black_knight:
                    line += "N";
                    break;
                case white_knight:
                    line += "n";
                    break;
                case black_bishop:
                    line += "B";
                    break;
                case white_bishop:
                    line += "b";
                    break;
                case black_king:
                    line += "K";
                    break;
                case white_king:
                    line += "k";
                    break;
                case black_queen:
                    line += "Q";
                    break;
                case white_queen:
                    line += "q";
                    break;
                case black_pawn:
                    line += "P";
                    break;
                case white_pawn:
                    line += "p";
                    break;
                case null:
                    line += ".";
                    break;
            }
        }
        board.push(line);
    }
    return board;
}

//Returns all possible white pawn moves at cell with given id and Same for other functions
function get_white_pawn_moves(id) {
    let x = get_position(id)[0];
    let y = get_position(id)[1];
    let moves = [];
    if (x != 0 && get_peice(get_id(x - 1, y)) == null) {
        moves.push(get_id(x - 1, y));
        if (x == 6 && get_peice(get_id(x - 2, y)) == null) {
            moves.push(get_id(x - 2, y));
        }
    }
    if (y != 7 && x != 0) {
        if (get_peice(get_id(x - 1, y + 1)) != null && peice_color(get_id(x - 1, y + 1)) == "black") {
            moves.push(get_id(x - 1, y + 1));
        }
    }
    if (y != 0 && x != 0) {
        if (get_peice(get_id(x - 1, y - 1)) != null && peice_color(get_id(x - 1, y - 1)) == "black") {
            moves.push(get_id(x - 1, y - 1));
        }
    }
    if (y + 1 < 8 && black_double == get_id(x, y + 1)) {
        remove_peice(get_id(x, y));
        remove_peice(get_id(x, y + 1));
        if (is_check_to_white(get_white_king_id()).length > 0);
        else
            moves.push(get_id(x - 1, y + 1));
        set_peice(get_id(x, y), white_pawn);
        set_peice(get_id(x, y + 1), black_pawn);
    }
    if (y - 1 >= 0 && black_double == get_id(x, y - 1)) {
        remove_peice(get_id(x, y));
        remove_peice(get_id(x, y - 1));
        if (is_check_to_white(get_white_king_id()).length > 0);
        else
            moves.push(get_id(x - 1, y - 1));
        set_peice(get_id(x, y), white_pawn);
        set_peice(get_id(x, y - 1), black_pawn);
    }
    return moves;
}

function get_black_pawn_moves(id) {
    let x = get_position(id)[0];
    let y = get_position(id)[1];
    let moves = [];
    if (x != 7 && get_peice(get_id(x + 1, y)) == null) {
        moves.push(get_id(x + 1, y));
        if (x == 1 && get_peice(get_id(x + 2, y)) == null) {
            moves.push(get_id(x + 2, y));
        }
    }
    if (y != 7 && x != 7) {
        let left = get_id(x + 1, y + 1);
        if (has_white_peice(left)) {
            moves.push(get_id(x + 1, y + 1));
        }
    }
    if (y != 0 && x != 7) {
        let right = get_id(x + 1, y - 1);
        if (has_white_peice(right)) {
            moves.push(get_id(x + 1, y - 1));
        }
    }
    if (y + 1 < 8 && white_double == get_id(x, y + 1)) {
        remove_peice(get_id(x, y));
        remove_peice(get_id(x, y + 1));
        if (is_check_to_black(get_black_king_id()).length > 0);
        else
            moves.push(get_id(x + 1, y + 1));
        set_peice(get_id(x, y), black_pawn);
        set_peice(get_id(x, y + 1), white_pawn);
    }
    if (y - 1 >= 0 && white_double == get_id(x, y - 1)) {
        remove_peice(get_id(x, y));
        remove_peice(get_id(x, y - 1));
        if (is_check_to_black(get_black_king_id()).length > 0);
        else
            moves.push(get_id(x + 1, y - 1));
        set_peice(get_id(x, y), black_pawn);
        set_peice(get_id(x, y - 1), white_pawn);
    }
    return moves;
}

function get_white_king_moves(id) {
    let x = get_position(id)[0],
        y = get_position(id)[1];
    let possible_moves = [
        [x - 1, y - 1],
        [x - 1, y],
        [x - 1, y + 1],
        [x, y + 1],
        [x + 1, y + 1],
        [x + 1, y],
        [x + 1, y - 1],
        [x, y - 1]
    ];
    let moves = [];
    possible_moves.map((xy) => {
        let x1 = xy[0],
            y1 = xy[1];
        if (x1 >= 0 && y1 >= 0 && x1 < 8 && y1 < 8 && !has_white_peice(get_id(x1, y1))) {
            moves.push(get_id(x1, y1));
        }
    });
    return moves;
}

function get_black_king_moves(id) {
    let x = get_position(id)[0],
        y = get_position(id)[1];
    let possible_moves = [
        [x - 1, y - 1],
        [x - 1, y],
        [x - 1, y + 1],
        [x, y + 1],
        [x + 1, y + 1],
        [x + 1, y],
        [x + 1, y - 1],
        [x, y - 1]
    ];
    let moves = [];
    possible_moves.map((xy) => {
        let x1 = xy[0],
            y1 = xy[1];
        if (x1 >= 0 && y1 >= 0 && x1 < 8 && y1 < 8 && !has_black_peice(get_id(x1, y1))) {
            moves.push(get_id(x1, y1));
        }
    });
    return moves;
}


function get_black_queen_moves(id) {
    let moves1 = get_black_rock_moves(id);
    let moves2 = get_black_bishop_moves(id);
    let moves = [].concat(moves1, moves2);
    return moves;
}

function get_white_queen_moves(id) {
    let moves1 = get_white_rock_moves(id);
    let moves2 = get_white_bishop_moves(id);
    let moves = [].concat(moves1, moves2);
    return moves;
}

function get_white_rock_moves(id) {
    let x = get_position(id)[0],
        y = get_position(id)[1];
    let possible_moves = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1]
    ];
    let moves = [];
    possible_moves.map((xy) => {
        let x1 = xy[0],
            y1 = xy[1];
        while (x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8) {
            if (has_white_peice(get_id(x1, y1))) {
                break;
            } else if (has_black_peice(get_id(x1, y1))) {
                moves.push(get_id(x1, y1));
                break;
            } else {
                moves.push(get_id(x1, y1));
            }
            if (x1 > x) {
                x1++;
            } else if (x1 < x) {
                x1--;
            }
            if (y1 > y) {
                y1++;
            } else if (y1 < y) {
                y1--;
            }
        }
    });
    return moves;
}

function get_black_rock_moves(id) {
    let x = get_position(id)[0],
        y = get_position(id)[1];
    let possible_moves = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1]
    ];
    let moves = [];
    possible_moves.map((xy) => {
        let x1 = xy[0],
            y1 = xy[1];
        while (x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8) {
            if (has_black_peice(get_id(x1, y1))) {
                break;
            } else if (has_white_peice(get_id(x1, y1))) {
                moves.push(get_id(x1, y1));
                break;
            } else {
                moves.push(get_id(x1, y1));
            }
            if (x1 > x) {
                x1++;
            } else if (x1 < x) {
                x1--;
            }
            if (y1 > y) {
                y1++;
            } else if (y1 < y) {
                y1--;
            }
        }
    });
    return moves;
}

function get_white_knight_moves(id) {
    let x = get_position(id)[0],
        y = get_position(id)[1];
    let possible_moves = [
        [x + 2, y - 1],
        [x + 2, y + 1],
        [x - 2, y + 1],
        [x - 2, y - 1],
        [x + 1, y - 2],
        [x + 1, y + 2],
        [x - 1, y + 2],
        [x - 1, y - 2]
    ];
    let moves = [];
    possible_moves.map((xy) => {
        let x1 = xy[0],
            y1 = xy[1];
        if (x1 >= 0 && y1 >= 0 && x1 < 8 && y1 < 8 && !has_white_peice(get_id(x1, y1))) {
            moves.push(get_id(x1, y1));
        }
    });
    return moves;
}

function get_black_knight_moves(id) {
    let x = get_position(id)[0],
        y = get_position(id)[1];
    let possible_moves = [
        [x + 2, y - 1],
        [x + 2, y + 1],
        [x - 2, y + 1],
        [x - 2, y - 1],
        [x + 1, y - 2],
        [x + 1, y + 2],
        [x - 1, y + 2],
        [x - 1, y - 2]
    ];
    let moves = [];
    possible_moves.map((xy) => {
        let x1 = xy[0],
            y1 = xy[1];
        if (x1 >= 0 && y1 >= 0 && x1 < 8 && y1 < 8 && !has_black_peice(get_id(x1, y1))) {
            moves.push(get_id(x1, y1));
        }
    });
    return moves;
}

function get_black_bishop_moves(id) {
    let x = get_position(id)[0],
        y = get_position(id)[1];
    let possible_moves = [
        [x + 1, y + 1],
        [x - 1, y + 1],
        [x + 1, y - 1],
        [x - 1, y - 1]
    ];
    let moves = [];
    possible_moves.map((xy) => {
        let x1 = xy[0],
            y1 = xy[1];
        while (x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8) {
            if (has_black_peice(get_id(x1, y1))) {
                break;
            } else if (has_white_peice(get_id(x1, y1))) {
                moves.push(get_id(x1, y1));
                break;
            } else {
                moves.push(get_id(x1, y1));
            }
            if (x1 > x) {
                x1++;
            } else {
                x1--;
            }
            if (y1 > y) {
                y1++;
            } else {
                y1--;
            }
        }
    });
    return moves;
}

function get_white_bishop_moves(id) {
    let x = get_position(id)[0],
        y = get_position(id)[1];
    let possible_moves = [
        [x + 1, y + 1],
        [x - 1, y + 1],
        [x + 1, y - 1],
        [x - 1, y - 1]
    ];
    let moves = [];
    possible_moves.map((xy) => {
        let x1 = xy[0],
            y1 = xy[1];
        while (x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8) {
            if (has_white_peice(get_id(x1, y1))) {
                break;
            } else if (has_black_peice(get_id(x1, y1))) {
                moves.push(get_id(x1, y1));
                break;
            } else {
                moves.push(get_id(x1, y1));
            }
            if (x1 > x) {
                x1++;
            } else {
                x1--;
            }
            if (y1 > y) {
                y1++;
            } else {
                y1--;
            }
        }
    });
    return moves;
}

function remove_peice(id) {
    document.getElementById(id).children[0].children[0].removeAttribute("src");
}

function set_peice(id, peice) {
    document.getElementById(id).children[0].children[0].setAttribute("src", peice);
}

function get_bg(id) {
    return document.getElementById(id).children[1].children[0];
}

function get_element(id) {
    return document.getElementById(id);
}

function get_black_king_id() {
    let pos = "";
    cells.map((id) => {
        if (get_peice(id) == black_king) {
            pos = id;
        }
    });
    return pos;
}

function get_white_king_id() {
    let cell = "";
    cells.map((id) => {
        if (get_peice(id) == white_king) {
            cell = id;
        }
    });
    return cell;
}

function is_check_to_white(id) {
    let moves = get_white_bishop_moves(id);
    let checked_cells = [];
    let x = get_position(id)[0],
        y = get_position(id)[1];
    moves.map((id1) => {
        if (has_black_peice(id1) && (get_peice(id1) == black_bishop || get_peice(id1) == black_queen)) {
            let temp = [];
            let x1 = get_position(id1)[0],
                y1 = get_position(id1)[1];
            while (x1 != x && y1 != y) {
                temp.push(get_id(x1, y1));
                if (x1 > x) {
                    x1--;
                } else {
                    x1++;
                }
                if (y1 > y) {
                    y1--;
                } else {
                    y1++;
                }
            }
            checked_cells.push(temp);
        }
    });

    moves = get_white_rock_moves(id);
    moves.map((id1) => {
        if (has_black_peice(id1) && (get_peice(id1) == black_rock || get_peice(id1) == black_queen)) {
            let temp = [];
            let x1 = get_position(id1)[0],
                y1 = get_position(id1)[1];
            while (x1 != x || y1 != y) {
                temp.push(get_id(x1, y1));
                if (x1 > x) {
                    x1--;
                } else if (x1 < x) {
                    x1++;
                }
                if (y1 > y) {
                    y1--;
                } else if (y1 < y) {
                    y1++;
                }
            }
            checked_cells.push(temp);
        }
    });

    moves = get_white_knight_moves(id);
    moves.map((id1) => {
        if (has_black_peice(id1) && (get_peice(id1) == black_knight)) {
            checked_cells.push([id1]);
        }
    });

    moves = get_white_king_moves(id);
    moves.map((id1) => {
        if (has_black_peice(id1) && (get_peice(id1) == black_king)) {
            checked_cells.push([id1]);
        }
    });

    if (x - 1 >= 0 && y + 1 < 8 && get_peice(get_id(x - 1, y + 1)) == black_pawn) {
        checked_cells.push(get_id(x - 1, y + 1));
    }
    if (x - 1 >= 0 && y - 1 >= 0 && get_peice(get_id(x - 1, y - 1)) == black_pawn) {
        checked_cells.push(get_id(x - 1, y - 1));
    }
    return checked_cells;
}

function is_check_to_black(id) {
    let moves = get_black_bishop_moves(id);
    let checked_cells = [];
    let x = get_position(id)[0],
        y = get_position(id)[1];
    moves.map((id1) => {
        if (has_white_peice(id1) && (get_peice(id1) == white_bishop || get_peice(id1) == white_queen)) {
            let temp = [];
            let x1 = get_position(id1)[0],
                y1 = get_position(id1)[1];
            while (x1 != x && y1 != y) {
                temp.push(get_id(x1, y1));
                if (x1 > x) {
                    x1--;
                } else {
                    x1++;
                }
                if (y1 > y) {
                    y1--;
                } else {
                    y1++;
                }
            }
            checked_cells.push(temp);
        }
    });

    moves = get_black_rock_moves(id);
    moves.map((id1) => {
        if (has_white_peice(id1) && (get_peice(id1) == white_rock || get_peice(id1) == white_queen)) {
            let temp = [];
            let x1 = get_position(id1)[0],
                y1 = get_position(id1)[1];
            while (x1 != x || y1 != y) {
                temp.push(get_id(x1, y1));
                if (x1 > x) {
                    x1--;
                } else if (x1 < x) {
                    x1++;
                }
                if (y1 > y) {
                    y1--;
                } else if (y1 < y) {
                    y1++;
                }
            }
            checked_cells.push(temp);
        }
    });

    moves = get_black_knight_moves(id);
    moves.map((id1) => {
        if (has_white_peice(id1) && (get_peice(id1) == white_knight)) {
            checked_cells.push([id1]);
        }
    });

    moves = get_black_king_moves(id);
    moves.map((id1) => {
        if (has_white_peice(id1) && (get_peice(id1) == white_king)) {
            checked_cells.push([id1]);
        }
    });

    if (x + 1 < 8 && y + 1 < 8 && get_peice(get_id(x + 1, y + 1)) == white_pawn) {
        checked_cells.push(get_id(x + 1, y + 1));
    }
    if (x + 1 < 8 && y - 1 >= 0 && get_peice(get_id(x + 1, y - 1)) == white_pawn) {
        checked_cells.push(get_id(x + 1, y - 1));
    }
    return checked_cells;
}



remove_backgroud();
cells.map((id) => {
    get_element(id).addEventListener("click", () => {
        if (get_bg(id).hasAttribute("hidden") && document.getElementById(id).children[2].children[0].hasAttribute("hidden") && document.getElementById(id).children[2].children[1].hasAttribute("hidden")) {
            remove_backgroud();
            if ((term == 0 && has_white_peice(id)) || (term == 1 && has_black_peice(id))) {
                document.getElementById(id).children[2].children[0].removeAttribute("hidden");
                show_moves(id);
                last_clicked = id;
            }
        } else {
            remove_backgroud();
            if (id != last_clicked) {
                make_move(id);
            }
        }
    });
})
