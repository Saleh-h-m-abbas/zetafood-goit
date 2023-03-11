import React, { useEffect, useState } from "react";
import { storage } from "../../firebase";
import { getDownloadURL, listAll, ref, uploadBytesResumable } from "firebase/storage";
import { TableCell, TableRow, Typography, Button, Grid } from "@mui/material";
import './file.scss'


const FileUploadDownload = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState([]);
  const [progress, setProgress] = useState(0);
  const [user] = useState(JSON.parse(localStorage.getItem("userInfo")));

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };
  useEffect(() => {
    const fetchFiles = async () => {
      const fileList = await listAll(ref(storage, `/files/`))
      console.log(fileList.items.map(item => getDownloadURL(item)))

      const promises = fileList.items.map(item => getDownloadURL(item));
      const urls = await Promise.all(promises);
      // console.log(urls)
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
          // console.log(url);
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
    <>
      {(user.role === 0 || user.role === 1) &&
        <>
          <Button variant="outlined" component="label" sx={{
            color: 'crimson',
            border: " 1px dotted rgba(220, 20, 60, 0.6)",
            marginBottom: "10px",
            marginTop: "10px",
          }}>
            Choose File
            <input onChange={handleChange} hidden multiple type="file" />
          </Button>
          <br />
          <button className="button" onClick={handleUpload}>Upload</button>
          <progress value={progress} max="100" />
        </>
      }
      {/* {url && (
        <a href={url} download>
          Download
        </a>
      )} */}
      {url.map(file => (
        <div className="file">
          <TableRow key={file.name}>
            <TableCell> <Typography
              className="filesname"
            >{file.name}</Typography></TableCell>
            <TableCell>
              <Grid direction={'column'} display='flex' >
              <Button variant="contained" color="success" href={file.url} download>
                تنزيل
              </Button>

              {(user.role === 0 || user.role === 1) &&
                <>
                  <Button variant="contained" color="error" sx={{mt:'25px'}} >
                    حذف
                  </Button>
                </>
              }
              </Grid>
            </TableCell>
          </TableRow>
        </div>
      ))}
    </>
  );
};

export default FileUploadDownload;
