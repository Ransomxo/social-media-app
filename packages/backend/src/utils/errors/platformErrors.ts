export class PlatformError extends Error {
  constructor(message: string, public platformName: string, public originalError?: any) {
    super(message);
    this.name = 'PlatformError';
  }
}

export function handleFacebookError(error: any): never {
  if (error.response?.data?.error) {
    throw new PlatformError(
      error.response.data.error.message,
      'Facebook',
      error
    );
  }
  throw new PlatformError('Unknown Facebook API error', 'Facebook', error);
}

export function handleTwitterError(error: any): never {
  if (error.response?.data?.errors?.[0]) {
    throw new PlatformError(
      error.response.data.errors[0].message,
      'Twitter',
      error
    );
  }
  throw new PlatformError('Unknown Twitter API error', 'Twitter', error);
}

export function handleInstagramError(error: any): never {
  if (error.response?.data?.error) {
    throw new PlatformError(
      error.response.data.error.message,
      'Instagram',
      error
    );
  }
  throw new PlatformError('Unknown Instagram API error', 'Instagram', error);
}

export function handleLinkedInError(error: any): never {
  if (error.response?.data?.message) {
    throw new PlatformError(
      error.response.data.message,
      'LinkedIn',
      error
    );
  }
  throw new PlatformError('Unknown LinkedIn API error', 'LinkedIn', error);
}
