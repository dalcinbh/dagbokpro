declare module 'html2pdf.js' {
    export default function html2pdf(options?: any): {
      from(element: HTMLElement): any;
      set(options: any): any;
      save(): any;
    };
  }