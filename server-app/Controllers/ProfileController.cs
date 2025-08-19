using ManagementApp.DTOs;
using ManagementApp.DTOs.Profile;
using ManagementApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ManagementApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        private Guid GetCurrentUserId()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(userIdString, out var userId) ? userId : Guid.Empty;
        }

        private bool IsAdmin()
        {
            return User.FindFirst(ClaimTypes.Role)?.Value == "Admin";
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<UserProfileDto>>> GetProfile()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty)
                {
                    return Unauthorized(new ApiResponse<UserProfileDto>
                    {
                        Success = false,
                        Message = "Invalid user ID"
                    });
                }

                var profile = await _profileService.GetUserProfileAsync(userId);
                if (profile == null)
                {
                    return NotFound(new ApiResponse<UserProfileDto>
                    {
                        Success = false,
                        Message = "User profile not found"
                    });
                }

                return Ok(new ApiResponse<UserProfileDto>
                {
                    Success = true,
                    Data = profile,
                    Message = "Profile retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<UserProfileDto>
                {
                    Success = false,
                    Message = $"Error retrieving profile: {ex.Message}"
                });
            }
        }

        [HttpPut]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateProfile([FromBody] UpdateProfileDto updateProfileDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty)
                {
                    return Unauthorized(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Invalid user ID"
                    });
                }

                var result = await _profileService.UpdateUserProfileAsync(userId, updateProfileDto);
                if (!result)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Failed to update profile. Email might already be in use."
                    });
                }

                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Data = result,
                    Message = "Profile updated successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = $"Error updating profile: {ex.Message}"
                });
            }
        }

        [HttpPost("change-password")]
        public async Task<ActionResult<ApiResponse<bool>>> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty)
                {
                    return Unauthorized(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Invalid user ID"
                    });
                }

                var result = await _profileService.ChangePasswordAsync(userId, changePasswordDto);
                if (!result)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Current password is incorrect"
                    });
                }

                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Data = result,
                    Message = "Password changed successfully. Please log in again."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = $"Error changing password: {ex.Message}"
                });
            }
        }

        [HttpPost("setup-2fa")]
        public async Task<ActionResult<ApiResponse<TwoFactorSetupDto>>> SetupTwoFactor()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty)
                {
                    return Unauthorized(new ApiResponse<TwoFactorSetupDto>
                    {
                        Success = false,
                        Message = "Invalid user ID"
                    });
                }

                var setup = await _profileService.SetupTwoFactorAsync(userId);
                return Ok(new ApiResponse<TwoFactorSetupDto>
                {
                    Success = true,
                    Data = setup,
                    Message = "Two-factor authentication setup generated. Please verify with your authenticator app."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<TwoFactorSetupDto>
                {
                    Success = false,
                    Message = $"Error setting up 2FA: {ex.Message}"
                });
            }
        }

        [HttpPost("verify-2fa")]
        public async Task<ActionResult<ApiResponse<bool>>> VerifyTwoFactor([FromBody] VerifyTwoFactorDto verifyDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty)
                {
                    return Unauthorized(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Invalid user ID"
                    });
                }

                var result = await _profileService.VerifyAndEnableTwoFactorAsync(userId, verifyDto.Code);
                if (!result)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Invalid verification code"
                    });
                }

                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Data = result,
                    Message = "Two-factor authentication enabled successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = $"Error verifying 2FA: {ex.Message}"
                });
            }
        }

        [HttpPost("disable-2fa")]
        public async Task<ActionResult<ApiResponse<bool>>> DisableTwoFactor([FromBody] ChangePasswordDto passwordDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty)
                {
                    return Unauthorized(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Invalid user ID"
                    });
                }

                var result = await _profileService.DisableTwoFactorAsync(userId, passwordDto.CurrentPassword);
                if (!result)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Incorrect password"
                    });
                }

                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Data = result,
                    Message = "Two-factor authentication disabled successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = $"Error disabling 2FA: {ex.Message}"
                });
            }
        }

        [HttpPost("regenerate-backup-codes")]
        public async Task<ActionResult<ApiResponse<string[]>>> RegenerateBackupCodes()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty)
                {
                    return Unauthorized(new ApiResponse<string[]>
                    {
                        Success = false,
                        Message = "Invalid user ID"
                    });
                }

                var backupCodes = await _profileService.GenerateBackupCodesAsync(userId);
                return Ok(new ApiResponse<string[]>
                {
                    Success = true,
                    Data = backupCodes,
                    Message = "Backup codes regenerated successfully. Please save them in a secure location."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string[]>
                {
                    Success = false,
                    Message = $"Error regenerating backup codes: {ex.Message}"
                });
            }
        }

        // Admin-only endpoints
        [HttpGet("admin/users")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<List<AdminUserManagementDto>>>> GetAllUsers()
        {
            try
            {
                var users = await _profileService.GetAllUsersAsync();
                return Ok(new ApiResponse<List<AdminUserManagementDto>>
                {
                    Success = true,
                    Data = users,
                    Message = "Users retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<List<AdminUserManagementDto>>
                {
                    Success = false,
                    Message = $"Error retrieving users: {ex.Message}"
                });
            }
        }

        [HttpPut("admin/users/{targetUserId}/role")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateUserRole(Guid targetUserId, [FromBody] UpdateUserRoleDto updateRoleDto)
        {
            try
            {
                var adminUserId = GetCurrentUserId();
                if (adminUserId == Guid.Empty)
                {
                    return Unauthorized(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Invalid admin user ID"
                    });
                }

                var result = await _profileService.UpdateUserRoleAsync(targetUserId, updateRoleDto.Role, adminUserId);
                if (!result)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Failed to update user role. User not found or invalid role."
                    });
                }

                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Data = result,
                    Message = "User role updated successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = $"Error updating user role: {ex.Message}"
                });
            }
        }

        [HttpPut("admin/users/{targetUserId}/toggle-status")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<bool>>> ToggleUserStatus(Guid targetUserId)
        {
            try
            {
                var adminUserId = GetCurrentUserId();
                if (adminUserId == Guid.Empty)
                {
                    return Unauthorized(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Invalid admin user ID"
                    });
                }

                var result = await _profileService.ToggleUserStatusAsync(targetUserId, adminUserId);
                if (!result)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Failed to toggle user status. User not found or cannot modify own status."
                    });
                }

                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Data = result,
                    Message = "User status updated successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = $"Error toggling user status: {ex.Message}"
                });
            }
        }

        [HttpGet("admin/system-config")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<SystemConfigDto>>> GetSystemConfig()
        {
            try
            {
                var config = await _profileService.GetSystemConfigAsync();
                return Ok(new ApiResponse<SystemConfigDto>
                {
                    Success = true,
                    Data = config,
                    Message = "System configuration retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<SystemConfigDto>
                {
                    Success = false,
                    Message = $"Error retrieving system config: {ex.Message}"
                });
            }
        }

        [HttpPut("admin/system-config")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateSystemConfig([FromBody] SystemConfigDto configDto)
        {
            try
            {
                var adminUserId = GetCurrentUserId();
                if (adminUserId == Guid.Empty)
                {
                    return Unauthorized(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Invalid admin user ID"
                    });
                }

                var result = await _profileService.UpdateSystemConfigAsync(configDto, adminUserId);
                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Data = result,
                    Message = "System configuration updated successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = $"Error updating system config: {ex.Message}"
                });
            }
        }
    }
}
