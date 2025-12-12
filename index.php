<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PetResQ</title>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Kreon:wght@300..700&family=Poppins:wght@100;300;400;700&display=swap" rel="stylesheet" />

    <script src="https://unpkg.com/feather-icons"></script>
    <link rel="stylesheet" href="css/style.css?v=2" />
  </head>
  <body>
    <nav class="navbar">
      <a href="/PetResQ/index.php" class="navbar-logo">Pet<span>ResQ</span></a>

      <div class="navbar-nav">
        <a href="/PetResQ/index.php">Home</a>
        <a href="/PetResQ/adopt/adopt.php">Adopt</a>
        <a href="/PetResQ/rehome/rehome.html">Rehome</a>
        <div class="navbar-dropdown">
          <a href="#care-guides" class="care-guides-link">Care Guides</a>
          <div class="dropdown-menu">
            <a href="/PetResQ/careguides/Dog Care Guides.html">Dog</a>
            <a href="/PetResQ/careguides/Cat Care Guides.html">Cat</a>
            <a href="/PetResQ/careguides/Rabbit Care Guides.html">Rabbit</a>
          </div>
        </div>
        <?php if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin'): ?>
          <a href="/PetResQ/Admin PetResQ/index.php">Admin</a>
        <?php endif; ?>
      </div>

      <div class="navbar-extra" aria-label="Top right taskbar">
        <a href="#" id="notification" aria-label="Notifications"><i data-feather="bell"></i></a>

        <button aria-label="User account" class="user-profile" id="user-profile" type="button">
          <div class="user-profile-inner">
            <svg class="profile-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g data-name="Layer 2" id="Layer_2">
                <path d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z"></path>
              </g>
            </svg>
            <span class="user-name">LOGIN</span>
            <span class="user-initial" id="user-initial"></span>
          </div>
        </button>

        <div class="profile-dropdown" id="profile-dropdown">
          <div class="dropdown-header">
            <div class="dropdown-user-name" id="dropdown-name"></div>
            <div class="dropdown-user-email" id="dropdown-email"></div>
          </div>
          <hr class="dropdown-divider" />
          <a href="#" id="logout-btn" class="dropdown-item">Logout</a>
        </div>
      </div>
    </nav>

    <?php include __DIR__ . '/index.html.content.php'; ?>

    <script>
      feather.replace();
    </script>
    <script src="/PetResQ/js/script.js"></script>
  </body>
  </html>
