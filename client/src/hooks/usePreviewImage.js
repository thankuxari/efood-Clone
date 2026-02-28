import { useState } from "react";

function usePreviewImage() {
    const [imageUrl, setImageUrl] = useState(null);

    function handleImageChange(e) {
        const file = e.target.files[0];

        if (
            file.type === "image/jpeg" ||
            file.type === "image/png" ||
            file.type === "image/jpg" ||
            file.type === "image/gif" ||
            file.type === "image/webp"
        ) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImageUrl(reader.result);
            };

            reader.readAsDataURL(file);
        } else {
            setImageUrl(null);
        }
    }

    return { handleImageChange, imageUrl };
}

export default usePreviewImage;
