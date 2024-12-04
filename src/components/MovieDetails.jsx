import { useState, useEffect } from 'react'
import { Row, Col, Spinner, Alert } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Rating from './Rating'

const MovieDetails = (props) => {
  const params = useParams()
  console.log('Parametri:', params)

  const [modalData, setModalData] = useState(null)
  const [commentData, setCommentData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [movieId, setMovieId] = useState(params.movieId)

  // Metodo per recuperare i dati del film
  const getModalData = () => {
    // Inizializza il caricamento
    setIsLoading(true)
    setIsError(false)

    fetch('https://www.omdbapi.com/?apikey=81a9ef25&i=' + params.movieId)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('Errore nel recupero dei dati')
        }
      })
      .then((data) => {
        console.log('Dati ricevuti:', data)
        setModalData(data)
        setIsLoading(false)
        setIsError(false)
      })
      .catch((err) => {
        setModalData(null)
        setIsLoading(false)
        setIsError(true)
      })
  }

  const getComments = () => {
    setIsLoading(true)
    setIsError(false)

    fetch('https://striveschool-api.herokuapp.com/api/comments/', {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzM3MDYyMDhhZDEyOTAwMTU4NzZiYzEiLCJpYXQiOjE3MzMxNDUxNDMsImV4cCI6MTczNDM1NDc0M30.b9vuC2wosIXVBrGf0AQwNBGmQXwsfYjq4W2ppICdxQA',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('Errore nella "response"')
        }
      })
      .then((arrayOfComments) => {
        arrayOfComments.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )
        setCommentData(arrayOfComments)
        setIsLoading(false)
        setIsError(false)
      })
      .catch((err) => {
        setCommentData(null)
        setIsLoading(false)
        setIsError(true)
      })
  }

  useEffect(() => {
    getModalData()
    getComments()
  }, [movieId])

  return (
    <>
      {isLoading && (
        <div className='text-center'>
          <Spinner animation='border' role='status' />
          <p>Caricamento in corso...</p>
        </div>
      )}

      {/* Errore */}
      {isError && (
        <Alert variant='danger'>
          Problema nel caricamento dei dati. Riprova più tardi.
        </Alert>
      )}

      {/* Dati caricati */}
      {!isLoading && !isError && modalData && (
        <>
          <Row className='my-5'>
            <Col className='d-flex justify-content-center'>
              <h3 className='text-red-NF'>
                {modalData.Title} ({modalData.Year})
              </h3>
            </Col>
          </Row>
          <Row className='d-flex  justify-content-center my-5'>
            {/* Colonna immagine del poster */}
            <Col xs={4}>
              <img
                className='img-fluid shadow-lg rounded'
                src={modalData.Poster}
                alt={`Poster di ${modalData.Title}`}
              />
            </Col>

            {/* Colonna informazioni */}
            <Col xs={4}>
              {modalData.Genre !== 'N/A' && (
                <p>
                  <strong>Genere:</strong> {modalData.Genre}
                </p>
              )}
              {modalData.Plot !== 'N/A' && (
                <p>
                  <strong>Trama:</strong> {modalData.Plot}
                </p>
              )}
              {modalData.Director !== 'N/A' && (
                <p>
                  <strong>Regista:</strong> {modalData.Director}
                </p>
              )}
              {modalData.Actors !== 'N/A' && (
                <p>
                  <strong>Attori:</strong> {modalData.Actors}
                </p>
              )}
              {modalData.Language !== 'N/A' && (
                <p>
                  <strong>Lingua:</strong> {modalData.Language}
                </p>
              )}
              {modalData.Awards !== 'N/A' && (
                <p>
                  <strong>Premi:</strong> {modalData.Awards}
                </p>
              )}
              {modalData.imdbRating !== 'N/A' && (
                <p>
                  <strong>Rating IMDb:</strong>{' '}
                  <Rating rate={modalData.imdbRating} max='10' />
                </p>
              )}
            </Col>
          </Row>
          <Row></Row>
        </>
      )}
    </>
  )
}

export default MovieDetails
