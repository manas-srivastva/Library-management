export const uploadBookCover=(file)=>{
    return {
        url:file.path,
        publicId:file.filename
    };
};



export const uploadAvatar=(file)=>{
    return {
        url:file.path,
        publicId:file.filename
    }
}