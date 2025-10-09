import { PieceService } from "../application/PieceService.js";

export const getAll=async (req,res,next)=>{
    try{
        const data=await PieceService.list();
        res.status(200).json(data);
    }catch(err){
        next(err)
    }
};

export const create=async(req,res,next)=>{
    try{
    const Piece=await PieceService.create(req.body);
    res.status(201).json(Piece);
    }catch(err){
        next(err)
    }
};
export const updare=async(req,res,next)=>{
    try{
        const id=req.params.id.replace(/['"]+/g, "")
        const Piece=await PieceService.update(id,req.body);
        res.status(201).json(Piece);
        }catch(err){
            next(err)
    };
}

export const remove=async(req,res,next)=>{
    try{
        const id=req.params.id.replace(/['"]+/g, "")
        const Piece=await PieceService.remove(id);
        res.status(201).json(Piece);
        }catch(err){
            next(err)
    }
}
