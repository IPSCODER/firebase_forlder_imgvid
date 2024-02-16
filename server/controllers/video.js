import videoSchema from "../models/video.js"

export const createVideo = async (req,res) =>{

    const {imgUrl ,videoUrl} = req.body;
    console.log(imgUrl,videoUrl);

    if (!imgUrl || !videoUrl) {
        res.status(400);
        throw new Error("title,description, imgUrl & videoUrl fields are required")
    }

    try{
        const video = await videoSchema.create({
            imgUrl,videoUrl
        });

        res.status(201).json({
            success:true,
            video
        });
    }catch(err){
        console.log(err);
        res.status(400);
        throw err;
    }

}