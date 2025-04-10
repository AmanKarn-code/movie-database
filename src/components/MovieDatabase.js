import React, { useState, useEffect } from 'react';
import { Loader2, Star } from 'lucide-react';

const MovieDatabase = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dummyapi.online/api/movies');
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      const validMovies = data.filter(movie => movie && typeof movie.movie === 'string');
      setMovies(validMovies);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  

  const filteredMovies = movies.filter(movie =>
    movie.movie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-center p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">Movie Database</h1>
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMovies.map(movie => (
                <div key={movie.id} className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={movie.image} 
                    alt={movie.movie}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <div className="mb-2">
                    <h2 className="text-xl font-semibold text-purple-700">{movie.movie}</h2>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-5 w-5 mr-1 inline" />
                      <span>{movie.rating || 'N/A'}/10</span>
                    </div>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <a href={movie.imdb_url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                      View on IMDb
                    </a>
                  </div>
                </div>
              ))}
            </div>
            {filteredMovies.length === 0 && (
              <p className="text-center text-gray-600 mt-8">No movies found. Try a different search term.</p>
            )}
          </>
        )}
        <div className="flex justify-center mt-8">
          <button onClick={fetchMovies} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            Refresh Movies
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDatabase;
