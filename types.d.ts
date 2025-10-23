declare module 'scribe.js-ocr' {
  /** Parameters for initializing the Scribe OCR system */
  export interface InitParams {
    /** Load PDF renderer (default: false) */
    pdf?: boolean;
    /** Load OCR engine (default: false) */
    ocr?: boolean;
    /** Load built-in fonts (default: false) */
    font?: boolean;
  }

  /** Parameters for recognition */
  export interface RecognizeOptions {
    /** Recognition mode (default: 'quality') */
    mode?: 'speed' | 'quality';
    /** Languages to use (default: ['eng']) */
    langs?: string[];
    /** Advanced recognition model (default: 'combined') */
    modeAdv?: 'lstm' | 'legacy' | 'combined';
    /** OCR result combination method (default: 'data') */
    combineMode?: 'conf' | 'data' | 'none';
    /** Use vanilla Tesseract.js model (default: false) */
    vanillaMode?: boolean;
    /** Custom Tesseract.js configuration (default: {}) */
    config?: Record<string, string>;
  }

  /** Parameters for exportData and download */
  export type ExportFormat = 'pdf' | 'hocr' | 'docx' | 'xlsx' | 'txt' | 'text';

  /** Sorted file object for importFiles */
  export interface SortedInputFiles {
    pdfFiles?: File[] | string[] | ArrayBuffer[];
    imageFiles?: File[] | string[] | ArrayBuffer[];
    ocrFiles?: File[] | string[] | ArrayBuffer[];
  }

  /** Scribe API Interface */
  export interface Scribe {
    /**
     * Initialize the OCR and/or PDF subsystems.
     */
    init(params?: InitParams): Promise<void>;

    /**
     * Extract text from one or more image or PDF files.
     * @param files - Array of File, URL strings, or ArrayBuffers.
     * @param langs - Array of language codes (default: ['eng'])
     * @param outputFormat - Format of output (default: 'txt')
     * @param options - Additional OCR options
     * @returns Promise<string | ArrayBuffer>
     */
    extractText(
      files: (File | string | ArrayBuffer)[],
      langs?: string[],
      outputFormat?: string,
      options?: Record<string, any>
    ): Promise<string | ArrayBuffer>;

    /**
     * Writes debug images to file.
     */
    writeDebugImages(
      ctx: unknown,
      compDebugArrArr: unknown[][],
      filePath: string
    ): Promise<void>;

    /**
     * Clears all document-specific data.
     */
    clear(): Promise<void>;

    /**
     * Terminates the program and releases resources.
     */
    terminate(): Promise<void>;

    /**
     * Export active OCR data to a specific format.
     * @returns The exported content as string or ArrayBuffer
     */
    exportData(
      format?: ExportFormat,
      minPage?: number,
      maxPage?: number
    ): Promise<string | ArrayBuffer>;

    /**
     * Run exportData and save result as download (browser)
     * or local file (Node.js)
     */
    download(
      format: ExportFormat,
      fileName: string,
      minPage?: number,
      maxPage?: number
    ): Promise<void>;

    /**
     * Import files for processing.
     * Accepts a mixed array or a SortedInputFiles object.
     */
    importFiles(
      files: (File | string | ArrayBuffer)[] | FileList | SortedInputFiles
    ): Promise<void>;

    /**
     * Recognize all pages in the active document.
     */
    recognize(options?: RecognizeOptions): Promise<void>;
  }

  const scribe: Scribe;
  export default scribe;
}
