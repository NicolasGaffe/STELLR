<?php
session_start();
require_once '../api/db.php';

$articles = [];
$tailles = [];

try {
    // 🔹 Récupération des articles (Bijoux)
    $sql = "SELECT a.id_article, a.nom_article, a.prix_article, a.stock,
                   COALESCE(a.image_article, 'bijoux.jpg') AS image_article
            FROM Article a
            INNER JOIN Accessoires ac ON a.id_article = ac.id_article
            WHERE ac.type_accessoire = :type";

    $stmt = $conn->prepare($sql);
    $stmt->execute(['type' => 'Bijoux']);
    $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 🔹 Récupération des tailles
    if (!empty($articles)) {
        $ids = array_column($articles, 'id_article');

        // sécurise les placeholders
        $placeholders = implode(',', array_fill(0, count($ids), '?'));

        $sql_tailles = "
            SELECT id_article, taille, stock 
            FROM Article_Taille
            WHERE id_article IN ($placeholders)
        ";

        $stmt_t = $conn->prepare($sql_tailles);
        $stmt_t->execute($ids);

        while ($t = $stmt_t->fetch(PDO::FETCH_ASSOC)) {
            $tailles[$t['id_article']][] = $t;
        }
    }

} catch (PDOException $e) {
    // 🔥 debug (à enlever en prod)
    echo 'Erreur SQL : ' . $e->getMessage();
}

// 🔹 Nombre d'articles dans le panier
$nb_panier = isset($_SESSION['panier']) ? count($_SESSION['panier']) : 0;
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bijoux – STELLR</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<header class="navbar">
    <div class="logo">STELLR</div>

    <nav class="menu">
        <a href="index.html">HOME</a>
        <a href="shop.html">SHOP</a>
        <a href="account.html">ACCOUNT</a>
        <a href="contact.html">CONTACT</a>
    </nav>

    <div class="icons">
        <span></span>
        <span></span>
        <span></span>
    </div>
</header>


<section class="shop-section">
    <h1 class="shop-title">BIJOUX</h1>

    <div class="shop-grid">

        <div class="product">
            <img src="/image/bijoux.jpg" alt="Chaîne argent streetwear">
            <h3>Bague Vision – Argent</h3>
            <p>25,00 €</p>
        </div>

        <div class="product">
            <img src="/image/bijoux1.jpg" alt="Bague anneau noir">
            <h3>Bague Lin - Argent</h3>
            <p>25,00 €</p>
        </div>

        <div class="product">
            <img src="/image/bijoux2.jpg" alt="Bague métal">
            <h3>Bague Steel – Argent</h3>
            <p>25,00 €</p>
        </div>

    </div>
</section>

</body>
</html>
