const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Konfigurasi penyimpanan file upload sementara
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint upload dan kompresi gambar
app.post('/api/compress', upload.single('image'), async (req, res) => {
  try {
    const { quality } = req.body;
    const imgBuffer = req.file.buffer;
    const ext = path.extname(req.file.originalname).toLowerCase();

    let compressedBuffer;
    if (ext === '.png') {
      compressedBuffer = await sharp(imgBuffer)
        .png({ quality: parseInt(quality) || 70, compressionLevel: 9 })
        .toBuffer();
    } else {
      compressedBuffer = await sharp(imgBuffer)
        .jpeg({ quality: parseInt(quality) || 70 })
        .toBuffer();
    }

    res.set('Content-Type', req.file.mimetype);
    res.send(compressedBuffer);
  } catch (err) {
    res.status(500).json({ error: 'Gagal kompres gambar', detail: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server berjalan di http://0.0.0.0:${PORT}`);
}); 