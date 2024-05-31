import { useState, useEffect } from 'react';
import './App.css';
import { CircularProgress, FormControl, InputLabel, Rating } from '@mui/material';
import {
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Grid,
} from '@mui/material';

var generos = ["drama", "action", "sci-fi", "romance", "horror", "thriller", "crime", "biography", "comedy", "adventure"] as const;
type Genre = typeof generos | undefined;

interface Film {
  actor: string;
  country: string;
  director: string;
  duration: number;
  genre: Genre;
  image: string;
  rating: number;
  subgenre: Genre;
  synopsis: string;
  title: string;
  votes: number;
  year: number;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [films, setFilms] = useState<Film[]>([]);
  const [genre, setGenre] = useState<Genre>();
  const [subgenre, setSubgenre] = useState<Genre>();

  const fetchFilms = async () => {
    var API_URL = "https://e164a568-6b9e-42db-9957-8726c995554f-00-1jjy2p1vowt3.janeway.replit.dev/films"
    const response = await fetch(`${API_URL}?genre=${genre ?? ""}&subgenre=${subgenre ?? ""}`);
    const data = await response.json();
    setFilms(data);
  };

  const formatFilmTime = (timeInMinutes: number) => {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    setLoading(true);
    fetchFilms().then(() => setLoading(false));
  }, [genre, subgenre])


  return (
    <div className="App">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">Films</Typography>
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="genre">Gênero</InputLabel>
            <Select
              labelId="genre"
              id="genre"
              value={genre}
              label="Gênero"
              onChange={(e) => setGenre(e.target.value as keyof Genre)}
            >
              <MenuItem value={undefined}>Todos os gêneros</MenuItem>
              {generos.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="subgenre">Subgênero</InputLabel>
            <Select
              labelId="subgenre"
              id="subgenre"
              value={subgenre}
              label="Subgênero"
              onChange={(e) => setSubgenre(e.target.value as keyof Genre)}
            >
              <MenuItem value={undefined}>Todos os subgêneros</MenuItem>
              {generos.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid container spacing={2}>
          {loading ? <CircularProgress /> : films.map((film, index) => (
            <Grid className='filmsContainer' item key={index} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <img
                      src={film.image}
                      alt={film.title}
                  />
                  <div className='filmInfoContainer'>
                    <Typography variant="h5">{film.title}</Typography>
                    <Typography variant="body2">{film.synopsis}</Typography>
                    <Typography variant="body2">
                      Gênero: {film.genre}/{film.subgenre}
                    </Typography>
                    <Typography variant="body2">
                      Duração: {formatFilmTime(film.duration)}
                    </Typography>
                    <Typography variant="body2">Ano de lançamento: {film.year}</Typography>
                    <Typography variant="body2">Director: {film.director}</Typography>
                    <Typography variant="body2">País de origem: {film.country}</Typography>
                    <Typography variant="body2">Ator principal: {film.actor}</Typography>
                    <Rating value={Math.round(film.rating * 100.0 / 2) / 100} readOnly precision={0.5} />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
