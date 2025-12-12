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

-- Index for commonly filtered queries
CREATE INDEX idx_rehome_submissions_created ON rehome_submissions(submitted_at DESC);
CREATE INDEX idx_rehome_submissions_pet_type ON rehome_submissions(pet_type);
