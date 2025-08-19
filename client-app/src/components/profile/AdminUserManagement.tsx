'use client';

import { useState, useEffect } from 'react';
import { profileService, AdminUserManagementDto } from '@/services/profileService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Users, Search, UserCheck, UserX, Shield, User, Crown } from 'lucide-react';

interface AdminUserManagementProps {
  currentUserId: string;
}

export function AdminUserManagement({ currentUserId }: AdminUserManagementProps) {
  const [users, setUsers] = useState<AdminUserManagementDto[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUserManagementDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await profileService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.isActive : !user.isActive
      );
    }

    setFilteredUsers(filtered);
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (userId === currentUserId) {
      toast.error('Không thể thay đổi vai trò của chính mình');
      return;
    }

    try {
      await profileService.updateUserRole(userId, newRole);
      toast.success('Cập nhật vai trò thành công');
      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Có lỗi khi cập nhật vai trò');
    }
  };

  const handleToggleStatus = async (userId: string) => {
    if (userId === currentUserId) {
      toast.error('Không thể thay đổi trạng thái của chính mình');
      return;
    }

    try {
      await profileService.toggleUserStatus(userId);
      toast.success('Cập nhật trạng thái thành công');
      loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Có lỗi khi cập nhật trạng thái');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <Crown className="h-4 w-4" />;
      case 'Moderator':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'destructive';
      case 'Moderator':
        return 'default';
      default:
        return 'secondary';
    }
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
                <Users className="h-5 w-5" />
                <span>Quản lý người dùng</span>
              </CardTitle>
              <CardDescription>
                Quản lý vai trò và trạng thái của người dùng trong hệ thống
              </CardDescription>
            </div>
            <Badge variant="outline">
              {filteredUsers.length} / {users.length} người dùng
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Tìm theo tên, email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Vai trò</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Moderator">Moderator</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Bị khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Không tìm thấy người dùng nào</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <Card key={user.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-2 rounded-full">
                          {getRoleIcon(user.role)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{user.fullName || user.username}</h3>
                            {user.id === currentUserId && (
                              <Badge variant="outline" className="text-xs">Bạn</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            Tạo: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                            {user.lastLoginAt && (
                              <> • Đăng nhập: {new Date(user.lastLoginAt).toLocaleDateString('vi-VN')}</>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {/* Status Badge */}
                        <Badge variant={user.isActive ? 'default' : 'destructive'}>
                          {user.isActive ? 'Hoạt động' : 'Bị khóa'}
                        </Badge>

                        {/* Role Badge */}
                        <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center space-x-1">
                          {getRoleIcon(user.role)}
                          <span>{user.role}</span>
                        </Badge>

                        {/* Actions */}
                        {user.id !== currentUserId && (
                          <div className="flex items-center space-x-2">
                            {/* Role Update */}
                            <Select
                              value={user.role}
                              onValueChange={(newRole) => handleUpdateRole(user.id, newRole)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="User">User</SelectItem>
                                <SelectItem value="Moderator">Moderator</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>

                            {/* Status Toggle */}
                            <Button
                              size="sm"
                              variant={user.isActive ? "destructive" : "default"}
                              onClick={() => handleToggleStatus(user.id)}
                              className="flex items-center space-x-1"
                            >
                              {user.isActive ? (
                                <>
                                  <UserX className="h-4 w-4" />
                                  <span>Khóa</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4" />
                                  <span>Mở khóa</span>
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Tổng</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Admin</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === 'Admin').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Hoạt động</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserX className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Bị khóa</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => !u.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
