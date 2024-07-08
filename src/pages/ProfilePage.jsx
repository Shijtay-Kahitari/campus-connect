import React, { useEffect, useState } from 'react';
import { FileInput, Label } from 'flowbite-react';
import axiosinstance from '../helpers/axiosInstance'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader'

const ProfilePage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [flag, setFlag] = useState(null);
    const [imageFile, setImageFile] = useState(false);
    const [loading, setLoading] = useState(false)

    const [userProfile, setUserProfile] = useState({})
    const { userId } = useParams();
    useEffect(() => {
        getProfile()
    }, [userId])

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
            setImageFile(file);
        }
    };





    const handleUpload = async () => {
        if (!imageFile) {
            toast.error('No image selected!');
            return;
        }

        const loading = toast.loading('wait uploading')

        const formData = new FormData();
        formData.append('avatar', imageFile);
        formData.append('username', userId);

        try {
            const response = await axiosinstance.post('/profile/upload-profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const userInSession = localStorage.getItem("user");
            let user = null;
            if (userInSession) {
                user = JSON.parse(userInSession);
                user.user.profilePicture =  response.data.data;
                localStorage.setItem("user", JSON.stringify(user)); // Make sure to set "user" with JSON.stringify
            }


            toast.dismiss(loading)
            toast.success('Image uploaded successfully!');
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image.');
        }
    };

    const getProfile = async () => {
        try {
            setLoading(true)
            const userData = await axiosinstance.post('/profile/get-profile', { username: userId });

            // Retrieve user from localStorage and update profilePicture if user exists

            // Assuming setUserProfile is a function to update state or handle profile data
            setUserProfile(userData.data);
            setLoading(false)
            return toast.success('profile fetch successfully')


        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };


    return (
        <>
            {
                loading ? <div className="flex justify-center items-center h-screen">

                    <h1
                        className="text-4xl text-black dark:text-white"

                    >Loading</h1>
                </div> :


                    <div className='flex p-4 w-full '>
                        <div className='p-4 w-full '>
                            <div className="flex items-center justify-center">
                                <Label
                                    htmlFor="dropzone-file"
                                    className="flex h-64 w-64 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                >

                                    <img src={selectedImage ? selectedImage : userProfile ? `${import.meta.env.VITE_SERVER_DOMAIN}${userProfile.profilePicture}` : ''} alt="Selected" className="h-full w-full rounded-full object-cover" />

                                    <FileInput id="dropzone-file" className="hidden" onChange={handleImageChange} />
                                </Label>
                            </div>
                            <button
                                type="button"
                                onClick={handleUpload}
                                className="rounded-lg w-full mt-4 bg-blue-700 px-4 py-3 text-xs font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-auto"
                            >
                                Upload
                            </button>
                        </div>
                        <div className='p-4 w-full'></div>
                    </div>
            }
        </>
    );
};

export default ProfilePage;
