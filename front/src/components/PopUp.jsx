import React, { useEffect, useState } from 'react'
import { isPopUpOpen, idUser } from '../utils/popUp'
import axios from 'axios'

const PopUp = () => {
    
    const [isVisible, setIsVisible] = useState(isPopUpOpen.get())
    const [institutions, setInstitutions] = useState([])

    const [form, setForm] = React.useState({
        name: "",
        email: "",
        idInstitution: "",
        password: "",
        state: ""
    })
    
    const {name, email,idInstitution, password, state} = form
    
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    
    const handleSubmit = async (e) => {
        const response = await axios.put(`http://localhost:3000/api/user/${idUser.get()}`, form)
        console.log(response.status)
    }
    
    const handleCancel = (e) => {
        e.preventDefault()
        setIsVisible(!isVisible)
    }
    useEffect(() => {
        const handleVisibilityChange = async () => {
            setIsVisible(isPopUpOpen.get());
            if(idUser.get()){
            const response = await axios.get(`http://localhost:3000/api/user/${idUser.get()}`)
            const institutionResponse = await axios.get(`http://localhost:3000/api/institution/get-all`)
            setInstitutions(institutionResponse.data)
            const data = response.data
            setForm({
                name: data.name,
                email: data.email,
                idInstitution: data.idInstitution,
                password: data.password,
                state: data.state
            })
            }
        };

        isPopUpOpen.subscribe(handleVisibilityChange);

        return () => {
            isPopUpOpen.unsubscribe(handleVisibilityChange);
        };
    }, []);

    
  return (
    <div id="popUp" className={`absolute top-0 left-0 w-full h-full z-30 
    ${isVisible ? "flex" : "hidden"}`} >
        <div className="relative w-full h-full flex justify-center items-center">
            <div className="bg-black opacity-50 w-full h-full" ></div>
            <form 
            className="absolute flex flex-col max-w-md w-full bg-white border border-gray-400 rounded-xl p-8 space-y-6 "
            >
                <h1 className="text-center font-bold text-4xl">Editar personal</h1>
                
                <div className="flex flex-col space-y-3">
                    <div className="flex flex-col space-y-2" >
                        <label className="font-semibold text-lg">Nombre</label>
                        <input 
                        className="border-gray-300 border-2 p-2 rounded-md outline-none"
                        placeholder="Ingresar nombre del personal"
                        value={name}
                        onChange={handleChange}
                        type="text" id="name" name="name" required />
                    </div>
                    {/* <div className="flex flex-col space-y-2" >
                        <label className="font-semibold text-lg">Correo</label>
                        <input 
                        className="border-gray-300 border-2 p-2 rounded-md outline-none"
                        placeholder="personal-casa@gmail.com"
                        value={email}
                        onChange={handleChange}
                        type="email" id="email" name="email" required />
                    </div> */}
                    <div className="flex flex-col space-y-2" >
                        <div className="flex flex-row " >
                            <label className="font-semibold text-lg" >Contraseña</label>
                        </div>
                        <input 
                        className="border-gray-300 border-2 p-2 rounded-md outline-none"
                        placeholder="Ingresar contraseña"
                        value={password}
                        onChange={handleChange}
                        type="text" id="password" name="password" required />
                    </div>
                    <div className="flex flex-col space-y-2" >
                        <div className="flex flex-row " >
                            <label className="font-semibold text-lg" >Institución</label>
                        </div>
                        <div className="relative " >
                            <select 
                            name="idInstitution" 
                            id="idInstitution" 
                            onChange={handleChange}
                            value={idInstitution}
                            className="border-gray-300 border-2 w-full p-2 rounded-md outline-none appearance-none">
                                {
                                institutions.map((institution) => {
                                    return (
                                    <option value={institution._id}>{institution.nameInstitution}</option>
                                )})
                                }
                            </select>
                            <div className="absolute left-0 top-0 w-full h-full flex items-center justify-end px-4 text-gray-700 pointer-events-none">
                                <i className="fa-solid fa-chevron-down "></i>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2" >
                        <div className="flex flex-row " >
                            <label className="font-semibold text-lg" >Estado</label>
                        </div>
                        <div className="relative " >
                            <select 
                            name="state" 
                            id="state" 
                            onChange={handleChange}
                            value={state}
                            className="border-gray-300 border-2 w-full p-2 rounded-md outline-none appearance-none">
                                <option value="Activo">Activo</option>
                                <option value="Bloqueado">Bloqueado</option>
                            </select>
                            <div className="absolute left-0 top-0 w-full h-full flex items-center justify-end px-4 text-gray-700 pointer-events-none">
                                <i className="fa-solid fa-chevron-down "></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between space-x-4" >
                    <button 
                        className="text-white font-semibold bg-black border-2 border-black rounded-lg p-2  w-full hover:scale-110 transition-all"
                        name="submit"
                        id="submit"
                        onClick={handleSubmit}
                        type="submit">Enviar edición</button>
                    <button 
                        className="text-black font-semibold  border-2 border-black rounded-lg p-2  w-full hover:scale-110 transition-all"
                        name="cancel"
                        id="cancel"
                        onClick={handleCancel}
                        >Cancelar edición</button>
                </div>
            </form>
        </div>
        
    </div>
    
  )
}



export default PopUp
