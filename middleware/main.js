
module.exports ={
    validateData:(req,res, next)=>{
        const data = req.body


        if(data.password.length<3||data.password.length>20){
            res.send({success:false,
                message:"Wrong password length"
            })
        }else if(data.password!==data.password2){
            res.send({success:false,
                message:"Passwords do not match"
            })
        }else if(data.name.length<3 || data.name.length>20){
            res.send({success:false,
                message:"The length of user name is less than 3 or more than 20"
            })
        }else{
            next()
        }
    },
    validateAuction:(req,res, next)=>{
        const data =req.body

        if(data.title.length<20||data.title.length>500){
            res.send({success:false,
                message:"Title must be between 20-500 symbols length"
            })
        }else if(!data.image.includes('http')){
            res.send({success:false,
                message:"URL of the picture must include 'http' "
            })
        }else if(!Number(data.price)){
            res.send({success:false,
                message:"Price must be a number"
            })
        }else {
            next()
        }

    },


}