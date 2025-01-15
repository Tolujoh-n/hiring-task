using Xunit;
using Moq;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using backend.Controllers; // Use 'backend' namespace since your project is named 'backend'
using backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using backend.Services;

namespace TodoApp.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<UserManager<IdentityUser>> _userManagerMock;
        private readonly Mock<SignInManager<IdentityUser>> _signInManagerMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly Mock<IRefreshTokenService> _refreshTokenServiceMock;
        private readonly AuthController _authController;

        public AuthControllerTests()
        {
            _userManagerMock = new Mock<UserManager<IdentityUser>>(
                Mock.Of<IUserStore<IdentityUser>>(), null, null, null, null, null, null, null, null);
            _signInManagerMock = new Mock<SignInManager<IdentityUser>>(
                _userManagerMock.Object, Mock.Of<IHttpContextAccessor>(), Mock.Of<IUserClaimsPrincipalFactory<IdentityUser>>(), null, null, null, null);
            _configurationMock = new Mock<IConfiguration>();
            _refreshTokenServiceMock = new Mock<IRefreshTokenService>();

            _authController = new AuthController(
                _userManagerMock.Object,
                _signInManagerMock.Object,
                _configurationMock.Object,
                _refreshTokenServiceMock.Object);
        }

        [Fact]
        public async Task Register_ReturnsOk_WhenUserIsRegistered()
        {
            // Arrange
            var registerDto = new RegisterDto
            {
                Username = "testuser",
                Email = "testuser@example.com",
                Password = "Test@123"
            };
            _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<IdentityUser>(), It.IsAny<string>()))
                            .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _authController.Register(registerDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("User registered successfully", okResult.Value);
        }
    }
}
