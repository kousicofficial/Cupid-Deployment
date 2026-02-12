import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";



/* BACKEND */
const API = "http://127.0.0.1:4000";

export default function Love() {
  const { id } = useParams();

  /* STATES */
  const [data, setData] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  const { width, height } = useWindowSize();

  /* =====================
     FETCH DATA
  ===================== */
  useEffect(() => {
    axios
      .get(`${API}/api/love/${id}`)
      .then((res) => {
        setData(res.data);

        if (!res.data.password) {
          setAuthorized(true);
        }
      })
      .catch(() => {
        alert("Love Page Not Found ❌");
      });
  }, [id]);

  /* =====================
     PASSWORD CHECK
  ===================== */
  useEffect(() => {
    if (data && data.password && !authorized) {
      const pass = prompt("Enter Secret Code 💖");

      if (pass === data.password) {
        setAuthorized(true);
      } else {
        alert("Wrong Password ❌");
      }
    }
  }, [data, authorized]);

  /* =====================
     FLOATING HEARTS
  ===================== */
  useEffect(() => {
    const interval = setInterval(() => {
      const heart = document.createElement("div");

      heart.className = "heart-float";
      heart.innerText = "💖";

      heart.style.left = Math.random() * 100 + "vw";
      heart.style.fontSize = Math.random() * 20 + 15 + "px";

      document.body.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 6000);
    }, 700);

    return () => clearInterval(interval);
  }, []);

  /* =====================
     LOADING / SECURITY
  ===================== */
  if (!data) return <h2>Loading...</h2>;
  if (!authorized) return <h2>Access Denied 🔒</h2>;

  /* =====================
     UI
  ===================== */
  return (
    <div className="love-wrapper">
      <Confetti width={width} height={height} numberOfPieces={200} />

      {/* PHOTO */}
      <motion.img
        src={`${API}/uploads/${data.photo}`}
        className="love-photo"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* NAME */}
      <motion.h1
        className="love-name"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        💖 I Love You {data.name}
      </motion.h1>

      {/* MESSAGE */}
      <motion.p
        className="love-message"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {data.message}
      </motion.p>

      {/* MUSIC */}
      {data.songs && data.songs.length > 0 && (
        <motion.div
          className="love-music"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <h3>🎵 Our Love Sounds Like</h3>

          {data.songs.map((s, i) => (
            <audio
              key={i}
              controls
              autoPlay={i === 0}
              src={`${API}/uploads/${s}`}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
