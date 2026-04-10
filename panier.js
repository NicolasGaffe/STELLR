document.addEventListener('DOMContentLoaded', () => {
    
    const style = document.createElement('style');
    style.textContent = `
        .size.selected {
            background: white;
            color: black;
            border-color: white;
            cursor: pointer;
        }
        .add-to-cart:disabled {
            background: #333;
            color: #666;
            cursor: not-allowed;
        }
        .size {
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
 
    const taillesChoisies = {};
 
    document.querySelectorAll('.sizes').forEach((groupe, index) => {
 
        const boutonAjouter = groupe.closest('.product').querySelector('.add-to-cart');
        boutonAjouter.disabled = true;
 
        groupe.querySelectorAll('.size').forEach(bouton => {
            bouton.addEventListener('click', () => {
                groupe.querySelectorAll('.size').forEach(b => b.classList.remove('selected'));
                bouton.classList.add('selected');
                taillesChoisies[index] = bouton.textContent.trim();
                boutonAjouter.disabled = false;
            });
        });
    });
 
    const panier = [];
 
    document.querySelectorAll('.add-to-cart').forEach((bouton, index) => {
        bouton.addEventListener('click', () => {
            if (bouton.disabled) return;
 
            const product    = bouton.closest('.product');
            const nomProduit = product.querySelector('h3').textContent.trim();
            const prixTexte  = product.querySelector('p').textContent.trim();
            const prix       = parseFloat(prixTexte.replace(',', '.').replace(/[^0-9.]/g, ''));
 
            const aSizeSelector = product.querySelector('.sizes');
            const taille = aSizeSelector ? (taillesChoisies[index] || 'Unique') : 'Unique';
 
            const cle = index + '-' + taille;
 
            const articleExistant = panier.find(a => a.key === cle);
            if (articleExistant) {
                articleExistant.qty++;
            } else {
                panier.push({ key: cle, name: nomProduit, price: prix, size: taille, qty: 1 });
            }
 
            afficherPanier();
 
            bouton.textContent = 'AJOUTÉ !';
            setTimeout(() => { bouton.textContent = 'AJOUTER AU PANIER'; }, 1000);
        });
    });
 
    document.body.insertAdjacentHTML('beforeend', `
        <div id="overlay" style="
            display:none; position:fixed; top:0; left:0;
            width:100%; height:100%;
            background:rgba(0,0,0,0.6); z-index:99;
        "></div>
 
        <div id="panier-panel" style="
            display:none; position:fixed; top:0; right:0;
            width:360px; height:100vh;
            background:#0f0f0f; border-left:1px solid #222;
            z-index:100; padding:30px; box-sizing:border-box;
            overflow-y:auto;
        ">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                <h2 style="margin:0; font-size:20px; letter-spacing:3px; color:white;">PANIER</h2>
                <span id="close-panier" style="cursor:pointer; font-size:22px; color:#aaa;">✕</span>
            </div>
            <div id="cart-items">
                <p style="color:#555; font-size:14px;">Ton panier est vide.</p>
            </div>
            <div id="cart-total" style="display:none; border-top:1px solid #222; padding-top:16px; margin-top:16px;">
                <div style="display:flex; justify-content:space-between; font-size:15px; font-weight:600; color:white;">
                    <span>TOTAL</span>
                    <span id="total-price">0,00 €</span>
                </div>
                <button style="
                    width:100%; margin-top:20px;
                    background:white; color:black; border:none;
                    padding:14px; font-weight:bold;
                    font-size:14px; letter-spacing:2px; cursor:pointer;
                ">COMMANDER</button>
            </div>
        </div>
    `);
 
    const iconePanier = document.querySelector('.icons span:last-child');
    iconePanier.style.position = 'relative';
    iconePanier.style.cursor = 'pointer';
    iconePanier.addEventListener('click', togglePanier);
 
    iconePanier.insertAdjacentHTML('beforeend', `
        <span id="cart-count" style="
            display:none; position:absolute;
            top:-8px; right:-10px;
            background:white; color:black;
            border-radius:50%; font-size:11px; font-weight:bold;
            width:18px; height:18px; line-height:18px; text-align:center;
        ">0</span>
    `);
 
    document.getElementById('close-panier').addEventListener('click', togglePanier);
    document.getElementById('overlay').addEventListener('click', togglePanier);
 
    function afficherPanier() {
        const conteneur  = document.getElementById('cart-items');
        const totalEl    = document.getElementById('cart-total');
        const compteurEl = document.getElementById('cart-count');
 
        const nbArticles = panier.reduce((total, a) => total + a.qty, 0);
        compteurEl.textContent = nbArticles;
        compteurEl.style.display = nbArticles > 0 ? 'block' : 'none';
 
        if (panier.length === 0) {
            conteneur.innerHTML = '<p style="color:#555; font-size:14px;">Ton panier est vide.</p>';
            totalEl.style.display = 'none';
            return;
        }
 
        conteneur.innerHTML = panier.map(article => `
            <div style="padding:14px 0; border-bottom:1px solid #222;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                    <div>
                        <div style="font-weight:600; font-size:13px; letter-spacing:1px; color:white;">
                            ${article.name}
                        </div>
                        <div style="font-size:12px; color:#777; margin-top:2px;">
                            ${article.size !== 'Unique' ? 'Taille : ' + article.size : 'Taille unique'}
                        </div>
                    </div>
                    <button onclick="supprimerArticle('${article.key}')" style="
                        background:none; border:none; color:#555;
                        font-size:18px; cursor:pointer; padding:0;
                    " onmouseover="this.style.color='white'" onmouseout="this.style.color='#555'">×</button>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <button onclick="changerQuantite('${article.key}', -1)" style="
                            width:26px; height:26px; background:transparent;
                            border:1px solid #444; color:white; cursor:pointer; font-size:16px;
                        ">−</button>
                        <span style="font-size:14px; min-width:16px; text-align:center;">${article.qty}</span>
                        <button onclick="changerQuantite('${article.key}', 1)" style="
                            width:26px; height:26px; background:transparent;
                            border:1px solid #444; color:white; cursor:pointer; font-size:16px;
                        ">+</button>
                    </div>
                    <span style="font-weight:600; font-size:14px; color:white;">
                        ${(article.price * article.qty).toFixed(2).replace('.', ',')} €
                    </span>
                </div>
            </div>
        `).join('');
 
        const total = panier.reduce((somme, a) => somme + a.price * a.qty, 0);
        document.getElementById('total-price').textContent = total.toFixed(2).replace('.', ',') + ' €';
        totalEl.style.display = 'block';
    }
 
    window.changerQuantite = function(cle, delta) {
        const article = panier.find(a => a.key === cle);
        if (!article) return;
        article.qty += delta;
        if (article.qty <= 0) panier.splice(panier.indexOf(article), 1);
        afficherPanier();
    };
 
    window.supprimerArticle = function(cle) {
        const index = panier.findIndex(a => a.key === cle);
        if (index > -1) panier.splice(index, 1);
        afficherPanier();
    };
 
    function togglePanier() {
        const panel   = document.getElementById('panier-panel');
        const overlay = document.getElementById('overlay');
        const ouvert  = panel.style.display === 'block';
        panel.style.display   = ouvert ? 'none' : 'block';
        overlay.style.display = ouvert ? 'none' : 'block';
    }
 
});