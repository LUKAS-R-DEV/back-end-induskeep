import { UserService } from "../application/UserService.js";
export const register=async(req,res,next)=>{
    try{
    const user=await UserService.register(req.body);
    res.status(201).json(user);
}catch(err){
    next(err)
}
};
export const login =async (req,res,next)=>{
    try{
        const data=await UserService.login(req.body);
        res.json(data);
    }catch(err){
        next(err)
    }
};
export const profile =async (req,res,next)=>{
    try{
        const user=await UserService.profile(req.user.id)
        res.json(user);
    }catch(err){
        next(err)
    }
}
