import {
    PluginManifest,
    PluginManifestKeys,
    isHttpAuthorizationType,
    isManifestAuthType,
    requiresUserLevelAuth,
} from '../../libs/models/PluginManifest';

export const isValidPluginManifest = (manifest?: PluginManifest): manifest is PluginManifest => {
    if (!manifest) {
        return false;
    }

    const missingKeys: string[] = [];
    PluginManifestKeys.forEach((key: string) => {
        if (!(key in manifest)) {
            missingKeys.push(key);
        }
    });

    if (missingKeys.length > 0) {
        throw new Error(`O manifesto do plug-in não possui as seguintes chaves: ${missingKeys.toLocaleString()}`);
    }

    // Check that the auth type is valid
    const authType = manifest.auth.type;
    if (!isManifestAuthType(manifest.auth.type)) {
        throw new Error(`Tipo de autenticação inválida: ${authType}`);
    }

    // Check that the auth properties match the auth type
    if (requiresUserLevelAuth(manifest.auth)) {
        if (!('authorization_type' in manifest.auth)) {
            throw new Error('authorization_type ausente para autenticação user_http');
        }
        const authHttpType = manifest.auth.authorization_type;
        if (!isHttpAuthorizationType(authHttpType)) {
            throw new Error(`authorization_type para autenticação user_http: ${authHttpType as string}`);
        }
    }

    // Check that the api type is valid
    const apiType = manifest.api.type;
    if ((apiType as unknown) !== 'openapi') {
        throw new Error(`Tipo de API inválida: ${apiType as string}. Apenas APIs OpenApi são compatíveis.`);
    }

    // Check that the api url is valid
    const apiUrl = manifest.api.url;
    if (!apiUrl.startsWith('http')) {
        throw new Error(`URL de API inválida: ${apiUrl}. Deve começar com http ou https.`);
    } else {
        try {
            new URL(apiUrl);
        } catch {
            throw new Error(`URL de API inválida: ${apiUrl}`);
        }
    }

    // If no errors are thrown, the plugin manifest is valid
    return true;
};

export const isValidOpenAPISpec = (_specPath: string) => {
    // TODO: [Issue #1973] Implement validation of OpenAPI spec
    return true;
};
