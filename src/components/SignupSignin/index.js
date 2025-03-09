import React, { useState } from "react";
import "./styles.css"
import Input from "../Input";
import Button from "../Button";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword ,signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { doc, setDoc , getDoc} from "firebase/firestore"; 
import { auth , db,  provider} from "../../firebase";
import { useNavigate } from "react-router-dom";
function SignupSigninComponent(){
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [loading,setLoading]=useState(false);
    const [loginForm,setLoginform]=useState(false);
    const navigate = useNavigate();
    function signpWithEmail(){
        setLoading(true);
        console.log("Name",name);
        console.log("Email",email);
        console.log("Password",password);
        console.log("ConfrimPassword",confirmPassword);
        if(name!=="" && email !=="" && password!=="" && confirmPassword!==""){
            if(password===confirmPassword){
                createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("User>>",user);
                    toast.success("User Created");
                    setLoading(false);
                    setConfirmPassword("");
                    setEmail("");
                    setName("");
                    setPassword("");
                    createDoc(user);
                    navigate("/dashboard");
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(errorMessage);
                    setLoading(false);
                });
            }else{
                toast.error("PassWord and Confirm Password don't match!");
                setLoading(false);
            }
        }else{
            toast.error("All fields are manadatory!")
            setLoading(false);
        }
    }
    function loginWithEmail(){
        console.log("Email",email);
        console.log("Password",password);
        setLoading(true);
        if(email !=="" && password!==""){
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                toast.success("User Logged In");
                navigate("/dashboard");
                setLoginform(false);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorMessage);
                setLoginform(false);
            });
        }else{
            toast.error("All fields are manadotory!")
            setLoginform(false);
        }
    }
    async function createDoc(user){
        if(!user) return;
        const userRef=doc(db,"users",user.uid);
        const userData=await getDoc(userRef);
        setLoading(true);
        if(!userData.exists()){
            try{
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName? user.displayName:name,
                    email:user.email,
                    photoUrl: user.photoUrl?user.photoUrl:"",
                    createdAt:new Date(),
                });
                setLoading(false);
            }catch (e){
                setLoading(false);
            }
        }else{
            setLoading(false);
        }
        
    }
    function googleAuth(){
        setLoading(true);
        try{
            signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                toast.success("User autheticated!");
                navigate("/dashboard");
                createDoc(user);
                setLoading(false);
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                toast.success(errorMessage);
                setLoading(false);
            });
        }catch(e){
            toast.error(e.message);
            setLoading(false);
        }
        
    }
    return(
        <>
        {loginForm?(
            <div className="signup-wrapper">
                <h2 className="title">
                    Login on <span style={{color: "var(--theme)"}}>FinTrack.</span>
                </h2>
                <form>
                    <Input 
                        type={"Email"}
                        label={"Email"} 
                        state={email}
                        setState={setEmail}
                        placeholder={"jamie.walker@example.com"}
                    />
                </form> 
                <form>
                    <Input 
                        type={"password"}
                        label={"Password"} 
                        state={password}
                        setState={setPassword}
                        placeholder={"Example@123"}
                    />
                    <Button 
                        disabled={loading}
                        text={loading?"Loading...":"Login Using Email and Password"} 
                        onClick={loginWithEmail}
                    />
                    <p className="p-login">or</p>
                    <Button 
                        onClick={googleAuth}
                        disabled={loading}
                        text={loading?"Loading...":"Login Using Google" } 
                        blue={true} 
                        />
                    <p 
                        className="p-login" 
                        style={{cursor:"pointer"}} 
                        onClick={()=>setLoginform(!loginForm)}>Don't Have an account? <span style={{color: "var(--theme)"}}>Click Here</span></p>
                </form> 
            </div>
        ):(
            <div className="signup-wrapper">
                <h2 className="title">
                    Signup on <span style={{color: "var(--theme)"}}>FinTrack.</span>
                </h2>
                <form>
                    <Input 
                        label={"Full Name"} 
                        state={name}
                        setState={setName}
                        placeholder={"Jamie Walker"}
                    />
                </form>
                <form>
                    <Input 
                        type={"Email"}
                        label={"Email"} 
                        state={email}
                        setState={setEmail}
                        placeholder={"jamie.walker@example.com"}
                    />
                </form> 
                <form>
                    <Input 
                        type={"password"}
                        label={"Password"} 
                        state={password}
                        setState={setPassword}
                        placeholder={"Example@123"}
                    />
                </form>
                <form>
                    <Input 
                        type={'password'}
                        label={"Confirm Password"} 
                        state={confirmPassword}
                        setState={setConfirmPassword}
                        placeholder={"Example@123"}
                    />
                    <Button 
                        disabled={loading}
                        text={loading?"Loading...":"Signup Using Email and Password"} 
                        onClick={signpWithEmail}
                    />
                    <p className="p-login">or</p>
                    <Button 
                        onClick={googleAuth}
                        disabled={loading}
                        text={loading?"Loading...":"Signup Using Google" } 
                        blue={true} 
                        />
                    <p 
                        className="p-login" 
                        style={{cursor:"pointer"}} 
                        onClick={()=>setLoginform(!loginForm) }>Already Have an account? <span style={{color: "var(--theme)"}}>Click Here</span></p>
                </form> 
            </div>)
            }
            
        </> 
    );
}

export default SignupSigninComponent;