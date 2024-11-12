import React, { useState ,useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import add from "../images/plus-sign.png"
import languagesIcon from "../images/languages.png";
import './pdf.css';
import data23 from "./lang.json";
import Cookie from "js-cookie";

const Home = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [filenames, setFilenames] = useState([]);
    const [displayname,setDisplayname]= useState("");
    const [language,setLanguage] = useState(data23[0]);
    const [notification, setNotification] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [loading, setLoading] = useState(false);
    const [id,setId]= useState("");
    const [name,setName]= useState("");
    const [cook,setCook]=useState("");

    useEffect(()=>{
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
                    'Content-Type': 'application/json', // Set content type to JSON
                },
                body: JSON.stringify(data),
            })
            .then(response=>response.json())
            .then(result=>{
                setName(result.name);
            })
        }
        return;
    },[])

    const navigate=useNavigate();
    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const login=()=>{
        navigate("/login", {
            state: {
                message: "From Mainpage",
                userId: 0
            }
        });
    }
    
    const signup=()=>{
        navigate("/register", {
            state: {
                message: "From Mainpage",
                userId: 0
            }
        });
    }
    
    const logout=()=>{
        Cookie.remove("id");
        window.location.reload();
    }

    const handleFileChange = (event) => {
        event.preventDefault();
        async function fun() {
            const files = event.target.files;
            if (files.length === 0) {
                alert("Please select at least one PDF.");
                return;
            }
            const formdata = new FormData();
            for (const file of files) {
                formdata.append('pdfs', file);
            }
            try {
                let response = await fetch('http://127.0.0.1:5000/upload', {
                    method: 'POST',
                    body: formdata
                });
                let account=await response.json();
                if(response.ok){
                    console.log(account.files);
                    setFilenames(account.files);
                }
            } catch (error) {
                console.log(error);   
            }
        }
        fun();
    };

    async function performTranslation(event){
        event.preventDefault();
        const data={
            lang:language.code
        }
        setLoading(true);
        try {
            const response=await fetch('http://127.0.0.1:5000/translatepdfs',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if(response.status==410){
                setLoading(false);
                setNotification("No file uploaded");
                setShowNotification(true);
                setTimeout(() => {
                    setShowNotification(false);
                }, 3000);
                return;
            }else{
                navigate("/download");
            }
        } catch (error) {
            console.log(error);
        }
    }

    function displayPdf(filename) {
        setDisplayname('http://127.0.0.1:5000/pdf/' + filename);
    }

    function showhistory(event){
        event.preventDefault();
        if(!id){
            setNotification("No Account");
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
            return;
        }
        const url='http://127.0.0.1:5000/save/'+cook;
        try {
            fetch(url).then(response=>{
                if(response.ok){
                    console.log('worked');
                    navigate("/download");
                }else{
                    console.log('fucked');
                }
            });
        } catch (error) {
            setNotification("Error occured");
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
            return;
        }
    }

  return (
    <div className="main-layout1">
        <head>
            <title>Translated File Page</title>
            <link rel="icon" href={languagesIcon} type="image/png" />
        </head>
        <div className="header1">
            <div className="hh1">SPAnslate</div>
            <div className="dets1">
                {
                    !id && (
                        <div className='interact1'>
                            <button type="button" onClick={login} className='button11'>Login</button>
                            <button type="button" onClick={signup} className='button11'>SignUp</button>
                        </div>
                    )
                }
                {
                    id && (
                        <div className='interact1'>
                            <span className="user-name1" >{name}</span>
                            <button type="button"  onClick={logout} className='button11'>Logout</button>
                        </div>
                    )
                }
            </div>
            <div className="log-b1">
            <button className="lb1" id="logb1" onClick={showhistory}>
                Saved
            </button>
            </div>
        </div>

        <div className="container1">
            {showNotification && (
                <div className="notification12">
                    {notification}
                </div>
            )}
            <div className="left-box1" id="leftBox1">
                <iframe id="pdfIframe1" src={displayname}></iframe>
            </div>
            <div className="right-box1">
                <div className="upper-right1">
                <div className="input-button-container11">
                    <div className="dropdown-container1" onClick={toggleDropdown}>
                        <input type="text" name="language" id="language1" readOnly placeholder="Select Language" value={language.name}/>
                        {isDropdownOpen && (
                            <div className="dropdown1">
                                {data23.map((item) => (
                                    <div key={item.code} value={item.code} className="items1" onClick={()=>setLanguage(item)}>
                                        <p className="p11">{item.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button className="action1" onClick={performTranslation}>Translate</button>
                </div>
                <div className="loading1">
                    {loading && <div className="spinner1"></div>}
                </div>
                </div>
                <div className="small-square1" id="addFileBtn1">
                    <button className="ss1" onClick={handleButtonClick}>
                        <img src={add} alt="add" width="40px" />
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept=".pdf"
                        multiple
                        onChange={handleFileChange}
                    />
                </div>
                <div className="lower-right-box1" id="extraFilesBox1">
                    <ul>
                        {
                            filenames.map(file => (
                                <li onClick={() => displayPdf(file)} className='li1' key={file}>{file}</li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Home;
