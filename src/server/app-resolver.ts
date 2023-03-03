export interface AppResolver {
  getAssetMap(): Promise<Record<string, string>>;
  getServerUrl(): string;

  /**
   * Returns absolute url for asset given relative path.
   * */
  getAssetUrl(relativePath: string): string;
}
