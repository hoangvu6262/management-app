using Microsoft.AspNetCore.Mvc;
using ManagementApp.DTOs;
using ManagementApp.DTOs.Auth;
using ManagementApp.Services;
using ManagementApp.Utils;
using Microsoft.AspNetCore.Authorization;

namespace ManagementApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<LoginResponseDto>>> Login([FromBody] LoginRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<LoginResponseDto>.ErrorResult("Invalid input data", ModelState));
            }

            var result = await _authService.LoginAsync(request);
            if (result == null)
            {
                return Unauthorized(ApiResponse<LoginResponseDto>.ErrorResult("Invalid email or password"));
            }

            return Ok(ApiResponse<LoginResponseDto>.SuccessResult(result, "Login successful"));
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<UserInfoDto>>> Register([FromBody] RegisterRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<UserInfoDto>.ErrorResult("Invalid input data", ModelState));
            }

            var result = await _authService.RegisterAsync(request);
            if (result == null)
            {
                return BadRequest(ApiResponse<UserInfoDto>.ErrorResult("User with this email or username already exists"));
            }

            return Ok(ApiResponse<UserInfoDto>.SuccessResult(result, "Registration successful"));
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<ActionResult<ApiResponse>> ChangePassword([FromBody] ChangePasswordRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse.ErrorResult("Invalid input data", ModelState));
            }

            var userId = User.GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(ApiResponse.ErrorResult("Invalid user"));
            }

            var result = await _authService.ChangePasswordAsync(userId, request);
            if (!result)
            {
                return BadRequest(ApiResponse.ErrorResult("Current password is incorrect"));
            }

            return Ok(ApiResponse.SuccessResult("Password changed successfully"));
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<ApiResponse<LoginResponseDto>>> RefreshToken([FromBody] RefreshTokenRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<LoginResponseDto>.ErrorResult("Invalid input data", ModelState));
            }

            var result = await _authService.RefreshTokenAsync(request);
            if (result == null)
            {
                return Unauthorized(ApiResponse<LoginResponseDto>.ErrorResult("Invalid or expired refresh token"));
            }

            return Ok(ApiResponse<LoginResponseDto>.SuccessResult(result, "Token refreshed successfully"));
        }

        [HttpPost("revoke-token")]
        [Authorize]
        public async Task<ActionResult<ApiResponse>> RevokeToken([FromBody] RefreshTokenRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse.ErrorResult("Invalid input data", ModelState));
            }

            var result = await _authService.RevokeRefreshTokenAsync(request.RefreshToken);
            if (!result)
            {
                return BadRequest(ApiResponse.ErrorResult("Token not found"));
            }

            return Ok(ApiResponse.SuccessResult("Token revoked successfully"));
        }

        [HttpPost("revoke-all-tokens")]
        [Authorize]
        public async Task<ActionResult<ApiResponse>> RevokeAllTokens()
        {
            var userId = User.GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(ApiResponse.ErrorResult("Invalid user"));
            }

            await _authService.RevokeAllRefreshTokensAsync(userId);
            return Ok(ApiResponse.SuccessResult("All tokens revoked successfully"));
        }
    }
}
