using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace TodoApp.Services
{
    public class RefreshTokenService : IRefreshTokenService
    {
        private readonly ConcurrentDictionary<string, string> _refreshTokens = new();

        public Task SaveRefreshTokenAsync(string userId, string refreshToken)
        {
            _refreshTokens[userId] = refreshToken;
            return Task.CompletedTask;
        }

        public string GetUserIdFromRefreshToken(string refreshToken)
        {
            foreach (var entry in _refreshTokens)
            {
                if (entry.Value == refreshToken)
                    return entry.Key;
            }
            return null;
        }
    }
}
