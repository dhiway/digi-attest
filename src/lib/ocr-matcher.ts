type SchemaProperty = {
  type: string;
  title?: string;
  description?: string;
  pattern?: string;
  enum?: string[];
};

type JSONSchema = {
  type: string;
  properties: Record<string, SchemaProperty>;
};

type ExtractedField = {
  value: string | null;
  matchedBy: string | null;
};

export type OcrExtractedOutput = {
  formData: Record<string, string | null> | null;
  extracted: Record<string, ExtractedField[]> | null;
};

function normalizeLineForPattern(line: string, pattern: RegExp): string {
  let normalized = line;

  // If pattern does not explicitly allow spaces, remove all whitespace
  if (!pattern.source.includes('\\s')) {
    normalized = normalized.replace(/\s+/g, '');
  }

  // If pattern looks like a date (DD/MM/YYYY or similar), extract date-like sequence
  const dateMatch = normalized.match(/\d{1,4}[\/\-]\d{1,2}[\/\-]\d{2,4}/);
  if (dateMatch) {
    normalized = dateMatch[0];
  }

  return normalized;
}

export function extractValuesFromOCR(
  text: string,
  schema: JSONSchema
): Record<string, ExtractedField[]> {
  const textLines = text.toLowerCase().split('\n');
  const match: Record<string, ExtractedField[]> = {};
  for (const [key, prop] of Object.entries(schema.properties)) {
    match[key] = [];
    for (let i = 0; i < textLines.length; i++) {
      const line = textLines[i];
      const finalKey = key.toLowerCase();

      // match with key
      if (line.includes(finalKey)) {
        const output = line.replace(finalKey, '');
        match[key].push({ value: output, matchedBy: 'key' });
      }
      // match with pattern
      if (prop.pattern) {
        const pattern = new RegExp(
          prop.pattern.replace(/^(\^)/, '').replace(/(\$)$/, '')
        );
        const normLine = normalizeLineForPattern(line, pattern);
        const patternMatch = pattern.test(normLine);
        if (patternMatch)
          match[key].push({ value: normLine, matchedBy: 'pattern' });
      }
      // match with enum
      if (prop.enum) {
        prop.enum.forEach((value) => {
          // whole word match to the enum
          const regex = new RegExp(`\\b${value}\\b`, 'i');
          const exists = regex.test(line);

          if (exists) {
            match[key].push({ value, matchedBy: 'enum' });
          }
        });
      }
    }
  }
  return match;
}

export function generateFormData(
  text: string,
  schema: JSONSchema
): OcrExtractedOutput {
  const extracted = extractValuesFromOCR(text, schema);
  const formData: Record<string, string | null> = {};
  for (const field of Object.keys(extracted)) {
    formData[field] = extracted[field][0]?.value || null;
  }
  return { formData, extracted };
}
