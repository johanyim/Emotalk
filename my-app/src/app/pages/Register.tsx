import React from 'react'


const Register = () => {
    return (
    <div className='h-screen w-screen bg-indigo-200 flex items-center justify-center rounded-lg'>
        <div className=''>
            <span className="title">Register</span>
            <form>
                <input type="text" placeholder="Display name"/>
                <input type="email" placeholder="email"/>
                <input type="password" placeholder="password"/>
                <button>Sign up</button>
            </form>
            <p>Or login</p>
        </div>
    </div>
    )
}

export default Register;
