import React, { useEffect, useState } from 'react';
import { FileInput, Textarea } from 'flowbite-react';
import axiosinstance from '../helpers/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Nav from '../components/Nav';
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { updateprofile } from '../Redux/Slices/AuthSlice';
import { useDispatch } from 'react-redux';

const ProfilePage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()

    const [updated, setupdated] = useState(false);
    const { userId } = useParams();
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        bio: '',
        github: '',
        website: '',
        instagram: '',
        facebook: '',
        twitter: '',
        youtube: '',
    });



    useEffect(() => {
        getProfile();
    }, [userId, updated]);

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

        const loading = toast.loading('wait uploading');

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
                user.user.profilePicture = response.data.data;
                localStorage.setItem("user", JSON.stringify(user));
            }

            toast.dismiss(loading);
            toast.success('Image uploaded successfully!');
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image.');
        }
    };

    const getProfile = async () => {
        try {
            setLoading(true);
            const { data } = await axiosinstance.post('/profile/get-profile', { username: userId });



            setFormData({
                profilePicture: data.profilePicture,
                firstName: data.fname,
                lastName: data.lname,
                username: data.username,
                email: data.email,
                bio: data.bio,
                github: data.social_links.github,
                website: data.social_links.website,
                instagram: data.social_links.instagram,
                facebook: data.social_links.facebook,
                twitter: data.social_links.twitter,
                youtube: data.social_links.website,
            })

            setLoading(false);
            return toast.success('Profile fetched successfully');
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);

            const formDataToSend = new FormData();

            for (const key in formData) {
                if (formData.hasOwnProperty(key)) {
                    formDataToSend.append(key, formData[key]);
                }
            }

            if (imageFile) {
                formDataToSend.append('avatar', imageFile);
            }

            for (let [key, value] of formDataToSend.entries()) {
                console.log(`${key}: ${value}`);
            }
            console.log("jii vara");
            // const response = await dispatch(createAccount(data)).unwrap();

            const res = await dispatch(updateprofile({ userId, formDataToSend }))
            console.log(res);

            setupdated(res.payload.data.success);
            setLoading(false);
            toast.success('Profile updated successfully!');
            return navigate('/')
        } catch (error) {
            console.error("Error updating profile: ", error);
            setLoading(false);

        }
    };

    return (
        <div>
            <Nav />
            <div className='mt-16 '>
                {loading ? (
                    <div className="flex justify-center  items-center min-h-screen">
                        <h1 className="text-4xl text-black dark:text-white">Loading</h1>
                    </div>
                ) : (
                    <div className='p-4 md:w-[80%] mx-auto '>
                        <h1 className='dark:text-white heading'>Update Profile</h1>

                        <div className=' mx-auto flex p-4 max-md:flex-col '>
                            <div className='p-4 w-full flex flex-col gap-3'>
                                <div className="flex gap-4 items-center relative justify-center w-100 mx-auto w-fit">
                                    <Label
                                        className="flex h-56 w-56 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                    >
                                        <img src={selectedImage ? selectedImage : formData.profilePicture ? `${import.meta.env.VITE_SERVER_DOMAIN}${formData.profilePicture}` : ''} alt="Selected" className="h-full w-full rounded-full object-cover" />
                                    </Label>
                                    <FileInput onChange={handleImageChange} id="dropzone-file" className="hidden" />
                                    <Label
                                        type="button"
                                        htmlFor="dropzone-file"
                                        className='dark:bg-slate-800 dark:text-white btn absolute right-4 bottom-3 cursor-pointer'
                                    >
                                        <i className="fa-solid fa-cloud-arrow-up"></i>
                                    </Label>
                                </div>
                                <div className='flex gap-3 mx-auto w-full justify-center '>
                                    <TextInput value={formData.firstName} className='w-full' id="firstName" name="firstName" type="text" placeholder="First Name" required onChange={handleInputChange} />
                                    <TextInput value={formData.lastName} className='w-full' id="lastName" name="lastName" type="text" placeholder="Last Name" required onChange={handleInputChange} />
                                </div>
                                <div className='flex flex-col mx-auto w-full justify-center'>
                                    <TextInput value={formData.username} className='w-full' id="username" name="username" type="text" placeholder="Username" required onChange={handleInputChange} />
                                    <p className='text-sm dark:text-white p-1'>Username will be used to search the user and will be visible to all users</p>
                                </div>
                                <div className='flex flex-col mx-auto w-full justify-center'>
                                    <TextInput disabled value={formData.email} className='w-full' id="email" name="email" type="text" placeholder="Email" required onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className='p-4 w-full md:mt-[1.3rem]'>
                                <div className='w-full flex flex-col gap-4 items-center'>
                                    <div className='flex flex-col mx-auto w-full justify-center'>
                                        <Textarea value={formData.bio} className='w-full h-32' id="bio" name="bio" type="text" placeholder="Bio" onChange={handleInputChange} />
                                        <p className='text-sm dark:text-white p-1'><span className={formData.bio.length > 800 ? 'text-red-500 ' : " text-green-300 " + '  text-sm'}>{800 - formData.bio.length > 0 ? 800 - formData.bio.length : 0}</span>/800 character left</p>
                                    </div>
                                    <div className='w-full flex flex-col gap-3'>
                                        <p className='text-sm dark:text-white p-1'>Add your social links</p>
                                        <div className='flex gap-3 mx-auto w-full justify-center max-md:flex-col'>
                                            <TextInput value={formData.github} className='w-full' id="github" name="github" type="text" placeholder="GitHub" onChange={handleInputChange} />
                                            <TextInput value={formData.website} className='w-full' id="website" name="website" type="text" placeholder="Portfolio Website" onChange={handleInputChange} />
                                        </div>
                                        <div className='flex gap-3 mx-auto w-full justify-center max-md:flex-col'>
                                            <TextInput value={formData.instagram} className='w-full' id="instagram" name="instagram" type="text" placeholder="Instagram" onChange={handleInputChange} />
                                            <TextInput value={formData.facebook} className='w-full' id="facebook" name="facebook" type="text" placeholder="Facebook" onChange={handleInputChange} />
                                        </div>
                                        <div className='flex gap-3 mx-auto w-full justify-center max-md:flex-col'>
                                            <TextInput value={formData.twitter} className='w-full' id="twitter" name="twitter" type="text" placeholder="Twitter" onChange={handleInputChange} />
                                            <TextInput value={formData.youtube} className='w-full' id="youtube" name="youtube" type="text" placeholder="YouTube" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button className='w-80 mx-auto' onClick={handleUpdate}>Update</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
