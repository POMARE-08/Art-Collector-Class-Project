import React, { useEffect, useState } from 'react';

/**
 * Don't touch these imports!
 */
import { 
  fetchAllCenturies,
  fetchAllClassifications,
  fetchQueryResults
} from '../api';

const Search = (props) => {
  // Make sure to destructure setIsLoading and setSearchResults from the props
  // const [searchResults, setSearchResults] = useState({info:{}, []})
  const {setIsLoading, setSearchResults} = props;

  /**
   * We are at the Search component, a child of app. This has a form, so we need to use useState for
   * our controlled inputs:
   * 
  */
  const [centuryList, setCenturyList] = useState([])
  const [classificationList, setClassificationList] = useState ([])
  const [queryString, setQueryString] = useState('')
  const [century, setCentury] = useState('')
  const [classification, setClassification] = useState('')


  async function getData(){
    try {
      const newClassificationsList = await fetchAllClassifications();
      const newCenturyList = await fetchAllCenturies();
        setClassificationList(newClassificationsList);
        setCenturyList(newCenturyList);
        console.log(newClassificationsList, newCenturyList)
    } catch(err) {
      console.log(err)
    }
  }
  /**
   * Inside of useEffect, use Promise.all([]) with fetchAllCenturies and fetchAllClassifications
   * 
   * In the .then() callback pass the returned lists to setCenturyList and setClassificationList
   * 
   * Make sure to console.error on caught errors from the API methods.
   */
  useEffect(() => {
    Promise.all([fetchAllCenturies(), fetchAllClassifications()])
      .then(([allCenturies, allClassifications]) => {
          setCenturyList(allCenturies);
          setClassificationList(allClassifications);
      })
      .catch ((error) => {
        return (
          console.error(error)
        );
      })
    getData()
  }, []);

  function handleChange(event){
    setQueryString(event.target.value)
  }

  function renderList(item){
    return <option key={item.name}>{item.name}</option>
  }
  /**
   * This is a form element, so we need to bind an onSubmit handler to it which:
   * 
   * calls event.preventDefault()
   * calls setIsLoading, set it to true
   * 
   * then, in a try/catch/finally block:
   * 
   * try to:
   * - get the results from fetchQueryResults({ century, classification, queryString })
   * - pass them to setSearchResults
   * 
   * catch: error to console.error
   * 
   * finally: call setIsLoading, set it to false
   */
  async function handleSubmit (event) {
    event.preventDefault();
          setIsLoading(true);
          try { 
            const result = await fetchQueryResults({century, classification, queryString})
            console.log(result)
            setSearchResults(result)
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }}
  return <form id="search" onSubmit={handleSubmit}>
    <fieldset>
      <label htmlFor="keywords">Query</label>
      <input 
        id="keywords" 
        type="text" 
        placeholder="enter keywords..." 
        value={queryString} 
        onChange={handleChange}
        
        />
    </fieldset>
    <fieldset>
      <label htmlFor="select-classification">Classification <span className="classification-count">({ classificationList.length })</span></label>
      <select 
        name="classification"
        id="select-classification"
        value={classification} 
        onChange={(event) => setClassification(event.target.value)}
        >
        <option value="any">Any</option>
        {classificationList.map(renderList)}
      </select>
    </fieldset>
    <fieldset>
      <label htmlFor="select-century">Century <span className="century-count">({ centuryList.length })</span></label>
      <select 
        name="century" 
        id="select-century"
        value={century} 
        onChange={(event) => setCentury(event.target.value)}
        >
        <option value="any">Any</option>
        {centuryList.map(renderList)}
      </select>
     </fieldset>
    <button>SEARCH</button>
  </form>
}

export default Search;