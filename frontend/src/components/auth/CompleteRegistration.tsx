/**
 * CompleteRegistration Component
 * Handles the intermediate registration flow after social login
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/i18n';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface CompleteRegistrationFormData {
  name: string;
  phone: string;
  nickname: string;
  linkedinUrl: string;
  profilePhoto: File | null;
  resume: File | null;
}

export default function CompleteRegistration() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { t } = useTranslation('common');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CompleteRegistrationFormData>({
    name: session?.user?.name || '',
    phone: '',
    nickname: '',
    linkedinUrl: '',
    profilePhoto: null,
    resume: null
  });
  const [previewImage, setPreviewImage] = useState<string | null>(session?.user?.image || null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    
    if (files) {
      if (name === 'profilePhoto') {
        const file = files[0];
        setFormData(prev => ({ ...prev, [name]: file }));
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (name === 'resume') {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error(t('auth.nameRequired'));
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error(t('auth.phoneRequired'));
      return false;
    }
    if (!formData.nickname.trim()) {
      toast.error(t('auth.nicknameRequired'));
      return false;
    }
    // Basic LinkedIn URL validation
    if (formData.linkedinUrl && !formData.linkedinUrl.includes('linkedin.com/')) {
      toast.error(t('auth.invalidLinkedInUrl'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      const response = await fetch('/api/auth/complete-registration', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // Update session with new user data
      await update();
      toast.success(t('auth.registrationCompleted'));
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(t('auth.registrationError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">{t('auth.completeRegistration')}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 mb-4">
            {previewImage ? (
              <Image
                src={previewImage}
                alt={t('auth.profilePhoto')}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-4xl text-gray-500">
                  {formData.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <Label htmlFor="profilePhoto" className="cursor-pointer text-indigo-600 hover:text-indigo-800">
            {t('auth.uploadPhoto')}
            <Input
              id="profilePhoto"
              name="profilePhoto"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange}
            />
          </Label>
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="name">{t('auth.name')}</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone">{t('auth.phone')}</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            className="mt-1"
            required
          />
        </div>

        {/* Nickname */}
        <div>
          <Label htmlFor="nickname">{t('auth.nickname')}</Label>
          <Input
            id="nickname"
            name="nickname"
            type="text"
            value={formData.nickname}
            onChange={handleInputChange}
            className="mt-1"
            required
          />
        </div>

        {/* LinkedIn URL */}
        <div>
          <Label htmlFor="linkedinUrl">{t('auth.linkedinUrl')}</Label>
          <Input
            id="linkedinUrl"
            name="linkedinUrl"
            type="url"
            value={formData.linkedinUrl}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="https://www.linkedin.com/in/your-profile"
          />
        </div>

        {/* Resume Upload */}
        <div>
          <Label htmlFor="resume">{t('auth.resume')}</Label>
          <Input
            id="resume"
            name="resume"
            type="file"
            accept=".pdf"
            onChange={handleInputChange}
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">{t('auth.resumeDescription')}</p>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t('common.loading') : t('common.submit')}
        </Button>
      </form>
    </div>
  );
} 