/**
 * Şablonlarda koda gömülü kalan metinleri sayar (Faz 24). `verify:text-slots` ve
 * `text-slots:baseline` kullanır. Sezgiseldir: JSX metni, `aria-label`/`title`/`alt`/`placeholder`/`label`
 * öznitelikleri ve Türkçe harf taşıyan ya da cümle gibi görünen dize sabitleri sayılır;
 * sınıf adı, kimlik, renk, yol gibi özellikler sayılmaz. `// text-slots: kod` işaretli satır (ya da sonraki satır) sayılmaz.
 */
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

export interface Finding {
  file: string;
  line: number;
  text: string;
}

const ATTRS = new Set(['aria-label', 'title', 'alt', 'placeholder', 'label', 'aria-description', 'aria-roledescription']);
const SKIP_PROPS = /className|class|ease|key|id|src|href|font|color|fill|stroke|transform|^d$|mask|clip|style|background|shadow|gradient/i;
/** `// text-slots: kod — <neden>`: metin değil, kod değeri. */
const IGNORE = /text-slots: kod/;
const HAS_WORD = /[A-Za-zÇĞİÖŞÜÂÎÛçğıöşüâîû]{2,}/;
// Faz 26.3: şapkalı harfler (Mekân, Hikâye) ve soru/iki nokta ile biten cümleler de sayılır.
const TURKISH = /[çğıöşüâîûÇĞİÖŞÜÂÎÛ]/;
const SENTENCE = /^[A-ZÇĞİÖŞÜÂÎÛ][a-zçğıöşüâîû]+( [A-Za-zçğıöşüâîûÇĞİÖŞÜÂÎÛ&·—-]+)*[.!…?:]?$/;

function walk(dir: string, out: string[]): void {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(name)) out.push(full);
  }
}

export function scanHardcodedTexts(root: string): Finding[] {
  const files: string[] = [];
  walk(root, files);
  const findings: Finding[] = [];
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const rel = path.relative(root, file).split(path.sep).join('/');
    const lines = source.split('\n');
    const add = (node: ts.Node, raw: string): void => {
      const text = raw.replace(/\s+/g, ' ').trim();
      if (!HAS_WORD.test(text) || text === '&amp;') return;
      const { line } = sf.getLineAndCharacterOfPosition(node.getStart());
      // Ekranda görünmeyen dize (tuş adı, yazı tipi, eşleşme sözcüğü): aynı ya da önceki satırda işaret (Faz 26.3).
      if (IGNORE.test(lines[line] ?? '') || IGNORE.test(lines[line - 1] ?? '')) return;
      findings.push({ file: rel, line: line + 1, text });
    };
    const visit = (node: ts.Node): void => {
      if (ts.isJsxText(node)) add(node, node.getText());
      else if (ts.isJsxAttribute(node) && node.initializer && ts.isStringLiteral(node.initializer)) {
        const name = node.name.getText();
        // Bilinen metin öznitelikleri her zaman; diğer prop'lar (`teknik="…"`) Türkçe harf taşıyorsa (Faz 26.3).
        if (ATTRS.has(name) || (!SKIP_PROPS.test(name) && TURKISH.test(node.initializer.text))) add(node, node.initializer.text);
      } else if (ts.isTemplateExpression(node)) {
        // `${ad} şehzademizin …` gibi şablon dizeleri: sabit parçalarda Türkçe harf varsa (Faz 26.3).
        const parts = [node.head.text, ...node.templateSpans.map((span) => span.literal.text)].join(' ');
        if (TURKISH.test(parts)) add(node, parts);
      } else if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && node.parent) {
        const parent = node.parent;
        const inValuePosition =
          ts.isJsxExpression(parent) ||
          ts.isPropertyAssignment(parent) ||
          ts.isConditionalExpression(parent) ||
          ts.isBinaryExpression(parent) ||
          ts.isArrayLiteralExpression(parent) ||
          ts.isReturnStatement(parent) ||
          ts.isParameter(parent) ||
          ts.isBindingElement(parent);
        // Çağrı argümanı yalnızca Türkçe harfle (anahtarlar ve sınıf adları sayılmasın).
        const inCall = ts.isCallExpression(parent) && TURKISH.test(node.text);
        const prop = ts.isPropertyAssignment(parent) ? parent.name.getText() : '';
        if (inCall || (inValuePosition && !SKIP_PROPS.test(prop) && (TURKISH.test(node.text) || SENTENCE.test(node.text)))) add(node, node.text);
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return findings;
}

/** Dosya başına sayı (taban dosyasının biçimi). */
export function countByFile(findings: Finding[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const f of findings) counts[f.file] = (counts[f.file] ?? 0) + 1;
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}
