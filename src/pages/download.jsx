import React, { useState,useEffect } from "react";
import "./download.css";
import { useNavigate } from 'react-router-dom';
import languagesIcon from "../images/languages.png";
import downloadIcon from "../images/download (1).png";
import saveIcon from "../images/save-instagram.png";
import mergeicon from "../images/pngegg.png";
import Cookie from "js-cookie";

function Download() {

    const [displayname,setDisplayname]= useState("");
    const [showfiles,setShowfiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [notification, setNotification] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [id,setId]= useState("");
    const [name,setName]= useState("");
    const [cook,setCook]=useState("");
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate();

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedFiles(showfiles);
        } else {
            setSelectedFiles([]);
        }
    };

    const handleFileSelect = (file) => {
        setSelectedFiles(prevSelected =>
            prevSelected.includes(file)
                ? prevSelected.filter(f => f !== file)
                : [...prevSelected, file]
        );
    };

    function displayPdf(filename) {
        setDisplayname('http://127.0.0.1:5000/pdf/' + filename);
    }

    async function fetchFilesAfterLoad(){
        try {
            const response = await fetch('http://127.0.0.1:5000/getfiles');
            if(response.ok) {
                const data = await response.json();
                setShowfiles(data.files);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function downloadFiles(event) {
        event.preventDefault();
        if(selectedFiles.length === 0){
            setNotification("No file selected");
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
            return;
        }
        const data={
            files:selectedFiles
        };
        fetch('http://127.0.0.1:5000/download',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
                if (response.status === 204) {
                    setNotification("No file uploaded");
                    setShowNotification(true);
                    setTimeout(() => {
                        setShowNotification(false);
                    }, 3000);
                } else {
                    return response.blob();
                }
            })
            .then(blob => {
                if (blob) {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'translated_files';
                    link.click();
                }
            })
            .catch(error => console.error('Error:', error));
    }

    useEffect(() => {
        fetchFilesAfterLoad();
        const token=Cookie.get("id");
        if(token!=undefined){
            setId(true);
            setCook(token);
            const data={
                id:token
            };
            fetch('http://127.0.0.1:5000/profilename',{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(data),
            })
            .then(response=>response.json())
            .then(result=>{
                setName(result.name);
            })
        }
        return;
    }, []);

    function sendfile(event){
        event.preventDefault();
        if(selectedFiles.length === 0){
            setNotification("No file selected");
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
            return;
        }
        if(!id){
            setNotification("No Account");
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
            return;
        }
        const data={
            id:cook,
            files:selectedFiles
        }
        try {
            fetch('http://127.0.0.1:5000/send',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response=>{
                if(response.ok) {
                    setNotification("Upload Successful");
                    setShowNotification(true);
                    setTimeout(() => {
                        setShowNotification(false);
                    }, 3000);
                }
                else {
                    setNotification("Upload Failed");
                    setShowNotification(true);
                    setTimeout(() => {
                        setShowNotification(false);
                    }, 3000);
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    function mergefiles(event){
        event.preventDefault();
        if(selectedFiles.length <= 1){
            setNotification("Select multiple files");
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
            return;
        }
        const data={
            files:selectedFiles
        }
        try {
            fetch('http://127.0.0.1:5000/merge',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response=>{
                if(response.ok){
                    window.location.reload();
                }
                else console.log('fucked');
            })
        } catch (error) {
            console.log(error);
        }
    }

    const login=()=>{
        navigate("/login", {
            state: {
                message: "From Downloads",
                userId: 1
            }
        });
    }
    
    const signup=()=>{
        navigate("/register", {
            state: {
                message: "From Downloads",
                userId: 1
            }
        });
    }
    
    const logout=()=>{
        Cookie.remove("id");
        navigate("/");
    }

    return (
        <div className="container4">
             {showNotification && (
                <div className="notification44">
                    {notification}
                </div>
            )}
            <div className="leftside4">
                <div className="hh4">SPAnslate</div>
                <div className="dets4">
                {
                    !id && (
                        <div className='interact4'>
                            <button type="button" onClick={login} className='button44'>Login</button>
                            <button type="button" onClick={signup} className='button44'>SignUp</button>
                        </div>
                    )
                }
                {
                    id && (
                        <div className='interact4'>
                            <span className="user-name4" >{name}</span>
                            <button type="button"  onClick={logout} className='button44'>Logout</button>
                        </div>
                    )
                }
                <button type="button" onClick={()=>navigate('/')} className="back4">BACK</button>
                </div>
            </div>
            <div className="translated-page4">
                <head>
                    <title>Translated File Page</title>
                    <link rel="icon" href={languagesIcon} type="image/png" />
                </head>
                <div className="file-display4">
                    <div className="showlist4">
                        <input type="checkbox" id="selectall4" name="selectall" value="selectall" checked={selectedFiles.length === showfiles.length} onChange={handleSelectAll}></input>
                        <label for="selectall" id="filelist4">Select All</label>
                        <ul>
                            {
                                showfiles.map((file) => (
                                    <li key={file} onClick={()=>displayPdf(file)}>
                                        <input type="checkbox" id="selectall4" name={file} checked={selectedFiles.includes(file)} onChange={() => handleFileSelect(file)}></input>
                                        <label for="selectall" id="filelist4">{file}</label>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="display4">
                        <iframe id="pdfIframe4" src={displayname}></iframe>
                        {loading &&
                            <div className="loading4">
                                <div className="spinner4"></div>
                            </div>
                        }
                    </div>
                </div>
                <div className="actions4">
                    <button id="downloadBtn4" onClick={downloadFiles}>
                        <img className="sing14" src={downloadIcon} alt="Download" />
                    </button>
                    <button id="saveButton4" onClick={sendfile}>
                        <img className="sing4" src={saveIcon} alt="Save" />
                    </button>
                    <button id="mergeButton4" onClick={mergefiles}>
                        <img className="sing4" src={mergeicon} alt="Save" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Download;
