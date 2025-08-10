import { createContext } from "react";
import type { MyContextType } from "./types";

export const MyContext = createContext<MyContextType>({ } as MyContextType);