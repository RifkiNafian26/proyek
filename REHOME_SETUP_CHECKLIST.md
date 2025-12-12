# ✅ Rehome Submission System - Setup Checklist

## Database Setup

### 1. Jalankan SQL Migration

Buka **phpMyAdmin** dan jalankan query dari file:

```
migrations/2025_12_12_create_rehome_schema.sql
```

Atau copy-paste query ini di MySQL CLI/phpMyAdmin:

```sql
CREATE TABLE IF NOT EXISTS rehome_submissions (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  assigned_admin_user_id INT NOT NULL DEFAULT 1,
  pet_name VARCHAR(120) NOT NULL,
  pet_type ENUM('Dog', 'Cat', 'Rabbit') NOT NULL,
  age_years INT NOT NULL DEFAULT 0,
  breed VARCHAR(200) NOT NULL,
  color VARCHAR(100) NOT NULL,
  weight DECIMAL(5, 2) NOT NULL,
  height DECIMAL(5, 2) NOT NULL,
  gender ENUM('Male', 'Female') NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  postcode VARCHAR(20) NOT NULL,
  spayed_neutered ENUM('Yes', 'No') NOT NULL,
  rehome_reason VARCHAR(200) NOT NULL,
  pet_story LONGTEXT NOT NULL,
  pet_image_path VARCHAR(255) DEFAULT NULL,
  documents_json TEXT DEFAULT NULL,
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

CREATE INDEX idx_rehome_submissions_created ON rehome_submissions(submitted_at DESC);
CREATE INDEX idx_rehome_submissions_pet_type ON rehome_submissions(pet_type);
```

### 2. Buat Folder Uploads

```bash
mkdir -p uploads/rehome/documents
chmod 755 uploads/rehome
chmod 755 uploads/rehome/documents
```

## Files yang Sudah Dibuat

### Backend Files

- ✅ `rehome/submit_rehome.php` - Handle form submission dan file upload
- ✅ `admin/rehome_submissions.php` - List semua submissions di admin panel
- ✅ `admin/rehome_detail.php` - Detail view submission
- ✅ `admin/rehome_update.php` - Update status submission

### Migration Files

- ✅ `migrations/2025_12_12_create_rehome_schema.sql` - Database schema
- ✅ `REHOME_DB_SETUP.md` - Dokumentasi setup

## Frontend Integration (TODO)

Update file `rehome/rehome.html` untuk submit data form:

### Di bagian Script Step 9 (Thank You), tambahkan:

```javascript
// Setelah step 8 confirm berhasil, ubah confirmContinueBtn listener:
confirmContinueBtn.addEventListener("click", async () => {
  if (!confirmAgreeCheckbox.checked) {
    confirmAgreeWrapper.classList.add("error");
    return;
  }

  // Create FormData untuk file upload
  const formData = new FormData();

  // Add form data
  formData.append("pet_name", getValue("pet_name"));
  formData.append("pet_type", getRadioValue("pet_type"));
  formData.append("age_years", getValue("age_years"));
  formData.append("breed", getValue("breed"));
  formData.append("color", getValue("color"));
  formData.append("weight", getValue("weight"));
  formData.append("height", getValue("height"));
  formData.append("gender", getValue("gender"));
  formData.append("address_line1", getValue("address_line1"));
  formData.append("city", getValue("city"));
  formData.append("postcode", getValue("location_postcode"));
  formData.append("spayed_neutered", getRadioValue("spayed_neutered"));
  formData.append("rehome_reason", getValue("rehome_reason"));
  formData.append("pet_story", getValue("pet_story"));

  // Add pet image file
  const imageInput = document.querySelector('#step-3 input[type="file"]');
  if (imageInput && imageInput.files[0]) {
    formData.append("pet_image", imageInput.files[0]);
  }

  // Add document files
  const docInputs = document.querySelectorAll('#step-7 input[type="file"]');
  docInputs.forEach((input, index) => {
    if (input.files[0]) {
      formData.append("documents[]", input.files[0]);
    }
  });

  try {
    const response = await fetch("submit_rehome.php", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      goToStep(9); // Go to thank you page
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error submitting form");
  }
});
```

## Admin Panel URLs

### Akses Admin Rehome Pages:

- **List Submissions**: `http://localhost/PetResQ/admin/rehome_submissions.php`
- **View Detail**: `http://localhost/PetResQ/admin/rehome_detail.php?id=1`

## Data Flow

```
User Form (rehome.html)
    ↓
JavaScript Collect Data + Files
    ↓
POST to submit_rehome.php (FormData)
    ↓
PHP Validation + File Upload
    ↓
Save to rehome_submissions table
    ↓
Admin Panel (rehome_submissions.php)
    ↓
View Detail (rehome_detail.php)
    ↓
Update Status (rehome_update.php)
```

## Table Schema Summary

| Field                          | Type         | Purpose                                             |
| ------------------------------ | ------------ | --------------------------------------------------- |
| id                             | INT          | Primary Key                                         |
| user_id                        | INT          | Who submitted (FK to user table)                    |
| assigned_admin_user_id         | INT          | Admin handling (default 1)                          |
| pet\_\*                        | VARCHAR/ENUM | Pet details (name, type, age, breed, color, gender) |
| weight, height                 | DECIMAL      | Pet measurements                                    |
| address_line1, city, postcode  | VARCHAR      | Location info                                       |
| spayed_neutered, rehome_reason | ENUM/VARCHAR | Questions answers                                   |
| pet_story                      | LONGTEXT     | Pet description                                     |
| pet_image_path                 | VARCHAR      | Photo path                                          |
| documents_json                 | TEXT         | JSON array of doc paths                             |
| status                         | ENUM         | submitted/in_review/approved/rejected/withdrawn     |
| admin_notes                    | TEXT         | Admin comments                                      |
| submitted_at, updated_at       | DATETIME     | Timestamps                                          |

## Testing Checklist

- [ ] Database table created successfully
- [ ] Upload folders created
- [ ] Form data can be submitted
- [ ] Files upload correctly
- [ ] Admin can view submissions list
- [ ] Admin can view submission details
- [ ] Admin can update status
- [ ] Files can be downloaded from admin panel

## Next Steps

1. **Update rehome.html** - Add form submission logic
2. **Create email notifications** - Notify admin when new submission
3. **Add approval flow** - Create hewan record when approved
4. **Create user dashboard** - Let users see their submissions
5. **Add image validation** - Check dimensions (600x600)
6. **Add file size validation** - Ensure 240KB-1024KB

---

**Files Created:**

```
✅ migrations/2025_12_12_create_rehome_schema.sql
✅ rehome/submit_rehome.php
✅ admin/rehome_submissions.php
✅ admin/rehome_detail.php
✅ admin/rehome_update.php
✅ REHOME_DB_SETUP.md (this file)
```
