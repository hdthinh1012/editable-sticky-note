import React from 'react';
import ReactDOM from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';
import App from './App';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #f8f9fa;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  /* Global scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

// Create Shadow DOM container
const createShadowDOMContainer = (): { container: HTMLElement; shadowRoot: ShadowRoot } => {
  // Create a container element
  const container = document.createElement('div');
  container.id = 'shadow-root-container';
  
  // Attach shadow root
  const shadowRoot = container.attachShadow({ mode: 'open' });
  
  // Create the React root container inside shadow DOM
  const reactContainer = document.createElement('div');
  reactContainer.id = 'react-app-root';
  shadowRoot.appendChild(reactContainer);
  
  // Add styles to shadow DOM
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body, #react-app-root {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: #f8f9fa;
      width: 100%;
      height: 100vh;
    }

    code {
      font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
        monospace;
    }

    /* Global scrollbar styling */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `;
  shadowRoot.appendChild(styleElement);
  
  return { container, shadowRoot };
};

// Initialize Shadow DOM
const { container, shadowRoot } = createShadowDOMContainer();

// Append container to document body
document.body.appendChild(container);

// Create React root inside shadow DOM
const reactContainer = shadowRoot.getElementById('react-app-root') as HTMLElement;
const root = ReactDOM.createRoot(reactContainer);

// Create a context provider component to pass shadow root
const AppWithShadowRoot: React.FC = () => {
  return (
    <React.StrictMode>
      <App shadowRoot={shadowRoot} />
    </React.StrictMode>
  );
};

// Render App with shadow root context
root.render(<AppWithShadowRoot />);
