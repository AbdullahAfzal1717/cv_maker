"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Home/Navbar";
import { authService } from "@/services/authService";
import { storage } from "@/utils/storage";
import ProfileImageDialog from "@/components/common/ProfileImageDialog";
import {
  Save,
  Loader2,
  Check,
  AlertCircle,
  User as UserIcon,
  Mail,
  ShieldCheck,
  BadgeCheck,
  ImageUp,
} from "lucide-react";
import ImageCropModal from "@/components/common/ImageCropModal";

const compressImage = (
  dataUrl: string,
  maxDim = 400,
  quality = 0.8,
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      if (width > height && width > maxDim) {
        height *= maxDim / width;
        width = maxDim;
      } else if (height > maxDim) {
        width *= maxDim / height;
        height = maxDim;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL("image/webp", quality));
    };
    img.src = dataUrl;
  });
};

const getInitials = (name: string) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ProfileManagementPage: React.FC = () => {
  const { user, updateUser, signOut } = useAuth();

  const [username, setUsername] = useState(user?.username || "");
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture || "",
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [imgError, setImgError] = useState("");
  const [imgSuccess, setImgSuccess] = useState("");
  const [rawImage, setRawImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const isDirty =
    username.trim() !== (user?.username || "") ||
    profilePicture !== (user?.profilePicture || "");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImgError("");
    setImgSuccess("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setImgError("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setRawImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleCropConfirm = async (croppedDataUrl: string) => {
    setRawImage(null);
    const compressed = await compressImage(croppedDataUrl);
    setProfilePicture(compressed);
    setImgSuccess("Photo ready — click Save Changes to apply.");
  };

  const handleDeleteImage = () => {
    setImgError("");
    setProfilePicture("");
    setImgSuccess("Photo removed — click Save Changes to apply.");
  };

  const handleSave = async () => {
    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = storage.getToken();
      if (!token) throw new Error("Not authenticated");

      const res = await authService.updateProfile(token, {
        username: username.trim(),
        profilePicture,
      });

      updateUser(res.user);
      setSuccess("Profile updated successfully!");
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setSuccess(""), 3500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to update profile.");
      } else {
        setError("Failed to update profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] flex flex-col font-sans select-none text-slate-700">
      <Navbar user={user} signOut={signOut} isInDashboard />

      <main className="grow px-4 sm:px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Account Settings
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Manage your profile details and how you appear across CV Maker.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8 flex flex-col items-center text-center lg:sticky lg:top-24">
              <div className="relative w-28 h-28">
                <div
                  className="w-28 h-28 rounded-full overflow-hidden bg-blue-50 border-4 border-white ring-1 ring-slate-200/80 shadow-md flex items-center justify-center cursor-pointer"
                  onClick={() => profilePicture && setShowImageDialog(true)}
                >
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">
                      {getInitials(user?.username || "")}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-full shadow-lg border-2 border-white hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Change picture"
                >
                  <ImageUp className="w-4 h-4" />
                </button>

                <ProfileImageDialog
                  open={showImageDialog}
                  image={profilePicture}
                  onClose={() => setShowImageDialog(false)}
                  onChangePhoto={() => fileInputRef.current?.click()}
                  onDeletePhoto={handleDeleteImage}
                />

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleImageUpload}
                />

                {rawImage && (
                  <ImageCropModal
                    imageSrc={rawImage}
                    onCancel={() => setRawImage(null)}
                    onConfirm={handleCropConfirm}
                  />
                )}
              </div>

              <h2 className="mt-4 text-base font-bold text-slate-800">
                {user?.username}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {user?.email}
              </p>

              <div className="w-full h-px bg-slate-100 my-6" />

              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  Account verified
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
                  <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
                  Free plan
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-6 font-semibold uppercase tracking-wider">
                Allowed: JPG, PNG, WebP
              </p>

              {imgError && (
                <span className="text-[10px] flex items-center gap-1 text-red-500 font-semibold mt-2">
                  <AlertCircle className="w-3 h-3" /> {imgError}
                </span>
              )}
              {imgSuccess && (
                <span className="text-[10px] flex items-center gap-1 text-emerald-600 font-semibold mt-2">
                  <Check className="w-3 h-3" /> {imgSuccess}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800">
                    Personal Information
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    This is how your name appears throughout the app.
                  </p>
                </div>

                <div className="p-8 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter new username"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-sm font-semibold text-slate-800 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 cursor-not-allowed"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5 font-medium ml-1">
                        Email cannot be changed.
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                      <Check className="w-4 h-4 shrink-0" /> {success}
                    </div>
                  )}
                </div>

                <div className="px-8 py-5 bg-slate-50/60 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={loading || !isDirty}
                    className="py-3 px-6 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800">Account</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Session and sign-out controls.
                  </p>
                </div>
                <div className="px-8 py-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Sign out of CV Maker
                    </p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      You&apos;ll need to sign in again to access your resumes.
                    </p>
                  </div>
                  <button
                    onClick={signOut}
                    className="py-2.5 px-5 bg-white border border-red-200 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 transition-all active:scale-[0.98] cursor-pointer shrink-0"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileManagementPage;
