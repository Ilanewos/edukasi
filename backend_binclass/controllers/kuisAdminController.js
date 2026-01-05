// controllers/kuisAdminController.js
const db = require("../config/db");

/* ================== KUIS ================== */

// Tambah kuis
exports.tambahKuis = async (req, res) => {
  try {
    const judul = (req.body.judul || "").trim();
    if (!judul) return res.status(400).json({ message: "Judul wajib diisi" });

    const [r] = await db.promise().query("INSERT INTO kuis (judul) VALUES (?)", [judul]);
    res.json({ message: "Kuis dibuat", id: r.insertId });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Ambil semua kuis
exports.getAllKuis = async (req, res) => {
  try {
    const [r] = await db.promise().query(
      "SELECT * FROM kuis WHERE is_active=1 ORDER BY created_at DESC"
    );
    res.json(r);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Ambil kuis per ID
exports.getKuisById = async (req, res) => {
  try {
    const [r] = await db.promise().query(
      "SELECT * FROM kuis WHERE id=? AND is_active=1",
      [req.params.id]
    );
    if (!r.length) return res.status(404).json({ message: "Kuis tidak ditemukan" });
    res.json(r[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Hapus kuis (soft delete)
exports.hapusKuis = async (req, res) => {
  try {
    await db.promise().query("UPDATE kuis SET is_active=0 WHERE id=?", [req.params.id]);
    res.json({ message: "Kuis dinonaktifkan" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ================== SOAL ================== */

// Tambah soal + opsi
exports.tambahSoal = async (req, res) => {
  try {
    const { kuis_id, pertanyaan, image_url, opsi } = req.body;

    if (!kuis_id) return res.status(400).json({ message: "kuis_id wajib" });
    if (!pertanyaan?.trim()) return res.status(400).json({ message: "Pertanyaan wajib" });
    if (!Array.isArray(opsi) || opsi.length < 2)
      return res.status(400).json({ message: "Opsi minimal 2" });

    const cleaned = opsi
      .map((o) => ({
        teks: (o.teks || "").trim(),
        benar: o.benar ? 1 : 0,
      }))
      .filter((o) => o.teks);

    if (cleaned.length < 2) return res.status(400).json({ message: "Opsi tidak valid" });

    // pastikan minimal 1 benar
    const hasTrue = cleaned.some((o) => o.benar === 1);
    if (!hasTrue) cleaned[0].benar = 1;

    const [r] = await db
      .promise()
      .query("INSERT INTO kuis_soal (kuis_id, pertanyaan, image_url) VALUES (?,?,?)", [
        kuis_id,
        pertanyaan.trim(),
        image_url?.trim() || null,
      ]);

    const soalId = r.insertId;

    const values = cleaned.map((o) => [soalId, o.teks, o.benar]);
    await db.promise().query("INSERT INTO kuis_opsi (soal_id, teks_opsi, benar) VALUES ?", [
      values,
    ]);

    res.json({ message: "Soal & opsi ditambahkan", soal_id: soalId });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Ambil semua soal (ADMIN) + opsi + benar (dipakai QuizAdmin FE)
exports.getSoalAllWithOpsi = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        s.id soal_id, s.kuis_id, s.pertanyaan, s.image_url, s.is_active,
        o.id opsi_id, o.teks_opsi, o.benar
      FROM kuis_soal s
      LEFT JOIN kuis_opsi o ON o.soal_id = s.id
      WHERE s.is_active=1
      ORDER BY s.id DESC, o.id ASC
    `);

    const map = {};
    for (const r of rows) {
      if (!map[r.soal_id]) {
        map[r.soal_id] = {
          id: r.soal_id,
          kuis_id: r.kuis_id,
          pertanyaan: r.pertanyaan,
          image_url: r.image_url,
          opsi: [],
        };
      }
      if (r.opsi_id) {
        map[r.soal_id].opsi.push({
          id: r.opsi_id,
          teks: r.teks_opsi,
          benar: r.benar === 1,
        });
      }
    }

    res.json(Object.values(map));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Ambil soal + opsi (ADMIN) by kuis
exports.getSoalByKuis = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `
      SELECT s.id soal_id, s.pertanyaan, s.image_url,
             o.id opsi_id, o.teks_opsi, o.benar
      FROM kuis_soal s
      LEFT JOIN kuis_opsi o ON s.id=o.soal_id
      WHERE s.kuis_id=? AND s.is_active=1
      ORDER BY s.id DESC, o.id ASC
      `,
      [req.params.kuis_id]
    );

    const map = {};
    rows.forEach((r) => {
      if (!map[r.soal_id]) {
        map[r.soal_id] = {
          id: r.soal_id,
          pertanyaan: r.pertanyaan,
          image_url: r.image_url,
          opsi: [],
        };
      }
      if (r.opsi_id) {
        map[r.soal_id].opsi.push({
          id: r.opsi_id,
          teks: r.teks_opsi,
          benar: r.benar === 1,
        });
      }
    });

    res.json(Object.values(map));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Ambil soal per ID + opsi
exports.getSoalById = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `
      SELECT s.id soal_id, s.pertanyaan, s.image_url,
             o.id opsi_id, o.teks_opsi, o.benar
      FROM kuis_soal s
      LEFT JOIN kuis_opsi o ON s.id=o.soal_id
      WHERE s.id=? AND s.is_active=1
      `,
      [req.params.id]
    );

    if (!rows.length) return res.status(404).json({ message: "Soal tidak ditemukan" });

    const soal = {
      id: rows[0].soal_id,
      pertanyaan: rows[0].pertanyaan,
      image_url: rows[0].image_url,
      opsi: [],
    };

    rows.forEach((r) => {
      if (r.opsi_id) {
        soal.opsi.push({
          id: r.opsi_id,
          teks: r.teks_opsi,
          benar: r.benar === 1,
        });
      }
    });

    res.json(soal);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Edit soal
exports.editSoal = async (req, res) => {
  try {
    const { pertanyaan, image_url } = req.body;
    if (!pertanyaan?.trim()) return res.status(400).json({ message: "Pertanyaan wajib" });

    await db
      .promise()
      .query("UPDATE kuis_soal SET pertanyaan=?, image_url=? WHERE id=?", [
        pertanyaan.trim(),
        image_url?.trim() || null,
        req.params.id,
      ]);

    res.json({ message: "Soal diperbarui" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Hapus soal (soft delete)
exports.hapusSoal = async (req, res) => {
  try {
    await db.promise().query("UPDATE kuis_soal SET is_active=0 WHERE id=?", [req.params.id]);
    res.json({ message: "Soal dinonaktifkan" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ================== OPSI ================== */

// ambil opsi by soal
exports.getOpsiBySoal = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `
      SELECT id, teks_opsi, benar
      FROM kuis_opsi
      WHERE soal_id=?
      ORDER BY id
      `,
      [req.params.soal_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// tambah opsi
exports.tambahOpsi = async (req, res) => {
  try {
    const { soal_id, teks_opsi, benar } = req.body;
    if (!soal_id) return res.status(400).json({ message: "soal_id wajib" });
    if (!teks_opsi?.trim()) return res.status(400).json({ message: "teks_opsi wajib" });

    if (benar) {
      await db.promise().query("UPDATE kuis_opsi SET benar=0 WHERE soal_id=?", [soal_id]);
    }

    await db.promise().query(
      `
      INSERT INTO kuis_opsi (soal_id, teks_opsi, benar)
      VALUES (?, ?, ?)
      `,
      [soal_id, teks_opsi.trim(), benar ? 1 : 0]
    );

    res.json({ message: "Opsi berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// edit opsi
exports.editOpsi = async (req, res) => {
  try {
    const { teks_opsi, benar } = req.body;
    if (!teks_opsi?.trim()) return res.status(400).json({ message: "teks_opsi wajib" });

    // kalau set benar=1, reset yang lain dulu
    const [[row]] = await db.promise().query("SELECT soal_id FROM kuis_opsi WHERE id=?", [
      req.params.id,
    ]);
    if (!row) return res.status(404).json({ message: "Opsi tidak ditemukan" });

    if (benar) {
      await db.promise().query("UPDATE kuis_opsi SET benar=0 WHERE soal_id=?", [row.soal_id]);
    }

    await db.promise().query("UPDATE kuis_opsi SET teks_opsi=?, benar=? WHERE id=?", [
      teks_opsi.trim(),
      benar ? 1 : 0,
      req.params.id,
    ]);

    res.json({ message: "Opsi diperbarui" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// hapus opsi
exports.hapusOpsi = async (req, res) => {
  try {
    await db.promise().query("DELETE FROM kuis_opsi WHERE id=?", [req.params.id]);
    res.json({ message: "Opsi dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.getAllSoal = exports.getSoalAllWithOpsi;
