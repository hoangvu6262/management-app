"use client";

import { useState } from "react";
import {
  profileService,
  UserProfileDto,
  UpdateProfileDto,
} from "@/services/profileService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, X, Mail, User, CheckCircle, AlertCircle } from "lucide-react";

interface ProfileEditFormProps {
  profile: UserProfileDto;
  onProfileUpdate: () => void;
}

export function ProfileEditForm({
  profile,
  onProfileUpdate,
}: ProfileEditFormProps) {
  const [formData, setFormData] = useState<UpdateProfileDto>({
    fullName: profile.fullName,
    email: profile.email,
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      await profileService.updateProfile(formData);
      toast.success("Cập nhật thông tin thành công");
      setIsEditing(false);
      onProfileUpdate();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Có lỗi khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile.fullName,
      email: profile.email,
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Thông tin cá nhân</span>
            </CardTitle>
            <CardDescription>Cập nhật thông tin cơ bản của bạn</CardDescription>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Chỉnh sửa
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  className="text-sm lg:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email"
                    className="pl-10 text-sm lg:text-base"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? "Đang lưu..." : "Lưu thay đổi"}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center justify-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Hủy</span>
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm text-gray-500">Họ và tên</Label>
                <p className="font-medium text-sm lg:text-base">
                  {profile.fullName || "Chưa cập nhật"}
                </p>
              </div>

              <div>
                <Label className="text-sm text-gray-500">Email</Label>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-sm lg:text-base">
                    {profile.email}
                  </p>
                  {/* {profile.emailVerified ? (
                    <CheckCircle className="h-4 w-4 text-green-500" title="Email đã xác thực" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" title="Email chưa xác thực" />
                  )} */}
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-500">Tên đăng nhập</Label>
                <p className="font-medium text-sm lg:text-base">
                  {profile.username}
                </p>
              </div>

              <div>
                <Label className="text-sm text-gray-500">Vai trò</Label>
                <p className="font-medium text-sm lg:text-base">
                  {profile.role}
                </p>
              </div>
            </div>

            {formData.email !== profile.email && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Khi thay đổi email, bạn sẽ cần xác thực email mới để tiếp
                    tục sử dụng các tính năng đầy đủ.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
