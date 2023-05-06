import { useSelector, useDispatch } from "react-redux";
import { addVoteOf } from "../reducers/anecdoteReducer";
import { setNotification, removeNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        return state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter))
    })
    const dispatch = useDispatch()

    const vote = (id) => {
        const anecdoteToVote = anecdotes.find(anecdote => anecdote.id === id)
        dispatch(addVoteOf(id))
        dispatch(setNotification(`you voted '${anecdoteToVote.content}'`))
        setTimeout(() => {dispatch(removeNotification())}, 5000)
    }

    return (
        <div>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList