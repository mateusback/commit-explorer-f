import React, { useState, useEffect } from 'react';
import md5 from 'md5';
import fallbackImage from '../assets/user.png'; 

const GRAVATAR_URL = 'https://www.gravatar.com/avatar/';

function getGravatarUrl(email) {
  if (!email) return null;
  const hash = md5(email.trim().toLowerCase());
  return `${GRAVATAR_URL}${hash}?s=128&d=404`;
}

export default function UserAvatar({ autor, className = 'w-10 h-10' }) {
  const [imageSrc, setImageSrc] = useState(fallbackImage);

  useEffect(() => {
    const customUrl = autor.avatarUrl || getGravatarUrl(autor.email);
    if (!customUrl) {
      setImageSrc(fallbackImage);
      return;
    }

    const img = new Image();
    img.src = customUrl;

    img.onload = () => {
      setImageSrc(customUrl);
    };

    img.onerror = () => {
      setImageSrc(fallbackImage);
    };
  }, [autor]);

  return (
    <img
      src={imageSrc}
      alt={`Avatar de ${autor.nome}`}
      className={`${className} rounded-full object-cover bg-stone-200`}
    />
  );
}
