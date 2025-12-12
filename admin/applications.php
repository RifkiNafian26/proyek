<?php
session_start();
require_once __DIR__ . '/../config.php';

// Simple role check: only allow admin users
// Assuming session stores user role in $_SESSION['role'] ('admin'|'user')
if (!isset($_SESSION['user_id'])) {
  header('Location: /PetResQ/login.php');
  exit;
}
$role = $_SESSION['role'] ?? 'user';
if ($role !== 'admin') {
  http_response_code(403);
  echo 'Forbidden: Admins only';
  exit;
}

// Fetch recent adoption applications
$apps = [];
$sql = "SELECT a.id, a.applicant_user_id, u.nama AS applicant_name, u.email AS applicant_email,
               a.full_name, a.email, a.phone, a.address_line1, a.city, a.postcode,
               a.has_garden, a.living_situation, a.status, a.submitted_at
        FROM adoption_applications a
        LEFT JOIN `user` u ON u.id_user = a.applicant_user_id
        ORDER BY a.submitted_at DESC LIMIT 100";

$res = mysqli_query($conn, $sql);
if ($res) {
  while ($row = mysqli_fetch_assoc($res)) {
    $apps[] = $row;
  }
}

// Fetch unread notifications for admin
$notes = [];
$noteSql = "SELECT id, application_id, message, is_read, created_at
            FROM notifications
            WHERE recipient_user_id = ?
            ORDER BY created_at DESC LIMIT 50";
$noteStmt = mysqli_prepare($conn, $noteSql);
$adminId = (int)$_SESSION['user_id'];
if ($noteStmt) {
  mysqli_stmt_bind_param($noteStmt, 'i', $adminId);
  mysqli_stmt_execute($noteStmt);
  $noteRes = mysqli_stmt_get_result($noteStmt);
  if ($noteRes) {
    while ($row = mysqli_fetch_assoc($noteRes)) {
      $notes[] = $row;
    }
  }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin - Adoption Applications</title>
  <link rel="stylesheet" href="/PetResQ/css/style.css?v=2" />
  <style>
    body { font-family: 'Poppins', sans-serif; padding: 20px; }
    h1 { margin-bottom: 10px; }
    .section { margin-top: 24px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    th { background: #f4f4f4; text-align: left; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
    .status-submitted { background: #eef; color: #225; }
    .status-in_review { background: #ffe; color: #552; }
    .status-approved { background: #efe; color: #252; }
    .status-rejected { background: #fee; color: #522; }
    .actions { display: flex; gap: 8px; }
    .btn { padding: 6px 10px; border: 1px solid #ccc; background:#fff; cursor:pointer; }
  </style>
</head>
<body>
  <h1>Adoption Applications</h1>
  <p>Welcome, <?php echo htmlspecialchars($_SESSION['user_name'] ?? 'Admin'); ?>.</p>

  <div class="section">
    <h2>Notifications</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Application</th>
          <th>Message</th>
          <th>Read</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($notes)) : ?>
          <tr><td colspan="5" style="text-align:center;">No notifications</td></tr>
        <?php else: foreach ($notes as $n): ?>
          <tr>
            <td><?php echo (int)$n['id']; ?></td>
            <td><?php echo (int)$n['application_id']; ?></td>
            <td><?php echo htmlspecialchars($n['message']); ?></td>
            <td><?php echo ((int)$n['is_read'] ? 'Yes' : 'No'); ?></td>
            <td><?php echo htmlspecialchars($n['created_at']); ?></td>
          </tr>
        <?php endforeach; endif; ?>
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Recent Submissions</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Applicant</th>
          <th>Contact</th>
          <th>Address</th>
          <th>Garden</th>
          <th>Living</th>
          <th>Status</th>
          <th>Submitted</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($apps)) : ?>
          <tr><td colspan="8" style="text-align:center;">No applications found</td></tr>
        <?php else: foreach ($apps as $a): ?>
          <tr>
            <td><?php echo (int)$a['id']; ?></td>
            <td>
              <?php echo htmlspecialchars($a['applicant_name'] ?? $a['full_name'] ?? ''); ?><br>
              <?php echo htmlspecialchars($a['applicant_email'] ?? $a['email'] ?? ''); ?>
            </td>
            <td><?php echo htmlspecialchars($a['phone'] ?? ''); ?></td>
            <td><?php echo htmlspecialchars($a['address_line1']); ?>, <?php echo htmlspecialchars($a['city'] ?? ''); ?> (<?php echo htmlspecialchars($a['postcode']); ?>)</td>
            <td><?php echo ((int)$a['has_garden'] ? 'Yes' : 'No'); ?></td>
            <td><?php echo htmlspecialchars($a['living_situation'] ?? ''); ?></td>
            <td><span class="badge status-<?php echo htmlspecialchars($a['status']); ?>"><?php echo htmlspecialchars($a['status']); ?></span></td>
            <td><?php echo htmlspecialchars($a['submitted_at']); ?></td>
          </tr>
        <?php endforeach; endif; ?>
      </tbody>
    </table>
  </div>
</body>
</html>
