import React from 'react'
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-slate-900/60 backdrop-blur-md border-b border-blue-500/20 text-white p-4">
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="text-xl font-bold">PassManager</h1>
                <div>
                    <button className="bg-slate-900/60 backdrop-blur-md border-b border-blue-500/20 text-white px-1 py-1 rounded ml-0"><Link to="/">Home</Link></button>
                    <button className="bg-slate-900/60 backdrop-blur-md border-b border-blue-500/20 text-white px-1 py-1 rounded ml-2"><Link to="/about">About</Link></button>
                    <button className="bg-slate-900/60 backdrop-blur-md border-b border-blue-500/20 text-white px-1 py-1 rounded ml-2"><Link to="/contact">Contact</Link></button>
                </div>
            </div>
        </nav>
    )
}
export default Navbar
