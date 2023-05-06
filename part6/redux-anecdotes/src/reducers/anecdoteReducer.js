import { createSlice } from "@reduxjs/toolkit"

const compareAnecdotes = (anecdote1, anecdote2) => {
    if (anecdote1.votes > anecdote2.votes) {
        return -1
    }
    if (anecdote1.votes < anecdote2.votes) {
        return 1
    }
    return 0
}
  
const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        createAnecdote (state, action) {
            state.push(action.payload)
        },
        addVoteOf (state, action) {
            const id = action.payload
            const anecdoteToVote = state.find(anecdote => anecdote.id === id)
            const votedAnecdote = {...anecdoteToVote, votes: anecdoteToVote.votes + 1}
            const newState = state.map(anecdote => anecdote.id === id ? votedAnecdote : anecdote)
            newState.sort(compareAnecdotes)
            return newState
        },
        setAnecdotes (state, action) {
            const newState = action.payload
            newState.sort(compareAnecdotes)
            return newState
        }
    }
})

export const { createAnecdote, addVoteOf, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer