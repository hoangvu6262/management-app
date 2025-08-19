'use client';

import { useState } from 'react';
import { profileService, ChangePasswordDto } from '@/services/profileService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, Shield, CheckCircle, X } from 'lucide-react';

export function ChangePasswordForm() {
  const [formData, setFormData] = useState<ChangePasswordDto>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const passwordRequirements = [
    { regex: /.{6,}/, text: 'Ít nhất 6 ký tự' },
    { regex: /[A-Z]/, text: 'Ít nhất 1 chữ hoa' },
    { regex: /[a-z]/, text: 'Ít nhất 1 chữ thường' },
    { regex: /\d/, text: 'Ít nhất 1 số' }
  ];

  const validatePassword = (password: string) => {
    return passwordRequirements.map(req => ({
      ...req,
      valid: req.regex.test(password)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmNewPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }

    const validation = validatePassword(formData.newPassword);
    if (validation.some(req => !req.valid)) {
      toast.error('Mật khẩu mới không đáp ứng yêu cầu');
      return;
    }

    try {
      setLoading(true);
      await profileService.changePassword(formData);
      toast.success('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);
      
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Mật khẩu hiện tại không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const passwordValidation = validatePassword(formData.newPassword);
  const isFormValid = formData.currentPassword && 
                     formData.newPassword && 
                     formData.confirmNewPassword &&
                     formData.newPassword === formData.confirmNewPassword &&
                     passwordValidation.every(req => req.valid);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Đổi mật khẩu</span>
        </CardTitle>
        <CardDescription>
          Cập nhật mật khẩu để bảo mật tài khoản của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                placeholder="Nhập mật khẩu hiện tại"
                className="pl-10 pr-10"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                className="pl-10 pr-10"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            
            {/* Password Requirements */}
            {formData.newPassword && (
              <div className="space-y-1">
                {passwordValidation.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    {req.valid ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span className={req.valid ? 'text-green-600' : 'text-red-600'}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="confirmNewPassword"
                type={showPasswords.confirm ? "text" : "password"}
                placeholder="Nhập lại mật khẩu mới"
                className="pl-10 pr-10"
                value={formData.confirmNewPassword}
                onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            
            {/* Password Match Validation */}
            {formData.confirmNewPassword && (
              <div className="flex items-center space-x-2 text-sm">
                {formData.newPassword === formData.confirmNewPassword ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">Mật khẩu khớp</span>
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 text-red-500" />
                    <span className="text-red-600">Mật khẩu không khớp</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-4">
            <Button 
              type="submit" 
              disabled={loading || !isFormValid}
              className="flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>{loading ? 'Đang đổi...' : 'Đổi mật khẩu'}</span>
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              disabled={loading}
            >
              Hủy
            </Button>
          </div>

          {/* Security Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex items-start space-x-2">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Lưu ý bảo mật</p>
                <p className="text-sm text-blue-700 mt-1">
                  Sau khi đổi mật khẩu thành công, bạn sẽ được đăng xuất khỏi tất cả thiết bị và cần đăng nhập lại.
                </p>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
