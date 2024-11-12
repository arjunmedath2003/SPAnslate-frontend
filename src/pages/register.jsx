import React,{useState} from "react";
import "./register.css";
import languagesIcon from "../images/languages.png";
import Cookie from "js-cookie";
import { useNavigate,useLocation } from 'react-router-dom';

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [notification, setNotification] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { message, userId } = location.state || {};

    function validateGmail(email) {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return gmailRegex.test(email);
    }

    function validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }

    function signup(event){
        event.preventDefault();
        if(email==="" || name==="" || password===""){
            setNotification("Empty column");
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
            return;
        }
        if(!validateGmail(email)){
            setNotification("Not proper email");
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
            return;
        }
        if(!validatePassword(password)){
            setNotification("Not a strong password");
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
            return;
        }
        const data={
            name:name,
            user:email,
            password:password
        };
        try {
            
            fetch('http://127.0.0.1:5000/signup',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response=>response.json())
            .then(result=>{
                Cookie.set("id",result.id);
                if(userId){
                    navigate("/download");
                }
                else{
                    navigate("/");
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container3">
            <head>
                <title>Register</title>
                <link rel="icon" href={languagesIcon} type="image/png" />
            </head>
            {showNotification && (
                <div className="notification33">
                    {notification}
                </div>
            )}
            <div className="left-box3">
                <h1 className="h3">SPAnslate</h1>
                <p className="p3">Translate your PDFs with ease</p>
            </div>
            <div className="right-box3">
                <h1 className="h3">Register</h1>
                <form>
                    <input
                        className="input3"
                        type="text"
                        name="Name"
                        id="username3"
                        placeholder="Name"
                        required
                        onChange={(e)=>{setName(e.target.value)}}
                    />
                    <input
                        className="input3"
                        type="text"
                        name="username"
                        id="username3"
                        placeholder="Username"
                        required
                        onChange={(e)=>{setEmail(e.target.value)}}
                    />
                    <input
                        className="input3"
                        type="password"
                        name="password"
                        id="password3"
                        placeholder="Password"
                        required
                        onChange={(e)=>{setPassword(e.target.value)}}
                    />
                    <button className="button3" type="submit" onClick={signup}>Register</button>
                </form>
                <p className="p3">
                    Already have an account? <a className="a3" onClick={()=>navigate('/login')}>Login here</a>
                </p>
            </div>
        </div>
    );
}

export default Register;
