import { TypeStrings } from "./enums";
export const Levels: {[name: string]: number};
export type Levels = any;

export declare class LoggerFactory {
  type: TypeStrings;

  builtinEnabled: boolean;
  level: Levels;
  connector?: (level: string, category: string, label: string, content: any) => void;

  constructor();

  getLogger(category: string, label?: string): Logger;
  print(target: ((content: string) => void), category: string, label: string, content: any): void;
}

export declare class Logger {
  type: TypeStrings;

  constructor(logger: LoggerFactory, category: string, label?: string);

  error(content: string): void;
  warn(content: string): void;
  log(content: string): void;
  debug(content: string): void;
}