CREATE TABLE IF NOT EXISTS adoption_applications (
  id INT NOT NULL AUTO_INCREMENT,

  applicant_user_id INT NOT NULL,
  assigned_admin_user_id INT NOT NULL DEFAULT 1,
  hewan_id INT NULL,

  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL,
  phone VARCHAR(30),

  address_line1 VARCHAR(255) NOT NULL,
  city VARCHAR(100) DEFAULT NULL,
  postcode VARCHAR(20) NOT NULL,

  has_garden TINYINT(1) NOT NULL DEFAULT 0,
  living_situation VARCHAR(200) DEFAULT NULL,

  story TEXT DEFAULT NULL,
  details_json TEXT DEFAULT NULL,

  status ENUM('submitted','in_review','approved','rejected','withdrawn') NOT NULL DEFAULT 'submitted',

  submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_adoption_applications_user (applicant_user_id),
  KEY idx_adoption_applications_admin (assigned_admin_user_id),
  KEY idx_adoption_applications_hewan (hewan_id),
  CONSTRAINT fk_adoption_applications_user
    FOREIGN KEY (applicant_user_id) REFERENCES user (id_user)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_adoption_applications_admin
    FOREIGN KEY (assigned_admin_user_id) REFERENCES user (id_user)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_adoption_applications_hewan
    FOREIGN KEY (hewan_id) REFERENCES hewan (id_hewan)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Simple notifications table so admin (id_user = 1) gets a row per submission
CREATE TABLE IF NOT EXISTS notifications (
  id INT NOT NULL AUTO_INCREMENT,
  recipient_user_id INT NOT NULL,
  application_id INT NULL,
  message VARCHAR(255) NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_notifications_recipient (recipient_user_id, is_read),
  KEY idx_notifications_application (application_id),
  CONSTRAINT fk_notifications_user
    FOREIGN KEY (recipient_user_id) REFERENCES user (id_user)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_notifications_application
    FOREIGN KEY (application_id) REFERENCES adoption_applications (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
