<?php
// Ensure clean JSON output without PHP notices/warnings
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([ 'ok' => false, 'error' => 'Not authenticated' ]);
    exit;
}

require_once __DIR__ . '/config.php';
if (!isset($conn) || !$conn) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'DB connection failed']);
    exit;
}

// Accept JSON or form-encoded payloads
$contentType = isset($_SERVER['CONTENT_TYPE']) ? strtolower($_SERVER['CONTENT_TYPE']) : '';
$raw = file_get_contents('php://input');
$data = null;
if (strpos($contentType, 'application/json') !== false) {
    $data = json_decode($raw, true);
}
// Fallback to POST if JSON not provided or decode failed
if (!is_array($data) || empty($data)) {
    if (!empty($_POST)) {
        $data = $_POST;
    } else {
        // Provide clearer diagnostic information
        http_response_code(400);
        echo json_encode([
            'ok' => false,
            'error' => 'Invalid payload: expected application/json or form data',
        ]);
        exit;
    }
}

// Basic required fields from SistemAdopt form
$hewan_id = null;
// Accept both 'hewan_id' and 'id_hewan' from payload
if (isset($data['hewan_id'])) {
    $hewan_id = (int)$data['hewan_id'];
} elseif (isset($data['id_hewan'])) {
    $hewan_id = (int)$data['id_hewan'];
}

$address = trim($data['address'] ?? '');
$postcode = trim($data['postcode'] ?? '');
$telephone = trim($data['telephone'] ?? '');
$garden = trim($data['garden'] ?? ''); // Yes/No
$living = trim($data['living_situation'] ?? '');
$household_setting = trim($data['household_setting'] ?? '');
$household_activity = trim($data['household_activity'] ?? '');
$adults = isset($data['adults']) ? (int)$data['adults'] : null;
$allergies = trim($data['allergies'] ?? '');
$other_animals = trim($data['other_animals'] ?? '');
$vaccinated = trim($data['vaccinated'] ?? '');
$experience = trim($data['experience'] ?? '');

// Relax validation slightly: adults can be 0, allow optional fields to be '-'
if ($address === '' || $postcode === '' || $telephone === '' || $garden === '' ||
    $living === '' || $household_setting === '' || $household_activity === '' ||
    $allergies === '' || $other_animals === '' || $vaccinated === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing required fields']);
    exit;
}

$applicant_user_id = (int)$_SESSION['user_id'];
$full_name = $_SESSION['user_name'] ?? '';
$email = $_SESSION['user_email'] ?? '';
$has_garden = (strtolower($garden) === 'yes') ? 1 : 0;
$status = 'submitted';

// Bundle all extra details to JSON for flexibility
$details = [
    'telephone' => $telephone,
    'household_setting' => $household_setting,
    'household_activity' => $household_activity,
    'adults' => $adults,
    'children' => (int)($data['children'] ?? 0),
    'children_ages' => ($data['children_ages'] ?? null),
    'visiting_children' => ($data['visiting_children'] ?? null),
    'visiting_ages' => ($data['visiting_ages'] ?? null),
    'flatmates' => ($data['flatmates'] ?? null),
    'flatmates_consent' => ($data['flatmates_consent'] ?? null),
    'allergies' => $allergies,
    'other_animals' => $other_animals,
    'vaccinated' => $vaccinated,
    'experience' => $experience
];
$details_json = json_encode($details, JSON_UNESCAPED_UNICODE);

// Insert application (now with hewan_id)
$withHewan = ($hewan_id !== null && $hewan_id > 0);
if ($withHewan) {
    $sql = "INSERT INTO adoption_applications
        (applicant_user_id, assigned_admin_user_id, hewan_id, full_name, email, phone,
         address_line1, postcode, has_garden, living_situation, story, details_json, status, submitted_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?, ?, NOW())";
} else {
    $sql = "INSERT INTO adoption_applications
        (applicant_user_id, assigned_admin_user_id, full_name, email, phone,
         address_line1, postcode, has_garden, living_situation, story, details_json, status, submitted_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?, ?, NOW())";
}
$stmt = mysqli_prepare($conn, $sql);
$story = $experience; // reuse
// Determine admin recipients dynamically (notify ALL admins)
$adminIds = [];
$adminLookup = mysqli_query($conn, "SELECT id_user FROM `user` WHERE role='admin' ORDER BY id_user ASC");
if ($adminLookup) {
    while ($r = mysqli_fetch_assoc($adminLookup)) {
        if (!empty($r['id_user'])) $adminIds[] = (int)$r['id_user'];
    }
}
if (empty($adminIds)) {
    // Fallback if no admin role found
    $adminIds[] = 1;
}
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'DB prepare failed', 'details' => mysqli_error($conn)]);
    exit;
}
// Pick an assigned admin (or leave NULL) — also notify all admins separately
$assignedAdmin = isset($adminIds[0]) ? (int)$adminIds[0] : null;

if ($withHewan) {
    mysqli_stmt_bind_param(
        $stmt,
        'iiissssisssss',
        $applicant_user_id,
        $assignedAdmin,
        $hewan_id,
        $full_name,
        $email,
        $telephone,
        $address,
        $postcode,
        $has_garden,
        $living,
        $story,
        $details_json,
        $status
    );
} else {
    mysqli_stmt_bind_param(
        $stmt,
        'iissssisssss',
        $applicant_user_id,
        $assignedAdmin,
        $full_name,
        $email,
        $telephone,
        $address,
        $postcode,
        $has_garden,
        $living,
        $story,
        $details_json,
        $status
    );
}

if (!mysqli_stmt_execute($stmt)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'DB insert failed', 'details' => mysqli_error($conn)]);
    exit;
}

$appId = mysqli_insert_id($conn);

// Create a notification for admin id=1
$noteSql = "INSERT INTO notifications (recipient_user_id, application_id, message) VALUES (?, ?, ?)";
$message = 'New adoption application from ' . ($full_name ?: 'Unknown');
foreach ($adminIds as $aid) {
    $noteStmt = mysqli_prepare($conn, $noteSql);
    if ($noteStmt) {
        mysqli_stmt_bind_param($noteStmt, 'iis', $aid, $appId, $message);
        if (!mysqli_stmt_execute($noteStmt)) {
            $noteError = (isset($noteError) ? $noteError.' | ' : '') . mysqli_error($conn);
        }
    } else {
        $noteError = (isset($noteError) ? $noteError.' | ' : '') . 'prepare failed';
    }
}

$resp = [ 'ok' => true, 'application_id' => $appId ];
if (isset($noteError)) {
    $resp['notification_warning'] = $noteError;
}
echo json_encode($resp);
exit;
