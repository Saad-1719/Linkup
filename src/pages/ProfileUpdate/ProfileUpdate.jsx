import React, { useEffect, useState } from "react";
import assets from "../../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const uploadImageToCloudinary = async (file) => {
    if (!file) {
      toast.error("No image selected");
      return null;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'profile_photos'); // Must match your Cloudinary upload preset
      formData.append('folder', 'profile_photos');

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

      if (!cloudName) {
        throw new Error("Cloudinary cloud name is not defined in the environment variables");
      }

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      let imgUrl = prevImage;

      if (image) {
        imgUrl = await uploadImageToCloudinary(image);
        if (!imgUrl) {
          toast.error("Failed to upload image");
          return;
        }
      }

      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, {
        ...(imgUrl && { avatar: imgUrl }),
        bio: bio,
        name: name,
      });

      toast.success("Profile updated successfully");
      navigate("/chat"); // Redirect after successful update
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const userData = docSnap.data();

        if (userData) {
          userData.name && setName(userData.name);
          userData.bio && setBio(userData.bio);
          userData.avatar && setPrevImage(userData.avatar);
        }
        setLoading(false);
      } else {
        navigate("/");
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload JPEG or PNG.");
        return;
      }

      if (file.size > maxSize) {
        toast.error("File too large. Maximum size is 5MB.");
        return;
      }

      setImage(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[url('/background.png')] bg-no-repeat flex items-center justify-center">
        <div className="bg-white flex items-center justify-between min-w-[700px] border-4 rounded-lg px-10">
          <div className="flex flex-col gap-5 p-10 w-full">
            <div className="h-6 bg-gray-400 rounded w-1/4 animate-pulse"></div>
            <div className="h-12 bg-gray-400 rounded-full w-12 animate-pulse"></div>
            <div className="h-10 bg-gray-400 rounded w-full animate-pulse"></div>
            <div className="h-20 bg-gray-400 rounded w-full animate-pulse"></div>
            <div className="h-10 bg-gray-400 rounded w-1/4 animate-pulse"></div>
          </div>
          <div className="h-40 w-56 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/background.png')] bg-no-repeat flex items-center justify-center">
      <div className="bg-white flex items-center justify-between min-w-[700px] border-4 rounded-lg px-10 space-x-12">
        <form className="flex flex-col gap-5 p-10" onSubmit={profileUpdate}>
          <h3 className="font-medium text-lg">Profile Details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 text-gray-400 cursor-pointer"
          >
            <input
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
              onChange={handleImageChange}
            />
            <img
              src={
                image 
                  ? URL.createObjectURL(image) 
                  : (prevImage || assets.avatar_icon)
              }
              alt="Profile"
              className="w-12 aspect-square rounded-full"
            />
            upload profile image
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="p-3 min-w-72 border-[1px] border-gray-400 outline-blue-700 rounded-lg"
          />
          <textarea
            placeholder="Write profile bio"
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-3 min-w-72 border-[1px] border-gray-400 outline-blue-700 rounded-lg"
          ></textarea>
          <button
            type="submit"
            disabled={uploading}
            className="text-white bg-blue-600 p-2 cursor-pointer hover:bg-blue-700 transition-all ease-in-out disabled:opacity-50 rounded-lg"
          >
            {uploading ? "Updating..." : "Save"}
          </button>
        </form>
        <img
          src={
            image 
              ? URL.createObjectURL(image) 
              : (prevImage || assets.logo_icon)
          }
          alt="Profile Preview"
          className="max-w-40 aspect-square my-5 mx-0 rounded-full"
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;

