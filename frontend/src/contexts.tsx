import { createContext } from "react";
import type { MyContextType } from "./types";

const isDevelopment = process.env.NODE_ENV === 'development';
export const prefixApi = isDevelopment ? '/prefix' : '';

export const MyContext = createContext<MyContextType>({ } as MyContextType);