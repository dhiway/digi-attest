type SchemaProperty = {
  type: string;
  title?: string;
  description?: string;
  pattern?: string;
};

type JSONSchema = {
  type: string;
  properties: Record<string, SchemaProperty>;
};

type ExtractedField = {
  key: string;
  value: string | null;
  confidence: number;
  matchedBy: 'pattern' | 'title' | 'description' | 'keyword';
};

export type OcrExtractedOutput = {
  formData: Record<string, string | null>;
  extracted: ExtractedField[];
};

export function extractValuesFromOCR(
  text: string,
  schema: JSONSchema
): ExtractedField[] {
  const normalizedText = text.replace(/\s+/g, ' ').trim();
  const lowerText = normalizedText.toLowerCase();
  const results: ExtractedField[] = [];

  for (const [key, prop] of Object.entries(schema.properties)) {
    let value: string | null = null;
    let confidence = 0;
    let matchedBy: ExtractedField['matchedBy'] = 'keyword';

    // regex pattern (strongest)
    if (prop.pattern) {
      const pattern = new RegExp(prop.pattern);
      const match = normalizedText.match(pattern);
      if (match) {
        value = match[0].replace(/\s+/g, '');
        confidence = 1.0;
        matchedBy = 'pattern';
      }
    }

    // If not matched, title/description-based extraction
    if (!value) {
      const candidates = [
        key,
        prop.title,
        ...(prop.description ? prop.description.split(/\s+/) : []),
      ]
        .filter(Boolean)
        .map((s) => s!.toLowerCase());

      for (const candidate of candidates) {
        // find "Key" or "Number" like segments
        const candidateIndex = lowerText.indexOf(candidate);
        if (candidateIndex !== -1) {
          const substring = normalizedText.slice(
            candidateIndex,
            candidateIndex + 100
          );
          const possibleValueMatch = substring.match(
            /[:\s\-]+([A-Z][a-zA-Z]+(?: [A-Z][a-zA-Z]+)*)/
          );
          if (possibleValueMatch) {
            value = possibleValueMatch[1].trim();
            confidence = 0.75;
            matchedBy = prop.title ? 'title' : 'description';
            break;
          }
        }
      }
    }

    results.push({
      key,
      value,
      confidence,
      matchedBy,
    });
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}

export function generateFormData(
  text: string,
  schema: JSONSchema
): OcrExtractedOutput {
  const extracted = extractValuesFromOCR(text, schema);
  const formData: Record<string, string | null> = {};
  for (const field of extracted) {
    formData[field.key] = field.value || null;
  }
  return { formData, extracted };
}
