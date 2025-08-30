/**
 * Regular expressions for parsing template metadata
 */
export const TEMPLATE_REGEX = {
  /**
   * Matches {% assign rule_description = "value" %} statements
   */
  RULE_DESCRIPTION: /\{%\s*assign\s+rule_description\s*=\s*["']([^"']+)["']/,

  /**
   * Matches {% assign globs = "value" %} statements
   */
  GLOBS: /\{%\s*assign\s+globs\s*=\s*["']([^"']+)["']/,

  /**
   * Matches {% assign alwaysApply = true|false %} statements
   */
  ALWAYS_APPLY: /\{%\s*assign\s+alwaysApply\s*=\s*(true|false)/,

  /**
   * Matches the first ## header in a content block
   */
  CONTENT_HEADER: /\{%\s*block\s+content\s*%\}[\s\S]*?##\s*([^\n]+)/,

  /**
   * Matches word boundaries for filename processing
   */
  WORD_START: /^\w/,

  /**
   * Matches "example-" prefix and dashes for filename processing
   */
  EXAMPLE_PREFIX: /^example-?/,

  /**
   * Matches dashes for replacement with spaces
   */
  DASHES: /-/g,
} as const;

/**
 * Constants for template processing
 */
export const TEMPLATE_CONSTANTS = {
  /**
   * Length of "example-" prefix to remove from filenames
   */
  EXAMPLE_PREFIX_LENGTH: 8,

  /**
   * Default file glob pattern for templates
   */
  DEFAULT_GLOBS: '**/*.{ts,tsx,js,jsx}',

  /**
   * Template file extension
   */
  TEMPLATE_EXTENSION: '.mdc.liquid',

  /**
   * Directories to skip during template scanning
   */
  SKIP_DIRECTORIES: ['layout', 'partials', 'src', 'node_modules'] as const,
} as const;
