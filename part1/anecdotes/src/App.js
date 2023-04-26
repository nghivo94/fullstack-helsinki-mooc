import { useState } from 'react'

const Anecdote = (probs) => {
  return (
    <div>
      <div>{probs.anecdote}</div>
      <div>has {probs.point} votes</div>
    </div>
  )
}

const Button = (probs) => {
  return (
    <button onClick={probs.handleClick}>{probs.text}</button>
  )
}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const selectMaxIndex = (points) => {
    const maxPoint = Math.max(...points)
    for (let i = 0; i < anecdotes.length; i++) {
      if (points[i] === maxPoint) {
        return i
      }
    }
  }
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0))
  const [mostVotes, setMostVotes] = useState(0)


  const selectNextRandom = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  const addPointToSelected = () => {
    const newPoints = [...points]
    newPoints[selected] += 1
    setPoints(newPoints)
    setMostVotes(selectMaxIndex(newPoints))
  }


  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote anecdote = {anecdotes[selected]} point = {points[selected]} />
      <Button handleClick = {addPointToSelected} text = "vote" />
      <Button handleClick = {selectNextRandom} text = "next anecdote" />

      <h1>Anecdote with most votes</h1>
      <Anecdote anecdote = {anecdotes[mostVotes]} point = {points[mostVotes]} />
    </div>
  )
}

export default App