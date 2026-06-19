import { useState, useEffect } from 'react'
import eyeShow from "../ShowFinal.png";
import eyeHide from "../HideFinal.png";
import background from "../Bg1.jpg";
import bin from "../bin.png";
import copy from "../copy.png";
import edit from "../edit.png";
import { motion, useScroll, useTransform } from "framer-motion";


const Home = () => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, -300]);
    const [visible, setVisible] = useState(false)
    const [form, setForm] = useState({ formWebsite: "", formUsername: "", formPassword: "" })
    const HandleChange = (e) => {
        setForm({
            ...form, [e.target.name]: e.target.value
        })
    }
    const [passwords, setPasswords] = useState([])
    const [passwordArray, setPasswordArray] = useState(() => {
        const savedPasswords = localStorage.getItem("passwords");
        return savedPasswords ? JSON.parse(savedPasswords) : [];
    });
    useEffect(() => {
        localStorage.setItem("passwords", JSON.stringify(passwords));
    }, [passwords]);
    const HandleTogglePasswordVisibility = () => {
        if (!visible) {
            setVisible(true)
        } else {
            setVisible(false)
        }
    }
    const HandleAddPassword = async () => {
        if (
            form.formWebsite.trim() &&
            form.formUsername.trim() &&
            form.formPassword.trim()
        ) {
            const passwordData = {
                website: form.formWebsite,
                username: form.formUsername,
                password: form.formPassword,
            };

            try {
                const response = await fetch(
                    "http://localhost:3000/save",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(passwordData),
                    }
                );

                const data = await response.json();
                console.log(data);

                setPasswords([...passwords, passwordData]);

                setForm({
                    formWebsite: "",
                    formUsername: "",
                    formPassword: "",
                });
            } catch (error) {
                console.error(error);
            }
        } else {
            alert("Please fill in all fields");
        }
    };
    const HandleDeletePassword = (index) => {
        const newPasswords = [...passwords];
        newPasswords.splice(index, 1);
        setPasswords(newPasswords);
    }
    const HandleCopyPassword = (password) => {
        navigator.clipboard.writeText(password)
            .then(() => {
                alert("Password copied to clipboard!");
            });
    };
    const HandleEditPassword = (index) => {
        HandleDeletePassword(index)
        const passwordToEdit = passwords[index];
        setForm({ formWebsite: passwordToEdit.website, formUsername: passwordToEdit.username, formPassword: passwordToEdit.password })
        focusInput();
    }
    return (
        <>
            <motion.div
                style={{
                    y,
                    position: "fixed",
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    inset: 0,
                    height: "150vh",
                    backgroundImage: `url(${background})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: -1,
                }}
            />

            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-center text-slate-50">Welcome to PassManager</h1>
                <p className="text-center text-slate-200 mt-4 font-semibold">Your secure password manager</p>
                <div className="container mx-auto p-4 flex flex-col items-center gap-4 rounded">
                    <input name='formWebsite' type="text" value={form.formWebsite} onChange={HandleChange} placeholder="Website URL" className="border p-2 rounded md:w-6/12 mb-4 bg-slate-900 text-slate-200 placeholder-slate-400" />
                    <div className="flex items-center gap-2 w-full md:w-6/12 mb-4 relative">
                        <input name='formUsername' type="text" value={form.formUsername} onChange={HandleChange} placeholder="Username" className="border p-2 rounded w-full bg-slate-900 text-slate-200 placeholder-slate-400" />
                        <input name='formPassword' type={visible ? "text" : "password"} value={form.formPassword} onChange={HandleChange} placeholder="Password" className="border p-2 rounded w-full bg-slate-900 text-slate-200 placeholder-slate-400" />
                        <span className="text-blue-500 hover:text-blue-700 cursor-pointer absolute text-sm right-4" onClick={() => { HandleTogglePasswordVisibility() }}>
                            <img src={visible ? eyeShow : eyeHide} alt={visible ? "Hide" : "Show"} className="h-5 w-5" />
                        </span>
                    </div>
                    <button onClick={HandleAddPassword} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer flex items-center gap-1"> <img src="https://cdn-icons-png.flaticon.com/512/2997/2997933.png" alt="Add" className="h-5 w-5 mr-2" />Add  Password</button>
                </div>
                <div className="container mx-auto w-9/12 md:w-6/12 bg-slate-900/60 backdrop-blur-md border border-blue-500/30 rounded-xl p-6 mt-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-100">Saved Passwords</h2>
                    {passwords.length === 0 ? (
                        <p className="text-gray-500">No passwords saved yet.</p>
                    ) : (
                        <ul className="space-y-4 flex flex-col-reverse">
                            {passwords.map((item, index) => (
                                <li key={index} className="border p-4 rounded flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-100">{item.website}</p>
                                        <p className="text-gray-500">{item.username}</p>
                                    </div>
                                    <p className="text-gray-500 mt-2 md:mt-0 flex items-center gap-2 invert ">{visible ? item.password : "••••••••"} <span className="text-blue-500 hover:text-blue-700 cursor-pointer" onClick={() => { HandleEditPassword(index) }}>
                                        <img src={edit} alt="Edit" className="h-5 w-5" />
                                    </span><span className="text-blue-500 hover:text-blue-700 cursor-pointer" onClick={() => { HandleCopyPassword(item.password) }}>
                                            <img src={copy} alt="Copy" className="h-5 w-5" />
                                        </span><span className="text-blue-500 hover:text-blue-700 cursor-pointer flex items-center gap-1" onClick={() => { HandleDeletePassword(index) }}>
                                            <img src={bin} alt="Delete" className="h-5 w-5" />

                                        </span></p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    )
}

export default Home