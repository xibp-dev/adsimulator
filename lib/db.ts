/**
 * Cloudflare D1 Database Helper Module for MetaLabs / AdSimulator
 */

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Response<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(): Promise<T[]>;
}

export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: any;
}

export interface D1Response<T = unknown> {
  results?: T[];
  success: boolean;
  meta: any;
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

// Global reference for D1 binding (set by Cloudflare environment or fallback)
let globalD1: D1Database | null = null;

export function setD1Database(db: D1Database) {
  globalD1 = db;
}

export function getD1(): D1Database | null {
  if (globalD1) return globalD1;
  // @ts-ignore
  if (typeof process !== "undefined" && process.env && process.env.DB) {
    // @ts-ignore
    return process.env.DB as D1Database;
  }
  return null;
}

export async function queryAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = getD1();
  if (!db) {
    console.warn("D1 Database binding not found!");
    return [];
  }
  const res = await db.prepare(sql).bind(...params).all<T>();
  return res.results || [];
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const db = getD1();
  if (!db) {
    console.warn("D1 Database binding not found!");
    return null;
  }
  return await db.prepare(sql).bind(...params).first<T>();
}

export async function execute(sql: string, params: any[] = []): Promise<D1Result> {
  const db = getD1();
  if (!db) {
    throw new Error("D1 Database binding not found!");
  }
  return await db.prepare(sql).bind(...params).run();
}
