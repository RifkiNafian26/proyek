# Rehome Submission Database Setup Guide

## 1. Database Schema

Jalankan query SQL berikut di phpMyAdmin atau MySQL CLI:

```sql
-- Rehome Submissions Table
CREATE TABLE IF NOT EXISTS rehome_submissions (
  id INT NOT NULL AUTO_INCREMENT,

  user_id INT NOT NULL,
  assigned_admin_user_id INT NOT NULL DEFAULT 1,

  -- Pet Information
  pet_name VARCHAR(120) NOT NULL,
  pet_type ENUM('Dog', 'Cat', 'Rabbit') NOT NULL,
  age_years INT NOT NULL DEFAULT 0,
  breed VARCHAR(200) NOT NULL,
  color VARCHAR(100) NOT NULL,
  weight DECIMAL(5, 2) NOT NULL,
  height DECIMAL(5, 2) NOT NULL,
  gender ENUM('Male', 'Female') NOT NULL,

  -- Location Information
  address_line1 VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  postcode VARCHAR(20) NOT NULL,

  -- Questions
  spayed_neutered ENUM('Yes', 'No') NOT NULL,
  rehome_reason VARCHAR(200) NOT NULL,

  -- Pet Story
  pet_story LONGTEXT NOT NULL,

  -- Files
  pet_image_path VARCHAR(255) DEFAULT NULL,
  documents_json TEXT DEFAULT NULL,

  -- Status
  status ENUM('submitted', 'in_review', 'approved', 'rejected', 'withdrawn') NOT NULL DEFAULT 'submitted',
  admin_notes TEXT DEFAULT NULL,

  submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_rehome_submissions_user (user_id),
  KEY idx_rehome_submissions_admin (assigned_admin_user_id),
  KEY idx_rehome_submissions_status (status),
  CONSTRAINT fk_rehome_submissions_user
    FOREIGN KEY (user_id) REFERENCES user (id_user)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_rehome_submissions_admin
    FOREIGN KEY (assigned_admin_user_id) REFERENCES user (id_user)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Index untuk query yang sering difilter
CREATE INDEX idx_rehome_submissions_created ON rehome_submissions(submitted_at DESC);
CREATE INDEX idx_rehome_submissions_pet_type ON rehome_submissions(pet_type);
```

## 2. Struktur Data

Table `rehome_submissions` berisi:

| Field                  | Tipe     | Keterangan                                                              |
| ---------------------- | -------- | ----------------------------------------------------------------------- |
| id                     | INT      | Primary key, auto increment                                             |
| user_id                | INT      | Foreign key ke table user                                               |
| assigned_admin_user_id | INT      | Admin yang handle submission (default 1)                                |
| pet_name               | VARCHAR  | Nama hewan                                                              |
| pet_type               | ENUM     | Tipe hewan (Dog, Cat, Rabbit)                                           |
| age_years              | INT      | Umur dalam tahun                                                        |
| breed                  | VARCHAR  | Jenis breed                                                             |
| color                  | VARCHAR  | Warna hewan                                                             |
| weight                 | DECIMAL  | Berat (kg)                                                              |
| height                 | DECIMAL  | Tinggi (cm)                                                             |
| gender                 | ENUM     | Jenis kelamin (Male, Female)                                            |
| address_line1          | VARCHAR  | Alamat                                                                  |
| city                   | VARCHAR  | Kota                                                                    |
| postcode               | VARCHAR  | Kode pos                                                                |
| spayed_neutered        | ENUM     | Status steril (Yes/No)                                                  |
| rehome_reason          | VARCHAR  | Alasan rehome                                                           |
| pet_story              | LONGTEXT | Deskripsi/cerita hewan                                                  |
| pet_image_path         | VARCHAR  | Path foto hewan                                                         |
| documents_json         | TEXT     | JSON array path dokumen                                                 |
| status                 | ENUM     | Status submission (submitted, in_review, approved, rejected, withdrawn) |
| admin_notes            | TEXT     | Catatan dari admin                                                      |
| submitted_at           | DATETIME | Waktu submit                                                            |
| updated_at             | DATETIME | Waktu update terakhir                                                   |

## 3. Backend PHP

File: `rehome/submit_rehome.php`

Fungsi:

- Menerima data form dari frontend
- Validasi semua field required
- Upload file gambar (600x600px, 240KB-1024KB)
- Upload dokumen (240KB-1024KB)
- Simpan ke database
- Create notification untuk admin

## 4. Integrasi di Frontend

Ubah form submit di `rehome.html`:

```javascript
// Di bagian submit form (Step 9)
confirmContinueBtn.addEventListener("click", async () => {
  const formData = new FormData();

  // Tambah data dari semua step
  formData.append("pet_name", document.getElementById("pet_name").value);
  formData.append("pet_type", getRadioValue("pet_type"));
  formData.append("age_years", document.getElementById("age_years").value);
  // ... field lainnya

  // Upload file gambar
  const imageInput = document.querySelector('#step-3 input[type="file"]');
  if (imageInput.files[0]) {
    formData.append("pet_image", imageInput.files[0]);
  }

  // Upload dokumen
  const docInputs = document.querySelectorAll('#step-7 input[type="file"]');
  docInputs.forEach((input) => {
    if (input.files[0]) {
      formData.append("documents[]", input.files[0]);
    }
  });

  try {
    const response = await fetch("submit_rehome.php", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      goToStep(9); // Redirect ke thank you page
    } else {
      alert("Error submitting form");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
```

## 5. Folder Uploads

Buat folder untuk menyimpan uploads:

```
uploads/
  └── rehome/
      ├── [pet images]
      └── documents/
          └── [documents]
```

## 6. Admin Panel

Untuk melihat submissions, buat halaman di admin:

- `admin/rehome_submissions.php` - List semua submissions
- `admin/rehome_detail.php` - Detail submission
- `admin/rehome_update.php` - Update status/approve/reject
