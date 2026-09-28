"use client";

import React, { useState, useRef } from "react";
import {
  Mail,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  ImageUp,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import type { ResumeData, PersonalInfo } from "../../types/resume";
import ImageCropModal from "../common/ImageCropModal";
import ProfileImageDialog from "../common/ProfileImageDialog";
import Image from "next/image";

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: React.Dispatch<React.SetStateAction<ResumeData>>;
  imageSpace: boolean;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  data,
  onChange,
  imageSpace,
}) => {
  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    linkedin?: string;
  }>({});
  const [imgError, setImgError] = useState("");
  const [imgSuccess, setImgSuccess] = useState("");
  const [rawImage, setRawImage] = useState<string | null>(null);

  const [showImageDialog, setShowImageDialog] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof PersonalInfo, value: string) => {
    const newErrors = { ...errors };

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      newErrors.email =
        value && !emailRegex.test(value)
          ? "Invalid email address format"
          : undefined;
    }

    if (field === "phone") {
      const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/;
      newErrors.phone =
        value && !phoneRegex.test(value) ? "Invalid phone format" : undefined;
    }

    if (field === "linkedin") {
      const isLinkedinUrl =
        value.startsWith("linkedin.com") ||
        value.startsWith("https://linkedin.com") ||
        value.startsWith("https://www.linkedin.com");
      newErrors.linkedin =
        value && !isLinkedinUrl
          ? "Must start with linkedin.com or https://linkedin.com"
          : undefined;
    }

    setErrors(newErrors);

    onChange((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImgError("");
    setImgSuccess("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setImgError("Only JPG, PNG, and WebP are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setRawImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleCropConfirm = (croppedDataUrl: string) => {
    setRawImage(null);

    const MAX_FILE_SIZE = 100 * 1024;
    const approxSize = Math.round((croppedDataUrl.length * 3) / 4);

    if (approxSize > MAX_FILE_SIZE) {
      const img = document.createElement("img") as HTMLImageElement;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 300, 300);
        const smaller = canvas.toDataURL("image/webp", 0.7);
        onChange((prev) => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, profilePhoto: smaller },
        }));
        setImgSuccess(
          `Photo compressed to ${Math.round((smaller.length * 3) / 4 / 1024)} KB ✓`,
        );
      };
      img.src = croppedDataUrl;
      return;
    }

    onChange((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, profilePhoto: croppedDataUrl },
    }));
    setImgSuccess(`Photo uploaded: ${Math.round(approxSize / 1024)} KB ✓`);
  };

  const handleDeleteImage = () => {
    setImgError("");
    setImgSuccess("Photo removed.");
    onChange((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, profilePhoto: "" },
    }));
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <div>
        <h2 className="text-base font-bold text-slate-800">
          Personal Information
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Provide your basic identity and contact profiles
        </p>
      </div>

      {imageSpace ? (
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <div className="relative w-16 h-16 shrink-0">
            <div
              className={`w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center ${
                data.profilePhoto
                  ? "cursor-pointer hover:opacity-90 transition"
                  : ""
              }`}
              onClick={() => {
                if (data.profilePhoto) {
                  setShowImageDialog(true);
                }
              }}
            >
              {" "}
              {data.profilePhoto ? (
                <Image
                  width={64}
                  height={64}
                  src={data.profilePhoto}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-slate-400" />
              )}
            </div>

            <button
              type="button"
              title="Change photo"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-700 border-2 border-white shadow-sm flex items-center justify-center cursor-pointer transition-colors"
            >
              <ImageUp className="w-3 h-3 text-white" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />

            {rawImage && (
              <ImageCropModal
                imageSrc={rawImage}
                onCancel={() => setRawImage(null)}
                onConfirm={handleCropConfirm}
              />
            )}
            <ProfileImageDialog
              open={showImageDialog}
              image={data.profilePhoto}
              onClose={() => setShowImageDialog(false)}
              onChangePhoto={() => fileInputRef.current?.click()}
              onDeletePhoto={handleDeleteImage}
            />
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold text-slate-700 block">
              Profile Image
            </span>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5 mb-1">
              Click the photo to preview it. Use the camera icon to upload or
              replace it. (Max 400 KB).
            </span>
            {imgError && (
              <span className="text-[10px] flex items-center gap-1 text-red-500 font-semibold">
                <AlertCircle className="w-3 h-3" /> {imgError}
              </span>
            )}
            {imgSuccess && (
              <span className="text-[10px] flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> {imgSuccess}
              </span>
            )}
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="space-y-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoComplete="name"
              maxLength={30}
              value={data.fullName}
              onChange={(e) =>
                handleInputChange(
                  "fullName",
                  e.target.value.replace(/[^a-zA-w\s.]/g, ""),
                )
              }
              placeholder="e.g. Abdullah Afzal"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Job Title
          </label>
          <input
            type="text"
            maxLength={50}
            value={data.jobTitle}
            onChange={(e) => handleInputChange("jobTitle", e.target.value)}
            placeholder="e.g. MERN Stack Developer"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                maxLength={254}
                value={data.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="name@domain.com"
                className={`w-full pl-10 pr-4 py-2 bg-slate-50 border ${errors.email ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-500"} focus:bg-white rounded-xl text-xs font-medium outline-none transition-all`}
              />
            </div>
            {errors.email && (
              <span className="text-[10px] text-red-500 font-semibold mt-1 block">
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                inputMode="tel"
                minLength={9}
                maxLength={12}
                value={data.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+92 300 1234567"
                className={`w-full pl-10 pr-4 py-2 bg-slate-50 border ${errors.phone ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-500"} focus:bg-white rounded-xl text-xs font-medium outline-none transition-all`}
              />
            </div>
            {errors.phone && (
              <span className="text-[10px] text-red-500 font-semibold mt-1 block">
                {errors.phone}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoComplete="street-address"
              maxLength={150}
              value={data.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Faisalabad, Pakistan"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            LinkedIn URL
          </label>
          <div className="relative">
            <FaLinkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="url"
              maxLength={200}
              value={data.linkedin}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
              placeholder="linkedin.com/in/username"
              className={`w-full pl-10 pr-4 py-2 bg-slate-50 border ${errors.linkedin ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-500"} focus:bg-white rounded-xl text-xs font-medium outline-none transition-all`}
            />
          </div>
          {errors.linkedin && (
            <span className="text-[10px] text-red-500 font-semibold mt-1 block">
              {errors.linkedin}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
