'use client';

import { useState } from 'react';
import { profileService, UserProfileDto, TwoFactorSetupDto } from '@/services/profileService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Shield, 
  Smartphone, 
  QrCode, 
  Key, 
  CheckCircle, 
  X, 
  Copy, 
  Download,
  AlertTriangle,
  Lock
} from 'lucide-react';

interface TwoFactorSettingsProps {
  profile: UserProfileDto;
  onProfileUpdate: () => void;
}

export function TwoFactorSettings({ profile, onProfileUpdate }: TwoFactorSettingsProps) {
  const [setupData, setSetupData] = useState<TwoFactorSetupDto | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [newBackupCodes, setNewBackupCodes] = useState<string[]>([]);

  const handleStartSetup = async () => {
    try {
      setLoading(true);
      const setup = await profileService.setupTwoFactor();
      setSetupData(setup);
      setShowSetup(true);
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      toast.error('Có lỗi khi thiết lập 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySetup = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Vui lòng nhập mã 6 số');
      return;
    }

    try {
      setLoading(true);
      await profileService.verifyTwoFactor({ code: verificationCode });
      toast.success('Kích hoạt 2FA thành công!');
      setShowSetup(false);
      setSetupData(null);
      setVerificationCode('');
      onProfileUpdate();
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      toast.error('Mã xác thực không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!disablePassword) {
      toast.error('Vui lòng nhập mật khẩu');
      return;
    }

    try {
      setLoading(true);
      await profileService.disableTwoFactor(disablePassword);
      toast.success('Đã tắt 2FA thành công');
      setShowDisable(false);
      setDisablePassword('');
      onProfileUpdate();
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast.error('Mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    try {
      setLoading(true);
      const codes = await profileService.regenerateBackupCodes();
      setNewBackupCodes(codes);
      toast.success('Đã tạo mã dự phòng mới');
    } catch (error) {
      console.error('Error regenerating backup codes:', error);
      toast.error('Có lỗi khi tạo mã dự phòng');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Đã sao chép');
  };

  const downloadBackupCodes = (codes: string[]) => {
    const content = `Mã dự phòng 2FA - Management App\nNgày tạo: ${new Date().toLocaleDateString('vi-VN')}\n\n${codes.join('\n')}\n\nGhi chú: Lưu các mã này ở nơi an toàn. Mỗi mã chỉ sử dụng được một lần.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-codes-${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Xác thực hai yếu tố (2FA)</span>
              </CardTitle>
              <CardDescription>
                Tăng cường bảo mật tài khoản với xác thực hai yếu tố
              </CardDescription>
            </div>
            <Badge variant={profile.twoFactorEnabled ? 'default' : 'secondary'}>
              {profile.twoFactorEnabled ? 'Đã bật' : 'Chưa bật'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              {profile.twoFactorEnabled ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              )}
              <div>
                <p className="font-medium">
                  {profile.twoFactorEnabled 
                    ? 'Xác thực hai yếu tố đã được kích hoạt'
                    : 'Xác thực hai yếu tố chưa được kích hoạt'
                  }
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {profile.twoFactorEnabled
                    ? 'Tài khoản của bạn được bảo vệ bởi xác thực hai yếu tố. Bạn sẽ cần nhập mã từ ứng dụng xác thực khi đăng nhập.'
                    : 'Kích hoạt 2FA để bảo vệ tài khoản khỏi truy cập trái phép, ngay cả khi mật khẩu bị lộ.'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!profile.twoFactorEnabled ? (
                <Button 
                  onClick={handleStartSetup} 
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Thiết lập 2FA</span>
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => setShowDisable(!showDisable)}
                    variant="destructive"
                    className="flex items-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Tắt 2FA</span>
                  </Button>
                  <Button 
                    onClick={handleRegenerateBackupCodes}
                    variant="outline"
                    disabled={loading}
                    className="flex items-center space-x-2"
                  >
                    <Key className="h-4 w-4" />
                    <span>Tạo mã dự phòng mới</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Setup 2FA */}
      {showSetup && setupData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="h-5 w-5" />
              <span>Thiết lập xác thực hai yếu tố</span>
            </CardTitle>
            <CardDescription>
              Quét mã QR với ứng dụng xác thực của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* QR Code */}
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <img 
                    src={setupData.qrCodeUrl} 
                    alt="QR Code for 2FA setup"
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-sm text-gray-600 text-center max-w-md">
                  Quét mã QR này bằng ứng dụng Google Authenticator, Authy, hoặc ứng dụng xác thực tương tự
                </p>
              </div>

              {/* Manual Entry */}
              <div className="bg-gray-50 rounded-lg p-4">
                <Label className="text-sm font-medium">Hoặc nhập thủ công:</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <code className="bg-white px-3 py-2 rounded border text-sm flex-1 font-mono">
                    {setupData.secretKey}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(setupData.secretKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Verification */}
              <div className="space-y-3">
                <Label htmlFor="verificationCode">Nhập mã xác thực (6 số)</Label>
                <div className="flex space-x-2">
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-lg tracking-widest"
                  />
                  <Button 
                    onClick={handleVerifySetup}
                    disabled={loading || verificationCode.length !== 6}
                  >
                    {loading ? 'Đang xác thực...' : 'Xác thực'}
                  </Button>
                </div>
              </div>

              {/* Backup Codes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Key className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-800">Mã dự phòng</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Lưu các mã sau ở nơi an toàn. Bạn có thể sử dụng chúng khi không có thiết bị xác thực:
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {setupData.backupCodes.map((code, index) => (
                        <code key={index} className="bg-white px-2 py-1 rounded text-sm">
                          {code}
                        </code>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3"
                      onClick={() => downloadBackupCodes(setupData.backupCodes)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Tải xuống
                    </Button>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={() => setShowSetup(false)}
                className="w-full"
              >
                Hủy thiết lập
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disable 2FA */}
      {showDisable && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <X className="h-5 w-5" />
              <span>Tắt xác thực hai yếu tố</span>
            </CardTitle>
            <CardDescription>
              Nhập mật khẩu để xác nhận tắt 2FA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Cảnh báo</p>
                    <p className="text-sm text-red-700 mt-1">
                      Tắt 2FA sẽ giảm độ bảo mật của tài khoản. Tài khoản sẽ chỉ được bảo vệ bởi mật khẩu.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="disablePassword">Mật khẩu hiện tại</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="disablePassword"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    className="pl-10"
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleDisable2FA}
                  disabled={loading || !disablePassword}
                  variant="destructive"
                >
                  {loading ? 'Đang tắt...' : 'Tắt 2FA'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDisable(false)}
                >
                  Hủy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Backup Codes */}
      {newBackupCodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>Mã dự phòng mới</span>
            </CardTitle>
            <CardDescription>
              Lưu các mã này ở nơi an toàn. Các mã cũ đã bị vô hiệu hóa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {newBackupCodes.map((code, index) => (
                  <code key={index} className="bg-gray-100 px-3 py-2 rounded text-sm">
                    {code}
                  </code>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadBackupCodes(newBackupCodes)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(newBackupCodes.join('\n'))}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Sao chép tất cả
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setNewBackupCodes([])}
                >
                  Đóng
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
