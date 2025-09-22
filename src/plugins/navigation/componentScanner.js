/**
 * Plugin de détection automatique des composants avec métadonnées de navigation
 * Scanne les fichiers pour extraire les configurations de navigation
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

class ComponentScanner {
  constructor(options = {}) {
    this.options = {
      scanPaths: ['src/views/**/*.jsx', 'src/app/**/page.jsx', 'src/components/**/*.jsx'],
      cacheFile: '.navigation-cache.json',
      excludePaths: ['node_modules', '.next', 'out'],
      ...options
    };
    this.cache = new Map();
    this.loadCache();
  }

  /**
   * Scanne tous les fichiers pour extraire les métadonnées de navigation
   */
  async scanComponents() {
    const components = [];
    
    for (const pattern of this.options.scanPaths) {
      const files = await glob(pattern, { 
        ignore: this.options.excludePaths.map(p => `**/${p}/**`)
      });
      
      for (const file of files) {
        const metadata = await this.extractNavigationMetadata(file);
        if (metadata) {
          components.push({
            file,
            ...metadata,
            lastModified: fs.statSync(file).mtime.getTime()
          });
        }
      }
    }

    // Trier par section puis par ordre
    components.sort((a, b) => {
      if (a.section !== b.section) {
        return (a.section || '').localeCompare(b.section || '');
      }
      return (a.order || 999) - (b.order || 999);
    });

    this.saveCache(components);
    return components;
  }

  /**
   * Extrait les métadonnées de navigation d'un fichier
   */
  async extractNavigationMetadata(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Recherche du pattern navigationConfig
      const configMatch = content.match(/export\s+const\s+navigationConfig\s*=\s*({[\s\S]*?});/);
      if (!configMatch) return null;

      // Parse de la configuration (simple eval pour les objets littéraux)
      const configStr = configMatch[1];
      const config = this.parseConfig(configStr);
      
      if (!config || !config.enabled) return null;

      // Extraction du chemin de route depuis le fichier
      const routePath = this.extractRoutePath(filePath);
      
      return {
        ...config,
        href: config.href || routePath,
        component: path.basename(filePath, '.jsx')
      };
    } catch (error) {
      console.warn(`Erreur lors de l'analyse de ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * Parse la configuration JavaScript (version simplifiée)
   */
  parseConfig(configStr) {
    try {
      // Remplace les valeurs non-JSON par des strings
      const jsonStr = configStr
        .replace(/'/g, '"')
        .replace(/(\w+):/g, '"$1":')
        .replace(/true/g, 'true')
        .replace(/false/g, 'false')
        .replace(/undefined/g, 'null');
      
      return JSON.parse(jsonStr);
    } catch (error) {
      console.warn('Erreur de parsing de configuration:', error.message);
      return null;
    }
  }

  /**
   * Extrait le chemin de route depuis le chemin de fichier
   */
  extractRoutePath(filePath) {
    // Conversion du chemin de fichier en route Next.js
    let route = filePath
      .replace(/^src\/app/, '')
      .replace(/\/page\.jsx$/, '')
      .replace(/\[([^\]]+)\]/g, ':$1'); // [id] -> :id
    
    if (route === '') route = '/';
    if (!route.startsWith('/')) route = '/' + route;
    
    return route;
  }

  /**
   * Charge le cache depuis le fichier
   */
  loadCache() {
    try {
      if (fs.existsSync(this.options.cacheFile)) {
        const cacheData = JSON.parse(fs.readFileSync(this.options.cacheFile, 'utf8'));
        this.cache = new Map(cacheData);
      }
    } catch (error) {
      console.warn('Erreur de chargement du cache:', error.message);
    }
  }

  /**
   * Sauvegarde le cache dans un fichier
   */
  saveCache(components) {
    try {
      const cacheData = components.map(comp => [comp.file, comp]);
      fs.writeFileSync(this.options.cacheFile, JSON.stringify(cacheData, null, 2));
    } catch (error) {
      console.warn('Erreur de sauvegarde du cache:', error.message);
    }
  }

  /**
   * Génère la structure de navigation hiérarchique
   */
  generateNavigationStructure(components) {
    const structure = [];
    const sections = new Map();

    for (const component of components) {
      if (!component.enabled) continue;

      const section = component.section || 'General';
      
      if (!sections.has(section)) {
        sections.set(section, {
          sectionTitle: section,
          items: []
        });
        structure.push(sections.get(section));
      }

      const item = {
        label: component.label,
        href: component.href,
        icon: component.icon,
        order: component.order || 999,
        permissions: component.permissions || [],
        children: component.children || []
      };

      sections.get(section).items.push(item);
    }

    // Trier les items dans chaque section
    structure.forEach(section => {
      section.items.sort((a, b) => (a.order || 999) - (b.order || 999));
    });

    return structure;
  }
}

export default ComponentScanner;
