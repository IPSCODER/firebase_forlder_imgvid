import React, { useEffect, useState } from 'react'
import {getStorage, ref, uploadBytesResumable,getDownloadURL} from "firebase/storage"
import axios from "axios"
import app from '../firebase'

const Upload = () => {

    const [img,setImg] = useState(undefined)
    const [video,setVideo] = useState(undefined)
    const [imgPerc,setImgPerc] = useState(0);
    const [videoPerc,setVideoPerc] = useState(0);
    const [inputs,setInputs] = useState({})

    useEffect(() =>{
        video && uploadFile(video, "videoUrl");
    },[video])

    useEffect(()=>{
        img && uploadFile(img, 'imgUrl')
    },[img])

    const uploadFile = (file,fileType) =>{
        const storage = getStorage(app);
        const folder = fileType === "imgUrl" ? "images/" : "videos/";
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, folder + fileName);
        const uploadTask = uploadBytesResumable(storageRef,file)

        // Listen for state changes, errors, and completion of the upload.
uploadTask.on('state_changed',
(snapshot) => {
  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  console.log('Upload is ' + progress + '% done');
  fileType === "imgUrl" ? setImgPerc(Math.round(progress)) : setVideoPerc(Math.round(progress))
  switch (snapshot.state) {
    case 'paused':
      console.log('Upload is paused');
      break;
    case 'running':
      console.log('Upload is running');
      break;
  }
}, 
(error) => {
  // A full list of error codes is available at
  // https://firebase.google.com/docs/storage/web/handle-errors
  switch (error.code) {
    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;
    case 'storage/canceled':
      // User canceled the upload
      break;

    // ...

    case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
      break;
  }
}, 
() => {
  // Upload completed successfully, now we can get the download URL
  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    console.log('File available at', downloadURL);

    setInputs((prev) => {
        return {
            ...prev,
            [fileType]:downloadURL
        }
    })

  });
}
);




    }


    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            await axios.post("http://localhost:5000/api/videos",{...inputs});
            window.location.reload();
        }catch(err){
            console.log(err);
        }

    }


  return (
    <div>
        <form onSubmit={handleSubmit} >
            <label>Video:</label>{videoPerc > 0 && "Uploading: "+ videoPerc + "%"}
            <br/>
            <input type='file' accept='video/' id='video' onChange={(e) =>{setVideo(e.target.files[0])}}  />
            <br/>
            <br/>
            <label>Images:</label>{imgPerc > 0 && "Uploading: " + imgPerc + "%"}
            <br/>
            <input type='file' accept='image/' id='image' onChange={(e) =>{setImg(e.target.files[0])}} />
            <br/>
            <br/>
            <button type='submit'>upload</button>


        </form>
    </div>
  )
}

export default Upload