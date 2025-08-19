'use client';

import { useState, useEffect } from 'react';
import { profileService, UserProfileDto } from '@/services/profileService';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { User, Shield, Settings, Users, Lock } from 'lucide-react';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';
import { TwoFactorSettings } from '@/components/profile/TwoFactorSettings';
import { AdminUserManagement } from '@/components/profile/AdminUserManagement';
import { SystemConfiguration } from '@/components/profile/SystemConfiguration';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await profileService.getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = profile?.role === 'Admin';

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Lỗi</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Không thể tải thông tin hồ sơ cá nhân.</p>
            <Button onClick={() => router.push('/dashboard')} className="mt-4">
              Quay lại Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 sm:p-4 lg:p-6 space-y-4 lg:space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Quản lý thông tin cá nhân và cài đặt bảo mật</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={profile.isActive ? 'default' : 'destructive'}>
            {profile.isActive ? 'Hoạt động' : 'Bị khóa'}
          </Badge>
          <Badge variant="outline">{profile.role}</Badge>
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="bg-blue-100 p-3 rounded-full w-fit">
              <User className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg lg:text-xl">{profile.fullName || profile.username}</CardTitle>
              <CardDescription className="text-sm lg:text-base">{profile.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tên đăng nhập</p>
              <p className="font-medium text-sm lg:text-base">{profile.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày tạo</p>
              <p className="font-medium text-sm lg:text-base">{new Date(profile.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Đăng nhập lần cuối</p>
              <p className="font-medium text-sm lg:text-base">
                {profile.lastLoginAt 
                  ? new Date(profile.lastLoginAt).toLocaleDateString('vi-VN')
                  : 'Chưa đăng nhập'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 min-w-max">
            <TabsTrigger value="general" className="flex items-center space-x-1 lg:space-x-2 text-xs lg:text-sm px-2 lg:px-3">
              <User className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">Thông tin</span>
              <span className="sm:hidden">TT</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-1 lg:space-x-2 text-xs lg:text-sm px-2 lg:px-3">
              <Shield className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">Bảo mật</span>
              <span className="sm:hidden">BM</span>
            </TabsTrigger>
            <TabsTrigger value="2fa" className="flex items-center space-x-1 lg:space-x-2 text-xs lg:text-sm px-2 lg:px-3">
              <Lock className="h-3 w-3 lg:h-4 lg:w-4" />
              <span>2FA</span>
            </TabsTrigger>
            {isAdmin && (
              <>
                <TabsTrigger value="users" className="flex items-center space-x-1 lg:space-x-2 text-xs lg:text-sm px-2 lg:px-3">
                  <Users className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline">Quản lý User</span>
                  <span className="sm:hidden">QL</span>
                </TabsTrigger>
                <TabsTrigger value="system" className="flex items-center space-x-1 lg:space-x-2 text-xs lg:text-sm px-2 lg:px-3">
                  <Settings className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline">Hệ thống</span>
                  <span className="sm:hidden">HT</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>
        </div>

        <TabsContent value="general">
          <ProfileEditForm profile={profile} onProfileUpdate={loadProfile} />
        </TabsContent>

        <TabsContent value="security">
          <ChangePasswordForm />
        </TabsContent>

        <TabsContent value="2fa">
          <TwoFactorSettings profile={profile} onProfileUpdate={loadProfile} />
        </TabsContent>

        {isAdmin && (
          <>
            <TabsContent value="users">
              <AdminUserManagement currentUserId={profile.id} />
            </TabsContent>

            <TabsContent value="system">
              <SystemConfiguration />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
