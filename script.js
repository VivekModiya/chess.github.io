const elements = Array.from(document.getElementsByClassName("board")[0].children);
const cells = [];
let term = 0;
let moves_queue = [];
let last_clicked = "";

let is_black_king_moved = 0,
    is_black_left_rock_moved = 0,
    is_black_right_rock_moved = 0;
let is_white_king_moved = 0,
    is_white_left_rock_moved = 0,
    is_white_right_rock_moved = 0;
let black_double = "",
    white_double = "";

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


elements.map((child) => {
    cells.push(child.getAttribute("id"));
});


document.getElementsByClassName("undo")[0].addEventListener("click", () => {
    undo();
})


function remove_backgroud() {
    cells.map((id) => {
        get_bg(id).setAttribute("hidden", "hidden");
        document.getElementById(id).children[2].children[0].setAttribute("hidden", "hidden");
    });
}

// Returns id of element from the position 
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
            return possible_moves;
        } else {
            return possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_pawn && checked_cells.length != 2) {
        let possible_moves = get_white_pawn_moves(id);
        if (checked_cells.length == 0) {
            return possible_moves;
        } else {
            return possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_knight && checked_cells.length != 2) {
        let possible_moves = get_white_knight_moves(id);
        if (checked_cells.length == 0) {
            return possible_moves;
        } else {
            return possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_knight && checked_cells.length != 2) {
        let possible_moves = get_black_knight_moves(id);
        if (checked_cells.length == 0) {
            return possible_moves;
        } else {
            return possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_bishop && checked_cells.length != 2) {
        let possible_moves = get_white_bishop_moves(id);
        if (checked_cells.length == 0) {
            return possible_moves;
        } else {
            return possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_bishop && checked_cells.length != 2) {
        let possible_moves = get_black_bishop_moves(id);
        if (checked_cells.length == 0) {
            return possible_moves;
        } else {
            return possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_rock && checked_cells.length != 2) {
        let possible_moves = get_black_rock_moves(id);
        if (checked_cells.length == 0) {
            return possible_moves;
        } else {
            return possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_rock && checked_cells.length != 2) {
        let possible_moves = get_white_rock_moves(id);
        if (checked_cells.length == 0) {
            return possible_moves;
        } else {
            return possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_queen && checked_cells.length != 2) {
        let possible_moves = get_black_queen_moves(id);
        if (checked_cells.length == 0) {
            return possible_moves;
        } else {
            return possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_queen && checked_cells.length != 2) {
        let possible_moves = get_white_queen_moves(id);
        if (checked_cells.length == 0) {
            return possible_moves;
        } else {
            return possible_moves.filter(value => checked_cells[0].includes(value));
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

        return safe_cells;
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
        return safe_cells;
    }
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
    moves.map((id) => {
        if (get_peice(id) != null) {
            document.getElementById(id).children[2].children[0].setAttribute("src", "./red.jpg");
            document.getElementById(id).children[2].children[0].removeAttribute("hidden");
        } else
            get_bg(id).removeAttribute("hidden");
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

function undo() {
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
    moves_queue.pop();
    let element = document.querySelector(".layer");
    document.getElementById("check").setAttribute("hidden", "hidden");
    element.style.display = "none";
    remove_backgroud();
}



// Plays the peice at the legal positions
function make_move(id) {
    let peice = get_peice(last_clicked);
    let saved_move = {
        "1": [id, get_peice(id)],
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
        if (get_peice(id) == null && get_position(id)[1] - get_position(last_clicked)[1] != 0) {
            saved_move["3"] = [get_id(get_position(id)[0] - 1, get_position(id)[1]), white_pawn];
        }
    }
    if (peice == white_pawn) {
        if (get_peice(id) == null && get_position(id)[1] - get_position(last_clicked)[1] != 0) {
            saved_move["3"] = [get_id(get_position(id)[0] + 1, get_position(id)[1]), black_pawn];
        }
    }
    moves_queue.push(saved_move);
    if (get_peice(id) == black_rock) {
        if (get_position(id)[1] == 0) {
            is_black_left_rock_moved = 1;
        } else {
            is_black_right_rock_moved = 1;
        }
    }
    if (get_peice(id) == white_rock) {
        if (get_position(id)[1] == 0) {
            is_white_left_rock_moved = 1;
        } else {
            is_white_right_rock_moved = 1;
        }
    }
    if (peice == black_pawn) {
        if (get_position(id)[0] == 7) {
            pawn_promotion(id);
        }
        if (get_position(id)[0] - get_position(last_clicked)[0] == 2) {
            black_double = id;
        }
        if ((get_position(id)[1] - get_position(last_clicked)[1]) != 0 && get_peice(id) == null) {
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
        if ((get_position(id)[1] - get_position(last_clicked)[1]) != 0 && get_peice(id) == null) {
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
    set_peice(id, peice);
    remove_peice(last_clicked);
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
            document.getElementById("check").removeAttribute("hidden");
            setTimeout(() => {
                document.getElementById("check").setAttribute("hidden", "hidden");
            }, 800);
        }
    } else {
        let checked_cells = is_check_to_white(get_white_king_id());
        let moves_count = get_moves_count(get_white_king_id(), checked_cells);
        if (moves_count == 0 && checked_cells.length > 0) {
            if (checked_cells.length > 0) {
                document.getElementById("check").children[0].innerHTML = "Check Mate";
            } else {
                document.getElementById("check").children[0].innerHTML = "Stale Mate";
            }
            document.getElementById("check").removeAttribute("hidden");
        } else if (checked_cells.length > 0) {
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
            setTimeout(() => {
                remove_peice("A8");
                set_peice("A6", black_rock);
            }, 60);
        }
        if (last_clicked == "A5" && id == "A3") {
            setTimeout(() => {
                remove_peice("A1");
                set_peice("A4", black_rock);
            }, 60)
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
            setTimeout(() => {
                remove_peice("H8");
                set_peice("H6", white_rock);
            }, 60);
        }
        if (last_clicked == "H5" && id == "H3") {
            setTimeout(() => {
                remove_peice("H1");
                set_peice("H4", white_rock);
            }, 60)
        }
    }

    let board = get_board();
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
    console.log(board);
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
        if (get_bg(id).hasAttribute("hidden") && document.getElementById(id).children[2].children[0].hasAttribute("hidden")) {
            remove_backgroud();
            if ((term == 0 && has_white_peice(id)) || (term == 1 && has_black_peice(id))) {
                document.getElementById(id).children[2].children[0].setAttribute("src", "./blue.jpg");
                document.getElementById(id).children[2].children[0].removeAttribute("hidden");
                show_moves(id);
                last_clicked = id;
            }
        } else {
            remove_backgroud();
            if(id!=last_clicked){
                make_move(id);
                term ^= 1;
            }
            
        }
    });
})