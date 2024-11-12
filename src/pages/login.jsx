import React,{useState} from "react";
import "./login.css";
import languagesIcon from "../images/languages.png";
import Cookie from "js-cookie";
import { useNavigate,useLocation } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [notification, setNotification] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { message, userId } = location.state || {};

    function login(event){
        event.preventDefault();
        if(email==="" || password===""){
            setNotification("Empty column");
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
            return;
        }
        const data={
            user:email,
            password:password
        };
        try {
            fetch('http://127.0.0.1:5000/login',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response=>response.json())
            .then(result=>{
                if(result.id==401){
                    setNotification("No such account exist");
                    setShowNotification(true);
                    setTimeout(() => {
                        setShowNotification(false);
                    }, 3000);
                    return;
                }else if(result.id==402){
                    setNotification("Wrong Passowrd");
                    setShowNotification(true);
                    setTimeout(() => {
                        setShowNotification(false);
                    }, 3000);
                    return;
                }
                else{
                    Cookie.set("id",result.id);
                    if(userId){
                        navigate("/download");
                    }
                    else{
                        navigate("/");
                    }
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <div className="container2 login-background2">
            <head>
                <title>Login</title>
                <link rel="icon" href={languagesIcon} type="image/png" />
            </head>
            {showNotification && (
                <div className="notification22">
                    {notification}
                </div>
            )}
            <div className="left-box2">
                <h1 id="h2">SPAnslate</h1>
                <p id="p2">Translate your PDFs with ease</p>
            </div>
            <div className="right-box2">
                <h1 id="h2">Login</h1>
                <form>
                    <input
                        className="input2"
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        required
                        onChange={(e)=>{setEmail(e.target.value)}}
                    />
                    <input
                        className="input2"
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        required
                        onChange={(e)=>{setPassword(e.target.value)}}
                    />
                    <button className="button2" type="submit" onClick={login}>Login</button>
                </form>
                <p id="p2">
                    Don't have an account? <a className="a2" onClick={()=>navigate('/register')}>Register here</a>
                </p>
            </div>
        </div>
    );
}

export default Login;