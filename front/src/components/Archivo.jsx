import React, { useEffect, useState } from "react";
import axios from 'axios';
import { newFileUpload } from "../utils/popUp";

const Archivo = ({ idInstitution }) => {
    const [files, setFiles] = useState([]);
    const [changeFile, setChangeFile] = useState(false);
    const [openOptionsId, setOpenOptionsId] = useState(null);
    const [editFileId, setEditFileId] = useState(null);
    const [editedFileName, setEditedFileName] = useState('');

    const handleClick = (fileId) => {
        setOpenOptionsId(prevId => (prevId === fileId ? null : fileId));
    };

    const handleVisibilityEdit = (fileId, currentName) => {
        setEditFileId(prevId => (prevId === fileId ? null : fileId));
        setEditedFileName(currentName);
    };

    const handleDeleteFile = async (idInstitution, idFile, extension) => {
        try {
            await axios.delete(
                'http://localhost:3000/api/file/' + idInstitution + "/" + idFile + "/" + extension);
            setChangeFile(!changeFile);
        } catch (error) {
            console.error('Error al eliminar archivo:', error);
        }
    };

    const handlePutFile = async (idFile) => {
        try {
            await axios.put(
                'http://localhost:3000/api/file/' + idFile, 
                { name: editedFileName }); // Envía el nombre editado
            setChangeFile(!changeFile);
        } catch (error) {
            console.error('Error al editar archivo:', error);
        }
    };

    const fetchFiles = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/file/' + idInstitution);
            setFiles(response.data);
        } catch (error) {
            console.error('Error al obtener archivos:', error);
        }
    };

    useEffect(() => {
        // Suscribirse a los cambios en newFileUpload
        const unsubscribe = newFileUpload.subscribe(() => {
            fetchFiles();
        });

        // Obtener los archivos inicialmente
        fetchFiles();

        // Desuscribirse cuando el componente se desmonte
        return () => {
            unsubscribe();
        };
    }, [idInstitution, changeFile]);

    return (
        <div className="*:gap-x-6 flex flex-col">
            <div className="grid grid-cols-12 font-semibold text-lg mb-4 px-2">
                <div className="col-span-6">Nombre</div>
                <div className="col-span-2">Personal</div>
                <div className="col-span-2 flex flex-row justify-between items-center">
                    <span>Fecha Registro</span>
                    <i className="fa-solid fa-caret-down"></i>
                </div>
                <div className="col-span-2 flex flex-row justify-between items-center">
                    <span>Tamaño</span>
                    <i className="fa-solid fa-caret-down px-1"></i>
                </div>
            </div>

            {
            files.length === 0 ? (
                <div className="text-center text-gray-600">Cargando ...</div>
            )
            :
            files.map(file => (
                <div key={file._id} className="grid grid-cols-12 text-gray-600 border-t border-gray-400 py-2 hover:bg-gray-200 px-2">
                    <div className="col-span-6 text-black font-medium">
                        {
                            editFileId === file._id ? (
                                <form 
                                    className="flex space-x-2" 
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handlePutFile(file._id);
                                        setEditFileId(null);
                                    }}
                                >
                                    <input 
                                    className="w-full border-gray-400 border px-1 rounded-md outline-gray-600"
                                    type="text" 
                                    value={editedFileName} 
                                    onChange={(e) => setEditedFileName(e.target.value)} 
                                    />
                                    <button 
                                    className="bg-blue-500 text-white px-2 rounded-md font-normal transition-all duration-300 hover:bg-blue-600 hover:px-4" 
                                    type="submit">Actualizar</button>
                                </form>
                            ) : (
                                <span>{file.name || 'Nombre del archivo'}</span>
                            )
                        }
                    </div>
                    <div className="col-span-2 flex flex-row items-center space-x-2">
                        <div className="aspect-square rounded-full w-6 text-sm text-white bg-red-500 grid place-content-center">
                            <span className="px-2">{file.username[0]}</span>
                        </div>
                        <span className="truncate" >{file.username || 'Desconocido'}</span>
                    </div>
                    <div className="col-span-2 flex flex-row items-center">
                        <span>{file.createdAt.split('T')[0] || 'Fecha'}</span>
                    </div>
                    <div className="col-span-2 flex flex-row justify-between items-center">
                        <span>{file.size || 'Tamaño'}  MB</span>
                        <div className="relative">
                            <button onClick={() => handleClick(file._id)}><i className="text-black fa-solid fa-ellipsis-vertical px-2"></i></button>
                            {openOptionsId === file._id && (
                                <ul className="absolute -left-24 z-20 block bg-white border border-gray-300 rounded shadow-lg">
                                    <li 
                                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                        <a href={file.url}>Descargar</a></li>
                                    <li  
                                    onClick={() => handleVisibilityEdit(file._id, file.name)}
                                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Editar</li>
                                    <li 
                                    onClick={() => handleDeleteFile(idInstitution, file._id, file.type)}
                                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Eliminar</li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Archivo;
