const Header = (probs) => {
  return (
    <h1>{probs.course}</h1>
  )
}

const Content = (probs) => {
  return (
    <div>
      <Part name = {probs.parts[0].name} exercises = {probs.parts[0].exercises}/>
      <Part name = {probs.parts[1].name} exercises = {probs.parts[1].exercises}/>
      <Part name = {probs.parts[2].name} exercises = {probs.parts[2].exercises}/>
    </div>
  )
}

const Part = (probs) => {
  return (
    <p> {probs.name} {probs.exercises}</p>
  )
}

const Total = (probs) => {
  return (
    <p>Number of exercises {probs.parts[0].exercises + probs.parts[1].exercises + probs.parts[2].exercises}</p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course = {course.name} />
      <Content parts = {course.parts} />
      <Total parts = {course.parts} />
    </div>
  )
}

export default App