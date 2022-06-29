let selectedPiece = null;
let selectedMoves = [];

function handlePieceInteract(_id){

	selectedMoves = state.moves.filter(move => move.pieceId === _id);
	render();
	
}

function handleMoveInteract(_id){
	const move = state.moves.find(m => m._id === _id);
	state = nextState(state)(move);
	selectedMoves = [];
	render();
}

function render() {
	let board = ``;
	console.log(state);

	for (let i = 0; i < 8; i++) {

		for (let j = 0; j < 8; j++) {

			board += `<div class="square" style="top: ${i * 100}; left: ${j * 100}; background-color: ${((i + j) % 2) === 1 ? "lightgray" : "steelblue"}"></div>`

		}
	}

	for (const piece of state.pieces) {

		const { x, y, isP1, _id } = piece;
		board += `<div class="piece" style="top: ${y * 100}; left: ${x * 100}; background-color: ${isP1 ? "black" : "white"}"></div>`

	}

	const activePieces = state.pieces.filter(piece => state.moves.some(move => move.pieceId === piece._id));
	console.log(activePieces);

	
	for (const piece of activePieces) {

		const { x, y, _id } = piece;
		board += `<div class="interactable-piece" onClick="handlePieceInteract('${_id}')" style="top: ${y * 100}; left: ${x * 100};"></div>`

	}

	for (const move of selectedMoves) {

		console.log(move);
		const {toX, toY, _id} = move;
		board += `<div class="interactable" onClick="handleMoveInteract('${_id}')" style="top: ${toY * 100}; left: ${toX * 100};"></div>`
	}

	document.getElementById("Board").innerHTML = board;
}

render();