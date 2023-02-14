import React, { useEffect, useState } from "react";
import { storage } from "../../firebase";
import { getDownloadURL, listAll, ref, uploadBytesResumable } from "firebase/storage";
import { TableCell, TableRow } from "@mui/material";

const FileUploadDownload = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };
  useEffect(() => {
    const fetchFiles = async () => {
      const fileList = await listAll(ref(storage, `/files/`))
      console.log(fileList.items.map(item => getDownloadURL(item)))

      const promises = fileList.items.map(item => getDownloadURL(item));
      const urls = await Promise.all(promises);
      console.log(urls)
      setUrl(
        fileList.items.map((item, i) => ({
          name: item.name,
          url: urls[i]
        }))
      );
    };
    fetchFiles();
  }, []);

  const handleUpload = () => {
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        ); // update progress
        setProgress(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          // setUrl(url)
        });
      }
    );
    // uploadTask.on(
    //   "state_changed",
    //   snapshot => {
    //     const progress = Math.round(
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //     );
    //     setProgress(progress);
    //   },
    //   error => {
    //     console.error(error);
    //   },
    //   () => {
    //     storage
    //       .ref("files")
    //       .child(file.name)
    //       .getDownloadURL()
    //       .then(url => {
    //         setUrl(url);
    //       });
    //   }
    // );
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
      <progress value={progress} max="100" />
      {/* {url && (
        <a href={url} download>
          Download
        </a>
      )} */}
      {url.map(file => (
            <TableRow key={file.name}>
              <TableCell>{file.name}</TableCell>
              <TableCell>
                <a href={file.url} download>
                  Download
                </a>
              </TableCell>
            </TableRow>
          ))}
    </div>
  );
};

export default FileUploadDownload;
