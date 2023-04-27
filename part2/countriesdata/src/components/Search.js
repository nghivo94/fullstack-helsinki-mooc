const Search = (probs) => {
  return (
    <div>find countries <input value = {probs.newSearch} onChange={probs.handleSearchChange} /></div>
  )  
}

export default Search