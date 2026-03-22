import React, { useState } from 'react';
import './App.css';

//To run the app, make sure to have the backend server running on http://localhost:8000
//To start use the command: npm start in the frontend directory

function App() {
  // State variables for form inputs, messages, and loading state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Logout handling, resets all states to initial values
  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setMessage('');
  };

  // Handles form submission for both login and registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    // Determine the endpoint based on whether the user is registering or logging in
    const endpoint = isRegister ? '/auth/register' : '/auth/login';

    // Make a POST request to the backend API with the email and password
    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Parse the JSON response from the backend
      const data = await response.json();

      // Check if the response is successful and update the message and login state accordingly
      if (response.ok) {
        if (isRegister) {
          setMessage('Rejestracja pomyślna! Możesz się zalogować.');
          setIsRegister(false);
          setPassword('');
        } else {
          setMessage('Logowanie pomyślne! Przekierowywanie do dashboardu...');
          setIsLoggedIn(true);
          setMessage('');
        }
      } else {
        setMessage(data.detail || (isRegister ? 'Rejestracja nie powiodła się' : 'Logowanie nie powiodło się'));
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggles between login and registration modes and resets the message
  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setMessage('');
  };

  // If the user is logged in, display the dashboard with a welcome message and logout button
  if (isLoggedIn) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Panel użytkownika</h1>
          <p>Witaj, {email}!</p>
          <p>Jesteś teraz zalogowany.</p>
          <button type="button" onClick={handleLogout}>
            Wyloguj
          </button>
          {message && <p className="message">{message}</p>}
        </header>
      </div>
    );
  }

  // If the user is not logged in, display the login/registration form (default option)
  return (
    <div className="App">
      <header className="App-header">
        <h1>{isRegister ? 'Rejestracja' : 'Logowanie'}</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label>Hasło:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Proszę czekać...' : isRegister ? 'Zarejestruj się' : 'Zaloguj się'}
          </button>
        </form>

        <button type="button" className="secondary" onClick={toggleMode}>
          {isRegister ? 'Przełącz na Logowanie' : 'Przełącz na Rejestrację'}
        </button>

        {message && <p className="message">{message}</p>}
      </header>
    </div>
  );
}

export default App;