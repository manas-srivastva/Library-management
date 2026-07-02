import ApiError from "../utils/ApiError.js"

import * as categoryRepository from "../repositories/categoryRepository.js"


export const createCategory=async(data)=>{
    const existing=await categoryRepository.findByName(data.name);

    if(existing)
    {
        throw new ApiError(400,"Category already exists");
    }

    return await categoryRepository.createCategory(data);
};


export const getCategories=async()=>{
    return await categoryRepository.getAllCategories();
};


export const updateCategory=async(
    id,data)=>{
    const category=await categoryRepository.findById(id);

    if(!category){
        throw new ApiError(
            404,"Category not found"
        );
    }

    return await categoryRepository.updateCategory(id,data);
};


export const deleteCategory=async(id)=>{
    const category=await categoryRepository.findById(id);
    if(!category){
        throw new ApiError(404,"category not found")
    }

    await categoryRepository.deleteCategory(id);
}