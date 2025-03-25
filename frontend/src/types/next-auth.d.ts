// Adiciona a propriedade __NEXTAUTH ao objeto Window
interface Window {
  __NEXTAUTH?: {
    basePath?: string;
    baseUrl?: string;
    baseUrlServer?: string;
    url?: string;
  };
} 