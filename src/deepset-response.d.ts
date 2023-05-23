import { IHashMap } from "deepset-typings.d.js";

export interface ISearchResult {
  test: string;
}

export interface ISearchHistoryResponse {
  data: SearchHistoryEntry[];
  has_more: boolean;
  total: number;
}


interface SearchHistoryEntry {
  search_history_id: string;
  request: {
    query: string;
    filters: any;
  };
  response: SearchHistoryEntryResult[];
  user: any;
  pipeline: { name: string; };
  time: Date;
  duration: number;
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
interface SearchHistoryEntry {
  search_history_id: string;
  request: {
    query: string;
    filters: any;
  };
  response: SearchHistoryEntryResult[];
  user: any;
  pipeline: { name: string; };
  time: Date;
  duration: number;
}

export interface ISearchHistoryResponse {
  data: SearchHistoryEntry[];
  has_more: boolean;
  total: number;
}

export interface ISearchResult {
  query_id: string;
  query: string;
  answers: Answer[]; // in QA cases this will be filled, otherwise []
  documents: Document[]; // in document serach cases, this will be filled otherwise []
  _debug: any;
}

export interface Answer {
  answer: string;
  type: string;
  score: number;
  context: string;
  offsets_in_document: Offset[];
  offsets_in_context: Offset[];
  document_id: string;
  meta: IHashMap;
  file: File;
  result_id: string;
}

export interface Offset {
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
