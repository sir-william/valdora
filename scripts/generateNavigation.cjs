#!/usr/bin/env node

/**
 * Script de génération de navigation statique
 * Utilise le ComponentScanner pour générer un fichier de navigation statique
 * à utiliser lors du build de production
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

class NavigationGenerator {
  constructor() {
    this.components = [];
    this.outputPath = path.join(process.cwd(), 'src/data/navigation/generated.js');
  }

  async generate() {
    console.log('🔍 Scanning components for navigation metadata...');
    
    try {
      await this.scanComponents();
      const navigation = this.buildNavigationStructure();
      await this.writeNavigationFile(navigation);
      
      console.log(`✅ Navigation generated successfully: ${this.outputPath}`);
      console.log(`📊 Found ${this.components.length} components with navigation config`);
    } catch (error) {
      console.error('❌ Error generating navigation:', error);
      process.exit(1);
    }
  }

  async scanComponents() {
    const patterns = [
      'src/views/**/*.jsx',
      'src/app/**/page.jsx',
      'src/components/**/*.jsx'
    ];

    for (const pattern of patterns) {
      const files = await glob(pattern, {
        ignore: ['**/node_modules/**', '**/.next/**', '**/out/**']
      });

      console.log(`📁 Found ${files.length} files for pattern: ${pattern}`);
      
      for (const file of files) {
        console.log(`🔍 Analyzing: ${file}`);
        const metadata = await this.extractNavigationMetadata(file);
        if (metadata) {
          console.log(`✅ Found navigation config in: ${file}`);
          this.components.push({
            file,
            ...metadata
          });
        } else {
          console.log(`❌ No navigation config in: ${file}`);
        }
      }
    }
  }

  async extractNavigationMetadata(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Recherche du pattern navigationConfig
      const configMatch = content.match(/export\s+const\s+navigationConfig\s*=\s*({[\s\S]*?});/);
      if (!configMatch) return null;

      // Parse de la configuration
      const configStr = configMatch[1];
      const config = this.parseConfig(configStr);
      
      if (!config || !config.enabled) return null;

      // Extraction du chemin de route
      const routePath = this.extractRoutePath(filePath);
      
      return {
        ...config,
        href: config.href || routePath,
        component: path.basename(filePath, '.jsx'),
        filePath
      };
    } catch (error) {
      console.warn(`⚠️  Error analyzing ${filePath}:`, error.message);
      return null;
    }
  }

  parseConfig(configStr) {
    try {
      // Conversion simple pour les objets littéraux JavaScript
      const jsonStr = configStr
        .replace(/'/g, '"')
        .replace(/(\w+):/g, '"$1":')
        .replace(/,(\s*[}\]])/g, '$1'); // Supprime les virgules finales
      
      return JSON.parse(jsonStr);
    } catch (error) {
      console.warn('⚠️  Config parsing error:', error.message);
      return null;
    }
  }

  extractRoutePath(filePath) {
    let route = filePath
      .replace(/^src\/app/, '')
      .replace(/\/page\.jsx$/, '')
      .replace(/\[([^\]]+)\]/g, ':$1');
    
    if (route === '') route = '/';
    if (!route.startsWith('/')) route = '/' + route;
    
    return route;
  }

  buildNavigationStructure() {
    // Trier par section puis par ordre
    this.components.sort((a, b) => {
      if (a.section !== b.section) {
        return (a.section || '').localeCompare(b.section || '');
      }
      return (a.order || 999) - (b.order || 999);
    });

    const sections = new Map();
    
    for (const component of this.components) {
      if (!component.enabled) continue;

      const sectionName = component.section || 'General';
      
      if (!sections.has(sectionName)) {
        sections.set(sectionName, {
          sectionTitle: sectionName,
          items: []
        });
      }

      const item = {
        label: component.label,
        href: component.href,
        icon: component.icon,
        order: component.order || 999,
        permissions: component.permissions || [],
        children: component.children || []
      };

      sections.get(sectionName).items.push(item);
    }

    // Convertir en tableau et trier les items
    const navigation = Array.from(sections.values());
    navigation.forEach(section => {
      section.items.sort((a, b) => (a.order || 999) - (b.order || 999));
    });

    return navigation;
  }

  async writeNavigationFile(navigation) {
    const content = `/**
 * Navigation générée automatiquement
 * ⚠️  Ne pas modifier ce fichier manuellement
 * Généré le: ${new Date().toISOString()}
 * Composants scannés: ${this.components.length}
 */

const generatedNavigation = ${JSON.stringify(navigation, null, 2)};

export default generatedNavigation;

// Métadonnées de génération
export const generationMetadata = {
  generatedAt: '${new Date().toISOString()}',
  componentsCount: ${this.components.length},
  components: ${JSON.stringify(this.components.map(c => ({
    file: c.filePath,
    label: c.label,
    section: c.section,
    enabled: c.enabled
  })), null, 2)}
};
`;

    // Créer le répertoire si nécessaire
    const dir = path.dirname(this.outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(this.outputPath, content, 'utf8');
  }
}

// Exécution du script
if (require.main === module) {
  const generator = new NavigationGenerator();
  generator.generate();
}

module.exports = NavigationGenerator;
