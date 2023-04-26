const Header = (probs) => {
    return (
      <h2>{probs.course}</h2>
    )
}
  
const Content = (probs) => {
    return (
      <div>
        {probs.parts.map(part => <Part key = {part.id} name = {part.name} exercises = {part.exercises}/>)}
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
      <h3>total of {probs.parts.map(part => part.exercises).
        reduce((ex1, ex2) => ex1 + ex2)} exercises</h3>
    )
}
  

const Course = (probs) => {
    return (
        <div>
            <Header course = {probs.course.name}/>
            <Content parts = {probs.course.parts} />
            <Total parts = {probs.course.parts} />
        </div>
    )
}

export default Course