import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// クリックされたらボードにイベントを伝搬する
// stateを持たないコンポーネントは関数で定義する
function Square(props) {
    return (
        // 渡された値を表示する
        // クリックされた場合はonClickを発火する
        <button className="square"
            onClick={() => props.onClick()}
        >
            {props.value}
        </button>
    );
}

// ゲームの状態を管理する
class Board extends React.Component {
    // コンストラクタ
    constructor(props) {
        // 初期化
        super(props);
        // stateを初期化する
        this.state = {
            // 初期状態用にnullをセットする
            squares: Array(9).fill(null),
            // 初手をX空に設定する
            xIsNext: true,
        };
    }

    // レンダリング
    renderSquare(i) {
        // 正方形のコンポーネントを呼び出す
        return (
            <Square
                value={this.props.squares[i]}
                // ここでGameのonclickを発火するよう登録する
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    // 履歴は親のGameコンポーネントで管理する
    constructor(props) {
        super(props);
        this.state = {
            // 履歴を管理する
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
        };
    }

    // クリック時の挙動
    handleClick(i) {
        // sliceメソッドを使って配列をコピーしている
        // これはイミュータビリティと言って直接ではなく新しい値によって上書きすること
        // 値を上書きしないので履歴の巻き戻しが容易になる
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        // 決着がついている場合はリターンする
        if (calculateWinner(current.squares) || squares[i]) return;
        // xIsNextがtrueの時はX、そうでない時はOをセットする
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        // 順番を変えるためxIsNextを反転させる
        this.setState({
            // 本の配列をミューテートしない目的でpush()ではなくconcat()を使用する
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: 0,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber]

        // 勝敗の判定
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                // reactは再レンダーの際、keyを参照する
                // keyがなければコンポーネントを作成、無ければ破棄、変更があれば再作成される
                // keyがあれば順番の入れ替わりにも対応できる
                // keyは親子間でのみ一意。グローバルでの重複は許される
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        // 勝負はついている場合はメッセージを出す
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);


function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}