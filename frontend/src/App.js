import React, { useState } from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [compressed, setCompressed] = useState(null);
  const [quality, setQuality] = useState(70);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setCompressed(null);
      setError('');
    }
  };

  const handleCompress = async () => {
    if (!image) return;
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('image', image);
    formData.append('quality', quality);
    try {
      const res = await fetch('http://192.168.1.37:5000/api/compress', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Gagal kompres gambar');
      const blob = await res.blob();
      setCompressed(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">Kompresi Gambar Online</h1>
      <div className="card">
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <div className="slider-row">
          <label>Kualitas: {quality}</label>
          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={e => setQuality(e.target.value)}
            disabled={!image}
          />
        </div>
        <button className="btn" onClick={handleCompress} disabled={!image || loading}>
          {loading ? 'Memproses...' : 'Kompres Gambar'}
        </button>
        {error && <div className="error">{error}</div>}
        <div className="preview-row">
          <div className="preview-col">
            <h3>Sebelum</h3>
            {preview && <img src={preview} alt="preview" className="preview-img" />}
          </div>
          <div className="preview-col">
            <h3>Sesudah</h3>
            {compressed && (
              <>
                <img src={compressed} alt="compressed" className="preview-img" />
                <a href={compressed} download="compressed-image.jpg" className="btn download-btn">Unduh</a>
              </>
            )}
          </div>
        </div>
      </div>
      <footer className="footer">&copy; 2024 Kompresi Gambar by Niko</footer>
    </div>
  );
}

export default App;
