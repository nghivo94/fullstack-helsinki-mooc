import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from "../services/anecdotes"

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
        appendAnecdote (state, action) {
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

export const { appendAnecdote, addVoteOf, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll()
        dispatch(setAnecdotes(anecdotes))
    }
}

export const createAnecdote = content => {
    return async dispatch => {
        const newAnecdote = await anecdoteService.createNew(content)
        dispatch(appendAnecdote(newAnecdote))
    }
}

export const voteAnecdote = id => {
    return async dispatch => {
        const anecdoteToVote = await anecdoteService.get(id)
        const votedAnecdote = {...anecdoteToVote, votes: anecdoteToVote.votes + 1}
        await anecdoteService.update(id, votedAnecdote)
        dispatch(addVoteOf(id))
    }
}

export default anecdoteSlice.reducer