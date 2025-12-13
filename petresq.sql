-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 13 Des 2025 pada 07.20
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `petresq`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `adoption_applications`
--

CREATE TABLE `adoption_applications` (
  `id` int(11) NOT NULL,
  `applicant_user_id` int(11) NOT NULL,
  `assigned_admin_user_id` int(11) NOT NULL DEFAULT 1,
  `hewan_id` int(11) DEFAULT NULL,
  `full_name` varchar(120) NOT NULL,
  `email` varchar(120) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `address_line1` varchar(255) NOT NULL,
  `postcode` varchar(20) NOT NULL,
  `has_garden` tinyint(1) NOT NULL DEFAULT 0,
  `living_situation` varchar(200) DEFAULT NULL,
  `story` text DEFAULT NULL,
  `details_json` text DEFAULT NULL,
  `status` enum('submitted','in_review','approved','rejected','withdrawn') NOT NULL DEFAULT 'submitted',
  `submitted_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `adoption_applications`
--

INSERT INTO `adoption_applications` (`id`, `applicant_user_id`, `assigned_admin_user_id`, `hewan_id`, `full_name`, `email`, `phone`, `address_line1`, `postcode`, `has_garden`, `living_situation`, `story`, `details_json`, `status`, `submitted_at`, `updated_at`) VALUES
(1, 6, 1, 1, 'alfareza', 'alfareza@gmail.com', '456', 'purwakarta', '1000', 0, 'bagus', 'adwadwa', '{\"telephone\":\"456\",\"household_setting\":\"jelek\",\"household_activity\":\"b aja\",\"adults\":1,\"children\":1,\"children_ages\":\"13-17\",\"visiting_children\":\"No\",\"visiting_ages\":\"under5\",\"flatmates\":\"No\",\"flatmates_consent\":\"Yes\",\"allergies\":\"no\",\"other_animals\":\"Yes\",\"vaccinated\":\"No\",\"experience\":\"adwadwa\"}', 'approved', '2025-12-12 10:07:17', '2025-12-12 10:32:20'),
(2, 3, 1, 2, 'Rifki Nafian', 'rifkinafian@upi.edu', '0821', 'bogor', '15', 1, 'i have 5 hektar house', 'i have 5 cats', '{\"telephone\":\"0821\",\"household_setting\":\"its bad but good\",\"household_activity\":\"rame pisan\",\"adults\":3,\"children\":5,\"children_ages\":\"0-5\",\"visiting_children\":\"Yes\",\"visiting_ages\":\"all\",\"flatmates\":\"Yes\",\"flatmates_consent\":\"Yes\",\"allergies\":\"yes\",\"other_animals\":\"Yes\",\"vaccinated\":\"Yes\",\"experience\":\"i have 5 cats\"}', 'rejected', '2025-12-12 10:56:16', '2025-12-12 10:56:58'),
(3, 3, 1, 1, 'Rifki Nafian', 'rifkinafian@upi.edu', '0898', 'gegerkalong', '140625', 1, 'asrama saya jelek', 'gada pengalaman', '{\"telephone\":\"0898\",\"household_setting\":\"luas 2 tingkat\",\"household_activity\":\"rame 5 orang dirumah\",\"adults\":1,\"children\":2,\"children_ages\":\"6-12\",\"visiting_children\":\"No\",\"visiting_ages\":\"under5\",\"flatmates\":\"No\",\"flatmates_consent\":\"Yes\",\"allergies\":\"no\",\"other_animals\":\"No\",\"vaccinated\":\"No\",\"experience\":\"gada pengalaman\"}', 'approved', '2025-12-12 17:35:02', '2025-12-12 17:38:15'),
(4, 4, 1, 1, 'wawa', 'wawaks@gmail.com', '12345678', 'cibiru', '40625', 1, 'gacor', 'sdyuio', '{\"telephone\":\"12345678\",\"household_setting\":\"gacor\",\"household_activity\":\"gacor\",\"adults\":1,\"children\":0,\"children_ages\":\"no-children\",\"visiting_children\":\"Yes\",\"visiting_ages\":\"under5\",\"flatmates\":\"Yes\",\"flatmates_consent\":\"Yes\",\"allergies\":\"yes\",\"other_animals\":\"No\",\"vaccinated\":\"No\",\"experience\":\"sdyuio\"}', 'approved', '2025-12-12 19:41:14', '2025-12-12 19:42:33');

-- --------------------------------------------------------

--
-- Struktur dari tabel `hewan`
--

CREATE TABLE `hewan` (
  `id_hewan` int(10) NOT NULL,
  `jenis` enum('Dog','Cat','Rabbit','') NOT NULL,
  `namaHewan` varchar(50) NOT NULL,
  `breed` varchar(50) NOT NULL,
  `gender` enum('Male','Female','','') NOT NULL,
  `age` varchar(20) NOT NULL,
  `color` varchar(20) NOT NULL,
  `weight` varchar(20) NOT NULL,
  `height` varchar(20) NOT NULL,
  `main_photo` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` enum('Available','Adopted','Pending','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `hewan`
--

INSERT INTO `hewan` (`id_hewan`, `jenis`, `namaHewan`, `breed`, `gender`, `age`, `color`, `weight`, `height`, `main_photo`, `description`, `status`) VALUES
(1, 'Dog', 'Iqbal', 'British Shorthair', 'Male', '2 years', 'golden', '5', '10', 'uploads/iqbal.jpg\r\n', 'iqbal adalah kucing baik', 'Available'),
(2, 'Cat', 'gifari', 'Beagle', 'Male', '2 Tahun', 'Black', '5', '30', '', 'gifari adalah kucing jahat', 'Available');

-- --------------------------------------------------------

--
-- Struktur dari tabel `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `recipient_user_id` int(11) NOT NULL,
  `application_id` int(11) DEFAULT NULL,
  `message` varchar(255) NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `notifications`
--

INSERT INTO `notifications` (`id`, `recipient_user_id`, `application_id`, `message`, `is_read`, `created_at`) VALUES
(5, 1, 1, 'New adoption application from alfareza', 0, '2025-12-12 10:07:17'),
(7, 1, 2, 'New adoption application from Rifki Nafian', 0, '2025-12-12 10:56:16'),
(9, 1, NULL, 'New rehome submission from bayou', 0, '2025-12-12 16:46:56'),
(10, 1, NULL, 'New rehome submission from tiffany', 0, '2025-12-12 16:53:07'),
(11, 1, 3, 'New adoption application from Rifki Nafian', 0, '2025-12-12 17:35:02'),
(12, 3, 3, 'New adoption application from Rifki Nafian', 0, '2025-12-12 17:35:02'),
(13, 1, 4, 'New adoption application from wawa', 0, '2025-12-12 19:41:14'),
(14, 3, 4, 'New adoption application from wawa', 0, '2025-12-12 19:41:14');

-- --------------------------------------------------------

--
-- Struktur dari tabel `rehome_submissions`
--

CREATE TABLE `rehome_submissions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `assigned_admin_user_id` int(11) NOT NULL DEFAULT 1,
  `pet_name` varchar(120) NOT NULL,
  `pet_type` enum('Dog','Cat','Rabbit') NOT NULL,
  `age_years` int(11) NOT NULL DEFAULT 0,
  `breed` varchar(200) NOT NULL,
  `color` varchar(100) NOT NULL,
  `weight` int(10) NOT NULL,
  `height` int(10) NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `address_line1` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `postcode` varchar(20) NOT NULL,
  `spayed_neutered` enum('Yes','No') NOT NULL,
  `rehome_reason` varchar(200) NOT NULL,
  `pet_story` longtext NOT NULL,
  `pet_image_path` varchar(255) DEFAULT NULL,
  `documents_json` text DEFAULT NULL,
  `status` enum('submitted','in_review','approved','rejected','withdrawn') NOT NULL DEFAULT 'submitted',
  `admin_notes` text DEFAULT NULL,
  `submitted_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `rehome_submissions`
--

INSERT INTO `rehome_submissions` (`id`, `user_id`, `assigned_admin_user_id`, `pet_name`, `pet_type`, `age_years`, `breed`, `color`, `weight`, `height`, `gender`, `address_line1`, `city`, `postcode`, `spayed_neutered`, `rehome_reason`, `pet_story`, `pet_image_path`, `documents_json`, `status`, `admin_notes`, `submitted_at`, `updated_at`) VALUES
(1, 6, 1, 'bayou', 'Cat', 1, 'Golden Retriever', 'Black', 2, 20, 'Female', 'Posindo', 'Jakarta', '40624', 'Yes', 'Moving', 'nothing\r\n', NULL, NULL, 'submitted', NULL, '2025-12-12 16:46:56', '2025-12-12 16:46:56'),
(2, 6, 1, 'tiffany', 'Cat', 3, 'Havana', 'White', 5, 25, 'Male', 'Griya', 'Purwakarta', '6006', 'Yes', 'Financial', 'dia anjing baik', 'uploads/rehome/pet_6_1765533187.jpg', NULL, 'submitted', NULL, '2025-12-12 16:53:07', '2025-12-12 16:53:07');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id_user` int(10) NOT NULL,
  `nama` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','user','','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id_user`, `nama`, `email`, `password`, `role`) VALUES
(1, 'bayou', 'bayouali@gmail.com', 'bayou123', 'admin'),
(3, 'Rifki Nafian', 'rifkinafian@upi.edu', 'nafian123', 'admin'),
(4, 'wawa', 'wawaks@gmail.com', 'wawa123', 'user'),
(6, 'alfareza', 'alfareza@gmail.com', '$2y$10$60usUG6u9vOspyznh6fnv.blu3PlU6IHSjxWqDUxLjqAzvf4/E642', 'user');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `adoption_applications`
--
ALTER TABLE `adoption_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_adoption_applications_user` (`applicant_user_id`),
  ADD KEY `idx_adoption_applications_admin` (`assigned_admin_user_id`),
  ADD KEY `idx_adoption_applications_hewan` (`hewan_id`);

--
-- Indeks untuk tabel `hewan`
--
ALTER TABLE `hewan`
  ADD PRIMARY KEY (`id_hewan`);

--
-- Indeks untuk tabel `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notifications_recipient` (`recipient_user_id`,`is_read`),
  ADD KEY `idx_notifications_application` (`application_id`);

--
-- Indeks untuk tabel `rehome_submissions`
--
ALTER TABLE `rehome_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_rehome_submissions_user` (`user_id`),
  ADD KEY `idx_rehome_submissions_admin` (`assigned_admin_user_id`),
  ADD KEY `idx_rehome_submissions_status` (`status`),
  ADD KEY `idx_rehome_submissions_created` (`submitted_at`),
  ADD KEY `idx_rehome_submissions_pet_type` (`pet_type`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `adoption_applications`
--
ALTER TABLE `adoption_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `hewan`
--
ALTER TABLE `hewan`
  MODIFY `id_hewan` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT untuk tabel `rehome_submissions`
--
ALTER TABLE `rehome_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `adoption_applications`
--
ALTER TABLE `adoption_applications`
  ADD CONSTRAINT `fk_adoption_applications_admin` FOREIGN KEY (`assigned_admin_user_id`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_adoption_applications_hewan` FOREIGN KEY (`hewan_id`) REFERENCES `hewan` (`id_hewan`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_adoption_applications_user` FOREIGN KEY (`applicant_user_id`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_application` FOREIGN KEY (`application_id`) REFERENCES `adoption_applications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notifications_user` FOREIGN KEY (`recipient_user_id`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `rehome_submissions`
--
ALTER TABLE `rehome_submissions`
  ADD CONSTRAINT `fk_rehome_submissions_admin` FOREIGN KEY (`assigned_admin_user_id`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_rehome_submissions_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
