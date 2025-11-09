import "./Vote.css"

interface VoteProps{
    userVote: number;
    score: number;
    handleVote: (value: number) => void;
}

const Vote: React.FC<VoteProps> = ({userVote, score, handleVote}) =>{

    return (
        <div className='vote-action' onClick={(e) => e.stopPropagation()}>
            <button className={`vote upvote ${userVote > 0 ? "active" : ""}`} onClick={() => handleVote(1)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M21 19l-9-9-9 9"/>
                </svg>
            </button>
            <span className='vote-score'>{score}</span>
            <button className={`vote downvote ${userVote < 0 ? "active" : ""}`} onClick={() => handleVote(-1)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M21 11l -9 9 -9 -9"/>
                </svg>
            </button>
        </div>
    )
}

export default Vote;