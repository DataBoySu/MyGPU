# Navigation Bar

<a href="../README.md">🇺🇸 Anglais</a> |
<a href="../locales/README.de.md">🇩🇪 Allemand</a> |
<a href="../locales/README.fr.md">🇫🇷 Français</a> |
<a href="../locales/README.es.md">🇪🇸 Espagnol</a> |
<a href="../locales/README.ja.md">🇯🇵 Japonais</a> |
<a href="../locales/README.zh.md">🇨🇳 Chinois</a> |
<a href="../locales/README.pt.md">🇵🇹 Portugais</a> |
<a href="../locales/README.ko.md">🇰🇷 Coréen</a> |
<a href="../locales/README.hi.md">🇮🇳 Hindi</a>

# Logo

[MyGPU Logo](../monitor/api/static/logo.png)

# Citation

*MyGPU : Outil de gestion GPU léger : un wrapper compact pour `nvidia-smi` avec un tableau de bord web élégant.*

## Galerie

<details>
  <summary>Tableau de bord Web</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <!-- Utilisez la première image pour le cadre de diapositive; ajustez la largeur/hauteur pour correspondre -->
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/web1.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/web2.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/web3.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/web4.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
  </div>
</details>
<details>
  <summary>Interface en ligne de commande (CLI)</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli1.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli2.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli3.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli4.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli5.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
  </div>
</details>

## Pourquoi l'utiliser ?

- **Légèreté** : Empreinte ressource minimale.
- **Flexibilité** : Fonctionne comme un outil CLI ou un tableau de bord Web complet.
- **Administration centrée** : Inclut des fonctionnalités comme **l'enforcement de la mémoire VRAM** (arrêt automatique des processus dépassant les limites) et les **listes de surveillance**.
- **Amical pour les développeurs** : Outils intégrés de test et de stress (GEMM, physique des particules) pour valider la stabilité du système.

---

## Fonctionnalités

- **Surveillance en temps réel** :
  - Métriques détaillées sur les GPU (Utilisation, VRAM, Puissance, Température).
  - Métriques système (CPU, RAM, etc.).

- **Administration et application de règles** :
  - **Limites de VRAM** : Définir des limites strictes sur l'utilisation de la VRAM par GPU.
  - **Arrêt automatique** : Arrêter automatiquement les processus qui violent les règles de VRAM (uniquement pour les administrateurs).
  - **Listes de surveillance** : Surveiller des PIDs ou des noms de processus spécifiques.

- **Benchmarking et simulation** :
  - **Tests de stress** : Configurer des charges de travail GEMM pour tester la mise en page thermique et la stabilité.
  - **Simulation visuelle** : Simulation interactive de physique des particules pour visualiser la charge de travail du GPU.

---

## Roadmap et travaux futurs

Les contributions sont les bienvenues ! Les points principaux à couvrir seraient :

- **Prise en charge multi-GPU** : Gestion améliorée des configurations multi-cartes et des topologies NVLink.
- **Conteneurisation** : Support officiel pour Docker pour un déploiement facile dans des environnements conteneurisés.
- **Accès à distance** : Intégration du tunnel SSH et de la gestion à distance sécurisée.
- **Prise en charge multi-plateforme** :
  - [ ] Linux (focalisation sur Ubuntu/Debian).
  - [ ] macOS (surveillance des Apple Silicon).
- **Indépendance matérielle** :
  - [ ] Prise en charge d'AMD ROCm.
  - [ ] Prise en charge d'Intel Arc.
- ~~**Documentation multi-langues** : Prise en charge des principales langues GitHub.~~

Consultez [CONTRIBUTING.md](../CONTRIBUTING.md) pour savoir comment contribuer.

---

## Exigences

- **Système d'exploitation** : Windows 10/11
- **Python** : 3.10+
- **Matériel** : GPU NVIDIA avec pilotes installés.
- **CUDA** : Version 12.x (strictement requise pour les fonctionnalités de benchmarking/simulation).
  - *Remarque : Si CUDA 12.x n'est pas détecté, les fonctionnalités de benchmarking seront désactivées.*

---

## Installation

L'outil prend en charge une installation modulaire pour répondre à vos besoins :

### 1. Installation minimale (CLI uniquement)

Idéale pour les serveurs sans tête ou la surveillance en arrière-plan.

- Interface en ligne de commande.
- Métriques de base système/GPU.

### 2. Installation standard (CLI + Tableau de bord Web)

Idéale pour la plupart des utilisateurs.

- Inclut le tableau de bord Web.
- Points d'extrémité API REST.
- Graphiques en temps réel.
- Mais sans simulation ou benchmarking.

### 3. Installation complète (Standard + Visualisation)

Idéale pour le développement et les tests de stress.

- Inclut la simulation.
- Dépendances PyTorch/CuPy pour le benchmarking.

### Démarrage rapide

1. **Téléchargez** la dernière version ou clonez le dépôt.
2. **Exécutez l'installation** :

  ```powershell
  .\setup.ps1
  ```

3. **Lancez** :

```powershell
# Démarrez le tableau de bord Web (Standard/Complete)
python health_monitor.py web

# Lancez l'interface en ligne de commande
python health_monitor.py cli
```