export type DataType = Record<string, string | undefined | null>

export type DataSource = {
    id: string,
    general: {
        url: string,
        method: string,
        description: string
    },
    headers: DataType,
    payload: {
        params: DataType,
        body: Record<string, string  | undefined | null>
    },
    response: {
        status: number,
        headers: string,
        body: string,
    },
    updateTime: string,
}

export type TableItem = {
    keys: string;
    value: string;
    uuid: string;
}

export type RefProps = {
  getValue: () => TableItem[]  | null
}

export type FormApi = {
  getValues: () => DataSource
}
export type RefPropsCurrent = {
  current: RefProps | null
}

export type JSONTYPE = {
    [key:string]: unknown
};
export type ComposeRefProps = {
    getValue: () =>
        | { data: JSONTYPE | null; type: BodyType; originStr?: string }
        | { data: FormData | null; type: BodyType }
        | { data: URLSearchParams | null; type:BodyType }
        | { data: string | undefined | null; type: BodyType }
        | null
};

export const BodyType = {
    NONE: "none",
    JSON: "json",
    FormData: "form-data",
    XFormUrl: "x-www-form-urlencoded",
    Raw: "raw",
} as const;

export type BodyType = typeof BodyType[keyof typeof BodyType];
export type BodyRefPropsCurrent = {
  current: ComposeRefProps | null
}
export type SendBtnProps = {
  params?: RefPropsCurrent;
  headers?: RefPropsCurrent;
  body?: BodyRefPropsCurrent
  description?: string;
  setResponse: React.Dispatch<React.SetStateAction<string>>
}

export interface JSONEditorProps {
    id: string;
    mode: string;
    defaultValue: string
    readOnly?: boolean;
}

export interface MyContextType {
    refresh: number | boolean;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}