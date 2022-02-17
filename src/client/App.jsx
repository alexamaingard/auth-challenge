import { useState } from 'react';
import { APIEndPoints_User } from '../config';
import './App.css';

const apiUrl = 'http://localhost:4000';

const initialUserData = {
  username: "",
  password: ""
}

const initialMovieData = {
  title: "",
  description: "",
  runtimeMins: null
}

function App() {
  const [userRegisterData, setUserRegisterData] = useState(initialUserData);
  const [userLoginData, setUserLoginData] = useState(initialUserData);
  const [movieToCreate, setMovieToCreate] = useState(initialMovieData);
  const [movieList, setMovieList] = useState();

  const fetchConfig = (reqBody) => {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify(reqBody)
    }
  } 

  const postFetch = async (endpoint, data) => {
    try {
        const res = await fetch(APIEndPoints_User[endpoint], fetchConfig(data));
        return res.json();
    }
    catch(error){
        console.log(error);
    }
  }

  const registerUser = async () => {
    try{
        const registeredUser = await postFetch('register', userRegisterData);
        if(registeredUser){
            return registeredUser;
        }
    }
    catch(error){
        console.log(error);
    }
  }

  // const loginUser = async () => {
  //   try{
  //       const token = await postFetch('login', userLoginData);
  //       console.log(token);
  //       if(token){
  //           return token;
  //       }
  //   }
  //   catch(error){
  //       console.log(error);
  //   }
  // }

  const handleRegisterChange = event => {
    const { name, value } = event.target;
    setUserRegisterData({...userRegisterData, [name]: value});
  }

  const handleRegister = async (event) => {
    event.preventDefault();
    setUserRegisterData(userRegisterData);

    const registeredUser = await registerUser();
  }

  console.log(userRegisterData);

  const handleLoginChange = event => {

  }

  const handleLogin = event => {

  }

  const handleMovieChange = event => {

  }

  const handleCreateMovie = event => {

  }

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
          value={movieToCreate.runtimeMins}
          placeholder="Runtime Minutes"
          onChange={handleMovieChange}
        />
        <button type="submit">Submit</button>
      </form>
      {movieList && movieList.map((movie, index) => {
        return (
          <li key={index}>
            <h4>{movie.data.title}</h4>
            <p>{movie.data.description}</p>
            <p>{movie.data.runtimeMins}</p>
          </li>
        );
      })}
    </div>
  );
}

export default App;