// Align local declarations with Firebase v10 ESM exports to avoid TS errors
declare module 'firebase/app' {
  export interface FirebaseApp {}
  export function initializeApp(options: any): FirebaseApp
  export function getApps(): FirebaseApp[]
  export function getApp(): FirebaseApp
}

declare module 'firebase/database' {
  import type { FirebaseApp } from 'firebase/app'
  export interface Database {}
  export function getDatabase(app: FirebaseApp): Database
  export function ref(db: Database, path?: string): any
  export function onValue(
    r: any,
    cb: (snap: any) => void,
    onError?: (err: any) => void,
    options?: any
  ): () => void
  export function push(r: any, value?: any): Promise<any>
  export function set(r: any, value: any): Promise<void>
  export type DataSnapshot = any
}
