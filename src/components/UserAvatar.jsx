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
  const [imageSrc, setImageSrc] = useState(autor.avatarUrl || getGravatarUrl(autor.email) || fallbackImage);

  useEffect(() => {
    setImageSrc(autor.avatarUrl || getGravatarUrl(autor.email) || fallbackImage);
  }, [autor]);

  const handleError = () => {
    if (imageSrc !== fallbackImage) {
      setImageSrc(fallbackImage);
    }
  };
  
  return (
    <img
      src={imageSrc}
      alt={`Avatar de ${autor.nome}`}
      className={`${className} rounded-full object-cover bg-stone-200`}
      onError={handleError}
    />
  );
}