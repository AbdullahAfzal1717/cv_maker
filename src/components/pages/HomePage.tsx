"use client";

import React, { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Home/Navbar";
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
import HowItWorks from "@/components/Home/HowItWorks";
import CallToAction from "@/components/Home/CallToAction";
import FAQSection from "@/components/Home/FAQSection";
import Footer from "@/components/Home/Footer";
import ProfilePickerModal from "@/components/common/ProfilePickerModal";

const HomePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showPickerModal, setShowPickerModal] = useState(false);

  const handleActionClick = useCallback(
    (targetPath: string) => {
      router.push(targetPath);
    },
    [router],
  );

  const handleCreateManually = useCallback(() => {
    setShowPickerModal(true);
  }, []);

  const handleCreateWithAI = useCallback(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    router.push("/ai-chat");
  }, [user, router]);

  const handleClosePicker = useCallback(() => setShowPickerModal(false), []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none text-slate-700">
      {showPickerModal && <ProfilePickerModal onClose={handleClosePicker} />}
      <Navbar user={user} signOut={signOut} onAction={handleActionClick} />
      <Hero
        onCreateManually={handleCreateManually}
        onCreateWithAI={handleCreateWithAI}
      />
      <Features />
      <HowItWorks onAction={handleActionClick} />
      <CallToAction onAction={handleActionClick} />
      <FAQSection />
      <Footer onAction={handleActionClick} />
    </div>
  );
};

export default HomePage;
