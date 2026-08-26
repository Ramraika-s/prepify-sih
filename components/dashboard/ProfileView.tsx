"use client";

import { useState, useTransition, useOptimistic, useRef } from "react";
import { motion } from "framer-motion";
import { updateProfileDetails, updatePassword } from "@/app/actions/profile";
import { deleteAccountAction } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { 
  User, Mail, Camera, Shield, AlertTriangle, Key, 
  Trash2, Save, Loader2, UploadCloud, GraduationCap, Users, BookOpen
} from "lucide-react";
import Image from "next/image";

type ProfileViewProps = {
  user: {
    id: string;
    email?: string;
    role: string;
    user_metadata: any;
  };
};

export function ProfileView({ user }: ProfileViewProps) {
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Optimistic UI state
  const [optimisticUser, setOptimisticUser] = useOptimistic(
    user.user_metadata,
    (state, newMetadata: any) => ({ ...state, ...newMetadata })
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordPending, startPasswordTransition] = useTransition();

  const handleProfileUpdate = (formData: FormData) => {
    setErrorMsg("");
    setSuccessMsg("");

    const updates = {
      full_name: formData.get("full_name") as string,
      target_exam: formData.get("target_exam") as string,
      institute_name: formData.get("institute_name") as string,
      batch_size: formData.get("batch_size") as string,
      specialty: formData.get("specialty") as string,
    };

    // Clean up empty fields
    const cleanedUpdates = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v != null));

    startTransition(async () => {
      setOptimisticUser(cleanedUpdates);
      const res = await updateProfileDetails(cleanedUpdates);
      if (!res.success) {
        setErrorMsg(res.error || "Failed to update profile.");
      } else {
        setSuccessMsg("Profile updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    });
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setErrorMsg("");
      setSuccessMsg("");

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.png`; // deterministic overwrite

      const supabase = createClient();
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      // Add a cache buster so Next Image updates instantly
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

      startTransition(async () => {
        setOptimisticUser({ avatar_url: publicUrl });
        const res = await updateProfileDetails({ avatar_url: publicUrl });
        if (!res.success) {
          setErrorMsg("Failed to save avatar URL to profile.");
        } else {
          setSuccessMsg("Profile picture updated!");
          setTimeout(() => setSuccessMsg(""), 3000);
        }
      });
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    startPasswordTransition(async () => {
      const res = await updatePassword({ password });
      if (!res.success) {
        setErrorMsg(res.error || "Failed to update password.");
      } else {
        setSuccessMsg("Password updated successfully!");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div>
        <h1 className="text-3xl font-bold font-heading text-white">Profile Settings</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage your account details and security preferences.</p>
      </div>

      {(errorMsg || successMsg) && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
            errorMsg 
              ? 'bg-red-500/10 border-red-500/20 text-red-400' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}
        >
          {errorMsg ? <AlertTriangle className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
          <span>{errorMsg || successMsg}</span>
        </motion.div>
      )}

      {/* Basic Info Section */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-zinc-400" />
          Basic Information
        </h2>

        <div className="flex flex-col sm:flex-row gap-8 items-start">
          
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border border-white/20 bg-zinc-900 overflow-hidden relative">
                {optimisticUser.avatar_url ? (
                  <Image 
                    src={optimisticUser.avatar_url} 
                    alt="Profile Avatar"
                    fill
                    className="object-cover"
                    unoptimized // if next config remotePatterns isn't picking it up immediately
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-600 bg-zinc-950">
                    <User className="w-12 h-12" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  {uploading ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <>
                      <UploadCloud className="w-6 h-6 text-white mb-1" />
                      <span className="text-[10px] text-white font-medium uppercase tracking-wider">Upload</span>
                    </>
                  )}
                </div>
              </div>
              <input 
                type="file" 
                accept="image/*"
                className="hidden" 
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </div>
            <p className="text-xs text-zinc-500 max-w-[120px] text-center">
              Recommended: 256x256px JPG or PNG.
            </p>
          </div>

          {/* Form */}
          <form action={handleProfileUpdate} className="flex-1 w-full space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 ml-1">Full Name</label>
                <input
                  name="full_name"
                  defaultValue={optimisticUser.full_name || ""}
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 ml-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-500 cursor-not-allowed pl-10"
                  />
                  <Mail className="w-4 h-4 text-zinc-600 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-zinc-600 ml-1">Email address cannot be changed.</p>
              </div>

              {/* Role-Specific Fields */}
              {user.role === "student" && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 ml-1 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" /> Target Exam
                  </label>
                  <select
                    name="target_exam"
                    defaultValue={optimisticUser.target_exam || "JEE Main & Advanced 2026"}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all appearance-none"
                  >
                    <option value="JEE Main & Advanced 2026">JEE Main & Advanced 2026</option>
                    <option value="NEET-UG 2026">NEET-UG 2026</option>
                    <option value="GATE Computer Science (CS)">GATE Computer Science (CS)</option>
                  </select>
                </div>
              )}

              {user.role === "institute" && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 ml-1 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Institute Name
                    </label>
                    <input
                      name="institute_name"
                      defaultValue={optimisticUser.institute_name || ""}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 ml-1 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Batch Size
                    </label>
                    <select
                      name="batch_size"
                      defaultValue={optimisticUser.batch_size || "100–500 Students"}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all appearance-none"
                    >
                      <option value="100–500 Students">100–500 Students</option>
                      <option value="500–2,500 Students">500–2,500 Students</option>
                      <option value="2,500+ Students">2,500+ Students (Multi-center)</option>
                    </select>
                  </div>
                </>
              )}

              {user.role === "mentor" && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 ml-1 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Specialty
                  </label>
                  <select
                    name="specialty"
                    defaultValue={optimisticUser.specialty || "Physics"}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all appearance-none"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </form>

        </div>
      </section>

      {/* Security Section */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
          <Key className="w-5 h-5 text-zinc-400" />
          Security
        </h2>

        <form onSubmit={handlePasswordUpdate} className="space-y-5 max-w-md">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 ml-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 ml-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPasswordPending || !password}
              className="bg-zinc-800 text-white border border-zinc-700 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isPasswordPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Password
            </button>
          </div>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-red-400 flex items-center gap-2 mb-2">
              <Trash2 className="w-5 h-5" />
              Delete Account
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl">
              Permanently delete your Prepify account, all associated data, test attempts, and subscriptions. This action cannot be undone.
            </p>
          </div>
          <form action={deleteAccountAction}>
            <button
              type="submit"
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 px-6 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap"
              onClick={(e) => {
                if (!window.confirm("Are you absolutely sure you want to permanently delete your account? This cannot be undone.")) {
                  e.preventDefault();
                }
              }}
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </form>
        </div>
      </section>
      
      {/* Spacer for bottom navigation if any */}
      <div className="h-8" />
    </div>
  );
}
