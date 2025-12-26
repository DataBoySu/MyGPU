# Moniteur GPU : Un outil de gestion léger des GPU

![MyGPU](../monitor/api/static/web1.png)

## Présentation

*MyGPU* est un utilitaire de gestion léger des GPU, offrant une interface web élégante et un wrapper compact pour *nvidia-smi*. Il permet une surveillance et une administration efficaces des ressources GPU, avec une approche agile et flexible.

## Caractéristiques clés

- **Légèreté** : Empreinte système minimale.
- **Polyvalence** : Disponible en version CLI ou avec une interface web complète.
- **Administration centrée** : Inclut des fonctionnalités telles que la **restreinte de la VRAM**, la **termination automatique** et les **listes de surveillance**.
- **Amical pour les développeurs** : Outils intégrés de test et de simulation pour valider la stabilité du système.

## Fonctionnalités

- **Surveillance en temps réel** :
  - Métriques détaillées sur les GPU (Utilisation, VRAM, Puissance, Température).
  - Métriques système (CPU, RAM, etc.).

- **Administration et application de politiques** :
  - **Limites de VRAM** : Définir des limites strictes sur l'utilisation de la VRAM par GPU.
  - **Terminaison automatique** : Arrêter automatiquement les processus qui violent les politiques de VRAM (réservé aux administrateurs).
  - **Listes de surveillance** : Surveiller des PIDs ou des noms de processus spécifiques.

- **Benchmarking et simulation** :
  - **Tests de stress** : Chargements de travail GEMM configurables pour tester la throttling thermique et la stabilité.
  - **Simulation visuelle** : Simulation interactive de physique de particules pour visualiser la charge GPU.

## Roadmap et travaux futurs

Les contributions sont les bienvenues ! Les points principaux à aborder dans un futur proche :

- **Prise en charge multi-GPU** : Amélioration de la gestion pour les configurations multi-cartes et les topologies NVLink.
- **Containerisation** : Prise en charge officielle de Docker pour un déploiement facile dans des environnements conteneurisés.
- **Accès à distance** : Intégration du tunnel SSH pour une gestion sécurisée à distance.
- **Prise en charge multi-plateforme** :
  - Prise en charge de Linux (focussé sur Ubuntu/Debian).
  - Prise en charge d'Apple Silicon pour la surveillance macOS.
- **Indépendance matérielle** :
  - Prise en charge de ROCm d'AMD.
  - Prise en charge d'Intel Arc.
- **Documentation multi-langues** (en cours).

Consultez [CONTRIBUTING.md](../CONTRIBUTING.md) pour savoir comment contribuer.

## Exigences

- **Système d'exploitation** : Windows 10/11
- **Python** : 3.10+
- **Matériel** : GPU NVIDIA avec pilotes installés.
- **CUDA** : Toolkit 12.x (strictement requis pour les fonctionnalités de benchmarking/simulation).
  - *Note : Si CUDA 12.x n'est pas détecté, les fonctionnalités de benchmarking GPU seront désactivées.*

## Installation

L'outil offre plusieurs options d'installation pour répondre à vos besoins :

### 1. Minimal (CLI uniquement)

Idéal pour les serveurs sans tête ou la surveillance en arrière-plan.

- Interface en ligne de commande.
- Métriques système et GPU de base.

### 2. Standard (CLI + Interface web)

Idéal pour la plupart des utilisateurs.

- Inclut l'interface web.
- Points de terminaison API REST.
- Graphiques en temps réel.

### 3. Complet (Standard + Simulation)

Idéal pour le développement et les tests de stress.

- Inclut la simulation de particules.
- Dépendances PyTorch/CuPy pour le benchmarking.

### Démarrage rapide

1. **Télécharger** la dernière version ou cloner le dépôt.
2. **Exécuter l'installation** :

   ```powershell
   .\setup.ps1
   ```

3. **Lancer** :

```powershell
# Démarrer l'interface web (Standard/Complet)
python health_monitor.py web

# Lancer l'interface CLI
python health_monitor.py cli
```