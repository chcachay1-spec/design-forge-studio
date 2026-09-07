import type { DesignNode } from './types';

export function generateCssCode(node: DesignNode): string {
  const styles = node.styles || {};
  const rules: string[] = [];

  if (styles.display) rules.push('  display: ' + styles.display + ';');
  if (styles.flexDirection) rules.push('  flex-direction: ' + styles.flexDirection + ';');
  if (styles.alignItems) rules.push('  align-items: ' + styles.alignItems + ';');
  if (styles.justifyContent) rules.push('  justify-content: ' + styles.justifyContent + ';');
  if (styles.gap) rules.push('  gap: ' + styles.gap + ';');
  if (styles.width) rules.push('  width: ' + styles.width + ';');
  if (styles.height) rules.push('  height: ' + styles.height + ';');
  if (styles.padding) rules.push('  padding: ' + styles.padding + ';');
  if (styles.margin) rules.push('  margin: ' + styles.margin + ';');
  if (styles.backgroundColor) rules.push('  background-color: ' + styles.backgroundColor + ';');
  if (styles.backgroundGradient) rules.push('  background-image: ' + styles.backgroundGradient + ';');
  if (styles.color) rules.push('  color: ' + styles.color + ';');
  if (styles.fontFamily) rules.push('  font-family: \'' + styles.fontFamily + '\', sans-serif;');
  if (styles.fontSize) rules.push('  font-size: ' + styles.fontSize + ';');
  if (styles.fontWeight) rules.push('  font-weight: ' + styles.fontWeight + ';');
  if (styles.letterSpacing) rules.push('  letter-spacing: ' + styles.letterSpacing + ';');
  if (styles.textTransform && styles.textTransform !== 'none') rules.push('  text-transform: ' + styles.textTransform + ';');
  if (styles.borderRadius) rules.push('  border-radius: ' + styles.borderRadius + ';');
  if (styles.borderWidth) rules.push('  border: ' + styles.borderWidth + ' ' + (styles.borderStyle || 'solid') + ' ' + (styles.borderColor || '#334155') + ';');
  if (styles.boxShadow) rules.push('  box-shadow: ' + styles.boxShadow + ';');
  if (styles.opacity) rules.push('  opacity: ' + styles.opacity + ';');

  const className = '.' + node.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return className + ' {\n' + rules.join('\n') + '\n}';
}

export function generateTailwindClasses(node: DesignNode): string {
  const styles = node.styles || {};
  const classes: string[] = [];

  if (styles.display === 'flex') {
    classes.push('flex');
    if (styles.flexDirection === 'column') classes.push('flex-col');
    if (styles.alignItems === 'center') classes.push('items-center');
    if (styles.alignItems === 'flex-start') classes.push('items-start');
    if (styles.alignItems === 'flex-end') classes.push('items-end');
    if (styles.justifyContent === 'center') classes.push('justify-center');
    if (styles.justifyContent === 'space-between') classes.push('justify-between');
  }

  if (styles.width === '100%') classes.push('w-full');
  else if (styles.width && styles.width !== 'auto') classes.push('w-[' + styles.width + ']');

  if (styles.height === '100%') classes.push('h-full');
  else if (styles.height && styles.height !== 'auto') classes.push('h-[' + styles.height + ']');

  if (styles.padding) classes.push('p-[' + styles.padding + ']');
  if (styles.gap) classes.push('gap-[' + styles.gap + ']');

  if (styles.backgroundColor) classes.push('bg-[' + styles.backgroundColor + ']');
  if (styles.color) classes.push('text-[' + styles.color + ']');

  if (styles.fontFamily) classes.push('font-[\'' + styles.fontFamily + '\']');
  if (styles.fontSize) classes.push('text-[' + styles.fontSize + ']');
  if (styles.fontWeight === '700' || styles.fontWeight === 'bold') classes.push('font-bold');
  else if (styles.fontWeight === '600') classes.push('font-semibold');
  else if (styles.fontWeight === '500') classes.push('font-medium');
  if (styles.textTransform === 'uppercase') classes.push('uppercase');

  if (styles.borderRadius) classes.push('rounded-[' + styles.borderRadius + ']');
  if (styles.borderWidth) classes.push('border-[' + styles.borderWidth + '] border-[' + (styles.borderColor || '#334155') + ']');
  if (styles.boxShadow) classes.push('shadow-lg');

  if (styles.animation === 'pulse') classes.push('animate-pulse');
  if (styles.animation === 'bounce') classes.push('animate-bounce');
  if (styles.hoverScale) classes.push('transition-transform duration-150 hover:scale-[1.04]');

  return classes.join(' ');
}

export function generateReactJsx(node: DesignNode): string {
  const tailwind = generateTailwindClasses(node);
  const tag = node.type === 'button' ? 'button' : node.type === 'input' ? 'input' : 'div';
  const tagContent = node.content || '';

  if (node.type === 'input') {
    return '<input\n  type="text"\n  placeholder="' + (node.placeholder || 'Escribe aquí...') + '"\n  className="' + tailwind + '"\n/>';
  }

  if (node.type === 'button') {
    return '<button\n  className="' + tailwind + '"\n>\n  ' + (tagContent || 'Botón') + '\n</button>';
  }

  const childJsx = node.children && node.children.length > 0
    ? '\n' + node.children.map(c => '    ' + generateReactJsx(c)).join('\n') + '\n'
    : tagContent ? '\n  ' + tagContent + '\n' : '';

  return '<' + tag + ' className="' + tailwind + '">' + childJsx + '</' + tag + '>';
}
