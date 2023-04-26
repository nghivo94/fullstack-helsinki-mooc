import { useState } from 'react'

const Button = (probs) => {
  const {handleClick, text} = probs
  return (
    <button onClick={handleClick} >{text}</button>
  )
}

const Statistic = (probs) => {
  const {good, neutral, bad} = probs
  if ((good + neutral + bad) === 0) {
    return (
      <div>No feedback given</div>
    )
  }
  return (
    <table>
      <StatisticLine text = "good" value = {good} />
      <StatisticLine text = "neutral" value = {neutral} />
      <StatisticLine text = "bad" value = {bad} />
      <StatisticLine text = "all" value = {good + neutral + bad} />
      <StatisticLine text = "average" value = {(good - bad) / (good + neutral + bad)} />
      <StatisticLine text = "positive" value = {(good / (good + neutral + bad))* 100 + " %"} />
    </table>
  )
}

const StatisticLine = (probs) => {
  const {text, value} = probs
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text = "good" handleClick = {() => setGood(good + 1)} />
      <Button text = "neutral" handleClick = {() => setNeutral(neutral + 1)} />
      <Button text = "bad" handleClick = {() => setBad(bad + 1)} />

      <h1>statistics</h1>
      <Statistic good = {good} neutral = {neutral} bad = {bad} />
    </div>
  )
}

export default App