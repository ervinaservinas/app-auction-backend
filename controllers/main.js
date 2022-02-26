const newUserModel= require("../models/newUserSchema")
const auctionModel= require("../models/auctionSchema")
const bcrypt = require("bcrypt")


module.exports = {
    registerUser: async (req, res) => {
        const data = req.body

        const createHash = async(data) =>{
            const hash = await bcrypt.hash(data.password,10)

            const isUser = await  newUserModel.findOne({username:data.name})

            if (!isUser){
                const user = new newUserModel()
                user.username = data.name
                user.money = 1000
                user.password = hash

                console.log(user)
                const newUser = await user.save()
                console.log(newUser)
                res.send({success:true, message: " User has been registered"})

            }else{

                res.send({success:false, message: " This username exists"})
            }
        }
        createHash(data)
    },
    loginUser: async (req, res) => {
        const data = req.body


        const comparePw = async(data) =>{

            const user = await  newUserModel.findOne({username:data.name})

            if (user){
                const compare = await bcrypt.compare(data.password,user.password)

                if(!compare){

                    req.session.user = null
                    res.send({success: false, message: "Something wrong with this password"})
                }else{

                    req.session.user = user
                    res.send({success: true, message: "User logged successfully", user})
                }

            }else{

                req.session.user = null
                res.send({success: false, message: "There no user"})
            }
        }
        comparePw(data)
    },
    logout: (req, res) => {
        req.session.user = null
        res.send({success: true, message: "User logged out"})
    },
    createauction: async (req, res) => {
        const data = req.body
        console.log(data, req.session.user)

        if(req.session.user){
            console.log("Session user", req.session.user.username)
            const auction = new auctionModel()
            auction.username=req.session.user.username
            auction.image = data.image
            auction.title = data.title
            auction.time = Date.now()+data.time
            auction.startprice = Number(data.price)
            auction.sellprice= Number(data.price)
            auction.active = true

            const newauction = await auction.save()

            return res.send({success:true, message:"Auction has been created successfully ", newauction })
        }
        res.send({success:false, message:"To create auction you need login first"})
    },
    allauctions: async (req, res) => {
        const user = req.session.user
        const allAuctions = await auctionModel.find()
        if(req.session.user){
            res.send({message:"All auctions", allAuctions, user})
        }else{
            res.send({message:"All auctions without active user", allAuctions})
        }
    },
    getauction: async (req,res) =>{
        const {id} = req.params
        const user = req.session.user

        const singleauction = await auctionModel.findOne({_id:id})
        res.send({message: "single auction", singleauction, user})

    },
    addbid: async (req,res) =>{
        const data = req.body
        console.log("bid added", data)
        const newbid={
            username: data.username,
            bid: data.bid,
            time: Date.now()
        }
        console.log("obj", newbid)
        await auctionModel.findOneAndUpdate({_id:data.id},{$set:{sellprice:data.bid}})
        await auctionModel.findOneAndUpdate({_id:data.id}, {$push:{bids:newbid}
        })
        res.send({message:"New bid has been added "})
    },

}