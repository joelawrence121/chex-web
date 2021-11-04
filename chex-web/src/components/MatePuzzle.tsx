import React, {useEffect, useState} from 'react';
import '../styles/SingleMovePuzzle.css';
import MainBoard from "./MainBoard";
import ChapiService from "../service/ChapiService";
import SinglePuzzleData from "../types/SinglePuzzleData";
import {Chess} from "chess.ts";
import refresh from './icons/refresh.png';
import eyeFilled from './icons/eye-filled.png';
import eyeUnfilled from './icons/eye-unfilled.png';
import rightArrow from './icons/right-arrow.png';
import blackPawn from './icons/black-pawn.png';
import whitePawn from './icons/white-pawn.png';
import BoardHighlight from "../types/BoardHighlight";
import MatePuzzleData from "../types/MatePuzzleData";
import PlayData from "../types/PlayData";

const MatePuzzle: React.FC = () => {

    const [chess, setChess] = useState(new Chess())
    const [fen, setFen] = useState<string>()
    const [arrow, setArrow] = useState([['', '']])
    const [nextMove, setNextMove] = useState<string | undefined>()
    const [puzzle, setPuzzle] = useState<MatePuzzleData>();
    const [n, setN] = useState(2);
    const [random, setRandom] = useState(Math.random());
    const [turn, setTurn] = useState(false)
    const [isStart, setIsStart] = useState(true)
    const [winner, setWinner] = useState<string | undefined>()
    const [solutionVisible, setSolutionVisible] = useState(false);

    const reRender = () => setRandom(Math.random());

    useEffect(() => {
        ChapiService.getMateInNPuzzle(n)
            .then(response => {
                console.log(response.data)
                setPuzzle(response.data);
                const puzzleData = (response.data as SinglePuzzleData)
                setFen(puzzleData.starting_fen)
                chess.load(puzzleData.starting_fen)
                setChess(chess)
                setSolutionVisible(false)
                ChapiService.getStockfishMove({
                    fen: chess.fen(),
                    difficulty: 9
                })
                    .then(response => {
                        const stockfishResult = (response.data as unknown as PlayData)
                        console.log(stockfishResult)
                        setNextMove(stockfishResult.move)
                    })
                    .catch(e => {
                        console.log(e)
                    })
            })
            .catch(e => {
                console.log(e)
            })
        console.log(nextMove)
    }, [random, n])

    useEffect(() => {
        ChapiService.getStockfishMove({
            fen: fen ? fen : chess.fen(),
            difficulty: 9
        })
            .then(response => {
                const stockfishResult = (response.data as unknown as PlayData)
                console.log(stockfishResult)
                setNextMove(stockfishResult.move)
            })
            .catch(e => {
                console.log(e)
            })
    }, [fen])

    // stockfish move hook
    useEffect(() => {
        if (!isStart) {
            ChapiService.getStockfishMove({
                fen: chess.fen(),
                difficulty: 1
            })
                .then(response => {
                    const stockfishResult = (response.data as unknown as PlayData)
                    setFen(stockfishResult.fen)
                    setChess(new Chess(stockfishResult.fen))
                    setWinner(stockfishResult.winner)
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }, [turn])


    function toggleSolution() {
        if (!solutionVisible) {
            setArrow([[nextMove?.slice(0, 2) as string, nextMove?.slice(2, 5) as string]])
        } else {
            setArrow([])
        }
        setSolutionVisible(!solutionVisible);
    }

    function getSolution() {
        return (solutionVisible ? eyeFilled : eyeUnfilled)
    }

    function getToMove() {
        return (puzzle?.to_move === 'WHITE' ? whitePawn : blackPawn)
    }

    function switchPuzzleType() {
        const nRange = [2, 3, 4, 5]
        setN(nRange[(nRange.indexOf(n) + 1) % nRange.length])
    }

    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        let move = chess.move({
            to: targetSquare,
            from: sourceSquare,
        })
        if (move == null) return false;
        if (isStart) setIsStart(false)

        setFen(chess.fen())

        // trigger stockfish's turn
        setTurn(!turn)
        return true
    }

    function resetPuzzle() {
        setFen((puzzle as MatePuzzleData).starting_fen)
        chess.load((puzzle as MatePuzzleData).starting_fen)
        setChess(chess)
        setSolutionVisible(false)
        setWinner(undefined)
    }

    function getBoardHighlight() {
        if (winner) {
            return winner === puzzle?.to_move.toLowerCase() ? BoardHighlight.userWinner() : BoardHighlight.normal();
        }
        return BoardHighlight.normal()
    }

    return (
        <section className="animated-grid">
            <div className="card-no-shadow m">
                <img className={"bigger"} src={getToMove()} alt={puzzle?.to_move}/>
            </div>
            <div className="card r" onClick={resetPuzzle}>
                <img className={"smaller"} src={refresh} alt="Refresh"/>
            </div>
            <div className="card t" onClick={switchPuzzleType}>
                <h1 className="text">Mate in {n}</h1>
            </div>
            <div className="card n" onClick={reRender}>
                <img className={"smaller"} src={rightArrow} alt="Next"/>
            </div>
            <div className="card-no-shadow s" onClick={toggleSolution}>
                <img className={"bigger"} src={getSolution()} alt="Show Solution"/>
            </div>
            <div className="card-no-shadow c"></div>
            <div className="main">
                <MainBoard
                    boardWidth={500}
                    position={fen}
                    boardOrientation={puzzle?.to_move as string}
                    onPieceDrop={onDrop}
                    arrows={arrow}
                    alternateArrows={false}
                    boardHighlight={getBoardHighlight()}
                />
            </div>
            <div className="card-no-shadow d"></div>
        </section>
    );
}

export default MatePuzzle;
