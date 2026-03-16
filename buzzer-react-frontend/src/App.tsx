import { useState, type FormEvent } from 'react'
import { createOrJoinGame, type GameModel } from './api'
import './App.css'

function App() {
  const [gameName, setGameName] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [game, setGame] = useState<GameModel | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextGameName = gameName.trim()
    const nextPlayerName = playerName.trim()

    if (!nextGameName || !nextPlayerName) {
      setErrorMessage('Please enter both game and player names.')
      return
    }

    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const updatedGame = await createOrJoinGame(nextGameName, nextPlayerName)
      setGame(updatedGame)
      setGameName(updatedGame.name ?? nextGameName)
      setPlayerName('')
    } catch (error) {
      if (error instanceof Error && error.message) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Unable to create or join the game right now.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const players = game?.players ?? []

  return (
    <main className="app-shell">
      <h1>Buzzer Lobby</h1>

      <form className="game-form" onSubmit={handleSubmit}>
        <label>
          Game name
          <input
            value={gameName}
            onChange={(event) => setGameName(event.target.value)}
            placeholder="example: friday-quiz"
          />
        </label>

        <label>
          Player name
          <input
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            placeholder="example: Alice"
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Create or Join'}
        </button>
      </form>

      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}

      {game ? (
        <section className="players-panel">
          <h2>Game: {game.name ?? '(unnamed)'}</h2>
          <h3>Players ({players.length})</h3>
          {players.length > 0 ? (
            <ul>
              {players.map((player, index) => (
                <li key={`${player.name ?? 'player'}-${index}`}>{player.name ?? '(unnamed player)'}</li>
              ))}
            </ul>
          ) : (
            <p>No players yet.</p>
          )}
        </section>
      ) : null}
    </main>
  )
}

export default App
