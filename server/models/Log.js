const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReceiverSchema = new Schema({
    receiver: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    read_status: {
        type: Boolean,
        default: false
    },
    delete_status: {
        type: Boolean,
        default: false
    }
})

const LogSchema = new Schema({
    operator: {
        type: Schema.Types.ObjectId, ref: 'User'
    },

    // for edge case (operator delelted) use only
    operator_name: {
        type: String
    },
    project_id: {
        type: Schema.Types.ObjectId, ref: 'Project'
    },
    
    // for edge case (project delelted) use only
    project_code:{
        type: String
    },
    action_type: {
        type: String,
        enum: ['CREATE', 'UPDATE', 'DELETE']
    },
    action_time: {
        type: Date, default: Date.now
    },
    record: {
        type: String
    },
    receivers: [ReceiverSchema]
}, {
    versionKey: false
})

module.exports = mongoose.model('Log', LogSchema)