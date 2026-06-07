export interface ProcessorFile {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
}

export interface ProcessorInput {
  files: ProcessorFile[];
  params: Record<string, unknown>;
}

export interface ProcessorOutput {
  buffer: Buffer;
  filename: string;
  mimeType: string;
}

export type Processor = (input: ProcessorInput) => Promise<ProcessorOutput>;

export interface ToolDefinition {
  slug: string;
  processor: Processor;
  minFiles: number;
  maxFiles: number;
  /** Accepted mime prefixes/types; empty = any. */
  accept: string[];
}
