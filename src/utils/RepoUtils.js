/**
 * Extrai o nome do repositório de uma URL do GitHub
 * @param {string} url - URL do repositório
 * @returns {string} - Nome do repositório
 */
export function extractRepoNameFromUrl(url) {
  if (!url) return '';
  
  try {
    // Remove .git se existir
    let cleanUrl = url.replace(/\.git$/, '');
    
    // Remove query parameters e fragments
    cleanUrl = cleanUrl.split('?')[0].split('#')[0];
    
    // Remove trailing slash
    cleanUrl = cleanUrl.replace(/\/$/, '');
    
    // Extrai o último segmento após a última barra
    const segments = cleanUrl.split('/');
    return segments[segments.length - 1] || '';
  } catch (error) {
    console.warn('Erro ao extrair nome do repositório:', error);
    return '';
  }
}

/**
 * Formata o nome do repositório para exibição
 * @param {string} repoName - Nome do repositório
 * @returns {string} - Nome formatado
 */
export function formatRepoName(repoName) {
  if (!repoName) return 'Repositório';
  
  // Capitaliza a primeira letra e substitui hífens/underscores por espaços
  return repoName
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}