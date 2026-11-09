/// <reference types="vite/client" />

// vite/client covers images and media but not documents.
declare module '*.pdf' {
  const src: string
  export default src
}
