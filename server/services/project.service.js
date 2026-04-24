import ProjectModel from "../models/project.modal.js";




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