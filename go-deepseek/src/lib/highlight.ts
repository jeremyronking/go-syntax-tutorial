export type TokenKind = 'plain' | 'keyword' | 'string' | 'comment' | 'number';

export type Token = { text: string; kind: TokenKind };

const KEYWORDS = new Set([
  'break',
  'case',
  'chan',
  'const',
  'continue',
  'default',
  'defer',
  'else',
  'fallthrough',
  'for',
  'func',
  'go',
  'goto',
  'if',
  'import',
  'interface',
  'map',
  'package',
  'range',
  'return',
  'select',
  'struct',
  'switch',
  'type',
  'var',
]);

const BUILTINS = new Set([
  'any',
  'append',
  'bool',
  'byte',
  'cap',
  'close',
  'comparable',
  'complex64',
  'complex128',
  'copy',
  'delete',
  'error',
  'float32',
  'float64',
  'int',
  'int8',
  'int16',
  'int32',
  'int64',
  'len',
  'make',
  'new',
  'nil',
  'panic',
  'print',
  'println',
  'recover',
  'rune',
  'string',
  'true',
  'false',
  'uint',
  'uint8',
  'uint16',
  'uint32',
  'uint64',
  'uintptr',
]);

/**
 * Small Go tokenizer for read-only snippets. It intentionally stops at lexical
 * highlighting — enough for annotated lessons without pulling in Monaco.
 */
export function tokenizeGo(source: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  const push = (text: string, kind: TokenKind) => {
    if (text) tokens.push({ text, kind });
  };

  while (index < source.length) {
    const char = source[index];

    if (char === '/' && source[index + 1] === '/') {
      const end = source.indexOf('\n', index);
      const stop = end === -1 ? source.length : end;
      push(source.slice(index, stop), 'comment');
      index = stop;
      continue;
    }

    if (char === '/' && source[index + 1] === '*') {
      const end = source.indexOf('*/', index + 2);
      const stop = end === -1 ? source.length : end + 2;
      push(source.slice(index, stop), 'comment');
      index = stop;
      continue;
    }

    if (char === '"' || char === '`' || char === "'") {
      let cursor = index + 1;
      while (cursor < source.length) {
        if (source[cursor] === '\\' && char !== '`') {
          cursor += 2;
          continue;
        }
        if (source[cursor] === char) {
          cursor += 1;
          break;
        }
        cursor += 1;
      }
      push(source.slice(index, cursor), 'string');
      index = cursor;
      continue;
    }

    if (/[0-9]/.test(char)) {
      let cursor = index + 1;
      while (cursor < source.length && /[0-9a-fA-FxX._eEpP+-]/.test(source[cursor])) cursor += 1;
      push(source.slice(index, cursor), 'number');
      index = cursor;
      continue;
    }

    if (/[A-Za-z_]/.test(char)) {
      let cursor = index + 1;
      while (cursor < source.length && /[A-Za-z0-9_]/.test(source[cursor])) cursor += 1;
      const word = source.slice(index, cursor);
      push(word, KEYWORDS.has(word) || BUILTINS.has(word) ? 'keyword' : 'plain');
      index = cursor;
      continue;
    }

    push(char, 'plain');
    index += 1;
  }

  return tokens;
}
