<div align="center">
  <a href="../README.md">🇺🇸 English</a> |
  <a href="../locales/README.de.md">🇩🇪 Deutsch</a> |
  <a href="../locales/README.fr.md">🇫🇷 Français</a> |
  <a href="../locales/README.es.md">🇪🇸 Español</a> |
  <a href="../locales/README.ja.md">🇯🇵 日本語</a> |
  <a href="../locales/README.zh.md">🇨🇳 中文</a> |
  <a href="../locales/README.pt.md">🇵🇹 Português</a> |
  <a href="../locales/README.ko.md">🇰🇷 한국어</a> |
  <a href="../locales/README.hi.md">🇮🇳 हिंदी</a>
</div>
</details>
<div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
<img src="../monitor/api/static/cli5.png" style="width:100%; height:100%; object-fit:contain;" />
</div>
<div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
<img src="../monitor/api/static/cli4.png" style="width:100%; height:100%; object-fit:contain;" />
</div>
<div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
<img src="../monitor/api/static/cli3.png" style="width:100%; height:100%; object-fit:contain;" />
</div>
<div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
<img src="../monitor/api/static/cli2.png" style="width:100%; height:100%; object-fit:contain;" />
</div>
</details>
<details>
<summary>
</summary>
<div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
<div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
<img src="../monitor/api/static/cli1.png" style="width:100%; height:100%; object-fit:contain;" />
</div>
</div>
<div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
<img src="../monitor/api/static/web4.png" style="width:100%; height:100%; object-fit:contain;" />
</div>
<div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
<img src="../monitor/api/static/web3.png" style="width:100%; height:100%; object-fit:contain;" />
</div>
<div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
<img src="../monitor/api/static/web2.png" style="width:100%; height:100%; object-fit:contain;" />
</div>
<div style="text-align:center; margin:18px 0;">
  <img src="../monitor/api/static/logo.png" alt="MyGPU logo"/>
</div>
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![Version](https://img.shields.io/badge/version-1.2.3-blue)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)
![cuda 12.x](https://img.shields.io/badge/CUDA-12.x-0f9d58?logo=nvidia)
<details>
<summary>
</summary>
<div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
<!-- Use first image aspect ratio 1624x675 for slide frame; images fit inside using object-fit:contain -->
<div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
<img src="../monitor/api/static/web1.png" style="width:100%; height:100%; object-fit:contain;" />
</div>

## Mon utilitaire GPU : MyGPU - Un outil de gestion léger des GPU avec un tableau de bord web élégant

**MyGPU** est un outil léger de gestion des GPU, un wrapper compact de `nvidia-smi` avec un tableau de bord web intégré.

## Galerie

- **Tableau de bord web** : une interface utilisateur intuitive pour surveiller et gérer vos GPU.
- **CLI** : une interface en ligne de commande pour une utilisation rapide et discrète.

## Pourquoi l'utiliser ?

- **Léger** : empreinte minimale en termes de ressources.
- **Polyvalent** : fonctionne en tant qu'outil CLI ou avec un tableau de bord web complet.
- **Orienté administration** : inclut des fonctionnalités telles que la **limitation de la VRAM** et les **listes de surveillance**.
- **Amical pour les développeurs** : outils intégrés de test et de simulation pour valider la stabilité du système.

## Fonctionnalités

- **Surveillance en temps réel** :
  - Métriques détaillées sur les GPU (Utilisation, VRAM, Puissance, Température).
  - Métriques système (CPU, RAM, etc.).

- **Administration et application de règles** :
  - **Limites de VRAM** : définissez des limites strictes sur l'utilisation de la VRAM par GPU.
  - **Arrêt automatique** : arrêtez automatiquement les processus qui violent les règles de la VRAM (réservé aux administrateurs).
  - **Listes de surveillance** : surveillez des PIDs ou des noms de processus spécifiques.

- **Test et simulation** :
  - **Tests de stress** : charges de travail GEMM configurables pour tester la throttling thermique et la stabilité.
  - **Simulation visuelle** : simulation interactive de physique des particules pour visualiser la charge du GPU.

## Roadmap et travaux futurs

Les contributions sont les bienvenues ! Les points principaux à aborder dans un futur proche sont :

- **Prise en charge multi-GPU** : amélioration de la gestion des configurations multi-cartes et des topologies NVLink.
- **Conteneurisation** : prise en charge officielle de Docker pour un déploiement facile dans des environnements conteneurisés.
- **Accès à distance** : intégration du tunnel SSH et de la gestion sécurisée à distance.
- **Prise en charge multi-plateforme** :

  - [ ] Linux (focalisation sur Ubuntu/Debian).
  - [ ] macOS (prise en charge Apple Silicon pour la surveillance).

- **Indépendant de l'hardware** :

  - [ ] Prise en charge de ROCm d'AMD.
  - [ ] Prise en charge d'Intel Arc.

- **Documentation multi-langues** : prise en charge des principales langues de GitHub.

Consultez [CONTRIBUTING.md](../CONTRIBUTING.md) pour savoir comment participer.

## Exigences

- **Système d'exploitation** : Windows 10/11
- **Python** : 3.10+
- **Hardware** : GPU NVIDIA avec pilotes installés.
- **CUDA** : Toolkit 12.x (strictement requis pour les fonctionnalités de test et de simulation).

  *Note : Si CUDA 12.x n'est pas détecté, les fonctionnalités de test et de simulation seront désactivées.*

## Installation

L'outil offre plusieurs options d'installation pour répondre à vos besoins :

### 1. Minimal (CLI uniquement)

Idéal pour les serveurs sans tête ou la surveillance en arrière-plan.

- Interface en ligne de commande.
- Métriques système et GPU de base.

### 2. Standard (CLI + Tableau de bord web)

Idéal pour la plupart des utilisateurs.

- Inclut le tableau de bord web.
- Points de terminaison d'API REST.
- Graphiques en temps réel.

### 3. Complet (Standard + Simulation)

Idéal pour le développement et les tests de stress.

- Inclut la simulation de particules.
- Dépendances PyTorch/CuPy pour les tests de performance.

### Démarrage rapide

1. **Téléchargez** la dernière version ou clonez le dépôt.
2. **Exécutez l'installation** :

  ```powershell
  .\setup.ps1
  ```

3. **Démarrez** :

```powershell
# Démarrez le tableau de bord web (Standard/Complet)
python health_monitor.py web

# Démarrez l'interface CLI
python health_monitor.py cli
```

## Licence

Licence MIT. Veuillez consulter le fichier [LICENSE](../LICENSE) pour plus de détails.