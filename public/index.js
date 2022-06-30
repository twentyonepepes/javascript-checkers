const getPieceAtLocation = (pieces) => (x, y) => pieces.find((piece)=>piece.x === x && piece.y === y);

const isValidSquare = (x, y) => {

	const a = x <= 7;
	const b = x >= 0;
	const c = y <= 7;
	const d = y >= 0;

	return a && b && c && d;
}

const isEndSquare = ({y}) => (isP1) => {

	return (!isP1 && y === 0) || (isP1 && y === 7);

}

const canTake = (piece1 , piece2) => piece1.isP1 !== piece2.isP1

const getValidMovesA = (pieces) => (piece)=>{

	const { isP1, x, y, _id : pieceId, isKing } = piece;

	const k = isP1 ? 1 : -1;

	const f1 = getPieceAtLocation(pieces);

	const x1 = x - 1;
	const x2 = x + 1;
	const x3 = x - 2;
	const x4 = x + 2;

	const y1 = y + (1 * k);
	const y2 = y + (2 * k);

	const ky1 = y + (-1 * k);
	const ky2 = y + (-2 * k);

	const a = f1( x1 , y1 );
	const b = f1( x2 , y1 );
	const c = f1( x3 , y2 );
	const d = f1( x4 , y2 );

	const ka = f1( x1 , ky1 );
	const kb = f1( x2 , ky1 );
	const kc = f1( x3 , ky2 );
	const kd = f1( x4 , ky2 );

	const e = isValidSquare( x1 , y1 );
	const f = isValidSquare( x2 , y1 );
	const g = isValidSquare( x3 , y2 );
	const h = isValidSquare( x4 , y2 );

	const ke = isValidSquare( x1 , ky1 );
	const kf = isValidSquare( x2 , ky1 );
	const kg = isValidSquare( x3 , ky2 );
	const kh = isValidSquare( x4 , ky2 );

	const m1 = e && !a;
	const m2 = f && !b;
	const m3 = g && !c && !!a && canTake(piece, a);
	const m4 = h && !d && !!b && canTake(piece, b);

	const km1 = isKing && ke && !ka;
	const km2 = isKing && kf && !kb;
	const km3 = isKing && kg && !kc && !!ka && canTake(piece, ka);
	const km4 = isKing && kh && !kd && !!kb && canTake(piece, kb);

	const ms1 = [
		{ _id : `${pieceId}-M1`, possible : m1 , toX : x1, toY : y1, taken : null, pieceId },
		{ _id : `${pieceId}-M2`, possible : m2 , toX : x2, toY : y1, taken : null, pieceId},
		{ _id : `${pieceId}-M3`, possible : m3 , toX : x3, toY : y2, taken : a && a._id || null, pieceId },
		{ _id : `${pieceId}-M4`, possible : m4 , toX : x4, toY : y2, taken : b && b._id || null, pieceId },
		{ _id : `${pieceId}-KM1`, possible : km1 , toX : x1, toY : ky1, taken : null, pieceId },
		{ _id : `${pieceId}-KM2`, possible : km2 , toX : x2, toY : ky1, taken : null, pieceId},
		{ _id : `${pieceId}-KM3`, possible : km3 , toX : x3, toY : ky2, taken : ka && ka._id || null, pieceId },
		{ _id : `${pieceId}-KM4`, possible : km4 , toX : x4, toY : ky2, taken : kb && kb._id || null, pieceId },
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
	const { isP1Turn, pieces } = state;
	const b = pieces.filter(piece => piece._id !== taken);
	const c = b.map(piece => {

		if (piece._id === pieceId) {

			const kingMe = isEndSquare({y:toY})(piece.isP1);
			return { ... piece, x : toX, y : toY, isKing : piece.isKing || kingMe }

		} else {

			return piece;

		}

	});

	const g = getMoveIndex(c)(isP1Turn).some(move => move.taken && move.pieceId === pieceId);
	const followup = taken && g;
	const nextTurnIsP1Turn = followup ? isP1Turn : !isP1Turn;
	const nextMoves = getMoveIndex(c)(nextTurnIsP1Turn)

	return {
		...state,
		pieces : c,
		isP1Turn : nextTurnIsP1Turn,
		moves : nextMoves
	}
}


const isP1Turn = false;
const moves = getMoveIndex(defaultPieces)(isP1Turn)
let state = {
	
	isP1Turn,
	moves,
	pieces : defaultPieces
}

