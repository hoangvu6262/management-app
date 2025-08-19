'use client';

import { useState, useEffect } from 'react';
import { profileService, SystemConfigDto } from '@/services/profileService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Shield, 
  Mail, 
  Clock, 
  AlertTriangle,
  MessageSquare,
  Lock
} from 'lucide-react';

export function SystemConfiguration() {
  const [config, setConfig] = useState<SystemConfigDto>({
    requireEmailVerification: false,
    enableTwoFactor: true,
    maxLoginAttempts: 5,
    sessionTimeoutMinutes: 60,
    maintenanceMode: false,
    systemMessage: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalConfig, setOriginalConfig] = useState<SystemConfigDto | null>(null);

  useEffect(() => {
    loadSystemConfig();
  }, []);

  useEffect(() => {
    if (originalConfig) {
      const changed = JSON.stringify(config) !== JSON.stringify(originalConfig);
      setHasChanges(changed);
    }
  }, [config, originalConfig]);

  const loadSystemConfig = async () => {
    try {
      setLoading(true);
      const configData = await profileService.getSystemConfig();
      setConfig(configData);
      setOriginalConfig(configData);
    } catch (error) {
      console.error('Error loading system config:', error);
      toast.error('Không thể tải cấu hình hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await profileService.updateSystemConfig(config);
      toast.success('Cập nhật cấu hình thành công');
      setOriginalConfig({ ...config });
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating system config:', error);
      toast.error('Có lỗi khi cập nhật cấu hình');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (originalConfig) {
      setConfig({ ...originalConfig });
      setHasChanges(false);
    }
  };

  const updateConfig = (key: keyof SystemConfigDto, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Cấu hình hệ thống</span>
              </CardTitle>
              <CardDescription>
                Quản lý các cài đặt bảo mật và cấu hình hệ thống
              </CardDescription>
            </div>
            {hasChanges && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={saving}
                  className="flex items-center space-x-1"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Khôi phục</span>
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-1"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Security Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Cài đặt bảo mật</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Verification */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Yêu cầu xác thực email</span>
                      </Label>
                      <p className="text-sm text-gray-600">
                        Bắt buộc người dùng xác thực email khi đăng ký
                      </p>
                    </div>
                    <Switch
                      checked={config.requireEmailVerification}
                      onCheckedChange={(checked) => updateConfig('requireEmailVerification', checked)}
                    />
                  </div>
                </div>

                {/* Two Factor */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center space-x-2">
                        <Lock className="h-4 w-4" />
                        <span>Cho phép 2FA</span>
                      </Label>
                      <p className="text-sm text-gray-600">
                        Cho phép người dùng kích hoạt xác thực hai yếu tố
                      </p>
                    </div>
                    <Switch
                      checked={config.enableTwoFactor}
                      onCheckedChange={(checked) => updateConfig('enableTwoFactor', checked)}
                    />
                  </div>
                </div>

                {/* Max Login Attempts */}
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Số lần đăng nhập sai tối đa</span>
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={config.maxLoginAttempts}
                    onChange={(e) => updateConfig('maxLoginAttempts', parseInt(e.target.value) || 5)}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    Tài khoản sẽ bị khóa tạm thời sau số lần này
                  </p>
                </div>

                {/* Session Timeout */}
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Thời gian hết hạn phiên (phút)</span>
                  </Label>
                  <Input
                    type="number"
                    min="15"
                    max="1440"
                    value={config.sessionTimeoutMinutes}
                    onChange={(e) => updateConfig('sessionTimeoutMinutes', parseInt(e.target.value) || 60)}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    Thời gian tự động đăng xuất khi không hoạt động
                  </p>
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-medium flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Cài đặt hệ thống</span>
              </h3>

              {/* Maintenance Mode */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Chế độ bảo trì</span>
                    </Label>
                    <p className="text-sm text-gray-600">
                      Chặn người dùng thường truy cập hệ thống (Admin vẫn truy cập được)
                    </p>
                  </div>
                  <Switch
                    checked={config.maintenanceMode}
                    onCheckedChange={(checked) => updateConfig('maintenanceMode', checked)}
                  />
                </div>

                {config.maintenanceMode && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <p className="text-sm font-medium text-yellow-800">
                        Hệ thống đang ở chế độ bảo trì
                      </p>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Chỉ Admin mới có thể truy cập. Người dùng khác sẽ thấy thông báo bảo trì.
                    </p>
                  </div>
                )}
              </div>

              {/* System Message */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Thông báo hệ thống</span>
                </Label>
                <Textarea
                  placeholder="Nhập thông báo hiển thị cho người dùng (để trống nếu không muốn hiển thị)"
                  value={config.systemMessage}
                  onChange={(e) => updateConfig('systemMessage', e.target.value)}
                  rows={3}
                />
                <p className="text-sm text-gray-600">
                  Thông báo này sẽ hiển thị trên dashboard cho tất cả người dùng
                </p>
              </div>
            </div>

            {/* Preview */}
            {config.systemMessage && (
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-medium">Xem trước thông báo</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Thông báo hệ thống</p>
                      <p className="text-sm text-blue-700 mt-1 whitespace-pre-wrap">
                        {config.systemMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Tóm tắt bảo mật</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${config.requireEmailVerification ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Mail className={`h-4 w-4 ${config.requireEmailVerification ? 'text-green-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <p className="text-sm font-medium">Xác thực email</p>
                <p className="text-xs text-gray-600">
                  {config.requireEmailVerification ? 'Bắt buộc' : 'Tùy chọn'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${config.enableTwoFactor ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Lock className={`h-4 w-4 ${config.enableTwoFactor ? 'text-green-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <p className="text-sm font-medium">2FA</p>
                <p className="text-xs text-gray-600">
                  {config.enableTwoFactor ? 'Cho phép' : 'Tắt'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Bảo vệ brute force</p>
                <p className="text-xs text-gray-600">
                  {config.maxLoginAttempts} lần thử
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Hết hạn phiên</p>
                <p className="text-xs text-gray-600">
                  {config.sessionTimeoutMinutes} phút
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
