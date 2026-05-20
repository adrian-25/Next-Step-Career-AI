import mammoth from 'mammoth';
import { parsePDF } from './pdfParser';
import { ParsedResume, ResumeSections, ContactInfo, ParsingMetadata } from '../types';

/**
 * Resume Parser Service
 * 
 * Extracts text and structured data from PDF, DOC, and DOCX resume files.
 * Supports multi-format parsing with automatic file type detection and
 * comprehensive error handling for corrupted or invalid files.
 * 
 * @class ResumeParser
 * @example
 * ```typescript
 * const parser = new ResumeParser();
 * const parsedResume = await parser.parseResume(file);
 * console.log(parsedResume.text, parsedResume.sections);
 * ```
 */
export class ResumeParser {
  /**
   * Parse resume file and extract structured data including text, sections,
   * contact information, and metadata.
   * 
   * Supports PDF, DOC, and DOCX formats. Automatically detects file type
   * and routes to appropriate parser. Extracts name, email, phone, and
   * identifies resume sections with quality scoring.
   * 
   * @param {File} file - The resume file to parse (PDF, DOC, or DOCX)
   * @returns {Promise<ParsedResume>} Parsed resume with structured data
   * @throws {Error} If file type is unsupported or parsing fails
   * 
   * @example
   * ```typescript
   * const file = new File([pdfBlob], 'resume.pdf', { type: 'application/pdf' });
   * const parsed = await resumeParser.parseResume(file);
   * // parsed.text contains extracted text
   * // parsed.sections contains identified sections
   * // parsed.contact contains email and phone
   * ```
   */
  async parseResume(file: File): Promise<ParsedResume> {
    const startTime = Date.now();
    const fileType = this.getFileType(file.name);
    let rawText = '';

    try {
      // Extract text based on file type
      switch (fileType) {
        case 'pdf':
          rawText = await this.parsePDF(file);
          break;
        case 'doc':
        case 'docx':
          rawText = await this.parseDOCX(file);
          break;
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }

      // Clean and structure the text
      const cleanedText = this.cleanText(rawText);
      
      // Extract structured information
      const name = this.extractName(cleanedText);
      const email = this.extractEmail(cleanedText);
      const phone = this.extractPhone(cleanedText);
      const sections = this.extractSections(cleanedText);

      const parsingDuration = Date.now() - startTime;

      // Build metadata
      const metadata: ParsingMetadata = {
        fileName: file.name,
        fileSize: file.size,
        fileType,
        textLength: cleanedText.length,
        parsedAt: new Date().toISOString(),
        parsingDuration,
      };

      // Build contact info
      const contact: ContactInfo = {
        email,
        phone,
      };

      return {
        text: cleanedText,
        skills: [], // Will be populated by skillExtractor
        sections,
        targetRole: '', // Will be populated by roleDetector
        roleConfidence: 0,
        experienceLevel: 'Entry Level',
        name,
        contact,
        metadata,
      };
    } catch (error) {
      console.error('Resume parsing error:', error);
      throw new Error(`Failed to parse resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse PDF file and extract raw text content.
   * 
   * Uses pdfjs-dist library to extract text from PDF files (browser-compatible).
   * Handles multi-page PDFs and preserves text structure.
   * 
   * @private
   * @param {File} file - PDF file to parse
   * @returns {Promise<string>} Extracted text content
   * @throws {Error} If PDF parsing fails
   */
  private async parsePDF(file: File): Promise<string> {
    try {
      const text = await parsePDF(file);
      return text;
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse DOC/DOCX file and extract raw text content.
   * 
   * Uses mammoth library to extract text from Microsoft Word documents.
   * Supports both legacy DOC and modern DOCX formats.
   * Browser-compatible: uses ArrayBuffer directly.
   * 
   * @private
   * @param {File} file - DOC or DOCX file to parse
   * @returns {Promise<string>} Extracted text content
   * @throws {Error} If document parsing fails
   */
  private async parseDOCX(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error('DOCX parsing error:', error);
      throw new Error(`Failed to parse DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract file extension from filename to determine file type.
   * 
   * @private
   * @param {string} filename - Name of the file including extension
   * @returns {string} File extension in lowercase (e.g., 'pdf', 'docx')
   */
  private getFileType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension || '';
  }

  /**
   * Clean and normalize extracted text by removing excessive whitespace,
   * normalizing line endings, and standardizing formatting.
   * 
   * @private
   * @param {string} text - Raw extracted text
   * @returns {string} Cleaned and normalized text
   */
  private cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')          // Normalize line endings
      .replace(/\r/g, '\n')             // Handle bare \r
      .replace(/\n{4,}/g, '\n\n\n')    // Cap consecutive newlines at 3
      .replace(/[^\S\n]{2,}/g, ' ')     // Collapse spaces/tabs but NOT newlines
      .trim();
  }

  /**
   * Extract candidate name from resume text using pattern matching.
   * 
   * Searches the first few lines for name patterns (2-4 capitalized words).
   * Skips lines containing email addresses or phone numbers.
   * 
   * @private
   * @param {string} text - Resume text content
   * @returns {string} Extracted name or 'Unknown' if not found
   */
  private extractName(text: string): string {
    // Name is typically in the first few lines
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    // Look for name patterns in first 5 lines
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      
      // Skip lines with email or phone
      if (line.includes('@') || /\d{10}/.test(line)) continue;
      
      // Name should be 2-4 words, each capitalized
      const words = line.split(/\s+/);
      if (words.length >= 2 && words.length <= 4) {
        const isLikelyName = words.every(word => 
          /^[A-Z][a-z]+$/.test(word) || /^[A-Z]\.$/.test(word)
        );
        if (isLikelyName) {
          return line;
        }
      }
    }
    
    return 'Unknown';
  }

  /**
   * Extract email address from resume text using regex pattern matching.
   * 
   * @private
   * @param {string} text - Resume text content
   * @returns {string | undefined} Extracted email address or undefined if not found
   */
  private extractEmail(text: string): string | undefined {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = text.match(emailRegex);
    return match ? match[0] : undefined;
  }

  /**
   * Extract phone number from resume text using regex pattern matching.
   * 
   * Supports various phone formats including international numbers,
   * parentheses, dashes, and spaces.
   * 
   * @private
   * @param {string} text - Resume text content
   * @returns {string | undefined} Extracted phone number or undefined if not found
   */
  private extractPhone(text: string): string | undefined {
    // Match various phone formats
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const match = text.match(phoneRegex);
    return match ? match[0] : undefined;
  }

  /**
   * Extract and identify resume sections (skills, experience, education, etc.)
   * with content, position indices, and quality scores.
   * 
   * Recognizes common section headers and their variations. Handles different
   * naming conventions (e.g., "Work Experience" vs "Employment History").
   * Calculates quality score for each section based on length, structure, and keywords.
   * 
   * @private
   * @param {string} text - Resume text content
   * @returns {ResumeSections} Object containing identified sections with metadata
   */
  /**
   * Robust regex-based section detection.
   * Supports case variations, ALL-CAPS, trailing colons, and multi-word headings.
   * A heading line must:
   *   1. Be short (≤ 60 chars)
   *   2. Match one of the regex patterns below
   *   3. Not look like a normal sentence (no mid-line punctuation like '.,' unless it's after a colon)
   */
  private readonly HEADING_PATTERNS: Array<{ key: string; pattern: RegExp }> = [
    { key: 'summary',        pattern: /^(summary|professional\s+summary|career\s+objective|objective|profile|about\s+me|personal\s+statement):?$/i },
    { key: 'experience',     pattern: /^(experience|work\s+experience|professional\s+experience|employment|employment\s+history|work\s+history|internship|internships|career|career\s+history|professional\s+background):?$/i },
    { key: 'education',      pattern: /^(education|educational\s+background|academic\s+background|academic\s+qualifications|qualifications|schooling|academics):?$/i },
    { key: 'skills',         pattern: /^(skills|technical\s+skills|core\s+competencies|competencies|technologies|expertise|key\s+skills|professional\s+skills|proficiencies|tools\s+&\s+technologies):?$/i },
    { key: 'projects',       pattern: /^(projects|project\s+experience|personal\s+projects|academic\s+projects|key\s+projects|portfolio|notable\s+projects|side\s+projects|work\s+samples):?$/i },
    { key: 'certifications', pattern: /^(certifications?|certificates?|credentials?|licenses?|professional\s+certifications?|accreditations?):?$/i },
    { key: 'achievements',   pattern: /^(achievements?|awards?|honors?|accomplishments?|recognition|publications?):?$/i },
  ];

  private extractSections(text: string): ResumeSections {
    const sections: ResumeSections = {};
    const lines = text.split('\n');

    let currentSection = 'header';
    let currentContent: string[] = [];
    let startIndex = 0;

    const saveCurrentSection = () => {
      if (currentContent.length > 0 && this.isValidSectionKey(currentSection)) {
        const content = currentContent.join('\n').trim();
        if (content.length > 0) {
          const endIndex = startIndex + content.length;
          sections[currentSection as keyof ResumeSections] = {
            content,
            startIndex,
            endIndex,
            qualityScore: this.calculateSectionQuality(content),
          };
        }
      }
    };

    let charOffset = 0;
    for (const line of lines) {
      const trimmed = line.trim();

      // Check heading: short line matching one of our regex patterns
      if (trimmed.length > 0 && trimmed.length <= 60) {
        const match = this.HEADING_PATTERNS.find(({ pattern }) => pattern.test(trimmed));
        if (match) {
          saveCurrentSection();
          currentSection = match.key;
          currentContent = [];
          startIndex = charOffset;
          charOffset += line.length + 1;
          continue;
        }
      }

      if (trimmed.length > 0) {
        currentContent.push(line);
      }
      charOffset += line.length + 1;
    }

    // Save last section
    saveCurrentSection();

    // ── Debug logging ──────────────────────────────────────────────────────────
    const detected = Object.keys(sections);
    console.log('[ResumeParser] Detected sections:', detected);
    console.log('[ResumeParser] Projects content length:', sections.projects?.content?.length ?? 0);
    console.log('[ResumeParser] Experience content length:', sections.experience?.content?.length ?? 0);
    console.log('[ResumeParser] Education content length:', sections.education?.content?.length ?? 0);

    return sections;
  }

  /**
   * Normalize section header names to standard keys used in ResumeSections interface.
   * 
   * Maps various section name variations to standardized keys
   * (e.g., "Work Experience" → "experience", "Technical Skills" → "skills").
   * 
   * @private
   * @param {string} header - Raw section header text
   * @returns {string} Normalized section key
   */
  private normalizeSectionName(header: string): string {
    const normalized = header.toLowerCase().replace(/[^a-z\s]/g, '').trim();

    if (/skill|competenc|technolog|expertis|proficien/.test(normalized)) return 'skills';
    if (/project|portfolio|work\s+sample/.test(normalized)) return 'projects';
    if (/experience|employment|internship|career|professional\s+background/.test(normalized)) return 'experience';
    if (/education|academic|qualif|school/.test(normalized)) return 'education';
    if (/certif|license|credential|accredit/.test(normalized)) return 'certifications';
    if (/summary|objective|profile|about|personal\s+statement/.test(normalized)) return 'summary';
    if (/achievement|award|honor|accomplishment|publication/.test(normalized)) return 'achievements';

    return header;
  }

  /**
   * Validate if a section key is recognized and valid.
   * 
   * @private
   * @param {string} key - Section key to validate
   * @returns {boolean} True if key is valid, false otherwise
   */
  private isValidSectionKey(key: string): boolean {
    return ['skills', 'projects', 'experience', 'education', 'certifications', 'summary', 'achievements', 'misc'].includes(key);
  }

  /**
   * Calculate quality score for a resume section based on multiple factors.
   * 
   * Scoring criteria:
   * - Length (0-40 points): Longer sections score higher
   * - Structure (0-30 points): Presence of bullets and numbers
   * - Keywords (0-30 points): Action verbs and achievement indicators
   * 
   * @private
   * @param {string} content - Section content text
   * @returns {number} Quality score from 0-100
   */
  private calculateSectionQuality(content: string): number {
    let score = 0;
    
    // Length score (0-40 points)
    const length = content.length;
    if (length > 500) score += 40;
    else if (length > 200) score += 30;
    else if (length > 100) score += 20;
    else score += 10;
    
    // Structure score (0-30 points)
    const hasBullets = /[•\-\*]/.test(content);
    const hasNumbers = /\d/.test(content);
    if (hasBullets) score += 15;
    if (hasNumbers) score += 15;
    
    // Keyword score (0-30 points)
    const keywords = ['developed', 'implemented', 'managed', 'created', 'designed', 'led', 'achieved'];
    const keywordCount = keywords.filter(kw => content.toLowerCase().includes(kw)).length;
    score += Math.min(keywordCount * 5, 30);
    
    return Math.min(score, 100);
  }
}

// Export singleton instance
export const resumeParser = new ResumeParser();
