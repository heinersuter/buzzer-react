using Buzzer.React.Backend.Game;
using Microsoft.AspNetCore.Mvc;

namespace Buzzer.React.Backend.Player;

[Route("api/games/{gameName}")]
public class PutGameAndPlayerController(GameRepository gameRepository) : Controller
{
    [HttpPut]
    public GameModel GetGame([FromRoute] string gameName, [FromBody] string playerName)
    {
        return gameRepository.AddPlayer(gameName, playerName);
    }
}