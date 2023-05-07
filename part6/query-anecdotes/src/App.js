import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { compareAnecdotes } from './utils/compareAnecdotes'

import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const voteMutation = useMutation(updateAnecdote, {
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData('anecdotes', 
        anecdotes.map(anecdote => anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote))
    }
  })
  const notificationDispatch = useNotificationDispatch()

  const handleVote = (anecdote) => {
    voteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
    notificationDispatch({type: 'SET', payload: {message: `anecdote '${anecdote.content}' voted`, isError: false}})
    setTimeout(() => {notificationDispatch({type: 'CLEAR'})}, 5000)
  }

  const result = useQuery("anecdotes", getAnecdotes, {
    refetchOnWindowFocus: false,
    retry: 1
  })
  if (result.isLoading) {
    return (
      <div>Is loading...</div>
    )
  }
  if (result.isError) {
    return (
      <div>anecdote service not available due to problems in server</div>
    )
  }
  const anecdotes = result.data
  anecdotes.sort(compareAnecdotes)

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App