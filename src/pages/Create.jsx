import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* =====================
   AUTO API DETECT
===================== */
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Create() {
  /* =====================
     LOAD SAVED DATA
  ===================== */
  const saved = JSON.parse(localStorage.getItem("cupidForm")) || {};

  /* FORM */
  const [name, setName] = useState(saved.name || "");
  const [message, setMessage] = useState(saved.message || "");
  const [password, setPassword] = useState(saved.password || "");

  /* MEDIA */
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(
    saved.photoPreview || null
  );

  const [songs, setSongs] = useState([]);

  /* THEME */
  const [darkMode, setDarkMode] = useState(false);

  const nav = useNavigate();

  /* =====================
     AUTO SAVE FORM
  ===================== */
  useEffect(() => {
    localStorage.setItem(
      "cupidForm",
      JSON.stringify({
        name,
        message,
        password,
        photoPreview,
      })
    );
  }, [name, message, password, photoPreview]);

  /* DARK MODE */
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  /* =====================
     PHOTO
  ===================== */
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  /* =====================
     SONGS
  ===================== */
  const handleSongs = (e) => {
    setSongs([...e.target.files]);
  };

  const removeSong = (index) => {
    setSongs(songs.filter((_, i) => i !== index));
  };

  /* =====================
     SUBMIT
  ===================== */
  const submit = async (e) => {
    e.preventDefault();

    try {
      if (!photo) {
        alert("Upload photo first 📸");
        return;
      }

      const data = new FormData();

      data.append("name", name);
      data.append("message", message);
      data.append("password", password);
      data.append("photo", photo);

      songs.forEach((s) => data.append("songs", s));

      const res = await axios.post(`${API}/api/create`, data);

      /* Save last ID */
      localStorage.setItem("cupidLastId", res.data.id);

      /* Clear form cache */
      localStorage.removeItem("cupidForm");

      nav(`/success/${res.data.id}`);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);

      alert(
        err?.response?.data?.message ||
          "Upload Failed ❌ Check server"
      );
    }
  };

  /* =====================
     UI
  ===================== */
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="container"
    >
      <h1>💘 CUPID</h1>

      {/* THEME */}
      <button
        type="button"
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "☀ Light" : "🌙 Dark"}
      </button>

      <form onSubmit={submit}>
        {/* NAME */}
        <input
          placeholder="Loved One Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* MESSAGE */}
        <textarea
          placeholder="Your Love Message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Secret Password (Optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* PHOTO */}
        <label>📸 Upload Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhoto}
        />

        {photoPreview && (
          <div className="preview-box">
            <img
              src={photoPreview}
              className="preview-img"
              alt="preview"
            />

            <button
              type="button"
              className="remove-btn"
              onClick={removePhoto}
            >
              Remove ❌
            </button>
          </div>
        )}

        {/* SONGS */}
        <label>🎵 Upload Songs</label>
        <input
          type="file"
          accept="audio/*"
          multiple
          onChange={handleSongs}
        />

        {songs.length > 0 && (
          <div className="preview-box">
            <h4>🎶 Selected Songs</h4>

            {songs.map((s, i) => (
              <div key={i} className="list-row">
                <span>▶ {s.name}</span>

                <button
                  type="button"
                  onClick={() => removeSong(i)}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}

        {/* PREVIEW */}
        {(name || message) && (
          <div className="preview-box">
            <h4>💖 Preview</h4>

            <p>
              <b>Name:</b> {name}
            </p>
            <p>
              <b>Message:</b> {message}
            </p>
          </div>
        )}

        <button>Create Love Page ❤️</button>
      </form>
    </motion.div>
  );
}
