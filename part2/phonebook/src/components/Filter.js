const Filter = (probs) => {
  return (
    <div>filter shown with <input value = {probs.filter} onChange={probs.handleFilterChange}/></div>
  )  
}

export default Filter