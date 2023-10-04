import { useState, useEffect } from 'react';
import axios from 'axios';

function ResearchFrontend() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const apiUrl = 'https://bing-web-search1.p.rapidapi.com/search';
  const autoSuggestApiUrl = 'https://auto-suggest-queries.p.rapidapi.com/suggestqueries';
  const rapidApiKey = '60fb9d4bd5mshba0400e10cb5f50p19dcf2jsn65a94575677b';
  const randomImageURL = 'https://picsum.photos/200/300';

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }

    const options = {
      method: 'GET',
      url: autoSuggestApiUrl,
      params: { query: searchTerm },
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'auto-suggest-queries.p.rapidapi.com',
      },
    };

    axios
      .request(options)
      .then((response) => {
        setSuggestions(response?.data || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [searchTerm]);

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    fetchData();
    setSuggestions([]); // Clear suggestions when a suggestion is clicked
  };

  const fetchData = () => {
    setLoading(true);
    setError(null);

    const query = `Research ${searchTerm}`;

    const options = {
      method: 'GET',
      url: apiUrl,
      params: {
        q: query,
        mkt: 'en-us',
        safeSearch: 'Off',
        textFormat: 'Raw',
        freshness: 'Day',
      },
      headers: {
        'X-BingApis-SDK': 'true',
        'X-RapidAPI-Key': '60fb9d4bd5mshba0400e10cb5f50p19dcf2jsn65a94575677b',
        'X-RapidAPI-Host': 'bing-web-search1.p.rapidapi.com',
      },
    };

    axios
      .request(options)
      .then((response) => {
        setSearchResults(response?.data?.value || []);
        setLoading(false);
        setSuggestions([]); // Clear suggestions when search results are displayed
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleResultClick = (result) => {
    if (result && result.url) {
      window.open(result.url, '_blank'); // Open URL in a new tab
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 border-[20px] border-white flex flex-col items-center justify-center">
      <a href='/'>
        <h1 className="mt-8 font-serif text-[80px]  font-bold mb-8 tracking-widest text-#36454f ">Searchly</h1>
      </a>
      <div className="w-full max-w-4xl relative">
        <input
          type="text"
          placeholder="Enter a research topic"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2 px-4 rounded-l-md focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          onClick={fetchData}
          className="bg-gray-700 hover:bg-gray-700 text-white py-2 px-4 rounded-r-md absolute right-0 top-0 bottom-0 mt-auto mb-auto"
        >
          Search
        </button>
        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white mt-10 w-full border border-gray-300 rounded-lg shadow-md">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="py-2 px-4 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-4">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="border rounded-lg overflow-hidden bg-white shadow-md transition-transform hover:scale-105 hover:shadow-xl cursor-pointer flex flex-col"
            >
              <div
                className="w-full h-40"
                style={{
                  backgroundImage: `url('${
                    result.image?.thumbnail?.contentUrl || randomImageURL
                  }')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {!result.image?.thumbnail?.contentUrl && (
                  <div className="flex items-center justify-center h-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21l-3-3m0 0l-3-3m3 3l3-3m-3 3l3 3M21 5l-3-3m0 0l-3-3m3 3l3-3m-3 3l3 3"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-semibold">
                  {result.name.substring(0, 60) + '....'}
                </h3>
                <p className="mt-2 text-sm line-clamp-3">{result.snippet}</p>
              </div>
              <div
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 text-center cursor-pointer mt-auto"
                onClick={() => handleResultClick(result)}
              >
                Read More
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResearchFrontend;
