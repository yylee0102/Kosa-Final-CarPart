// src/components/ImageComponent.tsx (새 파일)

import React, { useState, useEffect } from 'react';
import UserApiService from '@/services/user.api'; // API 서비스

interface Props {
  fileKey: string;
  alt: string;
  className?: string;
}

export const ImageComponent = ({ fileKey, alt, className }: Props) => {
  const [imageUrl, setImageUrl] = useState<string>('/placeholder.svg'); // 기본 이미지

  useEffect(() => {
    const fetchUrl = async () => {
      if (fileKey) {
        try {
          // ✅ 새로 만든 API를 호출해서 실제 이미지 URL을 가져옵니다.
          const presignedUrl = await UserApiService.getPresignedUrl(fileKey);
          setImageUrl(presignedUrl);
        } catch (error) {
          console.error("이미지 URL 로딩 실패:", error);
          // 에러 발생 시 기본 이미지를 그대로 사용
        }
      }
    };

    fetchUrl();
  }, [fileKey]);

  return <img src={imageUrl} alt={alt} className={className} />;
};