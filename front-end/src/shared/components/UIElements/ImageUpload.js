import React, {useRef, useState, useEffect} from "react";

import './ImageUpload.css';
import Button from "./Button";

const ImageUpload = (props) => {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState();

    const imageRef = useRef();

    useEffect(()=>{
        if(!file) {
            return;
        } else {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPreviewUrl(fileReader.result);
            };
            fileReader.readAsDataURL(file);
        }
    }, [file]);

    const pickImageHandler = () => {
        imageRef.current.click();
    }
    
    const pickedHandler = event => {
        let pickedFile;
        let fileIsValid = isValid;

        if(event.target.files && event.target.files.length===1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }

        props.onInput(props.id, pickedFile, fileIsValid);
    }

    return (
        <div className="form-control">
            <input 
                id={props.id}
                style={{display: "none"}}
                type="file"
                accept=".jpg,.png,.jpeg"
                ref={imageRef}
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview">
                    {previewUrl &&<img src={previewUrl} alt="preview" />}
                    {!previewUrl && <p>Please pick an image.</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}> PICK IMAGE</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    )
};

export default ImageUpload;