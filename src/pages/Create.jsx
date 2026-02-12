import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API = "http://127.0.0.1:4000";

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
  const [photoPreview, setPhotoPreview] = useState(saved.photoPreview || null);
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

  /* PHOTO */
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

  /* SONGS */
  const handleSongs = (e) => {
    setSongs([...e.target.files]);
  };

  /* SUBMIT */
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

      // Save ID for success page
      localStorage.setItem("cupidLastId", res.data.id);

      // OPTIONAL: Clear form after success
      localStorage.removeItem("cupidForm");

      nav(`/success/${res.data.id}`);
    } catch (err) {
      alert("Upload Failed ❌");
    }
  };

  /* UI */
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="container"
    >
      <h1>💘 CUPID</h1>

      <form onSubmit={submit}>
        <input
          placeholder="Loved One Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Your Love Message"
          value={message}
          required
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          type="password"
          placeholder="Secret Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>📸 Upload Photo</label>
        <input type="file" accept="image/*" onChange={handlePhoto} />

        {photoPreview && (
          <img src={photoPreview} className="preview-img" />
        )}

        {/* SONGS */}
        <label>🎵 Upload Songs</label>
        <input
          type="file"
          name="songs"
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
                <button type="button" onClick={() => removeSong(i)}>
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
            <p><b>Name:</b> {name}</p>
            <p><b>Message:</b> {message}</p>
          </div>
        )}

        <button>Create Love Page ❤️</button>
      </form>
    </motion.div>
  );
}
