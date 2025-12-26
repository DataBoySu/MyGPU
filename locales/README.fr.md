# MyGPU : Outil de gestion léger des GPU

*MyGPU : un utilitaire de gestion léger des GPU, un wrapper compact pour `nvidia-smi` avec un tableau de bord web élégant.*

## Galerie

<details>
  <summary>Tableau de bord web</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <!-- Utilisez la première image pour le cadre du diaporama; ajustez les autres en conséquence -->
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
    <!-- Ajoutez d'autres images CLI ici -->
  </div>
</details>

## Pourquoi utiliser MyGPU ?

- **Léger** : empreinte ressource minimale.
- **Polyvalent** : fonctionne en tant qu'outil CLI ou avec un tableau de bord web complet.
- **Orienté administration** : inclut des fonctionnalités telles que **l'allocation de VRAM** (arrêt automatique des processus dépassant les limites) et les **listes de surveillance**.
- **Amical pour les développeurs** : outils intégrés de test et de simulation de stress (GEMM, physique des particules) pour valider la stabilité du système.

---

## Fonctionnalités

- **Surveillance en temps réel** :
  - Métriques détaillées sur les GPU (utilisation, VRAM, puissance, température).
  - Métriques système (CPU, RAM, etc.).

- **Administration et application de règles** :
  - **Limites de VRAM** : définissez des limites dures sur l'utilisation de la VRAM par GPU.
  - **Arrêt automatique** : arrêtez automatiquement les processus qui violent les règles de politique de VRAM (uniquement pour les administrateurs).
  - **Listes de surveillance** : surveillez des PIDs ou des noms de processus spécifiques.

- **Test et simulation** :
  - **Test de stress** : configurez des charges de travail GEMM pour tester la thermolage et la stabilité.
  - **Simulation visuelle** : simulation interactive de physique des particules pour visualiser la charge de travail du GPU.

---

## Roadmap et travaux futurs

Les contributions sont les bienvenues ! Les points principaux à aborder seraient :

- **Prise en charge multi-GPU** : gestion améliorée des configurations multi-cartes et des topologies NVLink.
- **Conteneurisation** : prise en charge officielle de Docker pour un déploiement facile dans des environnements conteneurisés.
- **Accès à distance** : intégration du tunnel SSH et de la gestion à distance sécurisée.
- **Prise en charge multiplateforme** :
  - [ ] Linux (focalisation sur Ubuntu/Debian).
  - [ ] macOS (surveillance Apple Silicon).
- **Indépendance matérielle** :
  - [ ] Prise en charge AMD ROCm.
  - [ ] Prise en charge Intel Arc.
- ~~**Documentation multilingue** : prise en charge des principales langues GitHub.~~

Consultez [CONTRIBUTING.md](../CONTRIBUTING.md) pour savoir comment participer.

---

## Exigences

- **Système d'exploitation** : Windows 10/11
- **Python** : 3.10+
- **Matériel** : GPU NVIDIA avec pilotes installés.
- **CUDA** : Toolkit 12.x (strictement requis pour les fonctionnalités de test et de simulation).
  - *Remarque : si CUDA 12.x n'est pas détecté, les fonctionnalités de test et de simulation seront désactivées.*

---

## Installation

L'outil prend en charge une installation modulaire pour répondre à vos besoins :

### 1. Installation minimale (CLI uniquement)

Idéale pour les serveurs sans tête ou la surveillance en arrière-plan.

- Interface en ligne de commande.
- Métriques système et GPU de base.

### 2. Installation standard (CLI + tableau de bord web)

Idéale pour la plupart des utilisateurs.

- Inclut le tableau de bord web.
- Points de terminaison API REST.
- Graphiques en temps réel.
- Mais sans simulation ou test.

### 3. Installation complète (Standard + visualisation)

Idéale pour le développement et les tests de stress.

- Inclut la simulation.
- Dépendances PyTorch/CuPy pour les tests de performance.

### Démarrage rapide

1. **Téléchargez** la dernière version ou clonez le dépôt.
2. **Exécutez l'installation** :

   ```powershell
   .\setup.ps1
   ```

3. **Lancez** :

```powershell
# Démarrez le tableau de bord web (Standard/Complete)
python health_monitor.py web

# Démarrez l'interface en ligne de commande
python health_monitor.py cli
```

---

## Licence

MIT. Voir [LICENSE](../LICENSE) pour plus de détails.