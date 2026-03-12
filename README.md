# 🌌 STELLR — Boutique de Vêtements Interstellaire

> **Projet Hackathon - BTS SIO (1ère Année)** > Une plateforme de e-commerce futuriste reposant sur une architecture cloud sécurisée et monitorée.

---

## 🎯 Objectif du Projet
Développé dans le cadre d'un Hackathon, **STELLR** est une solution de commerce en ligne sécurisée. L'enjeu est de démontrer la capacité à déployer une infrastructure robuste, segmentée et supervisée, répondant aux exigences professionnelles de disponibilité et de sécurité.

## 🛠️ Architecture & Services Interactifs

Le projet repose sur une architecture distribuée et des outils de gestion ITSM :

* **Infrastructure Web (Azure) :**
    * **Frontend :** Interface utilisateur isolée sur une VM dédiée.
    * **Backend & API :** Logique métier hébergée sur une VM distincte, communiquant via une API sécurisée.
* **Gestion de Projet :** Suivi des tâches et de la roadmap via un tableau **Trello**.
* **Collaboration :** Dépôt **GitHub Public** avec gestion fine des droits d'accès pour les collaborateurs.
* **Support & Maintenance (GLPI) :** Gestion des incidents et des demandes via un système de tickets avec profils utilisateurs (Techniciens / Utilisateurs).
* **Supervision (Zabbix) :** Monitoring en temps réel de la santé des VMs (CPU, RAM, disponibilité des services).

## 🔒 Sécurité Mise en Place
La sécurité est au cœur de l'infrastructure STELLR :
* **Accès SSH durci :** Connexion aux VMs Azure exclusivement par **clés privées** fournies par l'administrateur (authentification par mot de passe désactivée).
* **Segmentation Réseau (NSG) :** Contrôle strict des flux. Seuls les ports indispensables (ex: 80, 443, 10050 pour Zabbix) sont ouverts.
* **Gestion des habilitations :** Application du principe de moindre privilège sur GLPI et GitHub.

## 🎓 Compétences Validées (Référentiel BTS SIO)

### **C1 - Recenser et identifier les ressources numériques**
* **Pourquoi ?** Ce projet a nécessité la cartographie complète de l'infrastructure (VMs, API, bases de données) et le choix d'outils adaptés (Zabbix pour l'inventaire technique, GLPI pour l'inventaire matériel/logiciel).

### **C3 - Mettre en place et vérifier les niveaux d'habilitation associés à un service**
* **Pourquoi ?** Mise en œuvre de politiques d'accès différenciées : droits d'écriture restreints sur GitHub, rôles spécifiques dans GLPI (Admin vs User) et gestion des clés SSH pour l'administration des serveurs.

### **C4 - Vérifier les conditions de la continuité d'un service informatique**
* **Pourquoi ?** Utilisation de **Zabbix** pour détecter proactivement les pannes et de **GLPI** pour assurer le suivi de la résolution des incidents, garantissant ainsi un taux de disponibilité optimal pour la boutique.

---
🚀 *Projet réalisé par l'équipe STELLR dans le cadre de la formation BTS SIO.*
