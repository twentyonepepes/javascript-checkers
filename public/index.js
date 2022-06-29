const getPieceAtLocation = (pieces) => (x, y) => pieces.find((piece)=>piece.x === x && piece.y === y);

const isValidSquare = (x, y) => {

	const a = x <= 7;
	const b = x >= 0;
	const c = y <= 7;
	const d = y >= 0;

	return a && b && c && d;
}

const canTake = (piece1 , piece2) => piece1.isP1 !== piece2.isP1

const getValidMovesA = (pieces) => (piece)=>{

	const { isP1, x, y, _id : pieceId } = piece;

	const k = isP1 ? 1 : -1;

	const f1 = getPieceAtLocation(pieces);

	const x1 = x - 1;
	const x2 = x + 1;
	const x3 = x - 2;
	const x4 = x + 2;

	const y1 = y + (1 * k);
	const y2 = y + (2 * k);

	const a = f1( x1 , y1 );
	const b = f1( x2 , y1 );
	const c = f1( x3 , y2 );
	const d = f1( x4 , y2 );

	const e = isValidSquare( x1 , y1 );
	const f = isValidSquare( x2 , y1 );
	const g = isValidSquare( x3 , y2 );
	const h = isValidSquare( x4 , y2 );

	const m1 = e && !a;
	const m2 = f && !b;
	const m3 = g && !c && !!a && canTake(piece, a);
	const m4 = h && !d && !!b && canTake(piece, b);

	const ms1 = [
		{ _id : `${pieceId}-M1`, possible : m1 , toX : x1, toY : y1, taken : null, pieceId },
		{ _id : `${pieceId}-M2`, possible : m2 , toX : x2, toY : y1, taken : null, pieceId},
		{ _id : `${pieceId}-M3`, possible : m3 , toX : x3, toY : y2, taken : a && a._id || null, pieceId },
		{ _id : `${pieceId}-M4`, possible : m4 , toX : x4, toY : y2, taken : b && b._id || null, pieceId },
	];

	const ms2 = ms1.filter(move => move.possible);
	return ms2;

}

function computeForcedMoves(moves) {
	const takeOption = moves.some(move => move.taken);
	const validMoves = takeOption ? moves.filter(move => move.taken) : moves;
	return validMoves;
}

const getMoveIndex = (pieces) => (isP1) => {

	const nextMoves = pieces.filter(piece => piece.isP1 === isP1)
		.map(getValidMovesA(pieces))
		.flat();

	const b = computeForcedMoves(nextMoves);

	return b;

	
}

const nextState = (state) => (move) => {

	const { taken, pieceId, toX, toY } = move;
	const { isP1Turn } = state;
	const b = state.pieces.filter(piece => piece._id !== taken);
	const c = b.map(piece => {

		if (piece._id === pieceId) {

			return { ... piece, x : toX, y : toY }

		} else {

			return piece;

		}

	});

	const followup = taken && getMoveIndex(c)(isP1Turn).some(move => move.taken && move.pieceId === pieceId);
	// const followup = false;

	const nextTurnIsP1Turn = followup ? isP1Turn : !isP1Turn;
	// const nextTurnIsP1Turn = !isP1Turn;
	const nextMoves = getMoveIndex(c)(nextTurnIsP1Turn)

	return {
		...state,
		pieces : c,
		isP1Turn : nextTurnIsP1Turn,
		moves : nextMoves
	}
}

const pieces = [
	{ _id : "BL0", x : 3, y: 3, isP1 : true, isKing : false },
	{ _id : "BL1", x : 2, y: 0, isP1 : true, isKing : false },
	{ _id : "BL2", x : 4, y: 0, isP1 : true, isKing : false },
	{ _id : "BL3", x : 6, y: 0, isP1 : true, isKing : false },
	{ _id : "BL4", x : 1, y: 1, isP1 : true, isKing : false },
	{ _id : "BL5", x : 3, y: 1, isP1 : true, isKing : false },
	{ _id : "BL6", x : 5, y: 1, isP1 : true, isKing : false },
	{ _id : "BL7", x : 7, y: 1, isP1 : true, isKing : false },
	{ _id : "WH0", x : 4, y: 4, isP1 : false, isKing : false },
	{ _id : "WH1", x : 3, y: 7, isP1 : false, isKing : false },
	{ _id : "WH2", x : 5, y: 7, isP1 : false, isKing : false },
	{ _id : "WH3", x : 7, y: 7, isP1 : false, isKing : false },
	{ _id : "WH4", x : 0, y: 6, isP1 : false, isKing : false },
	{ _id : "WH5", x : 2, y: 6, isP1 : false, isKing : false },
	{ _id : "WH6", x : 4, y: 6, isP1 : false, isKing : false },
	{ _id : "WH7", x : 6, y: 6, isP1 : false, isKing : false }
];

const isP1Turn = false;
const moves = getMoveIndex(pieces)(isP1Turn)
let state = {
	
	isP1Turn,
	moves,
	pieces
}

