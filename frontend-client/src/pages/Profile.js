import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error">Vous devez être connecté pour accéder à votre profil.</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Mon Profil</h2>
        <div className="profile-info">
          <div><strong>Nom :</strong> {user.nom}</div>
          <div><strong>Prénom :</strong> {user.prenom}</div>
          <div><strong>Email :</strong> {user.email}</div>
          <div><strong>Téléphone :</strong> {user.telephone}</div>
          <div><strong>Adresse :</strong> {user.adresse}</div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 