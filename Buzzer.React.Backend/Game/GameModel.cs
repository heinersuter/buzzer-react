using Buzzer.React.Backend.Player;

namespace Buzzer.React.Backend.Game;

public class GameModel
{
    public required string Name { get; set; } 
    
    public List<PlayerModel> Players { get; } = [];
}