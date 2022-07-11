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

    // クリック時の挙動
    handleClick(i) {
        // sliceメソッドを使って配列をコピーしている
        // これはイミュータビリティと言って直接ではなく新しい値によって上書きすること
        // 値を上書きしないので履歴の巻き戻しが容易になる
        const squares = this.state.squares.slice();
        // xIsNextがtrueの時はX、そうでない時はOをセットする
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        // 順番を変えるためxIsNextを反転させる
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
    }

    // レンダリング
    renderSquare(i) {
        // 正方形のコンポーネントを呼び出す
        return (
            <Square
                value={this.state.squares[i]}
                // ここでonclickを発火するよう登録する
                onClick={() => this.handleClick(i)}
            />
        );
    }

    render() {
        const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

        return (
            <div>
                <div className="status">{status}</div>
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
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
