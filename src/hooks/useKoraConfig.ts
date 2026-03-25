import { useState, useEffect } from 'react';

export interface KoraConfig {
  apiBaseUrl: string;
  features: {
    voice: {
      enabled: boolean;
      provider: string;
    };
  };
}

const defaultConfig: KoraConfig = {
  apiBaseUrl: 'https://kora-agent.grubtok.com',
  features: {
    voice: {
      enabled: false,
      provider: '',
    },
  },
};

export function useKoraConfig(): KoraConfig {
  const [config, setConfig] = useState<KoraConfig>(() => {
    if (typeof window !== 'undefined' && window.KORA_CONFIG) {
      return {
        apiBaseUrl: window.KORA_CONFIG.apiBaseUrl || defaultConfig.apiBaseUrl,
        features: {
          voice: {
            enabled: window.KORA_CONFIG.features?.voice?.enabled ?? defaultConfig.features.voice.enabled,
            provider: window.KORA_CONFIG.features?.voice?.provider || defaultConfig.features.voice.provider,
          },
        },
      };
    }
    return defaultConfig;
  });

  useEffect(() => {
    // This effect is mostly for environments like Storybook or tests
    // where the global might be set after initial render.
    // In a standard browser load, the initial state from the closure is sufficient.
    if (window.KORA_CONFIG) {
       setConfig({
        apiBaseUrl: window.KORA_CONFIG.apiBaseUrl || defaultConfig.apiBaseUrl,
        features: {
          voice: {
            enabled: window.KORA_CONFIG.features?.voice?.enabled ?? defaultConfig.features.voice.enabled,
            provider: window.KORA_CONFIG.features?.voice?.provider || defaultConfig.features.voice.provider,
          },
        },
      });
    }
  }, []);

  return config;
}