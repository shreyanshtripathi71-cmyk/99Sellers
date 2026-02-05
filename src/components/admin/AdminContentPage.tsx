"use client";

import React, { useState, useEffect, useRef } from "react";
import { adminAPI } from "@/services/api";

interface HeroImage {
    id: number;
    url: string;
    title: string;
    subtitle: string;
    order: number;
}

interface HeroText {
    title: string;
    subtitle: string;
    cta_primary: string;
    cta_secondary: string;
}

const AdminContentPage: React.FC = () => {
    const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
    const [heroText, setHeroText] = useState<HeroText>({
        title: '',
        subtitle: '',
        cta_primary: 'Get Started Free',
        cta_secondary: 'See How It Works'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        setLoading(true);
        try {
            // Load hero images
            const imagesResult = await adminAPI.content.get('hero_images');
            if (imagesResult.success && imagesResult.data?.value) {
                setHeroImages(imagesResult.data.value);
            }

            // Load hero text
            const textResult = await adminAPI.content.get('hero_text');
            if (textResult.success && textResult.data?.value) {
                setHeroText(textResult.data.value);
            }
        } catch (error) {
            console.error('Failed to load content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const result = await adminAPI.content.uploadImage(formData);
            if (result.success && result.data) {
                const newImage: HeroImage = {
                    id: Date.now(),
                    url: result.data.url,
                    title: 'New Slide',
                    subtitle: 'Add your subtitle here',
                    order: heroImages.length + 1
                };
                const updated = [...heroImages, newImage];
                setHeroImages(updated);
                await saveHeroImages(updated);
                showMessage('success', 'Image uploaded successfully!');
            }
        } catch (error) {
            showMessage('error', 'Failed to upload image');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const saveHeroImages = async (images: HeroImage[]) => {
        const result = await adminAPI.content.update('hero_images', images, 'json');
        return result.success;
    };

    const handleRemoveImage = async (id: number) => {
        const updated = heroImages.filter(img => img.id !== id);
        setHeroImages(updated);
        await saveHeroImages(updated);
        showMessage('success', 'Image removed');
    };

    const handleImageTextChange = async (id: number, field: 'title' | 'subtitle', value: string) => {
        const updated = heroImages.map(img =>
            img.id === id ? { ...img, [field]: value } : img
        );
        setHeroImages(updated);
    };

    const handleSaveHeroImages = async () => {
        setSaving(true);
        try {
            await saveHeroImages(heroImages);
            showMessage('success', 'Hero images saved!');
        } catch (error) {
            showMessage('error', 'Failed to save images');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveHeroText = async () => {
        setSaving(true);
        try {
            const result = await adminAPI.content.update('hero_text', heroText, 'json');
            if (result.success) {
                showMessage('success', 'Hero text saved!');
            }
        } catch (error) {
            showMessage('error', 'Failed to save text');
        } finally {
            setSaving(false);
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    if (loading) {
        return (
            <div style={{ padding: 32, textAlign: 'center' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 32 }}></i>
                <p>Loading content...</p>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>
                Site Content Management
            </h1>
            <p style={{ color: '#64748b', marginBottom: 32 }}>
                Manage hero images, text, and other site content
            </p>

            {message && (
                <div style={{
                    padding: '12px 16px',
                    borderRadius: 8,
                    marginBottom: 24,
                    background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: message.type === 'success' ? '#166534' : '#991b1b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                }}>
                    <i className={`fa-solid ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                    {message.text}
                </div>
            )}

            {/* Hero Images Section */}
            <div style={{
                background: '#fff',
                borderRadius: 12,
                padding: 24,
                marginBottom: 24,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a' }}>
                        <i className="fa-solid fa-images me-2" style={{ color: '#3b82f6' }}></i>
                        Hero Slider Images
                    </h2>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            style={{
                                padding: '8px 16px',
                                background: '#3b82f6',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                fontSize: 14,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}
                        >
                            <i className={`fa-solid ${uploading ? 'fa-spinner fa-spin' : 'fa-plus'}`}></i>
                            {uploading ? 'Uploading...' : 'Add Image'}
                        </button>
                        <button
                            onClick={handleSaveHeroImages}
                            disabled={saving}
                            style={{
                                padding: '8px 16px',
                                background: '#10b981',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                fontSize: 14,
                                cursor: 'pointer'
                            }}
                        >
                            <i className="fa-solid fa-save me-2"></i>
                            Save Changes
                        </button>
                    </div>
                </div>

                {heroImages.length === 0 ? (
                    <div style={{
                        padding: 40,
                        textAlign: 'center',
                        background: '#f8fafc',
                        borderRadius: 8,
                        border: '2px dashed #e2e8f0'
                    }}>
                        <i className="fa-solid fa-image" style={{ fontSize: 48, color: '#94a3b8', marginBottom: 16 }}></i>
                        <p style={{ color: '#64748b' }}>No hero images yet. Click &quot;Add Image&quot; to upload one.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                        {heroImages.map((image) => (
                            <div key={image.id} style={{
                                background: '#f8fafc',
                                borderRadius: 8,
                                overflow: 'hidden',
                                border: '1px solid #e2e8f0'
                            }}>
                                <div style={{
                                    height: 160,
                                    background: `url(${image.url.startsWith('/') ? 'http://localhost:3001' + image.url : image.url}) center/cover`,
                                    position: 'relative'
                                }}>
                                    <button
                                        onClick={() => handleRemoveImage(image.id)}
                                        style={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            width: 28,
                                            height: 28,
                                            background: 'rgba(239, 68, 68, 0.9)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '50%',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <i className="fa-solid fa-times"></i>
                                    </button>
                                </div>
                                <div style={{ padding: 12 }}>
                                    <input
                                        type="text"
                                        value={image.title}
                                        onChange={(e) => handleImageTextChange(image.id, 'title', e.target.value)}
                                        placeholder="Slide Title"
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: 6,
                                            marginBottom: 8,
                                            fontSize: 14
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={image.subtitle}
                                        onChange={(e) => handleImageTextChange(image.id, 'subtitle', e.target.value)}
                                        placeholder="Slide Subtitle"
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: 6,
                                            fontSize: 13,
                                            color: '#64748b'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Hero Text Section */}
            <div style={{
                background: '#fff',
                borderRadius: 12,
                padding: 24,
                marginBottom: 24,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a' }}>
                        <i className="fa-solid fa-font me-2" style={{ color: '#8b5cf6' }}></i>
                        Hero Text Content
                    </h2>
                    <button
                        onClick={handleSaveHeroText}
                        disabled={saving}
                        style={{
                            padding: '8px 16px',
                            background: '#10b981',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            fontSize: 14,
                            cursor: 'pointer'
                        }}
                    >
                        <i className="fa-solid fa-save me-2"></i>
                        Save Text
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                            Main Title
                        </label>
                        <input
                            type="text"
                            value={heroText.title}
                            onChange={(e) => setHeroText({ ...heroText, title: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: 6,
                                fontSize: 14
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                            Subtitle
                        </label>
                        <input
                            type="text"
                            value={heroText.subtitle}
                            onChange={(e) => setHeroText({ ...heroText, subtitle: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: 6,
                                fontSize: 14
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                            Primary CTA Button
                        </label>
                        <input
                            type="text"
                            value={heroText.cta_primary}
                            onChange={(e) => setHeroText({ ...heroText, cta_primary: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: 6,
                                fontSize: 14
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                            Secondary CTA Button
                        </label>
                        <input
                            type="text"
                            value={heroText.cta_secondary}
                            onChange={(e) => setHeroText({ ...heroText, cta_secondary: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: 6,
                                fontSize: 14
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminContentPage;
