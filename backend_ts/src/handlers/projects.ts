import { Response,Request } from "express";
import { connection } from "../lib/db";
import { buildImage, stopContainer } from "../managers/docker";
import { Build } from "../dtos/build";

export const getProjectslist = async (req:Request,res:Response) => {
    const query = `SELECT * FROM projects`;
    const rows = await connection.query(query);
    if(rows.rowCount === 0){
        res.status(404).json({message:'No projects found'});
    }else{
        res.status(200).json(rows.rows);
    }
};

export const buildImageHandler = async (req:Request<{},{},Build>,res:Response) => {
    const buildconfig = req.body;
    if(!buildconfig.name || !buildconfig.dockerfile){
        res.status(400).json({message:'Invalid Request'});
    }
    else{
        try{
            res.status(200).json({message:'Docker Build Started'});
            buildImage(buildconfig);
        }catch(err){
            res.status(500).json({message:'Error Building Docker Image'});
        }
    }
}

export const stopContainerHandler = async (req:Request<{},{},{name:string}>,res:Response) => {
    const {name} = req.body;
    if(!name){
        res.status(400).json({message:'Invalid Request!'});
    }
    else{
        try{
            res.status(200).json({message:'Stopping Container Requested'});
            stopContainer(name);
        }catch(err){
            res.status(500).json({message:'Error Stopping Container'});
        }
    }
}