import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Alert, Button, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'

class SectionCarousel extends Component {
  state = {
    genre: this.props.genre,
    genreId: this.props.genre.split(' ').join('').toLowerCase(),
    movies: this.props.movies,
    searchTerms: this.props.searchTerms,
    searchResults: [],
    isLoading: true,
    isError: false,
  }

  setSelectedMovieId = (movieId) => {
    this.props.setSelectedMovieId(movieId)
  }

  // Funzione per la gestione dello scrool delle card
  handleScroll = (e) => {
    const targetId = e.target.id ? e.target.id : e.target.parentElement.id

    const amount = 300
    const carousel = targetId.split('-')[0]
    const direction = targetId.split('-')[1]

    direction === 'Next'
      ? (document.getElementById(`${carousel}-Cards`).scrollLeft += amount)
      : (document.getElementById(`${carousel}-Cards`).scrollLeft -= amount)
  }

  // Recupera i dati di un film specifico
  async getMovieDataById(movieId) {
    try {
      const response = await fetch(
        'https://www.omdbapi.com/?apikey=81a9ef25&i=' + movieId
      )
      if (!response.ok) {
        throw new Error('Errore nel recupero dei dati del film')
      }
      const data = await response.json()
      return data // Ritorna i dati del film
    } catch (error) {
      console.error('Errore in getMovieDataById:', error)
      throw error // Propaga l'errore
    }
  }

  // Recupera i dati di ricerca
  async getSearchData() {
    try {
      const response = await fetch(
        'https://www.omdbapi.com/?apikey=81a9ef25&s=' + this.state.searchTerms
      )
      if (!response.ok) {
        throw new Error('Errore nel recupero dei dati di ricerca')
      }
      const data = await response.json()
      return data.Search // Ritorna i risultati di ricerca
    } catch (error) {
      console.error('Errore in getSearchData:', error)
      throw error
    }
  }

  // Recupera i dati e aggiorna lo stato
  async componentDidMount() {
    try {
      this.setState({ ...this.state, isLoading: true })

      let searchResults = []
      if (this.state.movies.length > 0) {
        // Recupera i dati di ogni film in parallelo
        const results = await Promise.allSettled(
          this.state.movies.map((movieId) => this.getMovieDataById(movieId))
        )
        searchResults = results
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value)
      } else {
        // Recupera i dati dalla ricerca
        searchResults = await this.getSearchData()
      }

      // Aggiorna lo stato con i dati recuperati
      this.setState({
        ...this.state,
        searchResults,
        isLoading: false,
        isError: false,
      })
    } catch (error) {
      // Gestisce eventuali errori
      this.setState({ ...this.state, isLoading: false, isError: true })
    }
  }

  render() {
    const { genre, genreId, isLoading, isError, searchResults } = this.state

    return (
      <>
        <section>
          <h2 className='fs-4 mt-5'>{genre}</h2>
          {isError && (
            <Alert id={`${genreId}-Alert`} variant='danger'>
              Problemi con il caricamento dei dati
            </Alert>
          )}
          <div
            id={`${genreId}Container`}
            className='d-flex justify-content-around'
          >
            <Button
              id={`${genreId}-Previous`}
              className='p-4 my-auto bg-dark text-white btn-outline-dark'
              onClick={this.handleScroll}
            >
              <FontAwesomeIcon
                id={`${genreId}-Previous-Icon`}
                icon='fa-solid fa-chevron-left'
              />
            </Button>

            {/* Cards */}
            <div
              id={`${genreId}-Cards`}
              className='d-flex align-content-center mt-3 p-3 overflow-hidden border border-1'
            >
              {/* Spinner */}
              {isLoading && (
                <div className='text-center'>
                  <Spinner animation='grow' size='sm' role='status' />
                  <p>Caricamento...</p>
                </div>
              )}

              {/* Immagini */}
              {!isLoading &&
                searchResults
                  .filter((data) => data.Poster !== 'N/A')
                  .map((data) => (
                    <div
                      key={`${genreId}-${data.imdbID}`}
                      className='d-inline-block me-2'
                    >
                      <Link to={`/movie/${data.imdbID}`}>
                        <img
                          id={data.imdbID}
                          src={data.Poster}
                          className=''
                          alt={data.Title}
                        />
                      </Link>
                    </div>
                  ))}
            </div>

            <Button
              id={`${genreId}-Next`}
              className='p-4 my-auto bg-dark text-white btn-outline-dark'
              onClick={this.handleScroll}
            >
              <FontAwesomeIcon
                id={`${genreId}-Next-Icon`}
                icon='fa-solid fa-chevron-right'
              />
            </Button>
          </div>
        </section>
      </>
    )
  }
}

export default SectionCarousel
