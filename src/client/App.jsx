import { useEffect, useState } from "react";
import { APIEndPoints_Movie, APIEndPoints_User } from "../config";
import "./App.css";

const initialUserData = {
  username: "",
  password: "",
};

const initialMovieData = {
  title: "",
  description: "",
  runtimeMins: null,
};

function App() {
  const [userRegisterData, setUserRegisterData] = useState(initialUserData);
  const [userLoginData, setUserLoginData] = useState(initialUserData);
  const [movieToCreate, setMovieToCreate] = useState(initialMovieData);
  const [movieList, setMovieList] = useState();
  const [fetchMovieList, setFetchMovieList] = useState(true);

  useEffect(() => {
    const getListOfMovies = async () => {
      const res = await fetch(APIEndPoints_Movie.basicURL);
      const movies = await res.json();

      setMovieList(movies.data);
    }

    if(fetchMovieList){
      getListOfMovies();
    }
    setFetchMovieList(false);

  }, [movieList, fetchMovieList]);

  const fetchConfig = (reqBody) => {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    };
  };

  const movieFetchConfig = (reqBody) => {
    console.log(localStorage.getItem("userToken"));
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("userToken"),
      },
      body: JSON.stringify(reqBody),
    };
  };

  const postFetchUser = async (endpoint, data) => {
    try {
      const res = await fetch(APIEndPoints_User[endpoint], fetchConfig(data));
      return res.json();
    } 
    catch(error){
      console.log(error);
    }
  };

  const postFetchMovie = async (data) => {
    try {
      const res = await fetch(APIEndPoints_Movie.basicURL, movieFetchConfig(data));
      return res.json();
    } 
    catch(error){
      console.log(error);
    }
  };

  const registerUser = async () => {
    try {
      const registeredUser = await postFetchUser("register", userRegisterData);
      if(registeredUser){
        return registeredUser;
      }
    } 
    catch(error){
      console.log(error);
    }
  };

  const loginUser = async () => {
    try {
      const token = await postFetchUser("login", userLoginData);
      if(token){
        return token;
      }
    } 
    catch(error){
      console.log(error);
    }
  };

  const createMovie = async () => {
    try {
      const createdMovie = await postFetchMovie(movieToCreate);
      if(createdMovie){
        return createdMovie;
      }
    } 
    catch(error){
      console.log(error);
    }
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setUserRegisterData({ ...userRegisterData, [name]: value });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setUserRegisterData(userRegisterData);

    const registeredUser = await registerUser();
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setUserLoginData({ ...userLoginData, [name]: value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setUserLoginData(userRegisterData);

    const token = await loginUser();
    localStorage.setItem("userToken", token.data);
  };

  const handleMovieChange = (event) => {
    const { name, value } = event.target;
    setMovieToCreate({ ...movieToCreate, [name]: value });
  };

  //console.log(movieToCreate);

  const handleCreateMovie = async (event) => {
    event.preventDefault();
    setMovieToCreate(movieToCreate);

    const createdMovie = await createMovie();
    setFetchMovieList(true);
  };

  return (
    <div className="App">
      <form onSubmit={handleRegister}>
        <h3>Register</h3>
        <input
          type="text"
          name="username"
          value={userRegisterData.username}
          placeholder="Username"
          onChange={handleRegisterChange}
        />
        <input
          type="password"
          name="password"
          value={userRegisterData.password}
          placeholder="Password"
          onChange={handleRegisterChange}
        />
        <button type="submit">Submit</button>
      </form>
      <form onSubmit={handleLogin}>
        <h3>Login</h3>
        <input
          type="text"
          name="username"
          value={userLoginData.username}
          placeholder="Username"
          onChange={handleLoginChange}
        />
        <input
          type="password"
          name="password"
          value={userLoginData.password}
          placeholder="Password"
          onChange={handleLoginChange}
        />
        <button type="submit">Submit</button>
      </form>
      <form onSubmit={handleCreateMovie}>
        <h3>Create a movie</h3>
        <input
          type="text"
          name="title"
          value={movieToCreate.title}
          placeholder="Title"
          onChange={handleMovieChange}
        />
        <input
          type="text"
          name="description"
          value={movieToCreate.description}
          placeholder="Description"
          onChange={handleMovieChange}
        />
        <input
          type="number"
          name="runtimeMins"
          placeholder="Runtime Minutes"
          onChange={handleMovieChange}
        />
        <button type="submit">Submit</button>
      </form>

      {movieList &&
        movieList.map((movie, index) => {
          return (
            <li key={index}>
              <h4>{movie.title}</h4>
              <p>{movie.description}</p>
              <p>{movie.runtimeMins}</p>
            </li>
          );
        })}
    </div>
  );
}

export default App;
