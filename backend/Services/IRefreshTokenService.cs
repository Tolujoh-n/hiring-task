namespace TodoApp.Services
{
    public interface IRefreshTokenService
    {
        Task SaveRefreshTokenAsync(string userId, string refreshToken);
        string GetUserIdFromRefreshToken(string refreshToken);
    }
}
