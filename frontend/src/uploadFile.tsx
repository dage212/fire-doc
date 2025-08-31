import { IconMinusCircle } from "@douyinfe/semi-icons";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import type { FileChangeEvent, FileRefProps } from "./types";
import { Button } from "@douyinfe/semi-ui";
import { IconUpload } from "@douyinfe/semi-icons";
import { useParams } from "react-router";

function MultiFileUpload(props: FileChangeEvent, ref: React.ForwardedRef<FileRefProps>) {
  const [files, setFiles] = useState<File[]>([]);
  const { id } = useParams();
  

  useImperativeHandle(ref, () => ({
      getValue: () => {
          return files;
      },
  }),[files]);

  useEffect(() => {
      setFiles(props.value || [])
  }, [id, props]);

 
  // 选择文件
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files as FileList);
    setFiles(preFieles => {
      const rs = [...preFieles, ...selectedFiles]
      props.onChange(rs)
      return rs
    });
  },[props]);

  // 删除单个文件
  const handleDelete = useCallback((index: number) => {
    setFiles(preFieles => {
      const newFiles = preFieles.filter((_, i) => i !== index);
      console.log(preFieles)
      console.log(newFiles)
      props.onChange(newFiles)
      return newFiles
    });
  },[props]);

  const onClick = () => {
    document.getElementById(`fileInput_${props.keys}`)!.click()
  }


  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <input type="file" id={`fileInput_${props.keys}`}  multiple onChange={handleChange} style={{display: "none"}}/>
      <Button onClick={onClick} size="small" icon={<IconUpload />}></Button>
      {files.length === 0 ? (
        <span>Please upload file</span>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
          {files.map((file, index) => (
            <li key={index} style={{display: "flex", alignItems: "center"}}>
              <span>{file.name}{" "}</span>
              <IconMinusCircle 
                onClick={() => {
                    handleDelete(index)
                }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const MultiFileUploadForwardRef = forwardRef(MultiFileUpload);
export default MultiFileUploadForwardRef