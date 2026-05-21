import ProjectModel from "../models/project.modal.js";
import mongoose from "mongoose";




export const createProject = async ({
    name,userId
})=> {
    if(!name){
        throw new Error('Project name is required');
    }
    if(!userId){
        throw new Error('User ID is required');
    }
    let project;
    try {
        project = await ProjectModel.create({
            name,
            users: [userId]
        });
    } catch (error) {
        if (error?.code === 11000 && error?.keyPattern?.name) {
            throw new Error("Project name already exists");
        }
        throw error;
    }
    return project;
}


export const getAllProjectByUserId = async ({userId}) => {
    if(!userId){
        throw new Error('User ID is required');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new Error('User ID must be a valid MongoDB ObjectId');
    }
    

    const allUserProjects = await ProjectModel.find({
        users: userId
    })

    return allUserProjects;
}


export const addUsersToProject = async ({projectId, users, userId}) => {

    if(!projectId){
        throw new Error('Project ID is required');
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error('Project ID must be a valid MongoDB ObjectId');
    }

    if(!users){
        throw new Error('Users are required');
    }

    if(!Array.isArray(users)){
        throw new Error('Users must be an array');
    }

    if(!userId){
        throw new Error('User ID is required');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new Error('User ID must be a valid MongoDB ObjectId');
    }

    const project = await ProjectModel.findOne({
        _id: projectId,
        users: userId
    })
    
    for(let i = 0; i < users.length; i++){
        if(!mongoose.Types.ObjectId.isValid(users[i])){
            throw new Error(`User at index ${i} must be a valid MongoDB ObjectId`);
        }
    }
    if(!project){
        throw new Error('Project not found or user does not have permission to add users');
    }

     const updatedProject = await ProjectModel.findOneAndUpdate({
        _id: projectId
    }, {
        $addToSet: {
            users: {$each: users
            }
        }
    }, {
        new: true
    })

    return updatedProject

}

export const getProjectById = async ({projectId}) => {
    if(!projectId){
        throw new Error('Project ID is required');
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error('Project ID must be a valid MongoDB ObjectId');
    }

    const project = await ProjectModel.findOne({
        _id: projectId
    }).populate('users')

    return project;
}

export const updateProjectFileTree = async ({projectId, fileTree}) => {

    if(!projectId){
        throw new Error('Project ID is required');
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error('Project ID must be a valid MongoDB ObjectId');
    }

    if(!fileTree){
        throw new Error('File tree is required');
    }    

    const updatedProject = await ProjectModel.findOneAndUpdate({
        _id: projectId
    }, {
    }, {
        new: true
    })
    return project;
    }