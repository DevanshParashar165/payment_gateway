import mongoose, { Schema } from "mongoose";

const courseSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true, "Course title is required"],
        trim : true,
        maxLength : [100,'Course title cannot exceed 100 characters']
    },
    subtitle : {
        type : String,
        trim : true,
        maxLength : [200,'Course subtitle cannont exceed 200 characters']
    },
    description : {
        type : String,
        trim : true,
    },
    category : {
        type : String,
        required : [true,'Course category is required'],
        trim : true,
    },
    level : {
        type : String,
        enum : {
            values : ['brgginer','intermediate','advanced']
        },
        default : 'begginer'
    },
    price : {
        type : Number,
        required : [true,'Course price is required'],
        min : [0,'Price must be a non-negetive number']
    },
    thumbnail : {
        type : String,
        required : [true,"Thumbnail is required"]
    },
    enrolledStudents : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ],
    lectures : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    instructor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : [true,'Course instructor is required']
    },
    isPublished : {
        type : Boolean,
        default : false
    },
    totalDuration : {
        type : Number,
        default : 0
    },
    totalLectures : {
        type : Number,
        default : 0
    }
},{
    timestamps : true,
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
})

courseSchema.virtual('averageRating').get(function(){
    return 0; //placeholder assignment
})

courseSchema.pre('save', function(next){
    if(this.lectures){
        this.totalLectures = this.lectures.length
    }
    next()
})

export const Course = mongoose.model('Course',courseSchema)