import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEMPLATE_CONSTANTS, TEMPLATE_REGEX } from './constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const templatesRoot = join(__dirname, '..');

export interface TemplateMetadata {
  name: string;
  description: string;
  path: string;
  globs: string;
  alwaysApply: boolean;
  key: string;
}

/**
 * Template paths for direct import
 */
export const TEMPLATE_PATHS = {
  // Layouts
  CURSOR_LAYOUT: join(templatesRoot, 'layout/cursor.mdc.liquid'),

  // Partials
  HEADER_PARTIAL: join(templatesRoot, 'partials/header.mdc.liquid'),
} as const;

/**
 * Parse template metadata from liquid file content
 */
function parseTemplateMetadata(
  filePath: string,
  content: string
): Omit<TemplateMetadata, 'path'> {
  const fileName = basename(filePath, TEMPLATE_CONSTANTS.TEMPLATE_EXTENSION);

  // Extract assigned variables from template
  const ruleDescMatch = content.match(TEMPLATE_REGEX.RULE_DESCRIPTION);
  const globsMatch = content.match(TEMPLATE_REGEX.GLOBS);
  const alwaysApplyMatch = content.match(TEMPLATE_REGEX.ALWAYS_APPLY);

  // Extract first header from content block as fallback name
  const headerMatch = content.match(TEMPLATE_REGEX.CONTENT_HEADER);

  // Generate a clean key from filename
  let key = fileName;
  if (key.startsWith('example-')) {
    key = key.substring(TEMPLATE_CONSTANTS.EXAMPLE_PREFIX_LENGTH); // Remove "example-" prefix
  } else if (key === 'example') {
    key = 'auth'; // Default for base example
  }
  key = key.replace(TEMPLATE_REGEX.DASHES, '_'); // Convert dashes to underscores

  return {
    key,
    name:
      headerMatch?.[1]?.trim() ||
      fileName
        .replace(TEMPLATE_REGEX.EXAMPLE_PREFIX, '')
        .replace(TEMPLATE_REGEX.DASHES, ' ')
        .replace(TEMPLATE_REGEX.WORD_START, (c) => c.toUpperCase()) ||
      'Custom Rule',
    description: ruleDescMatch?.[1] || `Rules for ${fileName}`,
    globs: globsMatch?.[1] || TEMPLATE_CONSTANTS.DEFAULT_GLOBS,
    alwaysApply: alwaysApplyMatch?.[1] === 'true',
  };
}

/**
 * Recursively scan directory for template files
 */
function scanTemplateDirectory(
  dirPath: string,
  relativePath = ''
): TemplateMetadata[] {
  const templates: TemplateMetadata[] = [];

  try {
    const entries = readdirSync(dirPath);

    for (const entry of entries) {
      const fullPath = join(dirPath, entry);
      const relativeFilePath = relativePath ? join(relativePath, entry) : entry;

      try {
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          // Skip layout and partials directories - they're not templates
          if (
            (TEMPLATE_CONSTANTS.SKIP_DIRECTORIES as readonly string[]).includes(
              entry
            )
          ) {
            continue;
          }
          // Recursively scan subdirectories
          templates.push(...scanTemplateDirectory(fullPath, relativeFilePath));
        } else if (
          stat.isFile() &&
          entry.endsWith(TEMPLATE_CONSTANTS.TEMPLATE_EXTENSION)
        ) {
          const content = readFileSync(fullPath, 'utf-8');
          const metadata = parseTemplateMetadata(fullPath, content);

          templates.push({
            ...metadata,
            path: fullPath,
          });
        }
      } catch (error) {
        // Skip files that can't be read
        console.warn(`Warning: Could not process ${fullPath}:`, error);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not scan directory ${dirPath}:`, error);
  }

  return templates;
}

/**
 * Dynamically discovered template registry
 */
let _templateCache: Record<string, TemplateMetadata> | null = null;

function getTemplateRegistry(): Record<string, TemplateMetadata> {
  if (_templateCache) {
    return _templateCache;
  }

  const discoveredTemplates = scanTemplateDirectory(templatesRoot);
  _templateCache = {};

  for (const template of discoveredTemplates) {
    _templateCache[template.key] = template;
  }

  return _templateCache;
}

/**
 * Clear template cache to force re-discovery
 */
export function clearTemplateCache(): void {
  _templateCache = null;
}

/**
 * Load template content from file system
 */
export function loadTemplate(templatePath: string): string {
  try {
    return readFileSync(templatePath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to load template: ${templatePath}. ${error}`);
  }
}

/**
 * Get all available template keys
 */
export function getTemplateKeys(): string[] {
  return Object.keys(getTemplateRegistry());
}

/**
 * Get template by key from dynamic registry
 */
export function getTemplate(
  key: string
): TemplateMetadata & { content: string } {
  const registry = getTemplateRegistry();
  const template = registry[key];

  if (!template) {
    const availableKeys = Object.keys(registry);
    throw new Error(
      `Template not found: ${key}. Available templates: ${availableKeys.join(', ')}`
    );
  }

  return {
    ...template,
    content: loadTemplate(template.path),
  };
}

/**
 * List all available templates
 */
export function listTemplates(): TemplateMetadata[] {
  return Object.values(getTemplateRegistry());
}

/**
 * Check if a template exists
 */
export function hasTemplate(key: string): boolean {
  const registry = getTemplateRegistry();
  return key in registry;
}

/**
 * Get template by file name (without extension)
 */
export function getTemplateByFileName(
  fileName: string
): TemplateMetadata | null {
  const templates = listTemplates();
  return (
    templates.find(
      (t) =>
        basename(t.path, TEMPLATE_CONSTANTS.TEMPLATE_EXTENSION) === fileName
    ) || null
  );
}

/**
 * Discover templates by pattern matching
 */
export function findTemplates(pattern: RegExp): TemplateMetadata[] {
  return listTemplates().filter(
    (template) =>
      pattern.test(template.name) ||
      pattern.test(template.description) ||
      pattern.test(template.key)
  );
}

/**
 * Create template variables for LiquidJS rendering
 */
export function createTemplateVars(
  rule_description: string,
  globs = TEMPLATE_CONSTANTS.DEFAULT_GLOBS,
  alwaysApply = false
) {
  return {
    rule_description,
    globs,
    alwaysApply,
  };
}

/**
 * Get template directory path for adding custom templates
 */
export function getTemplatesDirectory(): string {
  return templatesRoot;
}

/**
 * Refresh template discovery (useful in development)
 */
export function refreshTemplates(): TemplateMetadata[] {
  clearTemplateCache();
  return listTemplates();
}
