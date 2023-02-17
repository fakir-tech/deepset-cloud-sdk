export interface IFileUploadRequest {
  fileName: string;
  fileContent?: string;
  fileBuffer?: Buffer;
  metadata?: Object;
  skipDuplicates?: boolean;
  uniqueId?: string;
}

interface IHashMap {
  [details: string]: string;
}
export interface ISearchRequest {
  query: string | string[];
  filters?: IHashMap;
  pipeline: string;
}
export interface IFilesRequest {
  name?: string;
  metaKey?: string;
  metaValue?: string;
  limit?: number;
  before?: string;
  after?: string;
  pageNumber?: number;
}


interface SearchHistoryEntryResult {
  search_result_history_id: string;
  result: {
    file: File;
    meta: IHashMap;
    type: string;
    score?: any;
    answer: string;
    context?: any;
    document_id?: any;
    offsets_in_context: any[];
    offsets_in_document: any[];
  };
  type: number;
  rank: number;

}


export interface IFileEntry {
  file_id: string;
  url: string;
  name: string;
  size: number;
  characters: number;
  meta: IHashMap;
  created_at: string;
  languages: any[];
}
export interface ISearchResult {
  query_id: string;
  query: string;
  answers: any[]; // in QA cases this will be filled, otherwise []
  documents: Document[]; // in document serach cases, this will be filled otherwise []
  _debug: any;
}
export interface Answer {
  answer: string;
  type: string;
  score: number;
  context: string;
  offsets_in_document: OffsetsInDocument[];
  offsets_in_context: OffsetsInContext[];
  document_id: string;
  meta: any;
  file: File;
  result_id: string;
}

export interface OffsetsInDocument {
  start: number;
  end: number;
}

export interface OffsetsInContext {
  start: number;
  end: number;
}
export interface Document {
  id: string;
  content: string;
  content_type: string;
  meta: any;
  score: number;
  embedding: any;
  file: File;
  result_id: string;
}
