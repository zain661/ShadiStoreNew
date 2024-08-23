import React from 'react';
// import './CSS/LoginSignup.css'
import { useState } from 'react';

const LoginSignup = () => {

  const [state, setState] = useState("تسجيل دخول");
  const [formData, setFormData] = useState({
    username:"",
    password:"",
    email:"",
  });
 
  const changeHandler = (e)=>{
    setFormData({...formData,[e.target.name] : e.target.value});
  }

  const login = async ()=>{
    console.log("login function", formData);
    let responseData;
    await fetch(`${process.env.REACT_APP_SERVER_URL}/login`,{
      method: 'POST',
      headers:{
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(formData),
    }).then((response)=>response.json()).then((data)=>responseData = data)
    if(responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors)
    }
  }

  const signup = async ()=>{
    console.log("signup function", formData);
    let responseData;
    await fetch(`${process.env.REACT_APP_SERVER_URL}/signup`,{
      method: 'POST',
      headers:{
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(formData),
    }).then((response)=>response.json()).then((data)=>responseData = data)
    if(responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors)
    }
  }

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "الاشتراك" ? <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='اسمك' /> : <></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='الايميل' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='كلمة السر' />
        </div>
        <button onClick={()=>{state === "تسجيل دخول" ? login() : signup()}}>استمر</button>
        {state === "الاشتراك" ? 
         <p className='loginsignup-login'>هل تملك حساب من قبل؟ <span onClick={()=>{setState("تسجيل دخول")}}>سجل الدخول من هنا</span> </p> :
         <p className='loginsignup-login'>هل تريد عمل حساب؟ <span onClick={()=>{setState("الاشتراك")}}>اضغط هنا</span> </p>
         }
        {state === "تسجيل دخول" && (
          <div className="loginsignup-agree">
            <input type="checkbox" name='' id='' />
            <p>أوافق على السياسات</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginSignup;
