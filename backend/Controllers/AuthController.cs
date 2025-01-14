using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using TodoApp.Models;
using TodoApp.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;

namespace TodoApp.Controllers
{
    [ApiController]
    [Route("api/v1/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;

        public AuthController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            var user = new IdentityUser { UserName = model.Username, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                return Ok("User registered successfully");
            }
            return BadRequest(result.Errors);
        }
    

        [HttpPost("login")]
public async Task<IActionResult> Login(LoginDto model)
{
    IdentityUser user = null;

    if (model.UsernameOrEmail.Contains("@")) // Check if input is an email
    {
        user = await _userManager.FindByEmailAsync(model.UsernameOrEmail);
    }
    else
    {
        user = await _userManager.FindByNameAsync(model.UsernameOrEmail);
    }

    if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("VGhpcyBpcyBhIHNlY3VyZSBzaWduaW5nIGtleSB3aXRoIGF0IGxlYXN0IDMyIGJ5dGVzLg==")); 
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: "todoapp",
            audience: "todoapp",
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: creds
        );

        return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
    }

    return Unauthorized("Invalid credentials");
}

    }
}