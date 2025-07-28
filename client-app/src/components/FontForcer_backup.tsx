'use client';

import { useEffect } from 'react';

export function FontForcer() {
  useEffect(() => {
    // Force Inter font via JavaScript
    const injectFontStyles = () => {
      const style = document.createElement('style');
      style.id = 'force-inter-font';
      style.innerHTML = `
        *, *::before, *::after {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif !important;
        }
        
        html, body, div, span, applet, object, iframe,
        h1, h2, h3, h4, h5, h6, p, blockquote, pre,
        a, abbr, acronym, address, big, cite, code,
        del, dfn, em, img, ins, kbd, q, s, samp,
        small, strike, strong, sub, sup, tt, var,
        b, u, i, center,
        dl, dt, dd, ol, ul, li,
        fieldset, form, label, legend,
        table, caption, tbody, tfoot, thead, tr, th, td,
        article, aside, canvas, details, embed, 
        figure, figcaption, footer, header, hgroup, 
        menu, nav, output, ruby, section, summary,
        time, mark, audio, video, button, input, textarea, select {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif !important;
        }
        
        /* Target all possible Tailwind and component classes */
        [class*="text-"], [class*="font-"], [class*="bg-"], [class*="border-"],
        .sidebar, .header, .nav, .menu, .card, .button, .input,
        [data-radix-root], [data-radix-popper-content-wrapper],
        [class*="css-"], [class*="emotion-"] {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        }
      `;
      
      // Remove existing style if present
      const existing = document.getElementById('force-inter-font');
      if (existing) {
        existing.remove();
      }
      
      document.head.appendChild(style);
    };

    // Inject immediately
    injectFontStyles();

    // Also inject after DOM changes (for dynamic content)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Force font on newly added elements
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              element.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
              
              // Also force on all children
              const children = element.querySelectorAll('*');
              children.forEach((child) => {
                (child as HTMLElement).style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
              });
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
