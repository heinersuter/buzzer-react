using System.Collections.Concurrent;
using Buzzer.React.Backend.Player;
using Microsoft.Extensions.Caching.Memory;

namespace Buzzer.React.Backend.Game;

public class GameRepository(IMemoryCache cache)
{
    private readonly ConcurrentDictionary<string, object> _gameLocks = new();

    public GameModel AddPlayer(string gameName, string playerName)
    {
        lock (_gameLocks.GetOrAdd(gameName, _ => new object()))
        {
            var game = GetGame(gameName) ?? new GameModel { Name = gameName };
            if (game.Players.All(p => p.Name != playerName))
            {
                game.Players.Add(new PlayerModel { Name = playerName });
                StoreGame(game);
            }
            return game;
        }
    }

    private GameModel? GetGame(string gameName)
    {
        return cache.Get(GetGameCacheKey(gameName)) as GameModel;
    }

    private void StoreGame(GameModel game)
    {
        cache.Set(GetGameCacheKey(game.Name), game, DateTimeOffset.UtcNow.AddHours(24));
    }

    private static string GetGameCacheKey(string name) => $"game:{name}";
}