<?php
header('Content-Type: application/json; charset=UTF-8');
require __DIR__ . '/db.php';

// Read q: if missing or not a string, use ''. Then trim.
$search = $_GET['q'] ?? '';
if (!is_string($search)) {
    $search = '';
}
$search = trim($search);

$pattern = '%' . $search . '%';

$subject = filter_input(INPUT_GET, 'subject', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
$onShelf = ($_GET['available'] ?? '') === '1';

// The SQL
$sql = 'SELECT books.title,
               books.author,
               books.year AS year,
               subjects.name AS subject,
               books.copies,
               books.copies - books.on_loan AS available
        FROM books
        JOIN subjects ON subjects.id = books.subject_id
        WHERE (books.title LIKE :title OR books.author LIKE :author)';

// Prepare and run, one placeholder per name
$params = [':title' => $pattern, ':author' => $pattern];

if (is_int($subject)) {
    $sql .= ' AND books.subject_id = :subject';
    $params[':subject'] = $subject;
}

if ($onShelf) {
    $sql .= ' AND books.copies - books.on_loan >= 1';
}

$sql .= ' ORDER BY books.title';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

echo json_encode($stmt->fetchAll());