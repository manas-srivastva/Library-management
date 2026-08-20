import { useState } from "react";
import { toast } from "react-toastify";
import {
  Camera,
  Mail,
  Phone,
  Shield,
  User as UserIcon,
} from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

import { useAuthContext } from "@/context/AuthContext";
import { userApi } from "@/api/usersApi";

export default function ProfilePage() {
  const { user, refreshUser } = useAuthContext();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] =
    useState(false);

  if (!user) {
    return null;
  }

  const handleSave = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setIsSaving(true);

      await userApi.updateProfile({
        name: name.trim(),
        phone: phone.trim(),
      });

      await refreshUser();

      toast.success(
        "Profile updated successfully"
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "New password and confirm password do not match"
      );
      return;
    }

    if (newPassword.length < 8) {
      toast.error(
        "New password must be at least 8 characters"
      );
      return;
    }

    try {
      setIsChangingPassword(true);

      await userApi.changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success(
        "Password updated successfully"
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update password"
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Manage your personal information and preferences."
      />

      <div className="grid gap-4 lg:grid-cols-3">

        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <div className="relative h-24 rounded-t-2xl bg-gradient-to-r from-brand-500/20 to-accent-500/20" />

          <CardContent className="-mt-12 flex flex-col items-center text-center">

            <div className="relative">
              <Avatar
                name={user.name}
                src={user.profileImage}
                size="lg"
                className="border-4 border-bg-card"
              />

              <button
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-bg-elevated text-fg-muted hover:text-fg"
                aria-label="Change photo"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>

            <h3 className="mt-3 text-lg font-bold text-fg">
              {user.name}
            </h3>

            <p className="text-sm text-fg-muted">
              {user.email}
            </p>

            <div className="mt-2">
              <Badge
                tone="brand"
                className="capitalize"
              >
                {user.role.toLowerCase()}
              </Badge>
            </div>

            <div className="mt-5 grid w-full grid-cols-3 gap-2">
              <Stat
                label="Borrowed"
                value={0}
              />

              <Stat
                label="Reserved"
                value={0}
              />

              <Stat
                label="Fines"
                value="$0"
              />
            </div>

            <p className="mt-4 text-xs text-fg-subtle">
              Library member
            </p>

          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2">

          <CardHeader>
            <CardTitle>
              Personal Information
            </CardTitle>
          </CardHeader>

          <CardContent>

            <form
              className="space-y-4"
              onSubmit={handleSave}
            >

              <div className="grid gap-4 sm:grid-cols-2">

                <Field
                  label="Full name"
                  icon={UserIcon}
                >
                  <input
                    className="input-base pl-9"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                  />
                </Field>

                <Field
                  label="Email"
                  icon={Mail}
                >
                  <input
                    className="input-base pl-9"
                    type="email"
                    value={user.email}
                    disabled
                  />
                </Field>

                <Field
                  label="Phone"
                  icon={Phone}
                >
                  <input
                    className="input-base pl-9"
                    placeholder="+91 XXXXX XXXXX"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                  />
                </Field>

              </div>

              <div className="flex justify-end gap-2.5">

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setName(user.name);
                    setPhone(user.phone || "");
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving
                    ? "Saving..."
                    : "Save changes"}
                </Button>

              </div>

            </form>

          </CardContent>
        </Card>

      </div>

      {/* Security */}
      <Card className="mt-6">

        <CardHeader>
          <CardTitle>
            Security
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <Field
            label="Current password"
            icon={Shield}
          >
            <input
              type="password"
              className="input-base pl-9"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">

            <Field
              label="New password"
              icon={Shield}
            >
              <input
                type="password"
                className="input-base pl-9"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
              />
            </Field>

            <Field
              label="Confirm new password"
              icon={Shield}
            >
              <input
                type="password"
                className="input-base pl-9"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />
            </Field>

          </div>

          <div className="flex justify-end">

            <Button
              variant="secondary"
              onClick={handlePasswordUpdate}
              disabled={isChangingPassword}
            >
              {isChangingPassword
                ? "Updating..."
                : "Update password"}
            </Button>

          </div>

        </CardContent>
      </Card>

    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-border-soft bg-bg-soft px-2 py-3">

      <p className="text-lg font-bold text-fg">
        {value}
      </p>

      <p className="text-xs text-fg-subtle">
        {label}
      </p>

    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: typeof UserIcon;
  children: React.ReactNode;
}) {
  return (
    <div>

      <label className="mb-1.5 block text-sm font-medium text-fg">
        {label}
      </label>

      <div className="relative">

        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />

        {children}

      </div>

    </div>
  );
}