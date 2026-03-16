import { client } from './generated/client.gen'
import { putApiGamesByGameName, type GameModel, type PlayerModel } from './generated'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

if (configuredBaseUrl) {
  client.setConfig({ baseUrl: configuredBaseUrl })
}

export const createOrJoinGame = async (gameName: string, playerName: string): Promise<GameModel> => {
  const response = await putApiGamesByGameName({
    path: { gameName },
    body: playerName,
    throwOnError: true,
  })

  return response.data
}

export type { GameModel, PlayerModel }


