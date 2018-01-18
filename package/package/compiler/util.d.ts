import { BuildConfig, BuildContext, Diagnostic, FilesMap, StencilSystem } from '../util/interfaces';
export declare function getBuildContext(ctx?: BuildContext): BuildContext;
export declare function resetBuildContext(ctx: BuildContext): void;
export declare function getJsFile(sys: StencilSystem, ctx: BuildContext, jsFilePath: string): Promise<string>;
export declare function getCssFile(sys: StencilSystem, ctx: BuildContext, cssFilePath: string): Promise<string>;
export declare function readFile(sys: StencilSystem, filePath: string): Promise<string>;
export declare function writeFiles(sys: StencilSystem, rootDir: string, filesToWrite: FilesMap): Promise<any>;
export declare function ensureDirectoriesExist(sys: StencilSystem, directories: string[], existingDirectories: string[]): Promise<{}>;
export declare function isTsFile(filePath: string): boolean;
export declare function isDtsFile(filePath: string): boolean;
export declare function isJsFile(filePath: string): boolean;
export declare function isSassFile(filePath: string): boolean;
export declare function isCssFile(filePath: string): boolean;
export declare function isHtmlFile(filePath: string): boolean;
export declare function isWebDevFile(filePath: string): boolean;
export declare function generatePreamble(config: BuildConfig): string;
export declare function buildError(diagnostics: Diagnostic[]): Diagnostic;
export declare function buildWarn(diagnostics: Diagnostic[]): Diagnostic;
export declare function catchError(diagnostics: Diagnostic[], err: Error): Diagnostic;
export declare function hasError(diagnostics: Diagnostic[]): boolean;
export declare function normalizePath(str: string): string;
