import { AccessService } from "../application/AcessService.js";

export function authorize(rolesAllowed=[]){
    return(req,res,next)=>{
        const user=req.user;
        if(!user){
            return res.status(401).json({message:"Usuario nao autenticado"});
        }
        if(!AccessService.canAccess(user.role,rolesAllowed)){
            return res.status(403).json({message:"Acesso negado"});
        }
        next();
    }
}