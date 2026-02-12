import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

export default function Success() {
  const { id } = useParams();

  // Auto detect current site (5173 / deployed domain)
  const link = `${window.location.origin}/love/${id}`;

  // Romantic WhatsApp message
  const message = `
💖 Hey My Love 😘

I made something special for you 💝  
Just for us ✨

Open this surprise 👇  
${link}

Always Yours ❤️💫
  `;

  // Encode for URL
  const whatsappURL = `https://wa.me/?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div
      style={{
        textAlign: "center",
        padding: "30px",
        color: "white",
      }}
      className="container"
    >
      <h1>💘 Love Page Created</h1>

      {/* QR CODE */}
      <QRCodeCanvas value={link} size={180} />

      <p>Scan to Open 💖</p>

      {/* LINK BOX */}
      <input
        value={link}
        readOnly
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "10px",
          marginBottom: "15px",
        }}
      />

      {/* OPEN */}
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        style={{ display: "block", marginBottom: "15px" }}
      >
        🔗 Open Page
      </a>

      {/* WHATSAPP BUTTON */}
      <a
        href={whatsappURL}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-block",
          background: "#25D366",
          color: "white",
          padding: "12px 25px",
          borderRadius: "30px",
          fontWeight: "600",
          textDecoration: "none",
          fontSize: "16px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
        }}
      >
        💬 Share on WhatsApp
      </a>
    </div>
  );
}
