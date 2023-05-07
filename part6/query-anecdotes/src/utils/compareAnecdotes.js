export const compareAnecdotes = (anecdote1, anecdote2) => {
    if (anecdote1.votes > anecdote2.votes) {
        return -1
    }
    if (anecdote1.votes < anecdote2.votes) {
        return 1
    }
    return 0
}